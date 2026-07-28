// ECE 531 Final Project main controller code. To compile use: gcc -Wall -Wextra -o main main.c -lcurl -lcjson

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <time.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <dirent.h>
#include <libgen.h>
#include <limits.h>
#include <curl/curl.h>
#include <cjson/cJSON.h>


#define POLL_INTERVAL_SECONDS_DEFAULT 10
#define STOP_TIMEOUT_MS_DEFAULT 5000
#define STOP_POLL_MS_DEFAULT 100

// Name of the config file
#define DEFAULT_CONFIG_FILENAME "thermostat.conf"

// Default Configuration but can be overwritten
typedef struct {
    char api_base[256];
    char data_endpoint[280];   // derived: api_base + "/data"
    char temp_file_path[256];
    char status_file_path[256];
    char status_id[64];
    char temperature_id[64];
    int poll_interval_seconds;
    char daemon_name[64];
    int stop_timeout_ms;
    int stop_poll_ms;
} config_t;

static config_t g_config = {
    .api_base = "https//ec2-18-220-131-54.us-east-2.compute.amazonaws.com:8080",
    .data_endpoint = "", // filled in by update_derived_config()
    .temp_file_path = "/tmp/temp",
    .status_file_path = "/tmp/status",
    .status_id = "6a6570674d6b1510bc5c6dad",
    .temperature_id = "6a6570674d6b1510bc5c6dae",
    .poll_interval_seconds = POLL_INTERVAL_SECONDS_DEFAULT,
    .daemon_name = "thermostat",
    .stop_timeout_ms = STOP_TIMEOUT_MS_DEFAULT,
    .stop_poll_ms = STOP_POLL_MS_DEFAULT,
};

// Updates derived configuration fields
static void update_derived_config(void) {
    snprintf(g_config.data_endpoint, sizeof(g_config.data_endpoint), "%s/data", g_config.api_base);
}

// Updates a fixed-size config field with a new value, truncating if necessary
static void set_config_field(char* field, size_t field_size, const char* value, const char* key_name) {
    if (strlen(value) >= field_size) {
        printf("Warning: value for %s is too long, truncating\n", key_name);
    }
    strncpy(field, value, field_size - 1);
    field[field_size - 1] = '\0';
}

// Load configuration file 
static int load_config_file(const char* path) {
    FILE* f = fopen(path, "r");
    if (f == NULL) {
        printf("Error: could not open config file %s: %s\n", path, strerror(errno));
        return -1;
    }

    char line[512];
    int line_no = 0;
    while (fgets(line, sizeof(line), f) != NULL) {
        line_no++;

        size_t len = strlen(line);
        while (len > 0 && (line[len - 1] == '\n' || line[len - 1] == '\r')) {
            line[--len] = '\0';
        }

        char* p = line;
        while (*p == ' ' || *p == '\t') p++;
        if (*p == '\0' || *p == '#') continue; // blank line or comment

        char* eq = strchr(p, '=');
        if (eq == NULL) {
            printf("Warning: config line %d has no '=', skipping: %s\n", line_no, p);
            continue;
        }
        *eq = '\0';

        char* key = p;
        char* key_end = key + strlen(key);
        while (key_end > key && (key_end[-1] == ' ' || key_end[-1] == '\t')) {
            *(--key_end) = '\0';
        }

        char* value = eq + 1;
        while (*value == ' ' || *value == '\t') value++;

        if (strcmp(key, "API_BASE") == 0) {
            set_config_field(g_config.api_base, sizeof(g_config.api_base), value, key);
        } else if (strcmp(key, "TEMP_FILE_PATH") == 0) {
            set_config_field(g_config.temp_file_path, sizeof(g_config.temp_file_path), value, key);
        } else if (strcmp(key, "STATUS_FILE_PATH") == 0) {
            set_config_field(g_config.status_file_path, sizeof(g_config.status_file_path), value, key);
        } else if (strcmp(key, "STATUS_ID") == 0) {
            set_config_field(g_config.status_id, sizeof(g_config.status_id), value, key);
        } else if (strcmp(key, "TEMPERATURE_ID") == 0) {
            set_config_field(g_config.temperature_id, sizeof(g_config.temperature_id), value, key);
        } else if (strcmp(key, "POLL_INTERVAL_SECONDS") == 0) {
            g_config.poll_interval_seconds = atoi(value);
        } else if (strcmp(key, "DAEMON_NAME") == 0) {
            set_config_field(g_config.daemon_name, sizeof(g_config.daemon_name), value, key);
        } else if (strcmp(key, "STOP_TIMEOUT_MS") == 0) {
            g_config.stop_timeout_ms = atoi(value);
        } else if (strcmp(key, "STOP_POLL_MS") == 0) {
            g_config.stop_poll_ms = atoi(value);
        } else {
            printf("Warning: config line %d has unknown key '%s', ignoring\n", line_no, key);
        }
    }

    fclose(f);
    return 0;
}

