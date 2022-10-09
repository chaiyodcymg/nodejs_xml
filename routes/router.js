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


router.get('/',controller.index );//หน้า index
router.get('/more_cat',controller.more_cat);//หน้าดูเพิ่มเติมของน้องแมวหาบ้าน
router.get('/more_cat_john',controller.more_cat_john);//หน้าดูเพิ่มเติมของน้องแมวหาย
router.get('/more_found_cat',controller.more_found_cat);//หน้าดูเพิ่มเติมของเจอน้องแมว


router.post('/login' ,controller.login );//หน้า login
router.post('/register' ,controller.register );//หน้า register
router.get('/logout',controller.logout );//หน้า logout



// router.get('/footer',controller.footer );

router.get('/checkpost',controller.user_permission,controller.checkpost)
router.get('/login',controller.auth_logout  ,controller.login_get );
router.get('/register',controller.auth_logout ,controller.register_get );
router.get('/profile',controller.auth , controller.profile); 
router.get('/editprofile',controller.auth ,controller.editprofile ); 
router.post('/editprofile',controller.auth ,controller.editprofileinfo ); 
router.get("/mypost",controller.auth ,controller.mypost);

//yun
//หน้าแสดงข้อมูลของแต่ละตัว
router.get('/catinfo1/',controller.catfindhouse_detail);
router.get('/catinfo2/',controller.catlost_detail);
router.get('/catinfo3/',controller.catfound_detail);

//หน้าการจัดการเกี่ยวกับแมวหาบ้าน
router.get("/findhome_post", controller.auth ,controller.findhome_post);//ส่งไปหน้าโพสต์แมวหาบ้าน
router.post("/findhome_post/add", controller.auth ,controller.addcat_findhouse);//create ข้อมูลของแมวหาบ้าน
router.post("/findhome_post/edit", controller.edit_findhome_post);//ส่งไปหน้าแก้ไขข้อมูลโพสต์
router.post("/findhome_post/update", controller.update_findhome_post);//update ข้อมูลของแมวหาบ้าน

//หน้าการจัดการเกี่ยวกับแมวหาย
router.get('/report_post',controller.auth,controller.report_post);//ส่งไปหน้าโพสต์แมวหาย
router.post("/report_post/add", controller.addcat_lost);//create ข้อมูลของแมวหาย
router.post("/report_post/edit", controller.edit_cat_lost);//ส่งไปหน้าแก้ไขข้อมูลโพสต์
router.post("/report_post/update", controller.update_cat_lost);//update ข้อมูลของแมวหาย

router.get("/delete/:id", controller.delete);//Delete ข้อมูลแมวแต่ละตัว

//run
router.get('/accept/:id',controller.accept_post);
router.get('/decline/:id',controller.decline_post);

router.get('/search',controller.search);

module.exports = router;
