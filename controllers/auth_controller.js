const express = require('express')

module.exports.home_fn = (req,res) => {
     res.redirect('/home');
}

module.exports.logout_fn = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
    });
    res.redirect('/');
}
