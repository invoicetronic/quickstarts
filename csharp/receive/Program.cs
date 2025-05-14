using Invoicetronic.Sdk.Api;
using Invoicetronic.Sdk.Client;
using static Invoicetronic.Sdk.Model.Receive;

// Configure the SDK.
var config = new Configuration
{
    BasePath = "https://api.invoicetronic.com/v1",
    Username = "YOUR TEST API KEY (starts with ik_test_)"
};

// Download unread invoices.
var receiveApi = new ReceiveApi(config);

try
{
    var inboundInvoices = await receiveApi.ReceiveGetAsync(unread: true);
    Console.WriteLine($"Received {inboundInvoices.Count} invoices");

    foreach (var invoice in inboundInvoices)
    {
        switch (invoice.Encoding)
        {
            case EncodingEnum.Xml:
                File.WriteAllText(invoice.FileName, invoice.Payload);
                break;
            case EncodingEnum.Base64:
                File.WriteAllBytes(invoice.FileName, Convert.FromBase64String(invoice.Payload));
                break;
        }

        Console.WriteLine($"Downloaded {invoice.FileName} from a vendor with VAT ID {invoice.Prestatore}");
    }
}
catch (ApiException e)
{
    Console.WriteLine($"Error: {e.Message}");
    Console.WriteLine($"Status Code: {e.ErrorCode}");
}