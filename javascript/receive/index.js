const invoicetronicSdk = require('@invoicetronic/js-sdk');
const fs = require('fs');

// Configura l'SDK
const apiClient = invoicetronicSdk.ApiClient.instance;
const basicAuth = apiClient.authentications['Basic'];
basicAuth.username = 'LA TUA CHIAVE API DI TEST (inizia con ik_test_)';

apiClient.basePath = 'https://api.invoicetronic.com/v1';

// Scarica le fatture non lette
const receiveApi = new invoicetronicSdk.ReceiveApi();

async function downloadInvoices() {
  try {
    const opts = {
      'unread': true,
      'includePayload': true
    };

    const inboundInvoices = await receiveApi.receiveGet(opts);
    console.log(`Ricevute ${inboundInvoices.length} fatture`);

    for (const invoice of inboundInvoices) {
      // Gestisci encoding XML o Base64
      if (invoice.encoding === 'xml') {
        fs.writeFileSync(invoice.fileName, invoice.payload, 'utf8');
      } else if (invoice.encoding === 'base64') {
        const buffer = Buffer.from(invoice.payload, 'base64');
        fs.writeFileSync(invoice.fileName, buffer);
      }

      console.log(`Scaricato ${invoice.fileName} da un fornitore con Partita IVA ${invoice.prestatore}`);
    }
  } catch (error) {
    console.error('Errore:', error.message);
    if (error.response) {
      console.error('Response:', error.response.text);
    }
  }
}

downloadInvoices();
