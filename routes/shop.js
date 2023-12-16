const express = require('express')
const router = express.Router()
const { shop_homepage, search_fn, add_shop, add_ok, explore_fn, shop_explore_fn, view_items, view_cartItems, show_items, show_orders, edit_fn, edit_ok, delete_fn } = require('../controllers/shop_controller')

// @desc : welcome page
// @route : GET /shop/
router.get('/', shop_homepage);

router.get('/search', search_fn);

// @desc : welcome page
// @route : GET /shop/add
router.get('/add', add_shop);

router.post('/add/ok', add_ok);

router.get('/explore/:id', explore_fn);

router.get('/explore/:id/search', shop_explore_fn);

router.get('/:id/view-items', view_items);

router.get('/:shopId/:cartId/search', view_cartItems);

router.get('/:id/view-items/:cartId', show_items);

router.get('/:id/orders', show_orders);

router.get('/:id/edit', edit_fn);

router.post('/:id/edit/ok', edit_ok);

router.post('/:id/delete', delete_fn);

module.exports = router;