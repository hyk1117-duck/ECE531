//gcc -o hw netcall.c -lcurl // compling for x86_64 architecture
// arm-buildroot-linux-gnueabi-gcc -Wall netcall.c -o netcall -lcurl // compling for arm architecture


//including required header files
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <getopt.h>
#include <curl/curl.h>


//Defining constants for exit codes
#define EXIT_OK 0
#define EXIT_FAILURE 1

//defining a structure to hold the response data
typedef struct {
    char *data;
    size_t size;
} ResponseBuffer;

//Defining an enumeration for HTTP methods
typedef enum {
    METHOD_NONE,
    METHOD_GET,
    METHOD_POST,
    METHOD_PUT,
    METHOD_DELETE
} HttpMethod;

//Defining a structure to hold the request data
typedef struct {
    HttpMethod method;
    char *url;
    char *data;
} Request;


//Callback function to write the response data into the ResponseBuffer
static size_t write_callback(char *ptr, size_t size, size_t nmemb, void *userdata) {
    size_t total_size = size * nmemb;
    ResponseBuffer *buffer = (ResponseBuffer *)userdata;
    char *new_data = realloc(buffer->data, buffer->size + total_size + 1);

    if (new_data == NULL) {
        return 0;
    }

    buffer->data = new_data;
    memcpy(buffer->data + buffer->size, ptr, total_size);
    buffer->size += total_size;
    buffer->data[buffer->size] = '\0';

    return total_size;
}

//Function to display the help message
static void help(const char *progname) {
    printf("Usage: %s [options] [payload]\n", progname);
    printf("Options may appear in any order. The final positional argument is treated as the payload string.\n");
    printf("Options:\n");
    printf("  -h, --help         Show this help message\n");
    printf("  -o, --post         Perform a POST request\n");
    printf("  -g, --get          Perform a GET request\n");
    printf("  -p, --put          Perform a PUT request\n");
    printf("  -d, --delete       Perform a DELETE request\n");
    printf("  -u, --url URL      Specify the URL to fetch (for example http://localhost:8080)\n");
}

//Function to join the end of the command line arguments into a single string
static char *join_arguments(int argc, char *argv[], int start_index) {
    size_t total_length = 1;

    for (int i = start_index; i < argc; ++i) {
        total_length += strlen(argv[i]) + 1;
    }

    char *joined = malloc(total_length);
    if (joined == NULL) {
        return NULL;
    }

    joined[0] = '\0';
    for (int i = start_index; i < argc; ++i) {
        strcat(joined, argv[i]);
        if (i + 1 < argc) {
            strcat(joined, " ");
        }
    }

    return joined;
}

//Function to clean up the request structure
static void cleanup_request(Request *request) {
    free(request->url);
    free(request->data);
    request->url = NULL;
    request->data = NULL;
}


//Function to clean up the response buffer
static void cleanup_response(ResponseBuffer *buffer) {
    free(buffer->data);
    buffer->data = NULL;
    buffer->size = 0;
}


//Function to check the format of the URL
static int check_url_format(const char *url) {
    const char *host_start = url;
    const char *host_end;

    if (strncmp(url, "http://", 7) == 0) {
        host_start = url + 7;
    } else if (strncmp(url, "https://", 8) == 0) {
        host_start = url + 8;
    } else if (strncmp(url, "localhost", 9) == 0) {
        host_start = url;
    } else {
        fprintf(stderr, "Error: Invalid URL format\n");
        return 0;
    }

    if (*host_start == '\0') {
        fprintf(stderr, "Error: Invalid URL format\n");
        return 0;
    }

    host_end = host_start;
    while (*host_end != '\0' && *host_end != ':' && *host_end != '/') {
        host_end++;
    }

    if (host_end == host_start) {
        fprintf(stderr, "Error: Invalid URL format\n");
        return 0;
    }

    if (*host_end == ':') {
        const char *port_start = host_end + 1;
        const char *port_end = port_start;

        while (*port_end != '\0' && *port_end != '/') {
            if (*port_end < '0' || *port_end > '9') {
                fprintf(stderr, "Error: Invalid port number\n");
                return 0;
            }
            port_end++;
        }

        if (port_end == port_start) {
            fprintf(stderr, "Error: Invalid port number\n");
            return 0;
        }
    }

    return 1;
}


