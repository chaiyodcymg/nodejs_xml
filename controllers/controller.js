const monk = require('monk')
const url = 'localhost:27017/nodejs_xml';
const db = monk(url);

db.then(() => {
    console.log('Connected correctly to server')
})

const users = db.get('users')
exports.users = users
const CryptoJS = require("crypto-js");
const validator = require("email-validator");

const cat_findhouse = db.get("cat_findhouse");
const cat_lost = db.get("cat_lost");
const randomstring = require("randomstring");
process.env.TZ = "Asia/bangkok"
const fs = require('fs');
// หน้าหลัก
// res.setHeader('Cache-Control', 'no-store');  ไม่ให้เก็บ Back/forward cache ปุ่มไปกลับบน browser
exports.index= (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      cat_findhouse.find({status:1},{limit:3}).then((docs) => {
        cat_lost.find({status:1},{limit:2}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('home', { title: 'หน้าหลัก' ,result,role:result.role,callitem1: docs ,callitem2: doc});
        })
      })
    })
 
}else{
  cat_findhouse.find({status:1},{limit:3}).then((docs) => {
    cat_lost.find({status:1}, {limit:2}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render("home", { title: "Home",callitem1: docs ,callitem2: doc,role:null });
    })
  })
}
}

exports.user_permission = (req, res, next) => {
  if( req.cookies.AUTH != undefined){

    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
   if(result.role == 1){
      next()
   }else{
    res.redirect("back")
   }

    })
  }
}
// ระบบ login
exports.login = (req,res)=>{


  const encrypted_password = CryptoJS.MD5(req.body.password.toString()).toString()
    users.findOne({email:req.body.email,password:encrypted_password}).then((result) => {

        if(result != null){
            let encrypted = CryptoJS.AES.encrypt(result._id.toString(), "nodejs_xml").toString()
            var encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);

        
            res.cookie('AUTH',encoded, {  httpOnly: true })
            res.setHeader('Cache-Control', 'no-store');  
            res.status(200).redirect("/")
            // res.redirect("/")
    
        }else{
            req.flash('login', "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            res.redirect("/login")
        }
      })

}



exports.more_cat = (req,res)=>{

  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      cat_findhouse.find({status:1}).then((docs) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('more_cat', { result,role:result.role,callitem1: docs});
      })
    })
}else{
    cat_findhouse.find({status:1}).then((docs) => {
    res.setHeader('Cache-Control', 'no-store');  
    res.render('more_cat', { role:null,callitem1: docs});
    })
}
}

exports.more_cat_john = (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      cat_lost.find({status:1}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('more_cat_john', { result,role:result.role,callitem2: doc});
        })
    
    })
}else{
  cat_lost.find({status:1}).then((docs) => {
  res.setHeader('Cache-Control', 'no-store');  
  res.render('more_cat_john', { role:null,callitem1: docs});
  })
}
}

exports.more_found_cat = (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      cat_lost.find({status:1}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('more_found_cat', { result,role:result.role,callitem2: doc});
        })
    
    })
}else{
  cat_lost.find({status:1}).then((docs) => {
  res.setHeader('Cache-Control', 'no-store');  
  res.render('more_found_cat', { role:null,callitem1: docs});
  })
}
}

// หน้า login
exports.login_get =async (req,res)=>{
  if( req.cookies.AUTH == undefined){
  const login = await req.consumeFlash('login');
  res.setHeader('Cache-Control', 'no-store');  
  res.render('login',{title: 'เข้าสู่ระบบ',login});

  }
}
// ออกจากระบบ
exports.logout = (req,res)=>{

  res.clearCookie('AUTH');
  res.redirect("/")
}

// ระบบเช็คว่า login หรือยัง
exports.auth = (req,res,next)=>{

  if( req.cookies.AUTH != undefined){

            const cookie = req.cookies.AUTH
            const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
            const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
       
            users.findOne({_id: decrypted }).then((result) => {
            
              if(result != null){
                if(req.originalUrl == "/login" ){
                  res.redirect('/')
                }else{
                  next()
                }                        
              }else{
                res.clearCookie('AUTH');
                 res.redirect('/login')
              }
          })    
        }else {
        
          res.clearCookie('AUTH');
          res.redirect('/login')
        }
}

