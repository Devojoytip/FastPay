const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const { show_home, deliver_fn, view_fn, alert_fn, show_orders, show_cart } = require('../controllers/order_controller')

router.post('/:id/ok',ensureAuth, show_home);

router.get('/:id/deliver',ensureAuth, deliver_fn);

router.get('/:id/view',ensureAuth, view_fn);

router.get('/:id/alert',ensureAuth, alert_fn);

router.get('/myorders',ensureAuth, show_orders);

router.post('/:shopId/:cartId/ok', show_cart);

module.exports = router;