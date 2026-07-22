
//gcc app.c -o app -lcurl

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <curl/curl.h>
#include <unistd.h>

struct ResponseBuffer {
    char *data;
    size_t size;
};

static size_t write_callback(char *ptr, size_t size, size_t nmemb, void *userdata) {
    size_t bytes = size * nmemb;
    struct ResponseBuffer *buffer = (struct ResponseBuffer *)userdata;
    char *new_data = realloc(buffer->data, buffer->size + bytes + 1);
    if (!new_data) {
        return 0;
    }
    buffer->data = new_data;
    memcpy(buffer->data + buffer->size, ptr, bytes);
    buffer->size += bytes;
    buffer->data[buffer->size] = '\0';
    return bytes;
}

/* Frees and clears a response buffer so it's ready for the next request. */
static void reset_response(struct ResponseBuffer *r) {
    free(r->data);
    r->data = NULL;
    r->size = 0;
}

// Extracts the "id" field from a JSON response body. Returns 1 if successful, 0 otherwise.
static int extract_created_id(const char *body, char *out_id, size_t out_size) {
    if (!body) {
        return 0;
    }
    const char *p = strstr(body, "\"id\"");
    if (!p) {
        return 0;
    }
    p = strchr(p, ':');
    if (!p) {
        return 0;
    }
    p++;
    while (*p == ' ' || *p == '\t' || *p == '\n' || *p == '\r') {
        p++;
    }
    if (*p != '"') {
        return 0;
    }
    p++;
    const char *q = p;
    while (*q && *q != '"') {
        q++;
    }
    if (!*q) {
        return 0;
    }
    size_t len = (size_t)(q - p);
    if (len >= out_size) {
        len = out_size - 1;
    }
    memcpy(out_id, p, len);
    out_id[len] = '\0';
    return 1;
}

//start of main function
int main(void) {
    //variable declarations
    char message[128];
    const char *server_url = "http://ec2-18-217-176-62.us-east-2.compute.amazonaws.com:8080/";
    char json_body[512];
    char timestamp[64];
    char inserted_ids[10][64];
    int inserted_count = 0;
    struct tm tm_utc;
    struct ResponseBuffer response = {0};
    int exit_code = 0;
    long http_code = 0;
    char item_url[256];
    // Initialize libcurl
    CURL *curl = curl_easy_init();
    if (!curl) {
        fprintf(stderr, "Failed to initialize curl\n");
        return 1;
    }
    

    // Set up the HTTP headers for JSON content
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    // Set the URL, HTTP method, and write callback for the response
    curl_easy_setopt(curl, CURLOPT_URL, server_url);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

    //Create ten new entries in the database by sending PUT requests to the server
    for (int x = 0; x < 10; x++) {
        //Get the time and format 
        time_t now = time(NULL);
        gmtime_r(&now, &tm_utc);
        strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", &tm_utc);
        snprintf(message, sizeof(message), "Message %d", x + 1);
        // Create the JSON body for the PUT request
        int written = snprintf(json_body, sizeof(json_body),
                                "{\"time\": \"%s\", \"message\": \"%s\"}",
                                timestamp, message);
        if (written < 0 || (size_t)written >= sizeof(json_body)) {
            fprintf(stderr, "Message too long, aborting.\n");
            exit_code = 1;
            break;
        }
        // Reset the response buffer, set the POSTFIELDS option, and perform the request
        reset_response(&response);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_body);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);
        // Check for errors in the request
        if (res != CURLE_OK) {
            fprintf(stderr, "Request failed: %s\n", curl_easy_strerror(res));
            exit_code = 1;
            break;
        }
        // Get the HTTP response code and print the sent message and status
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
        printf("Sent:   %s\n", json_body);
        printf("Status: %ld\n", http_code);
        // Check if the response code indicates success (201 Created) and extract the created ID
        if (http_code != 201) {
            fprintf(stderr, "Create failed. Response: %s\n", response.data ? response.data : "(empty)");
            exit_code = 1;
        } else if (extract_created_id(response.data, inserted_ids[inserted_count], sizeof(inserted_ids[0]))) {
            printf("Inserted ID: %s\n", inserted_ids[inserted_count]);
            inserted_count++;
        } else {
            printf("Created, but could not parse id from: %s\n",
                   response.data ? response.data : "(empty)");
        }

        sleep(1); /* wait 1 second before sending the next message */
    }
    
    long http_code = 0;

    //Get each of the newly inserted entries by sending GET requests to the server
    printf("\nFetching each of the %d newly inserted entries:\n", inserted_count);
    for (int x = 0; x < inserted_count; x++) {
        // Construct the URL for the GET request using the inserted ID
        snprintf(item_url, sizeof(item_url), "%s%s", server_url, inserted_ids[x]);
        reset_response(&response);
        
        //Set the URL, HTTP method, and write callback for the GET request
        curl_easy_setopt(curl, CURLOPT_URL, item_url);
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, NULL); 
        curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        // Perform the GET request and check for errors
        CURLcode res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            fprintf(stderr, "Fetch of ID %s failed: %s\n", inserted_ids[x], curl_easy_strerror(res));
            exit_code = 1;
            continue;
        }
        // Get the HTTP response code and print the fetched entry
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
        printf("GET %s -> %ld\n%s\n\n", item_url, http_code, response.data ? response.data : "(empty)");
    }
    // Clean up resources
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    free(response.data);
    // Return the exit code indicating success or failure
    return exit_code;
}