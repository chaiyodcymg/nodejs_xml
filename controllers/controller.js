const monk = require("monk");
const url = "localhost:27017/nodejs_xml";
const db = monk(url);

db.then(() => {
  console.log("Connected correctly to server");
});

const users = db.get("users");
const cat_findhouse = db.get("cat_findhouse");
const cat_lost = db.get("cat_lost");
const data = [cat_findhouse,cat_lost];
const CryptoJS = require("crypto-js");
const randomstring = require("randomstring");
const fs = require('fs');

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
  cat_findhouse.find({}, function (err, docs) {
    //ค้นหาข้อมูลใน collection test2 ทั้งหมด ไปเก็บที่ docs
    res.render("test2", { title: "SHOWDATA", calltest: docs }); //test2 ต้องชื่อเดียวกันกับชื่อใน view
  });
};

exports.findhome_post = (req, res) => {
  res.render("findhome_post", { title: "findhome_post" });
};

exports.addcat_findhouse = (req, res, next) => {
  const file = req.files.pet_image;
  var filename_random = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(50)+".jpg"
  if (fs.existsSync(filename_random )) {
     filename_random  = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(60)+".jpg"
    file.mv(filename_random)
  }else{
    file.mv(filename_random)
  }
  cat_findhouse.insert(
    {
      status: false,
      findhome_type: req.body.flexRadioDefault,
      pet_name: req.body.pet_name,
      pet_gene: req.body.pet_gene,
      pet_gender: req.body.pet_gender,
      pet_color: req.body.pet_color,
      pet_vaccin: req.body.pet_vaccin,
      pet_vaccin_date: req.body.pet_vaccin_date,
      pet_symptom: req.body.pet_symptom,
      pet_image: filename_random.split('/public/')[1],
      place: req.body.place,
      contact_name: req.body.contact_name,
      contact_surname: req.body.contact_surname,
      contact_tel: req.body.contact_tel,
      contact_email: req.body.contact_email,
      contact_line: req.body.contact_line,
      contact_facebook: req.body.contact_facebook,
    },
    function (err, cat_findhome) {
      if (err) {
        console.log(err);
        res.send(
          ' <script>alert("บันทึกข้อมูลไม่สำเร็จ!!!"); window.location = "/"; </script>'
        );
      } else {
        res.send(
          ' <script>alert("บันทึกข้อมูลสำเร็จ!!!"); window.location = "/"; </script>'
        );
        // res.location('/');
        // res.redirect('/');
      }
    }
  );
};

//อ้างอิง id ที่จะทำการแก้ไขรายละเอียด
exports.edit_findhome_post = (req, res) => {
  const edit_id = req.body.edit_id;
  cat_findhouse.findOne({ _id: edit_id }).then((doc) => {
    res.render("edit_findhome_post", {title:"แก้ไขรายละเอียด", doc: doc });
  });
};

//หลังจากกด submit จากหน้า edit.ejs จะมาทำ action นี้
exports.update_findhome_post = (req, res) => {
  const file = req.files.pet_image;
  var filename_random = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(50)+".jpg"
  if (fs.existsSync(filename_random )) {
     filename_random  = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(60)+".jpg"
    file.mv(filename_random)
  }else{
    file.mv(filename_random)
  }
  const update_id = req.body.edit_id;
  let data = {
    pet_name: req.body.pet_name,
    pet_gene: req.body.pet_gene,
    pet_gender: req.body.pet_gender,
    pet_color: req.body.pet_color,
    pet_vaccin: req.body.pet_vaccin,
    pet_vaccin_date: req.body.pet_vaccin_date,
    pet_symptom: req.body.pet_symptom,
    pet_image: filename_random.split('/public/')[1],
    place: req.body.place,
    contact_name: req.body.contact_name,
    contact_surname: req.body.contact_surname,
    contact_tel: req.body.contact_tel,
    contact_email: req.body.contact_email,
    contact_line: req.body.contact_line,
    contact_facebook: req.body.contact_facebook
  };
  // console.log("ข้อมูลใหม่ที่กรอก : ",data);
  // console.log("รหัสอัพเดต :",update_id);
  cat_findhouse.findOneAndUpdate({ _id: update_id },{$set: {
        pet_name: data.pet_name,
        pet_gene: data.pet_gene,
        pet_gender: data.pet_gender,
        pet_color: data.pet_color,
        pet_vaccin: data.pet_vaccin,
        pet_vaccin_date: data.pet_vaccin_date,
        pet_symptom: data.pet_symptom,
        pet_image: data.pet_image,
        place: data.place,
        contact_name: data.contact_name,
        contact_surname: data.contact_surname,
        contact_tel: data.contact_tel,
        contact_email: data.contact_email,
        contact_line: data.contact_line,
        contact_facebook: data.contact_facebook
      },
    })
    .then((updatedDoc) => {
      res.redirect("/test2");
    });
};

