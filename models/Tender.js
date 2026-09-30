const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
    id: String,
    title: String,
    org: String,
    value: Number,
    deadline: String,
    status: String,
    region: String,
    winProb: Number,
    category: String,
    catLabel: String,
    reqs: [String],
    desc: String
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
