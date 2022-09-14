const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

//middleware ดักทุก request
router.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

router.get("/", controller.index);
router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/test1", controller.test1);
router.get("/test2", controller.test2);
router.get("/test2/:id", controller.show);

router.get("/findhome_post", controller.findhome_post);
router.post("/findhome_post/add", controller.addcat_findhouse);
router.post("/findhome_post/edit", controller.edit);
router.post("/findhome_post/update", controller.update);

router.get('/report_post', controller.report_post);
router.post("/report_post/add", controller.addcat_lost);

module.exports = router;
