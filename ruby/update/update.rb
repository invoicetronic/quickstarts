require 'invoicetronic_sdk'

# Configure the SDK
InvoicetronicSdk.configure do |config|
  config.host = 'https://api.invoicetronic.com/v1'
  config.username = 'YOUR TEST API KEY (starts with ik_test_)'
  config.password = ''
end

# Id of the sent invoice we want to inspect
send_id = 225

api_instance = InvoicetronicSdk::UpdateApi.new

begin
  updates = api_instance.update_get(
    nil,           # company_id
    nil,           # identifier
    nil,           # prestatore
    nil,           # unread
    send_id,       # send_id
    nil,           # state
    nil,           # last_update_from
    nil,           # last_update_to
    nil,           # date_sent_from
    nil,           # date_sent_to
    nil,           # page
    nil,           # page_size
    'last_update'  # sort
  )

  puts "Found #{updates.length} notifications for invoice #{send_id}"

  updates.each do |update|
    description = update.description || 'OK'
    puts "  [#{update.last_update}] state=#{update.state} - #{description}"
  end
rescue InvoicetronicSdk::ApiError => e
  puts "Error: #{e}"
end
