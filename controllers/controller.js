
const { Timestamp } = require('mongodb');
const monk = require('monk')
const url = 'mongodb://localhost:27017/nodejs_xml';
const db = monk(url);

db.then(() => {
  console.log('Connected correctly to server')
})

const users = db.get('users')
const cat_findhouse = db.get('cat_findhouse')


exports.index = (req,res)=>{
    users.find({}).then((docs) => {
        res.render('index', { title: 'Express',docs });
      })
}

exports.login = (req,res)=>{
    res.render('login', { title: 'Expresss' });
}

exports.cat_findhouse = (req,res)=>{
    cat_findhouse.find({status:1}).then((docs) => {
      return  res.render('cat_findhouse', { cats:docs });
    })
}

exports.findhouse_detail = (req,res)=>{
  cat_findhouse.findOne({'_id':req.params.id}).then((doc)=>{
    res.render('findhouse_detail', {cat:doc});
  })
}

exports.admin_check = (req,res)=>{
  cat_findhouse.find({deleted_at:Timestamp({ t: 0, i: 0 })}).then((docs) => {
    res.render('admin_check', { cats:docs });
  })
}

exports.accept_post = (req,res)=>{
  cat_findhouse.findOneAndUpdate({_id:req.params.id}, {$set:{ status:1} }).then((docs) => {
    res.redirect('/admin_check');
  })
}

exports.decline_post = (req,res)=>{
  cat_findhouse.findOneAndUpdate({_id:req.params.id}, {$set:{ status:2} }).then((docs) => {
    res.redirect('/admin_check');
  })
}

exports.search = (req,res) => {
  let payload = req.body.payload.trim();
  var query = new RegExp('^' + payload + '.*', 'i');
  cat_findhouse.find({name:query,status:1}).then((search) =>{
    res.send({cats:search});
  })
 
}

exports.mypost = (req,res) => {
  let userid = "63189269503f74057607d2e8"
  cat_findhouse.find({user_id:userid}).then((doc)=>{
    res.render('user_mypost', {cat:doc});
  })
}