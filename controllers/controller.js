
const monk = require('monk')
const url = 'localhost:27017/nodejs_xml';
const db = monk(url);
db.then(() => {
  console.log('Connected correctly to server')
})
const users = db.get('users')
exports.users = users
const CryptoJS = require("crypto-js");



exports.index = (req,res)=>{

    
    res.render('index', { title: 'Express' });
}

exports.login = (req,res)=>{

    
    users.findOne({email:req.body.email,password:req.body.password}).then((result) => {
  
        if(result != null){
            let encrypted = CryptoJS.AES.encrypt(result._id.toString(), "nodejs_xml").toString()
            var encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);

          
            res.cookie('AUTH',encoded, {  httpOnly: true })
            res.redirect("/")
    
        }else{
            // res.status(400).json({status:false,text:"ใส่ข้อมูลให้ครบ"}) 
            req.flash('login', "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            res.redirect("/login")
        }
      })
    // res.status(400).json({status:false,text:"ใส่ข้อมูลให้ครบ"})
    // res.render('login', { title: 'Expresss' });
}

exports.login_get =async (req,res)=>{
  const login = await req.consumeFlash('login');
    res.render('login',{login});
}
exports.logout = (req,res)=>{

  res.clearCookie('AUTH');
  res.redirect("/login")
}
exports.auth = (req,res,next)=>{

  if( req.cookies.AUTH != undefined){

      
            const cookie = req.cookies.AUTH
            const decoded = CryptoJS.enc.Hex.parse(cookie).toString(CryptoJS.enc.Base64);
            var decrypted = CryptoJS.AES.decrypt(decoded, "nodejs_xml").toString(CryptoJS.enc.Utf8); 
       
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
          res.redirect('/login')
        
        
        }
}

exports.auth_logout = (req,res,next)=>{
  // console.log(req)
  if( req.cookies.AUTH == undefined){
 
    next()
  }else{
    res.redirect('back')
  }
}
exports.register_get = async(req,res)=>{
  const register = await req.consumeFlash('register');
res.render('register' , { register});
}
exports.register =async (req,res,next)=>{

  
  users.findOne({email:req.body.email}).then((result) => {
  
    if(result == null){
      users.insert({email:req.body.email,password:req.body.password}).then((result) => {
       
        if(result != null){
            let encrypted = CryptoJS.AES.encrypt(result._id.toString(), "nodejs_xml").toString()
            var encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);
    
          
            res.cookie('AUTH',encoded, {  httpOnly: true })
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



}