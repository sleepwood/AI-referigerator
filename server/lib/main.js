var express = require('express');
var modify = require('./modify');
var create = require('./create');
var cut = require('./delete');
var fs = require('fs');
var cors = require('cors');
var app = express();

app.use(cors());

app.get('/init',function(req,res){
  fs.readFile('../../cargo.json', 'utf-8',function(err,data){
    res.end(data);
  });
})
app.get('/item/modify',function(req,res){
  var callback = modify.modifyItem(req.query);
  res.end(callback);
})
app.get('/item/number',function(req,res){
  var callback = modify.modifyNum(req.query);
  res.end(callback);
})
app.get('/item/create',function(req,res){
  var callback = create.createItem(req.query);
  res.end(callback);
})
app.get('/item/delete',function(req,res){
  console.log(req.query);
  var callback = cut.deleteItem(req.query);
  res.end(callback);
})
app.get('/category/create',function(req,res){
  console.log(req.query);
  var callback = create.createCate(req.query);
  res.end(callback);
})
app.get('/category/modify',function(req,res){
  console.log(req.query);
  var callback = modify.modifyCate(req.query);
  res.end(callback);
})
app.get('/category/delete',function(req,res){
  console.log(req.query);
  var callback = cut.deleteCate(req.query);
  res.end(callback);
})

app.listen(3000,function(){
  console.log('app is running at port 3000!');
})
