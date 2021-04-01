const mongoose = require('mongoose');
const {ObjectId,Array} = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, unique: true },
    topic: String,
    users: Array,
    messages: Array,
    created_at: Date,
    updated_at: { type: Date, default: Date.now },
},{timestamps: true});

mongoose.model("Message", messageSchema);