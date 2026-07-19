//Complie with gcc simplenet.c -o simplenet -Wall -lcurl 


#include <stdio.h>
#include <curl/curl.h>

#define OK       0
#define INIT_ERR 1
#define REQ_ERR  2

#define URL "http://google.com"

int main(void) {
    CURL *curl;
    CURLcode res;

    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, URL);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
            return REQ_ERR;
        }    
    curl_easy_cleanup(curl);
    } else {
        return INIT_ERR;
    }


        if (url) {
        printf("URL: %s\n", url);
    }

    if (get) {
        printf("Method: GET\n");
    }

    if (post_data) {
        printf("Method: POST\n");
        printf("Data: %s\n", post_data);
    }

    if (put_data) {
        printf("Method: PUT\n");
        printf("Data: %s\n", put_data);
    }

    if (delete) {
        printf("Method: DELETE\n");
    }
    return OK;
}