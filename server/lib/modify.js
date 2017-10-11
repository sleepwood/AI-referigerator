var file = require('fs');
var built = JSON.parse(file.readFileSync("../built.json"));
var create = require('./create');

function modifyItem(item){
  var data = file.readFileSync(built.cargo, 'utf-8');//读取数据
  var modify = false;
  if(item.category == "" || item.name == "" || item.quantity == ""){
    return "有参数未定义！";
  }

  data = JSON.parse(data);

  for(var i=0;i<data.items.length;i++){
    for(var j=0;j<data.items[i].length;j++){
      if(item.name == data.items[i][j].name){
        if(item.category == data.category[i].text){
          data.items[i][j].name = item.name;
          data.items[i][j].quantity = parseInt(item.quantity);
        }
        else{
          data.items[i].splice(j,1);
          create.createItem(item,data);
          return "修改类别成功！已经保存！";
        }
        modify = true;
      }
    }
  }

  data = JSON.stringify(data);
  file.writeFileSync(built.cargo,data,'utf8');

  if(modify){
    return "修改成功！已经保存！";
  }
  else{
    return "未找到内容，需要新建参数！";
  }
}

function modifyNum(item){
  var data = file.readFileSync(built.cargo, 'utf-8');//读取数据
  var modify = false;
  if(item.name == ""){
    return "名称未定义！";
  }

  data = JSON.parse(data);

  for(var i=0;i<data.items.length;i++){
    for(var j=0;j<data.items[i].length;j++){
      if(item.name == data.items[i][j].name){
          data.items[i][j].quantity --;
          if(data.items[i][j].quantity == 0){
            data.items[i].splice(j,1);
          }
          modify = true;
          break;
        }
      }
    }

  if(modify){
    data = JSON.stringify(data);
    file.writeFileSync(built.cargo,data,'utf8');
    return data;
  }
  else{
    return "未找到内容，需要新建参数！";
  }
}

function modifyCate(item){
  var data = file.readFileSync(built.cargo, 'utf-8');//读取数据
  if(item.name == "" || item.tag == ""){
    return "有参数未定义！";
  }

  data = JSON.parse(data);

  if(item.tag <= data.category.length){
    data.category[item.tag].text = item.name;

    data = JSON.stringify(data);
    file.writeFileSync(built.cargo,data,'utf8');
    return "修改类别成功！";
  }
  else{
    return "未找到要修改的类别！";
  }
}

module.exports = {
  modifyItem:modifyItem,
  modifyNum:modifyNum,
  modifyCate:modifyCate
};
