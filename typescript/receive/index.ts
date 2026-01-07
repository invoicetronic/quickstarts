import { Configuration, ReceiveApi } from '@invoicetronic/ts-sdk';
import * as fs from 'fs';

// Configure the SDK
const config = new Configuration({
  username: 'YOUR TEST API KEY (starts with ik_test_)',
  basePath: 'https://api.invoicetronic.com/v1'
});

// Download unread invoices
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

    console.log(`Received ${inboundInvoices.data.length} invoices`);

    for (const invoice of inboundInvoices.data) {
      if (invoice.encoding === 'Xml') {
        fs.writeFileSync(invoice.file_name!, invoice.payload!, 'utf8');
      } else if (invoice.encoding === 'Base64') {
        const buffer = Buffer.from(invoice.payload!, 'base64');
        fs.writeFileSync(invoice.file_name!, buffer);
      }

      console.log(`Downloaded ${invoice.file_name} from a vendor with VAT ID ${invoice.prestatore}`);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
}

downloadInvoices();
