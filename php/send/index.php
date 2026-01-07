<?php
require_once(__DIR__ . '/vendor/autoload.php');

// Configure the SDK
$config = Invoicetronic\Configuration::getDefaultConfiguration()
    ->setUsername('YOUR TEST API KEY (starts with ik_test_)');

$config->setHost('https://api.invoicetronic.com/v1');

// Send an invoice
$filePath = '/some/file/path/filename.xml';

$metaData = [
    'internal_id' => '123',
    'created_with' => 'myapp',
    'some_other_custom_data' => 'value'
];

$sendApi = new Invoicetronic\Api\SendApi(
    new GuzzleHttp\Client(),
    $config
);

try {
    $sendData = new Invoicetronic\Model\Send();
    $sendData->setFileName(basename($filePath));
    $sendData->setPayload(file_get_contents($filePath));
    $sendData->setMetaData($metaData);

    $sentInvoice = $sendApi->sendPost($sendData);

    echo "The invoice was sent successfully, it now has the unique Id of {$sentInvoice->getId()}.\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
    if (method_exists($e, 'getResponseBody')) {
        echo 'Response: ' . $e->getResponseBody() . "\n";
    }
}
