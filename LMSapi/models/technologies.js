const mongoose = require('mongoose')

const techSchema = new mongoose.Schema({
    technologyName:{
        type:String,
        minlength:1,
        maxlength:20,
        required:true
    }

})

module.exports = mongoose.model('technologies',techSchema)