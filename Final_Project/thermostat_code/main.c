#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <time.h>
#include <curl/curl.h>
#include <cjson/cJSON.h>
#include <unistd.h>

#define API_BASE "http://ec2-18-220-131-54.us-east-2.compute.amazonaws.com:8080"
#define DATA_ENDPOINT API_BASE "/data"
#define TEMP_FILE_PATH "/tmp/temp"
#define STATUS_FILE_PATH "/tmp/status"
#define STATUS_ID      "6a6570674d6b1510bc5c6dad"
#define TEMPERATURE_ID "6a6570674d6b1510bc5c6dae"
#define POLL_INTERVAL_SECONDS 10

typedef struct {
    char time[6];       // "HH:MM"
    float temperature;
} schedule_entry_t;

typedef struct {
    schedule_entry_t time1;
    schedule_entry_t time2;
    schedule_entry_t time3;
} schedule_t;

typedef struct {
    char* data;
    size_t size;
} response_buffer_t;

char* get_current_time(void) {
    static char buffer[6]; // "HH:MM" + null terminator
    time_t now = time(NULL);
    struct tm* local = localtime(&now);
    if (local == NULL) {
        return NULL;
    }
    strftime(buffer, sizeof(buffer), "%H:%M", local);
    return buffer;
}

void heater_status(const int* status) {
    FILE* statusFile = fopen(STATUS_FILE_PATH, "w");
    if (statusFile != NULL) {
        if (*status) {
            fprintf(statusFile, "ON\n");
        } else {
            fprintf(statusFile, "OFF\n");
        }
        fclose(statusFile);
    } else {
        printf("Error: Could not open status file %s\n", STATUS_FILE_PATH);
    }
}

/**
 * Reads the current heater status from the status file, matching the
 * format tcsimd expects ("ON\n" or "OFF\n").
 *
 * @param status Output pointer, set to 1 for ON, 0 for OFF.
 * @return 0 on success, -1 on failure (file missing/unreadable or
 *         unrecognized content).
 */

int read_status(int* status) {
    FILE* statusFile = fopen(STATUS_FILE_PATH, "r");
    if (statusFile == NULL) {
        printf("Error: Could not open status file %s\n", STATUS_FILE_PATH);
        return -1;
    }

    char buffer[32];
    int result = -1;
    if (fgets(buffer, sizeof(buffer), statusFile) != NULL) {
        if (strstr(buffer, "ON")) {
            *status = 1;
            result = 0;
        } else if (strstr(buffer, "OFF")) {
            *status = 0;
            result = 0;
        }
    }

    fclose(statusFile);
    return result;
}

/**
 * Reads the current temperature from the temp file, matching the
 * format tc_write_temperature() writes ("%f\n").
 *
 * @param temp Output pointer, set to the parsed temperature.
 * @return 0 on success, -1 on failure (file missing/unreadable or
 *         unparseable content).
 */
int read_temp(float* temp) {
    FILE* tempFile = fopen(TEMP_FILE_PATH, "r");
    if (tempFile == NULL) {
        printf("Error: Could not open temp file %s\n", TEMP_FILE_PATH);
        return -1;
    }

    int result = (fscanf(tempFile, "%f", temp) == 1) ? 0 : -1;
    fclose(tempFile);
    return result;
}

static size_t _write_callback(void* contents, size_t size, size_t nmemb, void* userp) {
    size_t total = size * nmemb;
    response_buffer_t* buf = (response_buffer_t*)userp;

    char* new_data = realloc(buf->data, buf->size + total + 1);
    if (new_data == NULL) {
        printf("Error: Memory allocation failed in HTTP response buffer\n");
        return 0; // aborts the transfer
    }
    buf->data = new_data;
    memcpy(&(buf->data[buf->size]), contents, total);
    buf->size += total;
    buf->data[buf->size] = '\0';
    return total;
}

