const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type: String
    },
    price : {
        type: Number,
        required : true
    }
})

module.exports = mongoose.model('Menu',menuSchema)