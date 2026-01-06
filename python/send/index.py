import invoicetronic_sdk
from invoicetronic_sdk.rest import ApiException
from invoicetronic_sdk.models.send import Send
import os

# Configura l'SDK
configuration = invoicetronic_sdk.Configuration(
    username='LA TUA CHIAVE API DI TEST (inizia con ik_test_)',
    host='https://api.invoicetronic.com/v1'
)

# Invia una fattura
file_path = '/qualche/percorso/file/nomefile.xml'

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

        print(f"La fattura è stata inviata con successo, ora ha l'Id univoco {sent_invoice.id}.")

    except ApiException as e:
        print(f"Errore: {e}")
