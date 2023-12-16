const express = require('express')
const router = express.Router()
const Item = require('../models/Item')
const translate = require('../helper/translate');

module.exports.add_item=async (req,res) => {
    res.render('add-item',{
        'shopid' : req.params.id
    });
}

module.exports.add_ok=async (req,res) => {
    req.body.itemShop = req.params.id;
    if(req.body.translate == 'YES'){
        const itemNameHindi = await translate(req.body.itemNameEnglish);
        return res.render('item-translate',{
            'values' : req.body,
            'itemNameHindi' : itemNameHindi,
            'shopid' : req.params.id,
        });
    }
    const fileName=req.file.filename;
    const basePath = `/item_images/` + fileName;
    req.body.itemImage=basePath;
    console.log(`${req.body.itemImage}`.blue.bold);
    const new_item = {
        itemNameEnglish : req.body.itemNameEnglish,
        itemNameHindi : req.body.itemNameHindi,
        itemPrice : req.body.itemPrice,
        itemQuantity : req.body.itemQuantity,
        itemShop : req.body.itemShop,
        itemImage : req.body.itemImage,
    }
    await Item.create(new_item);
    console.log("Items added to mongo..".yellow.bold);
    res.redirect('/shop/explore/'+req.params.id);
}

module.exports.edit_fn=async (req,res)=>{
    const item = await Item.findById(req.params.id).lean();
    res.render('edit-item',{
        'item' : item,
    })
}

module.exports.edit_ok=async (req,res) => {
    const item = await Item.findById(req.params.id).lean();
    console.log(req.body);
    console.log(item);
    var new_item = req.body;
    new_item.itemImage = item.itemImage;
    console.log(new_item);
    await Item.findOneAndUpdate({_id : req.params.id },new_item,{
        new:true,
        runValidators:true
    });
    res.redirect(`/shop/explore/${item.itemShop}`)
}

module.exports.delete_fn=async(req,res)=> {
    const item = await Item.findById(req.params.id).lean();
    const shop = item.itemShop;
    await Item.remove({_id: req.params.id});
    res.redirect(`/shop/explore/${shop}`);
}