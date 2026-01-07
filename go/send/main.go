package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"

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

	// Send an invoice
	filePath := "/some/file/path/filename.xml"

	metaData := map[string]string{
		"internal_id":            "123",
		"created_with":           "myapp",
		"some_other_custom_data": "value",
	}

	ctx := context.Background()

	payload, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file: %v\n", err)
		return
	}

	fileName := filepath.Base(filePath)
	payloadStr := string(payload)

	sendData := *invoicetronicsdk.NewSend()
	sendData.SetFileName(fileName)
	sendData.SetPayload(payloadStr)
	sendData.SetMetaData(metaData)

	sentInvoice, _, err := client.SendAPI.SendPost(ctx).Send(sendData).Execute()

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}

	fmt.Printf("The invoice was sent successfully, it now has the unique Id of %s.\n",
		*sentInvoice.Id)
}
