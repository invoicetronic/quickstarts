import invoicetronic_sdk
from invoicetronic_sdk.rest import ApiException
import base64

# Configura l'SDK
configuration = invoicetronic_sdk.Configuration(
    username='LA TUA CHIAVE API DI TEST (inizia con ik_test_)',
    host='https://api.invoicetronic.com/v1'
)

# Scarica le fatture non lette
with invoicetronic_sdk.ApiClient(configuration) as api_client:
    receive_api = invoicetronic_sdk.ReceiveApi(api_client)

    try:
        inbound_invoices = receive_api.receive_get(
            unread=True,
            include_payload=True
        )

        print(f"Ricevute {len(inbound_invoices)} fatture")

        for invoice in inbound_invoices:
            if invoice.encoding == 'Xml':
                with open(invoice.file_name, 'w', encoding='utf-8') as f:
                    f.write(invoice.payload)
            elif invoice.encoding == 'Base64':
                with open(invoice.file_name, 'wb') as f:
                    f.write(base64.b64decode(invoice.payload))

            print(f"Scaricato {invoice.file_name} da un fornitore con Partita IVA {invoice.prestatore}")

    except ApiException as e:
        print(f"Errore: {e}")