//Main function to handle command line arguments and perform the HTTP request
int main(int argc, char *argv[]) {
    // Initialize libcurl
    CURL *curl = curl_easy_init();
    CURLcode res;
    // Variable to hold the HTTP response code
    long http_code = 0;
    // Variable to hold the option index for getopt_long
    int opt;
    int option_index = 0;
    opterr = 0;
    // Initialize the response buffer and request structure
    ResponseBuffer response = {0};
    Request request = {
        .method = METHOD_NONE,
        .url = NULL,
        .data = NULL
    };
    // Check if libcurl was initialized successfully
    if (!curl) {
        fprintf(stderr, "Failed to initialize libcurl\n");
        return EXIT_FAILURE;
    }


    // Define the long options for command line arguments
    static struct option long_options[] = {
        {"help",   no_argument,       0, 'h'},
        {"post",   no_argument,       0, 'o'},
        {"get",    no_argument,       0, 'g'},
        {"put",    no_argument,       0, 'p'},
        {"delete", no_argument,       0, 'd'},
        {"url",    required_argument, 0, 'u'},
        {0, 0, 0, 0}
    };


    // Parse command line arguments using getopt_long
    while ((opt = getopt_long(argc, argv, "hogpdu:", long_options, &option_index)) != -1) {
        switch (opt) {
            case 'h':
                help(argv[0]);
                cleanup_request(&request);
                curl_easy_cleanup(curl);
                return EXIT_OK;

            case 'o':
                request.method = METHOD_POST;
                break;

            case 'g':
                request.method = METHOD_GET;
                break;

            case 'p':
                request.method = METHOD_PUT;
                break;

            case 'd':
                request.method = METHOD_DELETE;
                break;

            case 'u':
                // Check if the URL argument is provided and not empty
                if (optarg == NULL || optarg[0] == '\0') {
                    fprintf(stderr, "Error: URL is required\n");
                    cleanup_request(&request);
                    curl_easy_cleanup(curl);
                    return EXIT_FAILURE;
                }

                // Free any previously allocated URL memory before assigning a new one
                free(request.url);
                request.url = optarg;
                if (request.url == NULL) {
                    fprintf(stderr, "Failed to allocate memory\n");
                    cleanup_request(&request);
                    curl_easy_cleanup(curl);
                    return EXIT_FAILURE;
                }
                break;
            // Handle unknown options and missing required arguments
            case '?':
                if (optopt == 'u') {
                    fprintf(stderr, "Error: URL is required\n");
                    cleanup_request(&request);
                    curl_easy_cleanup(curl);
                    return EXIT_FAILURE;
                }

                help(argv[0]);
                cleanup_request(&request);
                curl_easy_cleanup(curl);
                return EXIT_FAILURE;
        }
    }
    // Join the remaining command line arguments into a single string for the request payload
    request.data = join_arguments(argc, argv, optind);
    if (request.data == NULL) {
        fprintf(stderr, "Failed to allocate memory\n");
        cleanup_request(&request);
        curl_easy_cleanup(curl);
        return EXIT_FAILURE;
    }

    // Validate the URL and HTTP method, and perform the HTTP request
    if (request.url == NULL) {
        fprintf(stderr, "Error: URL is required\n");
        cleanup_request(&request);
        curl_easy_cleanup(curl);
        return EXIT_FAILURE;
    }


    // Validate the URL format
    if (!check_url_format(request.url)) {
        cleanup_request(&request);
        curl_easy_cleanup(curl);
        return EXIT_FAILURE;
    }

    // If no HTTP method is specified, default to GET
    if (request.method == METHOD_NONE) {
        request.method = METHOD_GET;
    }

    // Validate that payload is provided for POST, PUT, and DELETE methods
    if ((request.method == METHOD_POST || request.method == METHOD_PUT || request.method == METHOD_DELETE) &&
        (request.data == NULL || request.data[0] == '\0')) {
        fprintf(stderr, "Error: Payload is required\n");
        cleanup_response(&response);
        cleanup_request(&request);
        curl_easy_cleanup(curl);
        return EXIT_FAILURE;
    }

    curl_easy_setopt(curl, CURLOPT_URL, request.url);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    switch (request.method) {
        case METHOD_POST:
            curl_easy_setopt(curl, CURLOPT_POST, 1L);
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, request.data);
            break;

        case METHOD_GET:
            curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
            break;

        case METHOD_PUT:
            curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, request.data);
            break;

        case METHOD_DELETE:
            curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "DELETE");
            if (request.data[0] != '\0') {
                curl_easy_setopt(curl, CURLOPT_POSTFIELDS, request.data);
            }
            break;

        default:
            fprintf(stderr, "Error: Invalid action\n");
            cleanup_response(&response);
            cleanup_request(&request);
            curl_easy_cleanup(curl);
            return EXIT_FAILURE;
    }

    // Perform the HTTP request and handle any errors
    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        cleanup_response(&response);
        cleanup_request(&request);
        curl_easy_cleanup(curl);
        return EXIT_FAILURE;
    }

    // Get the HTTP response code and print it along with the response data
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
    printf("HTTP %ld\n", http_code);
    if (response.data != NULL && response.size > 0) {
        printf("%s", response.data);
    }

    // Clean up allocated resources and return the appropriate exit code based on the HTTP response
    cleanup_response(&response);
    cleanup_request(&request);
    curl_easy_cleanup(curl);
    // Return EXIT_FAILURE if the HTTP response code is 400 or greater, otherwise return EXIT_OK
    return (http_code >= 400) ? EXIT_FAILURE : EXIT_OK;
}