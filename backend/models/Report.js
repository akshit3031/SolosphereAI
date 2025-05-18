const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  os: { type: String, required: true },
  disk_encryption: { type: Boolean, default: false },     // matches your JSON key
  os_update: { type: String, default: 'Unknown' },         // string, e.g. 'Check manually'
  antivirus: { type: String, default: 'Unknown' },
  sleep_ok: { type: Boolean, default: false },             // boolean flag for sleep settings
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
