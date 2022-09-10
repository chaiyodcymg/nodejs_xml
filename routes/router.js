const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

const CryptoJS = require("crypto-js");
const userDB = require('../controllers/controller')
const createError = require('http-errors');

router.use(( req, res, next)=>{
    next()
});


router.get('/',controller.auth,controller.index );
router.get('/login',controller.auth_logout  ,controller.login_get );
router.get('/register',controller.auth_logout ,controller.register_get );

router.post('/login' ,controller.login );
router.post('/register' ,controller.register );
router.post('/logout',controller.logout );

module.exports = router;
