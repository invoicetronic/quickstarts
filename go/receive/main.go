package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	invoicetronicsdk "github.com/invoicetronic/go-sdk"
)

func main() {
	// Configure the SDK
	config := invoicetronicsdk.NewConfiguration()
	config.Servers = invoicetronicsdk.ServerConfigurations{
		{
			URL: "https://api.invoicetronic.com/v1",
		},
	}

	apiKey := "YOUR TEST API KEY (starts with ik_test_)"
	auth := apiKey + ":"
	authHeader := "Basic " + base64.StdEncoding.EncodeToString([]byte(auth))
	config.AddDefaultHeader("Authorization", authHeader)

	client := invoicetronicsdk.NewAPIClient(config)

	// Download unread invoices
	ctx := context.Background()

	unread := true
	includePayload := true

	inboundInvoices, _, err := client.ReceiveAPI.ReceiveGet(ctx).
		Unread(unread).
		IncludePayload(includePayload).
		Execute()

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}

	fmt.Printf("Received %d invoices\n", len(inboundInvoices))

	for _, invoice := range inboundInvoices {
		if invoice.Encoding != nil {
			if *invoice.Encoding == "Xml" {
				err = os.WriteFile(*invoice.FileName, []byte(*invoice.Payload), 0644)
			} else if *invoice.Encoding == "Base64" {
				decoded, _ := base64.StdEncoding.DecodeString(*invoice.Payload)
				err = os.WriteFile(*invoice.FileName, decoded, 0644)
			}

			if err != nil {
				fmt.Fprintf(os.Stderr, "Error saving file: %v\n", err)
				continue
			}

			fmt.Printf("Downloaded %s from a vendor with VAT ID %s\n",
				*invoice.FileName, invoice.Prestatore.Get())
		}
	}
}