exports.delete_findhome_post = (req, res) => {
  cat_findhouse.remove({_id:req.params.id});
  res.redirect('/test2');
};

exports.report_post = (req, res) => {
  res.render("report_post", { title: "แจ้งพบ/หาย" });
};

exports.addcat_lost = (req, res, next) => {
  // const file = req.files.pet_image;
  // var filename_random = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(50)+".jpg"
  // if (fs.existsSync(filename_random)) {
  //   filename_random  = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(60)+".jpg"
  //   file.mv(filename_random)
  // }else{
  //   file.mv(filename_random)
  // }
  cat_lost.insert({
      status:false,
      post_type: req.body.flexRadioDefault,
      pet_name: req.body.pet_name,
      pet_gene: req.body.pet_gene,
      pet_gender: req.body.pet_gender,
      pet_color: req.body.pet_color,
      pet_vaccin: req.body.pet_vaccin,
      pet_vaccin_date: req.body.pet_vaccin_date,
      pet_symptom: req.body.pet_symptom,
      // pet_image: filename_random.split('/public/')[1],
      place_date_time: req.body.place_date_time,
      place_landmarks: req.body.place_landmarks,
      place_name: req.body.place_name,
      place: req.body.place,
      contact_name: req.body.contact_name,
      contact_surname: req.body.contact_surname,
      contact_tel: req.body.contact_tel,
      contact_email: req.body.contact_email,
      contact_line: req.body.contact_line,
      contact_facebook: req.body.contact_facebook
    },function (err, cat_lost) {
      if (err) {
        console.log(err);
        res.send(
          ' <script>alert("บันทึกข้อมูลไม่สำเร็จ!!!"); window.location = "/"; </script>'
        );
      } else {
        res.send(
          ' <script>alert("บันทึกข้อมูลสำเร็จ!!!"); window.location = "/"; </script>'
        );
        // res.location('/');
        // res.redirect('/');
      }
    }
  );
};

exports.edit_cat_lost = (req, res) => {
  const edit_id = req.body.edit_id;
  cat_lost.findOne({ _id: edit_id }).then((doc) => {
    res.render("edit_cat_lost", {title:"แก้ไขรายละเอียด", doc: doc });
  });
};

exports.update_cat_lost = (req, res) => {
  const file = req.files.pet_image;
  var filename_random = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(50)+".jpg"
  if (fs.existsSync(filename_random )) {
     filename_random  = __dirname.split('\controllers')[0]+"public/images/"+randomstring.generate(60)+".jpg"
    file.mv(filename_random)
  }else{
    file.mv(filename_random)
  }
  const update_id = req.body.edit_id;
  let data = {
    pet_name: req.body.pet_name,
    pet_gene: req.body.pet_gene,
    pet_gender: req.body.pet_gender,
    pet_color: req.body.pet_color,
    pet_vaccin: req.body.pet_vaccin,
    pet_vaccin_date: req.body.pet_vaccin_date,
    pet_symptom: req.body.pet_symptom,
    pet_image: filename_random.split('/public/')[1],
    place_date_time: req.body.place_date_time,
    place_landmarks: req.body.place_landmarks,
    place_name: req.body.place_name,
    place: req.body.place,
    contact_name: req.body.contact_name,
    contact_surname: req.body.contact_surname,
    contact_tel: req.body.contact_tel,
    contact_email: req.body.contact_email,
    contact_line: req.body.contact_line,
    contact_facebook: req.body.contact_facebook
  };
  cat_lost.findOneAndUpdate({ _id: update_id },{$set: {
    pet_name: data.pet_name,
    pet_gene: data.pet_gene,
    pet_gender: data.pet_gender,
    pet_color: data.pet_color,
    pet_vaccin: data.pet_vaccin,
    pet_vaccin_date: data.pet_vaccin_date,
    pet_symptom: data.pet_symptom,
    pet_image: data.pet_image,
    place_date_time: data.place_date_time,
    place_landmarks: data.place_landmarks,
    place_name: data.place_name,
    place: data.place,
    contact_name: data.contact_name,
    contact_surname: data.contact_surname,
    contact_tel: data.contact_tel,
    contact_email: data.contact_email,
    contact_line: data.contact_line,
    contact_facebook: data.contact_facebook
  },
})
.then((updatedDoc) => {
  res.redirect("/test2");
});
}

exports.delete_cat_lost = (req, res) => {
  cat_lost.remove({_id:req.params.id});
  res.redirect('/test2');
};

exports.show = (req, res) => {
  const cat_id = req.params.id;
  cat_findhouse.findOne({ _id: cat_id }).then((doc) => {
    res.render("show", { cat: doc });
  });
};
