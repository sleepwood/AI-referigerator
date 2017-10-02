var express = require('express');
var modify = require('./modify');
var fs = require('fs');
var cors = require('cors');
var app = express();

app.use(cors());

app.get('/init',function(req,res){
  fs.readFile('../../cargo.json', 'utf-8',function(err,data){
    res.end(data);
  });
})
app.get('/modify',function(req,res){
  var callback = modify.modifyItem(req.query);
  res.end(callback);
})

app.listen(3000,function(){
  console.log('app is running at port 3000!');
})
