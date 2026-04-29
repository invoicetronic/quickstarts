using Invoicetronic.Sdk.Api;
using Invoicetronic.Sdk.Client;

// Configure the SDK
var config = new Configuration
{
    BasePath = "https://api.invoicetronic.com/v1",
    Username = "YOUR TEST API KEY (starts with ik_test_)"
};

// Id of the sent invoice we want to inspect
const int sendId = 225;

var updateApi = new UpdateApi(config);

try
{
    var updates = await updateApi.UpdateGetAsync(
        sendId: sendId,
        sort: "last_update");

    Console.WriteLine($"Found {updates.Count} notifications for invoice {sendId}");

    foreach (var update in updates)
    {
        var description = update.Description ?? "OK";
        Console.WriteLine($"  [{update.LastUpdate:O}] state={update.State} - {description}");
    }
}
catch (ApiException e)
{
    Console.WriteLine($"{e.Message} - {e.ErrorCode}");
}
