
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
    cat_findhouse.find({}).then((docs) => {
    res.render('cat_findhouse', { cats:docs });
    })
}

exports.findhouse_detail = (req,res)=>{
  const cat_id = req.params.id
  cat_findhouse.findOne({_id:cat_id}).then((doc)=>{
    res.render('findhouse_detail', {cat:doc});
  })
}