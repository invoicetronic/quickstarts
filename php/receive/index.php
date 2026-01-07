<?php
require_once(__DIR__ . '/vendor/autoload.php');

// Configure the SDK
$config = Invoicetronic\Configuration::getDefaultConfiguration()
    ->setUsername('YOUR TEST API KEY (starts with ik_test_)');

$config->setHost('https://api.invoicetronic.com/v1');

// Download unread invoices
$receiveApi = new Invoicetronic\Api\ReceiveApi(
    new GuzzleHttp\Client(),
    $config
);

try {
    $inboundInvoices = $receiveApi->receiveGet(
        null,  // page
        null,  // pageSize
        null,  // sort
        true,  // unread
        true   // includePayload
    );

    echo "Received " . count($inboundInvoices) . " invoices\n";

    foreach ($inboundInvoices as $invoice) {
        if ($invoice->getEncoding() === 'Xml') {
            file_put_contents($invoice->getFileName(), $invoice->getPayload());
        } elseif ($invoice->getEncoding() === 'Base64') {
            file_put_contents($invoice->getFileName(), base64_decode($invoice->getPayload()));
        }

        echo "Downloaded {$invoice->getFileName()} from a vendor with VAT ID {$invoice->getPrestatore()}\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
    if (method_exists($e, 'getResponseBody')) {
        echo 'Response: ' . $e->getResponseBody() . "\n";
    }
}
