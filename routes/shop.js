const express = require('express')
const router = express.Router()
const Shop = require('../models/Shop')
const Item = require('../models/Item')
const Cart = require('../models/cart')
const Order = require('../models/Order')
const colors = require('colors');
const compare = require('../helper/sort')
const compare2 = require('../helper/sort2')
const translate = require('../helper/translate');
const {ensureAuth, ensureGuest} = require('../middleware/auth')

// @desc : welcome page
// @route : GET /shop/
router.get('/', async (req,res) => {
    try{
        const shops = await Shop.find({owner : req.user.id}).populate('owner').lean();
        shops.sort(compare);
        res.render('shop',{
            'shops' : shops,
            'user' : req.user.tamilName,
            'tamilName' : req.user.tamilName,
            layout:"main2"
        })
    }
    catch(err){
        console.log(err);
    } 
})

router.get('/search', async (req,res) => {
    try{
        //const shops = await Shop.find({owner : req.user.id}).populate('owner').lean();
        // console.log(req.query.search);
        const shops = await Shop.find({owner : req.user.id}).populate('owner').lean();
        var shops2=[]
        for(var i=0;i<shops.length;i++){
            if(shops[i].shopNameTamil.includes(req.query.search)){
                shops2.push(shops[i]);
            }
            if(shops[i].shopNameEnglish.includes(req.query.search)){
                shops2.push(shops[i]);
            }
        }
        if(req.query.search == ''){
            shops2 = shops;
        }
        shops2.sort(compare);
        return res.render('shop',{
            'shops' : shops2,
            'user' : req.user.tamilName,
            'tamilName' : req.user.tamilName,
            layout:"main2"
        })
    }
    catch(err){
        console.log(err);
    } 
})

// @desc : welcome page
// @route : GET /shop/add
router.get('/add', async (req,res) => {
    res.render('add-shop-1',{
        'user' : req.user.displayName,
        layout : 'main'
    })
    
})

router.post('/add/ok', async (req,res) => {
    try{
        console.log(req.body);
        if(req.body.translate == 'YES'){
            const shopNameTamil = await translate(req.body.shopNameEnglish);
            return res.render('shop-translate',{
                'values' : req.body,
                'shopNameTamil' : shopNameTamil,
                layout:"main"
            });
        }
        req.body.owner = req.user.id;
        console.log("shop added to mongo..".yellow.bold);
        await Shop.create(req.body);
        res.redirect('/shop/');
    }
    catch(err){
    }
})

router.get('/explore/:id', async (req,res) => {
    try{
        const shop = await Shop.findById(req.params.id).lean();
        const items = await Item.find({'itemShop' : req.params.id}).lean();
        items.sort(compare2);
        res.render('shop-explore-1',{
            'shop' : shop,
            "items" : items,
            'user' : req.user.displayName,
            'tamilName' : req.user.tamilName,
            'shopid' : req.params.id,
            layout : 'main2'
        });
    }
    catch(err){
        console.log(err);
    }
})

router.get('/explore/:id/search', async (req,res)=> {
    try{
        const shop = await Shop.findById(req.params.id).lean();
        const items = await Item.find({'itemShop' : req.params.id}).lean();
        var items2 = [];
        for(var i=0;i<items.length;i++){
            if(items[i].itemNameTamil.includes(req.query.search)){
                items2.push(items[i]);
            }
            if(items[i].itemNameEnglish.includes(req.query.search)){
                items2.push(items[i]);
            }
        }
        if(req.query.search == ""){
            items2 = items;
        }
        items2.sort(compare2);
        res.render('shop-explore-1',{
            'shop' : shop,
            "items" : items2,
            'user' : req.user.displayName,
            'tamilName' : req.user.tamilName,
            'shopid' : req.params.id,
            layout : 'main2'
        });

    }
    catch(err){
        console.log(err);
    }
})