static size_t _discard_callback(void* contents, size_t size, size_t nmemb, void* userp) {
    (void)contents; (void)userp;
    return size * nmemb; // used when we don't care about the response body
}

/**
 * Fetches the current schedule (time1/time2/time3) from the server.
 *
 * @param out Output schedule struct. Entries whose labels are missing
 *            from the server response are left untouched, so zero it
 *            yourself first if you want a clean slate.
 * @return 0 on success, -1 on failure (network error, bad HTTP status,
 *         or unparseable JSON).
 */
int fetch_schedule(schedule_t* out) {
    CURL* curl = curl_easy_init();
    if (curl == NULL) {
        printf("Error: Could not initialize curl\n");
        return -1;
    }

    response_buffer_t buf = { .data = malloc(1), .size = 0 };
    if (buf.data == NULL) {
        printf("Error: Memory allocation failed\n");
        curl_easy_cleanup(curl);
        return -1;
    }
    buf.data[0] = '\0';

    curl_easy_setopt(curl, CURLOPT_URL, DATA_ENDPOINT);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void*)&buf);

    CURLcode res = curl_easy_perform(curl);
    long http_code = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK || http_code != 200) {
        printf("Error: GET /data failed (%s, HTTP %ld)\n",
               curl_easy_strerror(res), http_code);
        free(buf.data);
        return -1;
    }

    cJSON* docs = cJSON_Parse(buf.data);
    free(buf.data);
    if (docs == NULL || !cJSON_IsArray(docs)) {
        printf("Error: Could not parse schedule response as JSON array\n");
        cJSON_Delete(docs);
        return -1;
    }

    cJSON* doc;
    cJSON_ArrayForEach(doc, docs) {
        cJSON* label = cJSON_GetObjectItemCaseSensitive(doc, "label");
        if (!cJSON_IsString(label) || label->valuestring == NULL) continue;

        schedule_entry_t* slot = NULL;
        if (strcmp(label->valuestring, "time1") == 0) slot = &out->time1;
        else if (strcmp(label->valuestring, "time2") == 0) slot = &out->time2;
        else if (strcmp(label->valuestring, "time3") == 0) slot = &out->time3;
        if (slot == NULL) continue;

        cJSON* time_field = cJSON_GetObjectItemCaseSensitive(doc, "time");
        cJSON* temp_field = cJSON_GetObjectItemCaseSensitive(doc, "temperature");

        if (cJSON_IsString(time_field) && time_field->valuestring != NULL) {
            strncpy(slot->time, time_field->valuestring, sizeof(slot->time) - 1);
            slot->time[sizeof(slot->time) - 1] = '\0';
        }
        if (cJSON_IsNumber(temp_field)) {
            slot->temperature = (float)temp_field->valuedouble;
        }
    }

    cJSON_Delete(docs);
    return 0;
}

/**
 * Pushes the thermocouple's current status and temperature up to the
 * server, overwriting the existing status/temperature documents.
 *
 * @param status 1 for ON, 0 for OFF.
 * @param temp Current temperature reading.
 * @return 0 if both updates succeeded, -1 if either failed.
 */
