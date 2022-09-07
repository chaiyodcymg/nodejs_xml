const monk = require("monk");
const url = "localhost:27017/nodejs_xml";
const db = monk(url);

db.then(() => {
  console.log("Connected correctly to server");
});

const users = db.get("users");

exports.index = (req, res) => {
  users.find({}).then((docs) => {
    res.render("index", { title: "Express", docs });
    // res.json(docs);
  });
};

exports.login = (req, res) => {
  res.render("login", { title: "Expresss" });
};

exports.register = (req, res) => {
  res.render("register", { title: "Register" });
};

exports.test1 = (req, res) => {
  req.body;
  console.log(req.body);
  // console.log(parseInt(req.body.password)+5);
  // res.json(parseInt(req.body.password) + 5);//แสดงผลที่ body postman
};

exports.test2 = (req, res) => {
  let CThome = db.get('home');//เรียก collection Movies เก็บตัวแปรรับคำสั่ง
  CThome.find({}, function(err,docs){//ค้นหาข้อมูลใน collection movies ทั้งหมด ไปเก็บที่ docs
      res.render('test2', { calltest:docs });//movies ต้องชื่อเดียวกันกับชื่อใน view
  })
};

exports.home = (req, res) => {
  res.render("home", { title: "Home" });
};

exports.add = (req, res, next) => {
  var cthome = db.get('home');
  cthome.insert({
    pet_name:req.body.pet_name,
    pet_gender:req.body.pet_gender,
    pet_color:req.body.pet_color,
    pet_vaccin_date:req.body.pet_vaccin_date,
    pet_gene:req.body.pet_gene,
    pet_symptom:req.body.pet_symptom,
    pet_image:req.body.pet_image
  },function(err,home){
    if(err){
      res.send(err);
    }else{
      res.location('/');
      res.redirect('/');
    }
  });
};

exports.show = (req, res) => {
  res.render("show", { title: "show" });
};