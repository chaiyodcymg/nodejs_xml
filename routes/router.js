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
router.get('/login',controller.login );
router.get('/cat_findhouse',controller.cat_findhouse);


router.get('/:id',controller.findhouse_detail,(req,res)=>{
  res.render('findhouse_detail')  
})
module.exports = router;
