#!/usr/bin/env node

const os = require('os');

function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name: name,
          address: iface.address
        });
      }
    }
  }
  
  return addresses;
}

console.log('\n🚀 ShelfShare Development Server URLs:\n');

// Local URL
console.log('📱 Local Development:');
console.log(`   http://localhost:5174`);
console.log(`   http://127.0.0.1:5174\n`);

// Network URLs
const networkInterfaces = getNetworkInterfaces();
if (networkInterfaces.length > 0) {
  console.log('🌐 Network Access (for other devices):');
  networkInterfaces.forEach(iface => {
    console.log(`   http://${iface.address}:5174  (${iface.name})`);
  });
  console.log('\n📋 To test on other devices:');
  console.log('   1. Connect devices to the same WiFi network');
  console.log('   2. Use any of the network URLs above');
  console.log('   3. Create different accounts with different emails\n');
} else {
  console.log('⚠️  No network interfaces found. Check your network connection.\n');
}

console.log('💡 Pro Tips:');
console.log('   • Use different emails: test1@example.com, test2@example.com');
console.log('   • Create both donor and receiver accounts');
console.log('   • Test the full flow: post food → claim → coordinate pickup');
console.log('   • Take screenshots for your Congressional App Challenge demo!\n');