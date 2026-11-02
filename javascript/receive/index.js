const invoicetronicSdk = require('@invoicetronic/js-sdk');
const fs = require('fs');

// Configure the SDK
const apiClient = invoicetronicSdk.ApiClient.instance;
const basicAuth = apiClient.authentications['Basic'];
basicAuth.username = 'YOUR TEST API KEY (starts with ik_test_)';

apiClient.basePath = 'https://api.invoicetronic.com/v1';

// Download unread invoices
const receiveApi = new invoicetronicSdk.ReceiveApi();

async function downloadInvoices() {
  try {
    const opts = {
      'unread': true,
      'includePayload': true
    };

    const inboundInvoices = await receiveApi.receiveGet(opts);
    console.log(`Received ${inboundInvoices.length} invoices`);

    for (const invoice of inboundInvoices) {
      if (invoice.encoding === 'Xml') {
        fs.writeFileSync(invoice.file_name, invoice.payload, 'utf8');
      } else if (invoice.encoding === 'Base64') {
        const buffer = Buffer.from(invoice.payload, 'base64');
        fs.writeFileSync(invoice.file_name, buffer);
      }

      console.log(`Downloaded ${invoice.file_name} from a vendor with VAT ID ${invoice.prestatore}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.text);
    }
  }
}

downloadInvoices();
