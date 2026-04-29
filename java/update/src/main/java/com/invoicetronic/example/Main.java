package com.invoicetronic.example;

import com.invoicetronic.sdk.ApiClient;
import com.invoicetronic.sdk.ApiException;
import com.invoicetronic.sdk.Configuration;
import com.invoicetronic.sdk.auth.HttpBasicAuth;
import com.invoicetronic.sdk.api.UpdateApi;
import com.invoicetronic.sdk.model.Update;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Configure the SDK
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://api.invoicetronic.com/v1");

        HttpBasicAuth basicAuth = (HttpBasicAuth) defaultClient.getAuthentication("Basic");
        basicAuth.setUsername("YOUR TEST API KEY (starts with ik_test_)");
        basicAuth.setPassword("");

        // Id of the sent invoice we want to inspect
        Integer sendId = 225;

        UpdateApi updateApi = new UpdateApi(defaultClient);

        try {
            List<Update> updates = updateApi.updateGet(
                null,           // companyId
                null,           // identifier
                null,           // prestatore
                null,           // unread
                sendId,         // sendId
                null,           // state
                null,           // lastUpdateFrom
                null,           // lastUpdateTo
                null,           // dateSentFrom
                null,           // dateSentTo
                null,           // page
                null,           // pageSize
                "last_update"   // sort
            );

            System.out.println("Found " + updates.size() +
                " notifications for invoice " + sendId);

            for (Update update : updates) {
                String description = update.getDescription() != null
                    ? update.getDescription() : "OK";
                System.out.println("  [" + update.getLastUpdate() + "] state=" +
                    update.getState() + " - " + description);
            }
        } catch (ApiException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
