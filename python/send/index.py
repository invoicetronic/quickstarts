import invoicetronic_sdk
from invoicetronic_sdk.rest import ApiException
from invoicetronic_sdk.models.send import Send
import os

# Configure the SDK
configuration = invoicetronic_sdk.Configuration(
    username='YOUR TEST API KEY (starts with ik_test_)',
    host='https://api.invoicetronic.com/v1'
)

# Send an invoice
file_path = '/some/file/path/filename.xml'

meta_data = {
    'internal_id': '123',
    'created_with': 'myapp',
    'some_other_custom_data': 'value'
}

with invoicetronic_sdk.ApiClient(configuration) as api_client:
    send_api = invoicetronic_sdk.SendApi(api_client)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            payload = f.read()

        send_data = Send(
            file_name=os.path.basename(file_path),
            payload=payload,
            meta_data=meta_data
        )

        sent_invoice = send_api.send_post(send_data)

        print(f"The invoice was sent successfully, it now has the unique Id of {sent_invoice.id}.")

    except ApiException as e:
        print(f"Error: {e}")