// Define Structure for the Time
typedef struct {
    char time[6];       // "HH:MM"
    float temperature;
} schedule_entry_t;

// Define Structure for the Schedule 
typedef struct {
    schedule_entry_t time1;
    schedule_entry_t time2;
    schedule_entry_t time3;
} schedule_t;


// Define Structure for the Response Buffer
typedef struct {
    char* data;
    size_t size;
} response_buffer_t;

// Allocates a buffer for reading a file into memory
char* allocateBuffer(FILE* file, long* outFileSize) {
    // Move to the end of the file to determine its size
    fseek(file, 0, SEEK_END);
    long size = ftell(file);
    rewind(file); // Return file pointer to the beginning

    // Pass the file size back to the caller via pointer
    if (outFileSize != NULL) {
        *outFileSize = size;
    }

    // Allocate memory for the string (+1 byte for the null terminator)
    char* buffer = (char*)malloc((size + 1) * sizeof(char));
    if (buffer == NULL) {
        printf("Error: Memory allocation failed\n");
        return NULL;
    }

    return buffer;
}

// Returns current time in HH:MM format
char* get_current_time(void) {
    static char buffer[6];
    time_t now = time(NULL);
    struct tm* local = localtime(&now);
    if (local == NULL) {
        return NULL;
    }
    strftime(buffer, sizeof(buffer), "%H:%M", local);
    return buffer;
}