router.get('/:id/view-items', async (req, res) => {
    try{
        var new_cart = {
            'user' : req.user,
            'shop' : req.params.id,
            'itemsOrdered' : [],
            'total' : 0,
        };

        try{
            await Cart.create(new_cart,(err,cart) => {
                console.log(cart._id);
                return res.redirect(`/shop/${req.params.id}/view-items/${cart._id}`);
            });
        }
        catch(err){
            console.log(err);
        }


    }
    catch(err){

    }
})
router.get('/:shopId/:cartId/search',async (req,res)=>{
    try{
        const shop = await Shop.findById(req.params.shopId).lean();
        const cart = await Cart.findById(req.params.cartId).lean();
        const items = await Item.find({'itemShop' : req.params.shopId}).lean();
        var items2 = [];
        for(var i=0;i<items.length;i++){
            if(items[i].itemNameTamil.includes(req.query.search)){
                items2.push(items[i]);
            }
            if(items[i].itemNameEnglish.includes(req.query.search)){
                items2.push(items[i]);
            }
        }
        if(req.query.search == ""){
            items2 = items;
        }
        const cartItems = cart.itemsOrdered;
        var checkItems = {};
        for(var i =0;i <cartItems.length;i++){
            console.log(`${cartItems[i].item}`);
            var item_id = cartItems[i].item;
            var item_quantity = cartItems[i].itemQuantity;
            checkItems[item_id] = item_quantity;
        }
        for(var i=0;i<items2.length;i++){
            var item_id = items2[i]._id;
            if(item_id in checkItems){
                items2[i].alreadyOrdered = checkItems[item_id];
            }
            else{
                items2[i].alreadyOrdered = 0;
            }
        }
        items2.sort(compare2);
        res.render('view-items-1',{
            'shop' : shop,
            'items' : items2,
            'user' : req.user.tamilName,
            layout : 'main2',
            'cartId' : req.params.cartId,
        })

    }
    catch(err){

    }
})
router.get('/:id/view-items/:cartId', async (req, res) => {
    try{
        const shop = await Shop.findById(req.params.id).lean();
        var items = await Item.find({'itemShop' : req.params.id}).lean();
        const cart = await Cart.findById(req.params.cartId).lean();
        const cartItems = cart.itemsOrdered;
        var checkItems = {};
        for(var i =0;i <cartItems.length;i++){
            console.log(`${cartItems[i].item}`);
            var item_id = cartItems[i].item;
            var item_quantity = cartItems[i].itemQuantity;
            checkItems[item_id] = item_quantity;
        }
        for(var i=0;i<items.length;i++){
            var item_id = items[i]._id;
            if(item_id in checkItems){
                items[i].alreadyOrdered = checkItems[item_id];
            }
            else{
                items[i].alreadyOrdered = 0;
            }
        }
        console.log(items);
        items.sort(compare2);
        res.render('view-items-1',{
            'shop' : shop,
            'items' : items,
            'user' : req.user.tamilName,
            layout : 'main2',
            'cartId' : req.params.cartId,
        })
    }
    catch(err){
        console.log(err);
    }
})

router.get('/:id/orders', async (req,res) => {
    try{
        const orders = await Cart.find({"shop" : req.params.id}).populate('user').lean();
        for(var i=0;i<orders.length;i++){
            orders[i].date = orders[i].createdAt.toLocaleDateString("en-US");
            orders[i].time = orders[i].createdAt.toLocaleTimeString("en-US");
        }
        res.render('shop-orders',{
            "order" : orders,
            layout : "main2"
        })

    }
    catch{

    }
})

router.get('/:id/edit', async (req,res) => {
    try{
        const shop =  await Shop.findById(req.params.id).lean();
        res.render('edit-shop',{
            'shop' : shop,
        })
    }
    catch(err){
        console.log(err);
    }
})

router.post('/:id/edit/ok', async (req,res) => {
    try{
        await Shop.findOneAndUpdate({_id : req.params.id },req.body,{
            new:true,
            runValidators:true
        });
        res.redirect('/shop/');
    }
    catch(err){
        console.log(err);
    }
})

router.post('/:id/delete', async (req,res)=>{
    try{
        await Shop.remove({_id : req.params.id});
        res.redirect('/shop');
    }
    catch(err){
        console.log(err);
    }
})


module.exports = router