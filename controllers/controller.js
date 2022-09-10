
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
    cat_findhouse.find({status:true}).then((docs) => {
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
  cat_findhouse.findOneAndUpdate({_id:req.params.id}, {$set:{ status:true} }).then((docs) => {
    res.redirect('/admin_check');
  })
}

exports.decline_post = (req,res)=>{
  cat_findhouse.findOneAndUpdate({_id:req.params.id}, {$set:{ deleted_at:Date.now()} }).then((docs) => {
    res.redirect('/admin_check');
  })
}