int push_status_and_temp(int status, float temp) {
    CURL* curl = curl_easy_init();
    if (curl == NULL) {
        printf("Error: Could not initialize curl\n");
        return -1;
    }

    struct curl_slist* headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _discard_callback);

    int result = 0;

    // --- push status ---
    cJSON* status_body = cJSON_CreateObject();
    cJSON_AddStringToObject(status_body, "label", "status");
    cJSON_AddStringToObject(status_body, "value", status ? "ON" : "OFF");
    char* status_json = cJSON_PrintUnformatted(status_body);

    char status_url[256];
    snprintf(status_url, sizeof(status_url), "%s/%s", DATA_ENDPOINT, STATUS_ID);
    curl_easy_setopt(curl, CURLOPT_URL, status_url);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, status_json);

    CURLcode res = curl_easy_perform(curl);
    long http_code = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
    if (res != CURLE_OK || http_code != 200) {
        printf("Error: POST status failed (%s, HTTP %ld)\n",
               curl_easy_strerror(res), http_code);
        result = -1;
    }
    free(status_json);
    cJSON_Delete(status_body);

    // --- push temperature ---
    cJSON* temp_body = cJSON_CreateObject();
    cJSON_AddStringToObject(temp_body, "label", "temperature");
    cJSON_AddNumberToObject(temp_body, "value", temp);
    char* temp_json = cJSON_PrintUnformatted(temp_body);

    char temp_url[256];
    snprintf(temp_url, sizeof(temp_url), "%s/%s", DATA_ENDPOINT, TEMPERATURE_ID);
    curl_easy_setopt(curl, CURLOPT_URL, temp_url);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, temp_json);

    res = curl_easy_perform(curl);
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
    if (res != CURLE_OK || http_code != 200) {
        printf("Error: POST temperature failed (%s, HTTP %ld)\n",
               curl_easy_strerror(res), http_code);
        result = -1;
    }
    free(temp_json);
    cJSON_Delete(temp_body);

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    return result;
}

/**
 * Determines the desired temperature for the current time, based on
 * the schedule fetched from the server.
 *
 * Since "HH:MM" is a fixed-width, zero-padded format, plain string
 * comparison sorts times correctly — no need to parse into integers.
 *
 * Picks the slot with the latest scheduled time that is <= the
 * current time (i.e. the most recently triggered slot). If the
 * current time is earlier than all three scheduled times (e.g. it's
 * 1 AM and the earliest slot is 6 AM), falls back to the slot with
 * the latest time overall, treating it as still active from the
 * previous day.
 *
 * @param schedule The schedule fetched via fetch_schedule().
 * @param current_time The current time as "HH:MM", from get_current_time().
 * @return The desired temperature for the active slot.
 */
float get_desired_temperature(const schedule_t* schedule, const char* current_time) {
    const schedule_entry_t* entries[3] = { &schedule->time1, &schedule->time2, &schedule->time3 };
    const schedule_entry_t* active = NULL;

    for (int i = 0; i < 3; i++) {
        if (strcmp(entries[i]->time, current_time) <= 0) {
            if (active == NULL || strcmp(entries[i]->time, active->time) > 0) {
                active = entries[i];
            }
        }
    }

    if (active == NULL) {
        active = entries[0];
        for (int i = 1; i < 3; i++) {
            if (strcmp(entries[i]->time, active->time) > 0) {
                active = entries[i];
            }
        }
    }

    return active->temperature;
}
int main() {
    curl_global_init(CURL_GLOBAL_DEFAULT);

    while (1) {
        schedule_t schedule = {0};
        if (fetch_schedule(&schedule) != 0) {
            printf("Error: could not fetch schedule; skipping this cycle\n");
            sleep(POLL_INTERVAL_SECONDS);
            continue;
        }

        char* current_time = get_current_time();
        if (current_time == NULL) {
            printf("Error: could not read current time; skipping this cycle\n");
            sleep(POLL_INTERVAL_SECONDS);
            continue;
        }

        float desired_temp = get_desired_temperature(&schedule, current_time);

        float actual_temp;
        if (read_temp(&actual_temp) != 0) {
            printf("Error: could not read current temperature; skipping this cycle\n");
            sleep(POLL_INTERVAL_SECONDS);
            continue;
        }

        // Simple on/off thermostat logic: heat if we're below target.
        int status = (actual_temp < desired_temp) ? 1 : 0;

        heater_status(&status);

        if (push_status_and_temp(status, actual_temp) != 0) {
            printf("Error: could not report status/temperature to server\n");
        }

        sleep(POLL_INTERVAL_SECONDS);
    }

    curl_global_cleanup();
    return 0;
}

