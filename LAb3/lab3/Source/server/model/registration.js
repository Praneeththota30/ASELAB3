const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registration = new Schema({
    first_name: String,
    last_name: String,
    email_Id: String,
    password: String
});

exports.module = mongoose.model('registration', registration);