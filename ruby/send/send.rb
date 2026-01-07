require 'invoicetronic_sdk'

# Configure the SDK
InvoicetronicSdk.configure do |config|
  config.host = 'https://api.invoicetronic.com/v1'
  config.username = 'YOUR TEST API KEY (starts with ik_test_)'
  config.password = ''
end

# Send an invoice
file_path = '/some/file/path/filename.xml'

meta_data = {
  'internal_id' => '123',
  'created_with' => 'myapp',
  'some_other_custom_data' => 'value'
}

api_instance = InvoicetronicSdk::SendApi.new

begin
  payload = File.read(file_path)

  send_data = InvoicetronicSdk::Send.new(
    file_name: File.basename(file_path),
    payload: payload,
    meta_data: meta_data
  )

  sent_invoice = api_instance.send_post(send_data)

  puts "The invoice was sent successfully, it now has the unique Id of #{sent_invoice.id}."
rescue InvoicetronicSdk::ApiError => e
  puts "Error: #{e}"
end