// Control heater status 
void heater_status(const int* status) {
    FILE* statusFile = fopen(g_config.status_file_path, "w");
    if (statusFile != NULL) {
        if (*status) {
            fprintf(statusFile, "ON\n");
        } else {
            fprintf(statusFile, "OFF\n");
        }
        fclose(statusFile);
    } else {
        printf("Error: Could not open status file %s\n", g_config.status_file_path);
    }
}
// Read the status of the heater
int read_status(int* status) {
    FILE* statusFile = fopen(g_config.status_file_path, "r");
    if (statusFile == NULL) {
        printf("Error: Could not open status file %s\n", g_config.status_file_path);
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

// Read the temperature 
int read_temp(float* temp) {
    FILE* tempFile = fopen(g_config.temp_file_path, "r");
    if (tempFile == NULL) {
        printf("Error: Could not open temp file %s\n", g_config.temp_file_path);
        return -1;
    }

    int result = (fscanf(tempFile, "%f", temp) == 1) ? 0 : -1;
    fclose(tempFile);
    return result;
}


// Callback for writing HTTP response data into a buffer
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

// Callback for discarding HTTP response data
static size_t _discard_callback(void* contents, size_t size, size_t nmemb, void* userp) {
    (void)contents; (void)userp;
    return size * nmemb; // used when we don't care about the response body
}

// Gets schedule from the server
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

    curl_easy_setopt(curl, CURLOPT_URL, g_config.data_endpoint);
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

// Pushes update to server
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

    char status_url[256 + sizeof(g_config.data_endpoint)];
    snprintf(status_url, sizeof(status_url), "%s/%s", g_config.data_endpoint, g_config.status_id);
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

    char temp_url[256 + sizeof(g_config.data_endpoint)];
    snprintf(temp_url, sizeof(temp_url), "%s/%s", g_config.data_endpoint, g_config.temperature_id);
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

// Converts time to minutes
static int time_to_minutes(const char* hhmm) {
    int h, m;
    if (sscanf(hhmm, "%d:%d", &h, &m) != 2) return -1;
    if (h < 0 || h > 23 || m < 0 || m > 59) return -1;
    return h * 60 + m;
}

// Computes the circular distance in minutes between two times-of-day, accounting
// for midnight wraparound (e.g. 23:58 and 00:02 are 4 minutes apart, not 1436).
static int circular_distance(int a, int b) {
    int diff = abs(a - b);
    int wrapped = 24 * 60 - diff;
    return diff < wrapped ? diff : wrapped;
}

// Determine the desired temperature based on the current time and schedule
float get_desired_temperature(const schedule_t* schedule, const char* current_time) {
    const schedule_entry_t* entries[3] = { &schedule->time1, &schedule->time2, &schedule->time3 };

    int now_min = time_to_minutes(current_time);
    if (now_min < 0) {
        return entries[0]->temperature; // malformed current time; fall back
    }

    const schedule_entry_t* closest = NULL;
    int best_distance = -1;

    for (int i = 0; i < 3; i++) {
        int slot_min = time_to_minutes(entries[i]->time);
        if (slot_min < 0) continue; // skip unset/malformed slots

        int distance = circular_distance(now_min, slot_min);
        if (closest == NULL || distance < best_distance) {
            best_distance = distance;
            closest = entries[i];
        }
    }

    return (closest != NULL) ? closest->temperature : entries[0]->temperature;
}

// Flag set by the SIGTERM handler; the main loop checks this between
// poll cycles so the daemon can shut down cleanly instead of being
// killed mid-request.
static volatile sig_atomic_t g_shutdown_requested = 0;


// Handles shutdown signals (SIGTERM, SIGINT)
// @param signum The signal number received
static void handle_shutdown_signal(int signum) {
    (void)signum;
    g_shutdown_requested = 1;
}

// Main Control loop
static void run_main_loop(void) {
    signal(SIGTERM, handle_shutdown_signal);
    signal(SIGINT, handle_shutdown_signal);

    // Main loop begins
    while (!g_shutdown_requested) {
        schedule_t schedule = {0};
        if (fetch_schedule(&schedule) != 0) {
            printf("Error: could not fetch schedule; skipping this cycle\n");
            sleep(g_config.poll_interval_seconds);
            continue;
        }

        char* current_time = get_current_time();
        if (current_time == NULL) {
            printf("Error: could not read current time; skipping this cycle\n");
            sleep(g_config.poll_interval_seconds);
            continue;
        }

        float desired_temp = get_desired_temperature(&schedule, current_time);

        float actual_temp;
        if (read_temp(&actual_temp) != 0) {
            printf("Error: could not read current temperature; skipping this cycle\n");
            sleep(g_config.poll_interval_seconds);
            continue;
        }

        // Simple on/off thermostat logic: heat if we're below target.
        int status = (actual_temp < desired_temp) ? 1 : 0;

        heater_status(&status);

        if (push_status_and_temp(status, actual_temp) != 0) {
            printf("Error: could not report status/temperature to server\n");
        }

        sleep(g_config.poll_interval_seconds);
    }

    printf("Received shutdown signal, exiting main loop\n");
}

// Read process command name from /proc/<pid>/comm
static int read_process_comm(pid_t pid, char* out, size_t out_size) {
    char path[64];
    snprintf(path, sizeof(path), "/proc/%d/comm", (int)pid);

    FILE* f = fopen(path, "r");
    if (f == NULL) {
        return -1;
    }
    if (fgets(out, (int)out_size, f) == NULL) {
        fclose(f);
        return -1;
    }
    fclose(f);

    size_t len = strlen(out);
    if (len > 0 && out[len - 1] == '\n') {
        out[len - 1] = '\0';
    }
    return 0;
}

// Finds a running instance of this same program by scanning /proc
static pid_t find_running_daemon(void) {
    char self_comm[64];
    if (read_process_comm(getpid(), self_comm, sizeof(self_comm)) != 0) {
        printf("Error: could not read our own process name from /proc\n");
        return -1;
    }

    DIR* proc_dir = opendir("/proc");
    if (proc_dir == NULL) {
        printf("Error: could not open /proc: %s\n", strerror(errno));
        return -1;
    }

    pid_t found = -1;
    struct dirent* entry;
    while ((entry = readdir(proc_dir)) != NULL) {
        // Process directories under /proc are purely numeric.
        char* endptr;
        long pid_val = strtol(entry->d_name, &endptr, 10);
        if (*endptr != '\0' || pid_val <= 0) {
            continue;
        }

        pid_t pid = (pid_t)pid_val;
        if (pid == getpid()) {
            continue; // never match ourselves
        }

        char comm[64];
        if (read_process_comm(pid, comm, sizeof(comm)) != 0) {
            continue; // process likely exited mid-scan
        }

        if (strcmp(comm, self_comm) == 0) {
            found = pid;
            break;
        }
    }

    closedir(proc_dir);
    return found;
}

// Daemonizes the calling process using the classic double-fork technique
static int daemonize(void) {

    fflush(NULL);

    // --- first fork ---
    pid_t pid = fork();
    if (pid < 0) {
        printf("Error: first fork failed: %s\n", strerror(errno));
        return -1;
    }
    if (pid > 0) {
        // Original process: our job is done, let the caller's shell
        // see us exit right away.
        exit(EXIT_SUCCESS);
    }

    // --- now running as the first child ---
    if (setsid() < 0) {
        printf("Error: setsid failed: %s\n", strerror(errno));
        return -1;
    }

    // Ignore SIGHUP: as session leader, this child would otherwise
    // get one the moment it exits below (terminating the session),
    // which could race with the grandchild's setup.
    signal(SIGHUP, SIG_IGN);

    fflush(NULL);

    // --- second fork ---
    pid = fork();
    if (pid < 0) {
        printf("Error: second fork failed: %s\n", strerror(errno));
        return -1;
    }
    if (pid > 0) {
        // First child: also exit, orphaning the grandchild to init.
        exit(EXIT_SUCCESS);
    }

    // --- now running as the grandchild: the actual daemon --- 
    umask(0);

    if (chdir("/") < 0) {
        printf("Error: chdir(\"/\") failed: %s\n", strerror(errno));
        return -1;
    }

    // Detach from the standard file descriptors so the daemon holds
    // no reference to whatever terminal/pipe launched it.
    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);

    int null_fd = open("/dev/null", O_RDWR);
    if (null_fd >= 0) {
        dup2(null_fd, STDIN_FILENO);
        dup2(null_fd, STDOUT_FILENO);
        dup2(null_fd, STDERR_FILENO);
        if (null_fd > STDERR_FILENO) {
            close(null_fd);
        }
    }

    return 0;
}

// Get the directory containing this program's own executable
static void get_executable_dir(char* out, size_t out_size) {
    char exe_path[PATH_MAX];
    ssize_t len = readlink("/proc/self/exe", exe_path, sizeof(exe_path) - 1);
    if (len <= 0) {
        if (getcwd(out, out_size) == NULL) {
            snprintf(out, out_size, ".");
        }
        return;
    }
    exe_path[len] = '\0';

    // dirname() may modify its argument; exe_path is a disposable
    // local copy, so that's fine.
    char* dir = dirname(exe_path);
    snprintf(out, out_size, "%s", dir);
}

// Create the default config file path
static void build_default_config_path(char* out, size_t out_size) {
    char dir[PATH_MAX];
    get_executable_dir(dir, sizeof(dir));
    snprintf(out, out_size, "%s/%s", dir, DEFAULT_CONFIG_FILENAME);
}


// Print the usage/help message
static void print_usage(const char* prog_name) {
    char default_config_path[PATH_MAX];
    build_default_config_path(default_config_path, sizeof(default_config_path));

    printf("Usage: %s [-c <config_file> | --config_file <config_file>] {start|stop|restart|status|help}\n", prog_name);
    printf("       %s -h | --help\n\n", prog_name);
    printf("%s is a thermostat control daemon.\n\n", g_config.daemon_name);
    printf("Options:\n");
    printf("  -c, --config_file <path>  Load settings from the given KEY=VALUE\n");
    printf("                            config file. If omitted, %s\n", prog_name);
    printf("                            looks for one at:\n");
    printf("                              %s\n", default_config_path);
    printf("                            (loaded automatically if present; it's\n");
    printf("                            fine if it isn't, built-in defaults are\n");
    printf("                            used instead)\n");
    printf("  -h, --help                Show this help message and exit\n\n");
    printf("Commands:\n");
    printf("  start    Start %s as a background daemon\n", g_config.daemon_name);
    printf("  stop     Stop the running daemon\n");
    printf("  restart  Stop the daemon, then start it again\n");
    printf("  status   Report whether the daemon is currently running\n");
    printf("  help     Show this help message and exit\n");
}


// Handle the "start" command
static int cmd_start(void) {
    pid_t existing = find_running_daemon();
    if (existing > 0) {
        printf("%s is already running (PID %d)\n", g_config.daemon_name, (int)existing);
        return 1;
    }

    printf("Starting %s...\n", g_config.daemon_name);

    if (daemonize() != 0) {
        fprintf(stderr, "Error: failed to daemonize %s\n", g_config.daemon_name);
        return 1;
    }

    curl_global_init(CURL_GLOBAL_DEFAULT);
    run_main_loop();
    curl_global_cleanup();

    return 0;
}

// Handle the "stop" command
static int cmd_stop(void) {
    pid_t pid = find_running_daemon();
    if (pid <= 0) {
        printf("%s is not running\n", g_config.daemon_name);
        return 1;
    }

    printf("Stopping %s (PID %d)...\n", g_config.daemon_name, (int)pid);
    if (kill(pid, SIGTERM) != 0) {
        printf("Error: could not signal PID %d: %s\n", (int)pid, strerror(errno));
        return 1;
    }

    int waited_ms = 0;
    while (find_running_daemon() == pid && waited_ms < g_config.stop_timeout_ms) {
        usleep(g_config.stop_poll_ms * 1000);
        waited_ms += g_config.stop_poll_ms;
    }

    if (find_running_daemon() == pid) {
        printf("%s did not exit within %dms; sending SIGKILL\n", g_config.daemon_name, g_config.stop_timeout_ms);
        kill(pid, SIGKILL);
        usleep(g_config.stop_poll_ms * 1000);
    }

    printf("%s stopped\n", g_config.daemon_name);
    return 0;
}

// Handle the "status" command
static int cmd_status(void) {
    pid_t pid = find_running_daemon();
    if (pid > 0) {
        printf("%s is running (PID %d)\n", g_config.daemon_name, (int)pid);
        return 0;
    }

    printf("%s is not running\n", g_config.daemon_name);
    return 1;
}

// Handle the "restart" command
static int cmd_restart(void) {
    cmd_stop();
    sleep(1);
    return cmd_start();
}

// Main entry point
int main(int argc, char* argv[]) {
    const char* config_path = NULL; // explicit override from -c/--config_file, if any
    const char* command = NULL;

    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-c") == 0 || strcmp(argv[i], "--config_file") == 0) {
            if (i + 1 >= argc) {
                fprintf(stderr, "Error: %s requires a path argument\n", argv[i]);
                return 1;
            }
            config_path = argv[++i];
        } else if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            print_usage(argv[0]);
            return 0;
        } else if (command == NULL) {
            command = argv[i];
        } else {
            fprintf(stderr, "Error: unexpected argument '%s'\n\n", argv[i]);
            print_usage(argv[0]);
            return 1;
        }
    }

    if (config_path != NULL) {
        if (load_config_file(config_path) != 0) {
            return 1; // load_config_file() already printed the error
        }
    } else {
        char default_config_path[PATH_MAX];
        build_default_config_path(default_config_path, sizeof(default_config_path));
        if (access(default_config_path, F_OK) == 0) {
            load_config_file(default_config_path);
        }
    }
    update_derived_config(); // recompute data_endpoint from (possibly overridden) api_base

    if (command == NULL) {
        print_usage(argv[0]);
        return 1;
    }

    if (strcmp(command, "start") == 0) {
        return cmd_start();
    } else if (strcmp(command, "stop") == 0) {
        return cmd_stop();
    } else if (strcmp(command, "restart") == 0) {
        return cmd_restart();
    } else if (strcmp(command, "status") == 0) {
        return cmd_status();
    } else if (strcmp(command, "help") == 0) {
        print_usage(argv[0]);
        return 0;
    }

    printf("Unknown command: %s\n\n", command);
    print_usage(argv[0]);
    return 1;
}