// ระบบเช็คว่าถ้า login แล้ว จะไม่สามารถไปหน้า login กับ register ได้
exports.auth_logout =  (req,res,next)=>{

  if( req.cookies.AUTH == undefined){
    
   return  next()
   }
 
     res.redirect('/')
   
 }
// หน้าregister
exports.register_get = async(req,res)=>{
  const register = await req.consumeFlash('register');
  res.setHeader('Cache-Control', 'no-store');  
res.render('register' , {title:'สมัครสมาชิก', register});
}
// ระบบ register
exports.register =async (req,res,next)=>{
 

  if(validator.validate(req.body.email) && req.body.password.length >= 8){
  users.findOne({email:req.body.email}).then((result) => {

    
    if(result == null){
     const encrypted_password = CryptoJS.MD5(req.body.password.toString()).toString()
      users.insert({
        email:req.body.email,
        password:encrypted_password ,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        role:0,
        image_url :"/images/user.png",
 
      }).then((result) => {
       
        if(result != null){
            let encrypted = CryptoJS.AES.encrypt(result._id.toString(), "nodejs_xml").toString()
            var encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);
    
     
            res.cookie('AUTH',encoded, {  httpOnly: true })
            res.setHeader('Cache-Control', 'no-store'); 
           res.redirect("/")
    
        }else{
            res.status(400).json({text:"สมัครสมาชิกไม่สำเร็จ"})
        }
      })

    }else{

   req.flash('register', "มีผู้ใช้อีเมลนี้แล้ว กรุณาใช้อีเมลอื่น");
    res.status(304).redirect("/register" )
    
  
    }
  })
}else if(!validator.validate(req.body.email) && req.body.password.length < 8){
  req.flash('register', "กรุณาใส่อีเมลให้ถูกต้องและใส่รหัสผ่าน 8 ตัวขึ้นไป");
  res.status(304).redirect("/register" )
}else if(!validator.validate(req.body.email) ){
  req.flash('register', "กรุณาใส่อีเมลให้ถูกต้อง");
  res.status(304).redirect("/register" )
}else if(req.body.password.length < 8){
  req.flash('register', "กรุณาใส่รหัสผ่าน 8 ตัวขึ้นไป");
  res.status(304).redirect("/register" )
}


}



exports.footer = (req,res)=>{
  res.render('footer', { title: 'Expresss' });
}

exports.checkpost  = (req, res) => {
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      cat_findhouse.find({}).then((docs) => {
        cat_lost.find({}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('admincheckpost', { title: 'ตรวจสอบโพสต์',role:result.role,callitem1: docs ,callitem2: doc });
        })
      })
    })
  }
}


exports.mypost = (req, res) =>{
    if( req.cookies.AUTH != undefined){
      const cookie = req.cookies.AUTH
      const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
      const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
      users.findOne({_id: decrypted }).then((result) => {
        cat_findhouse.find({user_id:decrypted}).then((docs) => {
          cat_lost.find({userid:decrypted}).then((doc) => {
        res.setHeader('Cache-Control', 'no-store');  
        res.render('user_mypost', { title: "โพสต์ของฉัน",profile:result,role:result.role,callitem1: docs ,callitem2: doc});

          })
        })
      })
    }
  
  }
   



