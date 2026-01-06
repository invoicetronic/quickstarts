package com.invoicetronic.example;

import com.invoicetronic.sdk.ApiClient;
import com.invoicetronic.sdk.ApiException;
import com.invoicetronic.sdk.Configuration;
import com.invoicetronic.sdk.auth.HttpBasicAuth;
import com.invoicetronic.sdk.api.ReceiveApi;
import com.invoicetronic.sdk.model.Receive;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Configure the SDK
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://api.invoicetronic.com/v1");

        HttpBasicAuth basicAuth = (HttpBasicAuth) defaultClient.getAuthentication("Basic");
        basicAuth.setUsername("YOUR TEST API KEY (starts with ik_test_)");
        basicAuth.setPassword("");

        // Download unread invoices
        ReceiveApi receiveApi = new ReceiveApi(defaultClient);

        try {
            List<Receive> inboundInvoices = receiveApi.receiveGet(
                null,  // companyId
                null,  // identifier
                true,  // unread
                null,  // committente
                null,  // prestatore
                null,  // fileName
                null,  // lastUpdateFrom
                null,  // lastUpdateTo
                null,  // dateSentFrom
                null,  // dateSentTo
                null,  // documentDateFrom
                null,  // documentDateTo
                null,  // documentNumber
                true,  // includePayload
                null,  // page
                null,  // pageSize
                null   // sort
            );

            System.out.println("Received " + inboundInvoices.size() + " invoices");

            for (Receive invoice : inboundInvoices) {
                if (invoice.getEncoding() == Receive.EncodingEnum.XML) {
                    try (FileOutputStream fos = new FileOutputStream(invoice.getFileName())) {
                        fos.write(invoice.getPayload().getBytes(StandardCharsets.UTF_8));
                    }
                } else if (invoice.getEncoding() == Receive.EncodingEnum.BASE64) {
                    try (FileOutputStream fos = new FileOutputStream(invoice.getFileName())) {
                        fos.write(Base64.getDecoder().decode(invoice.getPayload()));
                    }
                }

                System.out.println("Downloaded " + invoice.getFileName() +
                    " from a vendor with VAT ID " + invoice.getPrestatore());
            }
        } catch (ApiException | IOException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
