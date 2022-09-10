
const monk = require('monk')
const url = 'localhost:27017/nodejs_xml';
const db = monk(url);



db.then(() => {
  console.log('Connected correctly to server')
})

const users = db.get('users')


exports.index = (req,res)=>{
    users.find({}).then((docs) => {
      res.render('index', { title: 'Express',docs });
      })

}

exports.login = (req,res)=>{
    res.render('login', { title: 'Expresss' });
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