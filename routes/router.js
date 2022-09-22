const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

const CryptoJS = require("crypto-js");
const userDB = require('../controllers/controller')
const createError = require('http-errors');

router.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
    next()
});


router.get('/',controller.index );
// router.get('/login',controller.login );

router.get('/more_cat',controller.more_cat);
router.get('/more_cat_john',controller.more_cat_john);
// router.get('/',controller.auth,controller.index );
// router.get('/login',controller.auth_logout  ,controller.login_get );
// router.get('/register',controller.auth_logout ,controller.register_get );

router.post('/login' ,controller.login );
router.post('/register' ,controller.register );
router.post('/logout',controller.logout );

// router.get('/',controller.index );
// router.get('/login', controller.login);
// router.get('/',controller.index );
// router.get('/login',controller.login );
router.get('/catinfo/',controller.cat_info);
router.get('/footer',controller.footer );
router.get('/checkpost',controller.checkpost );
// router.get('/login', controller.login);
// router.get('/findhome_post', controller.findhome_post);
// router.get('/report_post', controller.report_post);
router.get('/profile', controller.profile); 
router.get('/editprofile',controller.editprofile ); 
router.get('/register', controller.register); 
router.get('/login2',controller.login2); 


router.get('/mypost',controller.mypost); 

//yun
router.get('/catinfo1/:id',controller.catfindhouse_detail);
router.get('/catinfo2/:id',controller.catlost_detail);

router.get("/findhome_post", controller.findhome_post);
router.post("/findhome_post/add", controller.addcat_findhouse);
router.post("/findhome_post/edit", controller.edit_findhome_post);
router.post("/findhome_post/update", controller.update_findhome_post);

router.get('/report_post', controller.report_post);
router.post("/report_post/add", controller.addcat_lost);
router.post("/report_post/edit", controller.edit_cat_lost);
router.post("/report_post/update", controller.update_cat_lost);

router.get("/delete/:id", controller.delete);

//run
router.get('/accept/:id',controller.accept_post);
router.get('/decline/:id',controller.decline_post);

router.get('/search',controller.search);

module.exports = router;
