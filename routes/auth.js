const express = require('express')
const router = express.Router()
const passport = require('passport')
const { home_fn, logout_fn } = require('../controllers/auth_controller')

// @desc : Auth with Google
// @route : GET /auth/google
router.get('/google',passport.authenticate('google',{
    scope: ['profile','email'],
}))

// @desc : Google auth callback
// @route : GET /auth/google/callback
router.get('/google/callback',passport.authenticate('google',{
    failureRedirect: '/',
}), home_fn)

// @desc : logout user
// @route : GET /auth/logout
router.get('/logout', logout_fn)

module.exports = router