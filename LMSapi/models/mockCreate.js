const mongoose = require('mongoose')

const createMockSchema = new mongoose.Schema({
    mockNo:{
        type:Number,
        required:true
    },
    technologyName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'technologies'
    },
    panel:{
        type:String,
        required:true
    },
    dateTime:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('createdMocks',createMockSchema)