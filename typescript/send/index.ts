import { Configuration, SendApi, Send } from '@invoicetronic/ts-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Configura l'SDK
const config = new Configuration({
  username: 'LA TUA CHIAVE API DI TEST (inizia con ik_test_)',
  basePath: 'https://api.invoicetronic.com/v1'
});

// Invia una fattura
const filePath = '/qualche/percorso/file/nomefile.xml';

const metaData: { [key: string]: string } = {
  'internal_id': '123',
  'created_with': 'myapp',
  'some_other_custom_data': 'value'
};

const sendApi = new SendApi(config);

async function sendInvoice() {
  try {
    const sendData: Send = {
      file_name: path.basename(filePath),
      payload: fs.readFileSync(filePath, 'utf8'),
      meta_data: metaData
    };

    const sentInvoice = await sendApi.sendPost(sendData);

    console.log(`La fattura è stata inviata con successo, ora ha l'Id univoco ${sentInvoice.data.id}.`);
  } catch (error: any) {
    console.error('Errore:', error.message);
    if (error.response) {
      console.error('Dettagli:', error.response.data);
    }
  }
}

sendInvoice();
