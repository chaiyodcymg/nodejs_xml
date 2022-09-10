const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')



//middleware ดักทุก request
router.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


router.get('/',controller.index );
router.get('/login', controller.login);
router.get('/findhome_post', controller.findhome_post);
router.get('/report_post', controller.report_post);
router.get('/profile', controller.profile); 
router.get('/editprofile', controller.editprofile); 
router.get('/register',controller.register); 
module.exports = router;
