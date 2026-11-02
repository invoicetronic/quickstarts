require 'invoicetronic_sdk'
require 'base64'

# Configure the SDK
Invoicetronic_Sdk.configure do |config|
  config.scheme = 'https'
  config.host = 'api.invoicetronic.com'
  config.base_path = '/v1'
  config.username = 'YOUR TEST API KEY (starts with ik_test_)'
  config.password = ''
end

# Download unread invoices
api_instance = Invoicetronic_Sdk::ReceiveApi.new

begin
  inbound_invoices = api_instance.receive_get(
    unread: true,
    include_payload: true
  )

  puts "Received #{inbound_invoices.length} invoices"

  inbound_invoices.each do |invoice|
    if invoice.encoding == 'Xml'
      File.write(invoice.file_name, invoice.payload)
    elsif invoice.encoding == 'Base64'
      File.write(invoice.file_name, Base64.decode64(invoice.payload))
    end

    puts "Downloaded #{invoice.file_name} from a vendor with VAT ID #{invoice.prestatore}"
  end
rescue Invoicetronic_Sdk::ApiError => e
  puts "Error: #{e}"
end
