<?php
require_once(__DIR__ . '/vendor/autoload.php');

// Configura l'SDK
$config = Invoicetronic\Configuration::getDefaultConfiguration()
    ->setUsername('LA TUA CHIAVE API DI TEST (inizia con ik_test_)');

$config->setHost('https://api.invoicetronic.com/v1');

// Scarica le fatture non lette
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

    echo "Ricevute " . count($inboundInvoices) . " fatture\n";

    foreach ($inboundInvoices as $invoice) {
        // Gestisci encoding XML o Base64
        if ($invoice->getEncoding() === 'xml') {
            file_put_contents($invoice->getFileName(), $invoice->getPayload());
        } elseif ($invoice->getEncoding() === 'base64') {
            file_put_contents($invoice->getFileName(), base64_decode($invoice->getPayload()));
        }

        echo "Scaricato {$invoice->getFileName()} da un fornitore con Partita IVA {$invoice->getPrestatore()}\n";
    }
} catch (Exception $e) {
    echo 'Errore: ' . $e->getMessage() . "\n";
    if (method_exists($e, 'getResponseBody')) {
        echo 'Response: ' . $e->getResponseBody() . "\n";
    }
}
