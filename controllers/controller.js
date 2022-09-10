
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
const cat_findhouse= db.get('cat_findhouse')
const cat_lost = db.get('cat_lost');




// console.log( __dirname.split('\controllers')[0]+"public/images/")
// หน้าหลัก
// res.setHeader('Cache-Control', 'no-store');  ไม่ให้เก็บ Back/forward cache ปุ่มไปกลับบน browser
exports.index = (req,res)=>{

  cat_findhouse.find({}).then((result) => {
    res.setHeader('Cache-Control', 'no-store');  
    res.render('index', { title: 'Express' ,result});
  })
  
 
}
// ระบบ login
exports.login = (req,res)=>{

  console.log(req.body.email)
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
// หน้า login
exports.login_get =async (req,res)=>{
  if( req.cookies.AUTH == undefined){
  const login = await req.consumeFlash('login');
  res.setHeader('Cache-Control', 'no-store');  
    res.render('login',{login});

  }
}
// ออกจากระบบ
exports.logout = (req,res)=>{

  res.clearCookie('AUTH');
  res.redirect("/login")
}
// ระบบเช็คว่า login หรือยัง
exports.auth = (req,res,next)=>{

  if( req.cookies.AUTH != undefined){
    console.log("เข้า if 1")
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
          console.log("เข้า else 1")
          res.clearCookie('AUTH');
          res.redirect('/login')

        
        }
}

// ระบบเช็คว่าถ้า login แล้ว จะไม่สามารถไปหน้า login กับ register ได้
exports.auth_logout =  (req,res,next)=>{

 if( req.cookies.AUTH == undefined){
    console.log("เข้า if")
  return  next()
  }
    console.log("เข้า else if")
    res.redirect('/')
  
}
// หน้าregister
exports.register_get = async(req,res)=>{
  const register = await req.consumeFlash('register');
  res.setHeader('Cache-Control', 'no-store');  
res.render('register' , { register});
}
// ระบบ register
exports.register =async (req,res,next)=>{

  if(validator.validate(req.body.email) && req.body.password.length >= 8){


  users.findOne({email:req.body.email}).then((result) => {
  
    if(result == null){

 
     const encrypted_password = CryptoJS.MD5(req.body.password.toString()).toString()

      users.insert({email:req.body.email,password:encrypted_password }).then((result) => {
       
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




exports.findhome_post = (req,res)=>{
    res.render('findhome_post', { title: 'หาบ้านให้น้องเหมียว' });
}

exports.report_post = (req,res)=>{
    res.render('report_post', { title: 'แจ้งพบ/หาย' });
}

exports.profile = (req,res)=>{
    res.render('profile', { title: 'โปรไฟล์' });
}

exports.editprofile = (req,res)=>{
    res.render('editprofile', { title: 'แก้ไขโปรไฟล์' });
}

exports.addcat_findhouse = (req, res, next) => {
  if (req.files) {
    console.log(req.files.pet_image)
  }
  const file = req.files.pet_image
  const image_path =  __dirname.split('\controllers')[0]+"public/images/aa.jpg"
  file.mv(image_path)
    // fs.writeFile(image_path , oldpath , function (err) {
    //   if (err){
    //     console.log(err)
    //     res.status(400).send(err)
    //   }else{
    //     res.status(200).send("success")
    //   }
    
    // })
 
  // cat_findhouse.insert({
  //   findhome_type:req.body.flexRadioDefault,
  //   pet_name:req.body.pet_name,
  //   pet_gene:req.body.pet_gene,
  //   pet_gender:req.body.pet_gender,
  //   pet_color:req.body.pet_color,
  //   pet_vaccin:req.body.pet_vaccin,
  //   pet_vaccin_date:req.body.pet_vaccin_date,
  //   pet_symptom:req.body.pet_symptom,
  //   pet_image:req.body.pet_image,
  //   place:req.body.place,
  //   contact_name:req.body.contact_name,
  //   contact_surname:req.body.contact_surname,
  //   contact_tel:req.body.contact_tel,
  //   contact_email:req.body.contact_email,
  //   contact_line:req.body.contact_line,
  //   contact_facebook:req.body.contact_facebook
  // },function(err,result){
  //   if(err){
  //     console.log(err);
  //     res.send(' <script>alert("บันทึกข้อมูลไม่สำเร็จ!!!"); window.location = "/"; </script>');
  //   }else{
  //     res.send(' <script>alert("บันทึกข้อมูลสำเร็จ!!!"); window.location = "/"; </script>');
  //     // res.location('/');
  //     // res.redirect('/');
  //   }
  // });
};