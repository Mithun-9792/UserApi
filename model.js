const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },
    address : {
        required: true,
        type: String
    },
    phone : {
        required: true,
        type : Number
    },
    password : {
        required: true,
        type: String
    },
    dept : {
        required: true,
        type: String
    }

})

module.exports = mongoose.model('Data', userSchema)