const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

const CryptoJS = require("crypto-js");
const userDB = require('../controllers/controller')
const createError = require('http-errors');

router.use(( req, res, next)=>{
    next()
});


router.get('/more_cat',controller.more_cat);
router.get('/more_cat_john',controller.more_cat_john);
router.get('/more_found_cat',controller.more_found_cat);
// router.get('/',controller.auth,controller.index );
router.get('/',controller.home);
router.get('/login',controller.auth_logout  ,controller.login_get );
router.get('/register',controller.auth_logout ,controller.register_get );

router.post('/login' ,controller.login );
router.post('/register' ,controller.register );
router.post('/logout',controller.logout );


router.get('/catinfo',controller.cat_info );
router.get('/footer',controller.footer );
router.get('/checkpost',controller.checkpost );
// router.get('/login', controller.login);
router.get('/findhome_post', controller.findhome_post);
router.get('/report_post', controller.report_post);
router.get('/profile', controller.profile); 
router.get('/mypost',controller.mypost ); 

router.get('/editprofile', controller.editprofile); 
router.get('/register', controller.register); 
router.get('/login2',controller.login2); 

module.exports = router;
