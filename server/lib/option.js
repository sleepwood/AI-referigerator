var file = require('fs');
var built = JSON.parse(file.readFileSync("../built.json"));

function warn(item){
  var data = file.readFileSync(built.option, 'utf-8');//读取数据
  data = JSON.parse(data);
  data.warns = item;
  for(var i=0;i<data.warns.brandary.length;i++){
      data.warns.brandary[i] = parseInt(data.warns.brandary[i]);
  }
  data = JSON.stringify(data);
  file.writeFileSync(built.option,data,'utf8');
  return data;
}

function general(item){
  var data = file.readFileSync(built.option, 'utf-8');//读取数据
  data = JSON.parse(data);
  data.general = item;

  data = JSON.stringify(data);
  file.writeFileSync(built.option,data,'utf8');
  return data;
}

module.exports = {
  warn:warn,
  general:general
}
