var express = require('express');
var cors = require('cors');
var modify = require('./modify');
var create = require('./create');
var init = require('./init');
var option = require('./option');
var cut = require('./delete');
var lang = require('./lang');

var fs = require('fs');
var built = JSON.parse(fs.readFileSync("../built.json"));
var app = express();

app.use(cors());

app.get('/init',function(req,res){
  var callback = init.initCargo();
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
  res.end(callback);
})
app.get('/initApp',function(req,res){
  var callback = init.initApp();
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
  res.end(callback);
})
app.get('/lang',function(req,res){
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
  var callback = lang.initLang()
  res.end(callback);
})
app.get('/item/modify',function(req,res){
  var callback = modify.modifyItem(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/item/number',function(req,res){
  var callback = modify.modifyNum(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/item/create',function(req,res){
  var callback = create.createItem(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/item/delete',function(req,res){
  console.log(req.query);
  var callback = cut.deleteItem(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/category/create',function(req,res){
  console.log(req.query);
  var callback = create.createCate(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/category/modify',function(req,res){
  console.log(req.query);
  var callback = modify.modifyCate(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/category/delete',function(req,res){
  console.log(req.query);
  var callback = cut.deleteCate(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/option/warn',function(req,res){
  var callback = option.warn(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.get('/option/general',function(req,res){
  var callback = option.general(req.query);
  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
  res.end(callback);
})
app.listen(built.port,function(){
  console.log('app is running at port '+ built.port);
})
