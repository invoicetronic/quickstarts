const invoicetronicSdk = require('@invoicetronic/js-sdk');
const fs = require('fs');
const path = require('path');

// Configura l'SDK
const apiClient = invoicetronicSdk.ApiClient.instance;
const basicAuth = apiClient.authentications['Basic'];
basicAuth.username = 'LA TUA CHIAVE API DI TEST (inizia con ik_test_)';

apiClient.basePath = 'https://api.invoicetronic.com/v1';

// Invia una fattura
const filePath = '/qualche/percorso/file/nomefile.xml';

const metaData = {
  'internal_id': '123',
  'created_with': 'myapp',
  'some_other_custom_data': 'value'
};

const sendApi = new invoicetronicSdk.SendApi();

async function sendInvoice() {
  try {
    const sendData = new invoicetronicSdk.Send();
    sendData.fileName = path.basename(filePath);
    sendData.payload = fs.readFileSync(filePath, 'utf8');
    sendData.metaData = metaData;

    const sentInvoice = await sendApi.sendPost(sendData);

    console.log(`La fattura è stata inviata con successo, ora ha l'Id univoco ${sentInvoice.id}.`);
  } catch (error) {
    console.error('Errore:', error.message);
    if (error.response) {
      console.error('Response:', error.response.text);
    }
  }
}

sendInvoice();
