
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

exports.cat_info = (req,res)=>{
  res.render('cat_info', { title: 'Expresss' });
}

exports.footer = (req,res)=>{
  res.render('footer', { title: 'Expresss' });
}

exports.checkpost = (req,res)=>{
  res.render('admincheckpost', { title: 'Expresss' });
}