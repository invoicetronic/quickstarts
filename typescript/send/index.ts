import { Configuration, SendApi, Send } from '@invoicetronic/ts-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Configure the SDK
const config = new Configuration({
  username: 'YOUR TEST API KEY (starts with ik_test_)',
  basePath: 'https://api.invoicetronic.com/v1'
});

// Send an invoice
const filePath = '/some/file/path/filename.xml';

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

    console.log(`The invoice was sent successfully, it now has the unique Id of ${sentInvoice.data.id}.`);

    // Read the current SDI state without a separate /update call.
    // latest_state may be null right after submission (the SDI hasn't processed yet).
    const fresh = await sendApi.sendIdGet(sentInvoice.data.id!);
    console.log(`Current state: ${fresh.data.latest_state ?? 'Processing'}`);
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
}

sendInvoice();
