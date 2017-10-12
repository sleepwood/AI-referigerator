var fs = require('fs');
var built = JSON.parse(fs.readFileSync("../built.json"));

function initCargo(){
  var data = fs.readFileSync(built.cargo, 'utf-8');//读取数据

  data = JSON.parse(data);

  var cate = 0;
  while(cate<data.category.length){
    for(var i = 0;i<data.items[cate].length;i++){
      for(var j= i;j<data.items[cate].length;j++){
        if(data.items[cate][i].quantity > data.items[cate][j].quantity){
          var temp = data.items[cate][i];
          data.items[cate][i] = data.items[cate][j];
          data.items[cate][j] = temp;
        }
      }
    }
    cate ++;
  }

  data = JSON.stringify(data);
  fs.writeFileSync(built.cargo,data,'utf8');
  return data;
}

function initApp(){
  var option = fs.readFileSync(built.option, 'utf-8');//读取数据
  option = JSON.parse(option);
  var cargo = initCargo();
  cargo = JSON.parse(cargo);

  var data = new Object();
  data.cargo = cargo;
  data.option = option;

  data = JSON.stringify(data);
  return data;
}

module.exports = {
  initCargo:initCargo,
  initApp:initApp,
}
