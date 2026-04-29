<?php
require_once(__DIR__ . '/vendor/autoload.php');

// Configure the SDK
$config = Invoicetronic\Configuration::getDefaultConfiguration()
    ->setUsername('YOUR TEST API KEY (starts with ik_test_)');

$config->setHost('https://api.invoicetronic.com/v1');

// Id of the sent invoice we want to inspect
$sendId = 225;

$updateApi = new Invoicetronic\Api\UpdateApi(
    new GuzzleHttp\Client(),
    $config
);

try {
    $updates = $updateApi->updateGet(
        null,         // companyId
        null,         // identifier
        null,         // prestatore
        null,         // unread
        $sendId,      // sendId
        null,         // state
        null,         // lastUpdateFrom
        null,         // lastUpdateTo
        null,         // dateSentFrom
        null,         // dateSentTo
        null,         // page
        null,         // pageSize
        'last_update' // sort
    );

    echo "Found " . count($updates) . " notifications for invoice {$sendId}\n";

    foreach ($updates as $update) {
        $description = $update->getDescription() ?: 'OK';
        echo "  [{$update->getLastUpdate()->format('c')}] state={$update->getState()} - {$description}\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
    if (method_exists($e, 'getResponseBody')) {
        echo 'Response: ' . $e->getResponseBody() . "\n";
    }
}
