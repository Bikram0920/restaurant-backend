const mongoose=require('mongoose');

const TableSchema=new mongoose.Schema({
    T_id:{
        type:'String',
        required: true
    },
    capacity:{
        type: Number,
        required: true
    },
    b_date:{
        type: Date,
        default: Date.now()
    },
    date:{
        type: Date,
        // required: true
    },
    time_slot:{
        type: 'String',
        // required: true
    }
})

const Table=mongoose.model('Tables',TableSchema);

module.exports=Table