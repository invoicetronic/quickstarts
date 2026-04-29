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

	// Id of the sent invoice we want to inspect
	sendId := int32(225)

	ctx := context.Background()

	updates, _, err := client.UpdateAPI.UpdateGet(ctx).
		SendId(sendId).
		Sort("last_update").
		Execute()

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}

	fmt.Printf("Found %d notifications for invoice %d\n", len(updates), sendId)

	for _, update := range updates {
		description := "OK"
		if update.Description.IsSet() && update.Description.Get() != nil {
			description = *update.Description.Get()
		}
		fmt.Printf("  [%s] state=%v - %s\n", update.LastUpdate.Format("2006-01-02T15:04:05Z"), *update.State, description)
	}
}
