var file = require('fs');
var create = require('./create');

function modifyItem(item){
  var data = file.readFileSync('../../cargo.json', 'utf-8');//读取数据
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
          data.items[i][j].quantity = item.quantity;
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
  file.writeFileSync('../../cargo.json',data,'utf8');

  if(modify){
    return "修改成功！已经保存！";
  }
  else{
    return "未找到内容，需要新建参数！";
  }
}

module.exports = {
  modifyItem:modifyItem
};