//yun
exports.catfindhouse_detail = (req, res) => {
  let cat_id = req.params.id.toString() ;
  if( req.cookies.AUTH != undefined){

    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
    cat_findhouse.findOne({status:1}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('cat_detail', { title:'หาบ้านให้น้องแมว',profile:result,role:result.role,cat:doc});
    })
   
    })
  }else{
    cat_findhouse.findOne({_id:cat_id}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('cat_detail', { title:'หาบ้านให้น้องแมว',role:null,cat:doc});
    })
}
  
  
};
exports.catlost_detail = (req, res) => {
  let cat_id = req.params.id.toString() ;
  if( req.cookies.AUTH != undefined){
    
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 

    users.findOne({_id: decrypted }).then((result) => {
      cat_lost.findOne({status:1}).then((doc) => {
        res.setHeader('Cache-Control', 'no-store');  
        res.render('cat_detail', { title:'น้องแมวหาย',profile:result,role:result.role,cat:doc});

    })  
   
    })
  }else{
    cat_lost.findOne({_id:cat_id}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('cat_detail', { title:'น้องแมวหาย',role:null,cat:doc});
    })
}
};



exports.findhome_post = (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      const findhome_post  =  req.consumeFlash('findhome_post');
      res.setHeader('Cache-Control', 'no-store');  
      res.render('findhome_post', { title: 'หาบ้านให้น้องเหมียว',role:result.role,findhome_post });
    })
  }
}


exports.addcat_findhouse = (req, res) => {
  const cookie = req.cookies.AUTH
  const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
  const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
  const file = req.files.pet_image
  
  var filename_random = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
    if (fs.existsSync(filename_random )) {
       filename_random  = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
      file.mv(filename_random)
    }else{
      file.mv(filename_random)
    }
    const event = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric',minute: 'numeric',second: 'numeric' };
  
  const createat = event.toLocaleDateString('th-TH', options)
  users.findOne({_id: decrypted }).then((result) => {
    if (result.role == 1) {
      cat_findhouse.insert({
        status:1,
        // findhome_type:req.body.flexRadioDefault,
        post_type: req.body.flexRadioDefault,
        pet_name:req.body.pet_name,
        pet_gene:req.body.pet_gene,
        pet_gender:req.body.pet_gender,
        pet_color:req.body.pet_color,
        pet_vaccin:req.body.pet_vaccin,
        pet_vaccin_date:req.body.pet_vaccin_date,
        pet_symptom:req.body.pet_symptom,
        pet_image:filename_random.split('/public')[1],
        place:req.body.place,
        contact_name:req.body.contact_name,
        contact_surname:req.body.contact_surname,
        contact_tel:req.body.contact_tel,
        contact_email:req.body.contact_email,
        contact_line:req.body.contact_line,
        contact_facebook:req.body.contact_facebook,
        createat:createat,
        user_id:decrypted
      
      },function(err,result){
        if(err){
          console.log(err);
          // res.send(' <script>alert("บันทึกข้อมูลไม่สำเร็จ!!!") </script>');
          req.flash('findhome_post', "ข้อมูลไม่ถูกต้อง");
          res.redirect('/findhome_post');
        }else{
          // res.send(' <script>alert("บันทึกข้อมูลสำเร็จ!!!"); </script>');
     
          res.redirect('/');
        }
      });
    }else {
      cat_findhouse.insert({
        status:0,
        // findhome_type:req.body.flexRadioDefault,
        post_type: req.body.flexRadioDefault,
        pet_name:req.body.pet_name,
        pet_gene:req.body.pet_gene,
        pet_gender:req.body.pet_gender,
        pet_color:req.body.pet_color,
        pet_vaccin:req.body.pet_vaccin,
        pet_vaccin_date:req.body.pet_vaccin_date,
        pet_symptom:req.body.pet_symptom,
        pet_image:filename_random.split('/public')[1],
        place:req.body.place,
        contact_name:req.body.contact_name,
        contact_surname:req.body.contact_surname,
        contact_tel:req.body.contact_tel,
        contact_email:req.body.contact_email,
        contact_line:req.body.contact_line,
        contact_facebook:req.body.contact_facebook,
        createat:createat,
        user_id:decrypted
      
      },function(err,result){
        if(err){
          console.log(err);
          // res.send(' <script>alert("บันทึกข้อมูลไม่สำเร็จ!!!") </script>');
          req.flash('findhome_post', "ข้อมูลไม่ถูกต้อง");
          res.redirect('/findhome_post');
        }else{
          // res.send(' <script>alert("บันทึกข้อมูลสำเร็จ!!!"); </script>');
     
          res.redirect('/');
        }
      });
    }
  })
    
  };


