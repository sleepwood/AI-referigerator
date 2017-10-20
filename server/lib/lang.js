var file = require('fs');
var Q = require('q');

var initLang = function(){
  var temp = [];
  var lang = new Object();

  var dir = file.readdirSync("../lang/")
  for(var i = 0;i<dir.length;i++){
    var data = file.readFileSync("../lang/"+dir[i], 'utf-8');//读取数据
    data = JSON.parse(data);
    lang[dir[i].slice(0,2)] = data;
  }
  lang = JSON.stringify(lang);
  console.log(lang);
  return lang;
}

var pReadFile = function () {
    var defer = Q.defer();
    setTimeout(function(){
      defer.resolve("test!");
    }, 2000);
    return defer.promise;
};

module.exports = {
  initLang:initLang,
  pReadFile:pReadFile,
}
