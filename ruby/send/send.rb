require 'invoicetronic_sdk'

# Configure the SDK
Invoicetronic_Sdk.configure do |config|
  config.scheme = 'https'
  config.host = 'api.invoicetronic.com'
  config.base_path = '/v1'
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

api_instance = Invoicetronic_Sdk::SendApi.new

begin
  payload = File.read(file_path)

  send_data = Invoicetronic_Sdk::ModelSend.new(
    file_name: File.basename(file_path),
    payload: payload,
    meta_data: meta_data
  )

  sent_invoice = api_instance.send_post(send_data)

  puts "The invoice was sent successfully, it now has the unique Id of #{sent_invoice.id}."

  # Read the current SDI state without a separate /update call.
  # latest_state may be nil right after submission (the SDI hasn't processed yet).
  fresh = api_instance.send_id_get(sent_invoice.id)
  puts "Current state: #{fresh.latest_state || 'Processing'}"
rescue Invoicetronic_Sdk::ApiError => e
  puts "Error: #{e}"
end
