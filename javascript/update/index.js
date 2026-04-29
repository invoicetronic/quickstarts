const invoicetronicSdk = require('@invoicetronic/js-sdk');

// Configure the SDK
const apiClient = invoicetronicSdk.ApiClient.instance;
const basicAuth = apiClient.authentications['Basic'];
basicAuth.username = 'YOUR TEST API KEY (starts with ik_test_)';

apiClient.basePath = 'https://api.invoicetronic.com/v1';

// Id of the sent invoice we want to inspect
const sendId = 225;

const updateApi = new invoicetronicSdk.UpdateApi();

async function fetchUpdates() {
  try {
    const updates = await updateApi.updateGet({
      sendId: sendId,
      sort: 'last_update'
    });

    console.log(`Found ${updates.length} notifications for invoice ${sendId}`);

    for (const update of updates) {
      const description = update.description || 'OK';
      console.log(`  [${update.lastUpdate}] state=${update.state} - ${description}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.text);
    }
  }
}

fetchUpdates();
