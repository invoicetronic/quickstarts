import { Configuration, ReceiveApi } from '@invoicetronic/ts-sdk';
import * as fs from 'fs';

// Configura l'SDK
const config = new Configuration({
  username: 'LA TUA CHIAVE API DI TEST (inizia con ik_test_)',
  basePath: 'https://api.invoicetronic.com/v1'
});

// Scarica le fatture non lette
const receiveApi = new ReceiveApi(config);

async function downloadInvoices() {
  try {
    const inboundInvoices = await receiveApi.receiveGet(
      undefined,  // companyId
      undefined,  // identifier
      true,       // unread
      undefined,  // committente
      undefined,  // prestatore
      undefined,  // fileName
      undefined,  // lastUpdateFrom
      undefined,  // lastUpdateTo
      undefined,  // dateSentFrom
      undefined,  // dateSentTo
      undefined,  // documentDateFrom
      undefined,  // documentDateTo
      undefined,  // documentNumber
      true        // includePayload
    );

    console.log(`Ricevute ${inboundInvoices.data.length} fatture`);

    for (const invoice of inboundInvoices.data) {
      if (invoice.encoding === 'Xml') {
        fs.writeFileSync(invoice.file_name!, invoice.payload!, 'utf8');
      } else if (invoice.encoding === 'Base64') {
        const buffer = Buffer.from(invoice.payload!, 'base64');
        fs.writeFileSync(invoice.file_name!, buffer);
      }

      console.log(`Scaricato ${invoice.file_name} da un fornitore con Partita IVA ${invoice.prestatore}`);
    }
  } catch (error: any) {
    console.error('Errore:', error.message);
    if (error.response) {
      console.error('Dettagli:', error.response.data);
    }
  }
}

downloadInvoices();
