const mongoose = require('mongoose');

const itemOrderSchema = new mongoose.Schema({
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Item'
    },
    itemQuantity:{
        type: 'number',
        required: true,
    },
    itemPrice:{
        type:'number',
        required: false,
    }
})

const CartSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User' 
    },
    shop:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Shop'
    },
    itemsOrdered : [itemOrderSchema],
    delivered:{
        type:"boolean",
        default: false
    },
    total:{
        type:'number',
        required: false,
    },
    createdAt:{
        type: Date,
        default:Date.now()
    }  
})

module.exports =mongoose.model('Cart',CartSchema);