exports.report_post = (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('report_post', { title: 'แก้ไขโปรไฟล์' ,result,role:result.role});

    })
  }
  
}

exports.addcat_lost = (req, res, next) => {
  const cookie = req.cookies.AUTH
  const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
  const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8);
  const file = req.files.pet_image;
  var filename_random = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
  if (fs.existsSync(filename_random)) {
    filename_random  = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
    file.mv(filename_random)
  }else{
    file.mv(filename_random)
  }
  const event = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric',minute: 'numeric',second: 'numeric' };
  const createat = event.toLocaleDateString('th-TH', options)
  users.findOne({_id: decrypted }).then((result) => {
    if (result.role == 1) {
      cat_lost.insert({
        status:1,
        post_type: req.body.flexRadioDefault,
        pet_name: req.body.pet_name,
        post_title : req.body.post_title,
        pet_gene: req.body.pet_gene,
        pet_gender: req.body.pet_gender,
        pet_color: req.body.pet_color,
        pet_vaccin: req.body.pet_vaccin,
        pet_vaccin_date: req.body.pet_vaccin_date,
        pet_symptom: req.body.pet_symptom,
        pet_image: filename_random.split('/public')[1],
        place_date_time: req.body.place_date_time,
        place_landmarks: req.body.place_landmarks,
        place_name: req.body.place_name,
        place: req.body.place,
        contact_name: req.body.contact_name,
        contact_surname: req.body.contact_surname,
        contact_tel: req.body.contact_tel,
        contact_email: req.body.contact_email,
        contact_line: req.body.contact_line,
        contact_facebook: req.body.contact_facebook,
        createat : createat,
        userid:decrypted
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
  
        }
      });
    }else{
      cat_lost.insert({
        status:0,
        post_type: req.body.flexRadioDefault,
        pet_name: req.body.pet_name,
        post_title : req.body.post_title,
        pet_gene: req.body.pet_gene,
        pet_gender: req.body.pet_gender,
        pet_color: req.body.pet_color,
        pet_vaccin: req.body.pet_vaccin,
        pet_vaccin_date: req.body.pet_vaccin_date,
        pet_symptom: req.body.pet_symptom,
        pet_image: filename_random.split('/public')[1],
        place_date_time: req.body.place_date_time,
        place_landmarks: req.body.place_landmarks,
        place_name: req.body.place_name,
        place: req.body.place,
        contact_name: req.body.contact_name,
        contact_surname: req.body.contact_surname,
        contact_tel: req.body.contact_tel,
        contact_email: req.body.contact_email,
        contact_line: req.body.contact_line,
        contact_facebook: req.body.contact_facebook,
        createat : createat,
        userid:decrypted
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
  
        }
      });
    }
   
    })
  
};

exports.profile = (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('profile', { title: 'โปรไฟล์' ,profile:result,role:result.role});
    //  console.log(result)
    })
  }
   
}

exports.editprofile = (req,res)=>{
  if( req.cookies.AUTH != undefined){
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('editprofile', { title: 'แก้ไขโปรไฟล์' ,profile:result,role:result.role});
    //  console.log(result)
    })
  }
}

exports.editprofileinfo = (req, res) => {
  if( req.cookies.AUTH != undefined){
      users.findOne({email:req.body.email}).then((result) => {
        if(result == null){
          var objedit = {}

          if(req.files){
          const file = req.files.image

          var filename_random = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
            if (fs.existsSync(filename_random )) {
               filename_random  = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
              file.mv(filename_random)
            }else{
              file.mv(filename_random)
            }
            objedit.image_url  = filename_random.split('/public')[1]
          }
          const cookie = req.cookies.AUTH
          const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
          const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
      
          objedit.firstname = req.body.firstname
          objedit.lastname = req.body.lastname
         users.findOneAndUpdate({_id: decrypted}, { $set:  objedit }).then((result) => {
           
            if(result != null){
                res.setHeader('Cache-Control', 'no-store'); 
               res.redirect("/profile")
        
            }else{
                res.status(400).json({text:"สมัครสมาชิกไม่สำเร็จ"})
            }
          })
    
        }else{
    
       req.flash('register', "มีผู้ใช้อีเมลนี้แล้ว กรุณาใช้อีเมลอื่น");
        res.status(304).redirect("/register" )
        
      
        }
      })
    
  }else{
    res.redirect("/")
  }

}

