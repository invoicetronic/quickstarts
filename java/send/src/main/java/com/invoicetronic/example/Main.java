package com.invoicetronic.example;

import com.invoicetronic.sdk.ApiClient;
import com.invoicetronic.sdk.ApiException;
import com.invoicetronic.sdk.Configuration;
import com.invoicetronic.sdk.auth.HttpBasicAuth;
import com.invoicetronic.sdk.api.SendApi;
import com.invoicetronic.sdk.model.Send;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // Configure the SDK
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://api.invoicetronic.com/v1");

        HttpBasicAuth basicAuth = (HttpBasicAuth) defaultClient.getAuthentication("Basic");
        basicAuth.setUsername("YOUR TEST API KEY (starts with ik_test_)");
        basicAuth.setPassword("");

        // Send an invoice
        String filePath = "/some/file/path/filename.xml";

        Map<String, String> metaData = new HashMap<>();
        metaData.put("internal_id", "123");
        metaData.put("created_with", "myapp");
        metaData.put("some_other_custom_data", "value");

        SendApi sendApi = new SendApi(defaultClient);

        try {
            String payload = new String(Files.readAllBytes(Paths.get(filePath)));

            Send sendData = new Send();
            sendData.setFileName(Paths.get(filePath).getFileName().toString());
            sendData.setPayload(payload);
            sendData.setMetaData(metaData);

            Send sentInvoice = sendApi.sendPost(sendData, null, null);

            System.out.println("The invoice was sent successfully, it now has the unique Id of " +
                sentInvoice.getId() + ".");

        } catch (ApiException | IOException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
