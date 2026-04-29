import invoicetronic_sdk
from invoicetronic_sdk.rest import ApiException

# Configure the SDK
configuration = invoicetronic_sdk.Configuration(
    username='YOUR TEST API KEY (starts with ik_test_)',
    host='https://api.invoicetronic.com/v1'
)

# Id of the sent invoice we want to inspect
send_id = 225

with invoicetronic_sdk.ApiClient(configuration) as api_client:
    update_api = invoicetronic_sdk.UpdateApi(api_client)

    try:
        updates = update_api.update_get(send_id=send_id, sort='last_update')

        print(f"Found {len(updates)} notifications for invoice {send_id}")

        for update in updates:
            description = update.description or 'OK'
            print(f"  [{update.last_update}] state={update.state} - {description}")

    except ApiException as e:
        print(f"Error: {e}")
