require 'invoicetronic_sdk'
require 'base64'

# Configure the SDK
InvoicetronicSdk.configure do |config|
  config.host = 'https://api.invoicetronic.com/v1'
  config.username = 'YOUR TEST API KEY (starts with ik_test_)'
  config.password = ''
end

# Download unread invoices
api_instance = InvoicetronicSdk::ReceiveApi.new

begin
  inbound_invoices = api_instance.receive_get(
    nil,    # company_id
    nil,    # identifier
    true,   # unread
    nil,    # committente
    nil,    # prestatore
    nil,    # file_name
    nil,    # last_update_from
    nil,    # last_update_to
    nil,    # date_sent_from
    nil,    # date_sent_to
    nil,    # document_date_from
    nil,    # document_date_to
    nil,    # document_number
    true,   # include_payload
    nil,    # page
    nil,    # page_size
    nil     # sort
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
rescue InvoicetronicSdk::ApiError => e
  puts "Error: #{e}"
end
