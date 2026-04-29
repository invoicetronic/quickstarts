import { Configuration, UpdateApi } from '@invoicetronic/ts-sdk';

// Configure the SDK
const config = new Configuration({
  username: 'YOUR TEST API KEY (starts with ik_test_)',
  basePath: 'https://api.invoicetronic.com/v1'
});

// Id of the sent invoice we want to inspect
const sendId = 225;

const updateApi = new UpdateApi(config);

async function fetchUpdates() {
  try {
    const response = await updateApi.updateGet(
      undefined,    // companyId
      undefined,    // identifier
      undefined,    // prestatore
      undefined,    // unread
      sendId,       // sendId
      undefined,    // state
      undefined,    // lastUpdateFrom
      undefined,    // lastUpdateTo
      undefined,    // dateSentFrom
      undefined,    // dateSentTo
      undefined,    // page
      undefined,    // pageSize
      'last_update' // sort
    );

    console.log(`Found ${response.data.length} notifications for invoice ${sendId}`);

    for (const update of response.data) {
      const description = update.description || 'OK';
      console.log(`  [${update.last_update}] state=${update.state} - ${description}`);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
}

fetchUpdates();
