using Invoicetronic.Invoice.Sdk.Api;
using Invoicetronic.Invoice.Sdk.Client;
using Invoicetronic.Invoice.Sdk.Model;

// Configure the SDK.
var config = new Configuration
{
    BasePath = "https://api.invoicetronic.com",
    Username = "YOUR TEST API KEY (starts with ik_test_)"
};

// Send an invoice
var filePath = "/some/file/path/filename.xml";

var metaData = new Dictionary<string, string>
{
    { "internal_id", "123" },
    { "created_with", "myapp" },
    { "some_other_custom_data", "value" },
};

var sendApi = new SendApi(config);

try
{
    var sentInvoice = await sendApi.InvoiceV1SendPostAsync(new Send()
    {
        FileName = Path.GetFileName(filePath),
        Payload = File.ReadAllText(filePath),
        MetaData = metaData
    });

    Console.WriteLine($"The invoice was sent successfully, it now has the unique Id of {sentInvoice.Id}.");
}
catch (ApiException e)
{
    Console.WriteLine($"{e.Message} - {e.ErrorCode}");
}