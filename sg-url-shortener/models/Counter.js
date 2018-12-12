const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter Collection Schema
var countersSchema = new Schema({
    _id: { type: String, required: true },
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', countersSchema);
