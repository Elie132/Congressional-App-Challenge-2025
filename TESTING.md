# Testing ShelfShare on Multiple Devices

## For Congressional App Challenge Demo

### Option 1: Use Your Network IP (Recommended)
1. **Find your computer's IP address**:
   - Mac: System Preferences → Network → Advanced → TCP/IP
   - Or run: `ifconfig | grep "inet " | grep -v 127.0.0.1`

2. **Access from other devices**:
   - Instead of `localhost:5174`
   - Use: `http://YOUR_IP_ADDRESS:5174`
   - Example: `http://192.168.1.100:5174`

3. **Make sure devices are on same WiFi network**

### Option 2: Use ngrok (Public URL)
1. **Install ngrok**: `brew install ngrok` (Mac) or download from ngrok.com
2. **Run**: `ngrok http 5174`
3. **Use the public URL** it gives you (like `https://abc123.ngrok.io`)
4. **Access from any device** with internet

### Creating Test Accounts
1. **Use different email addresses** for each account:
   - `donor1@test.com`, `receiver1@test.com`, etc.
   - Or use Gmail + trick: `yourname+donor1@gmail.com`

2. **Create diverse profiles**:
   - Restaurant (donor): "Mario's Pizza", donor role
   - Food bank (receiver): "Downtown Food Pantry", receiver role  
   - Individual (donor): "Sarah Johnson", donor role
   - Family (receiver): "The Smith Family", receiver role

3. **Post varied listings**:
   - Different food types, quantities, times
   - Different addresses/ZIP codes
   - Mix of individual and organization sources

### Demo Script Ideas
1. **Show donor posting**: Restaurant listing surplus pizza
2. **Show receiver browsing**: Family finding food nearby
3. **Show claiming process**: Multiple people claiming portions
4. **Show map view**: All listings with locations
5. **Show messaging**: Coordination between donor/receiver
6. **Show profile switching**: Same person can donate and receive

### Pro Tips
- **Use realistic data** (real addresses, reasonable quantities)
- **Take screenshots** of each step for backup
- **Test the full flow** before recording
- **Have backup accounts** ready in case of issues