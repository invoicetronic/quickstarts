require 'invoicetronic_sdk'

# Configure the SDK
Invoicetronic_Sdk.configure do |config|
  config.scheme = 'https'
  config.host = 'api.invoicetronic.com'
  config.base_path = '/v1'
  config.username = 'YOUR TEST API KEY (starts with ik_test_)'
  config.password = ''
end

# Id of the sent invoice we want to inspect
send_id = 225

api_instance = Invoicetronic_Sdk::UpdateApi.new

begin
  updates = api_instance.update_get(
    send_id: send_id,
    sort: 'last_update'
  )

  puts "Found #{updates.length} notifications for invoice #{send_id}"

  updates.each do |update|
    description = update.description || 'OK'
    puts "  [#{update.last_update}] state=#{update.state} - #{description}"
  end
rescue Invoicetronic_Sdk::ApiError => e
  puts "Error: #{e}"
end
