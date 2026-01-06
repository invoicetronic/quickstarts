<?php
require_once(__DIR__ . '/vendor/autoload.php');

// Configura l'SDK
$config = Invoicetronic\Configuration::getDefaultConfiguration()
    ->setUsername('LA TUA CHIAVE API DI TEST (inizia con ik_test_)');

$config->setHost('https://api.invoicetronic.com/v1');

// Invia una fattura
$filePath = '/qualche/percorso/file/nomefile.xml';

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

    echo "La fattura è stata inviata con successo, ora ha l'Id univoco {$sentInvoice->getId()}.\n";
} catch (Exception $e) {
    echo 'Errore: ' . $e->getMessage() . "\n";
    if (method_exists($e, 'getResponseBody')) {
        echo 'Response: ' . $e->getResponseBody() . "\n";
    }
}
