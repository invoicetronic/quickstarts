const invoicetronicSdk = require('@invoicetronic/js-sdk');
const fs = require('fs');
const path = require('path');

// Configure the SDK
const apiClient = invoicetronicSdk.ApiClient.instance;
const basicAuth = apiClient.authentications['Basic'];
basicAuth.username = 'YOUR TEST API KEY (starts with ik_test_)';

apiClient.basePath = 'https://api.invoicetronic.com/v1';

// Send an invoice
const filePath = '/some/file/path/filename.xml';

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

    console.log(`The invoice was sent successfully, it now has the unique Id of ${sentInvoice.id}.`);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.text);
    }
  }
}

sendInvoice();