exports.banner = (req, res) => {
    res.render('banner', {
        title: 'แบนเนอร์'
    });
}

exports.search = (req, res) => {
  if( req.cookies.AUTH != undefined){
    let input = req.query.search
    const cookie = req.cookies.AUTH
    const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
    const decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
    users.findOne({_id: decrypted }).then((result) => {
      cat_findhouse.find({pet_name:input,status:1}).then((docs) => {
        cat_lost.find({pet_name:input,status:1}).then((doc) => {
      res.setHeader('Cache-Control', 'no-store');  
      res.render('search', { title: 'ค้นหา',role:result.role,callitem1: docs ,callitem2: doc  });
        })
      })
    })
  }
}





//yun

exports.delete = (req, res) => {
  cat_findhouse.remove({_id:req.params.id});
  cat_lost.remove({_id:req.params.id});
  res.redirect('/');
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
  var filename_random = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
  if (fs.existsSync(filename_random )) {
     filename_random  = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
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
    pet_image: filename_random.split('/public')[1],
    place: req.body.place,
    contact_name: req.body.contact_name,
    contact_surname: req.body.contact_surname,
    contact_tel: req.body.contact_tel,
    contact_email: req.body.contact_email,
    contact_line: req.body.contact_line,
    contact_facebook: req.body.contact_facebook
  };
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
      res.send(
        ' <script>alert("อัพเดตข้อมูลสำเร็จ!!!"); window.location = "/"; </script>'
      );
    });
};
exports.edit_cat_lost = (req, res) => {
  const edit_id1 = req.body.edit_id;
  cat_lost.findOne({ _id: edit_id1 }).then((doc) => {
    res.render("edit_cat_lost", {title:"แก้ไขรายละเอียด", doc: doc });
  });
};

exports.update_cat_lost = (req, res) => {
  const file = req.files.pet_image;
  var filename_random = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
  if (fs.existsSync(filename_random )) {
     filename_random  = __dirname.split('\controllers')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
    file.mv(filename_random)
  }else{
    file.mv(filename_random)
  }
  const update_id = req.body.edit_id;
  let data = {
    pet_name: req.body.pet_name,
    post_title : req.body.post_title,
    pet_gene: req.body.pet_gene,
    pet_gender: req.body.pet_gender,
    pet_color: req.body.pet_color,
    pet_vaccin: req.body.pet_vaccin,
    pet_vaccin_date: req.body.pet_vaccin_date,
    pet_symptom: req.body.pet_symptom,
    pet_image: filename_random.split('/public')[1],
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
    post_title : data.post_title,
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
  res.send(
    '<script>alert("อัพเดตข้อมูลสำเร็จ!!!"); window.location = "/"; </script>'
  );
});
}




exports.accept_post = (req,res)=>{
  cat_findhouse.findOneAndUpdate({_id:req.params.id}, {$set:{ status:1}}).then((docs) => {
    cat_lost.findOneAndUpdate({_id:req.params.id}, {$set:{ status:1}}).then((doc) => {
      res.redirect('/checkpost');
    })
  })
}

exports.decline_post = (req,res)=>{
  cat_findhouse.findOneAndUpdate({_id:req.params.id}, {$set:{ status:2}}).then((docs) => {
    cat_lost.findOneAndUpdate({_id:req.params.id}, {$set:{ status:2}}).then((doc) => {
      res.redirect('/checkpost');
    })
  })
}
