const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

const CryptoJS = require("crypto-js");
const userDB = require('../controllers/controller')
const createError = require('http-errors');

router.use(( req, res, next)=>{
    next()
});


router.get('/',controller.home );
router.get('/login',controller.auth_logout  ,controller.login_get );
router.get('/register',controller.auth_logout ,controller.register_get );

router.post('/login' ,controller.login );
router.post('/register' ,controller.register );
router.post('/logout',controller.logout );


router.get('/report_post',controller.auth,controller.report_post);
router.get('/profile',controller.auth , controller.profile); 

router.get('/editprofile',controller.auth ,controller.editprofile ); 
router.post('/editprofile',controller.auth ,controller.editprofileinfo ); 

router.get("/findhome_post", controller.auth ,controller.findhome_post);
router.get("/mypost",controller.auth ,controller.mypost);
router.post("/findhome_post/add", controller.auth ,controller.addcat_findhouse);
router.get('/admincheckpost',controller.user_permission,controller.admincheckpost)
module.exports = router;
