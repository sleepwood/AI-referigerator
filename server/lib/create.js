var file = require('fs');
var built = JSON.parse(file.readFileSync("../built.json"));

function createItem(item,data){
    if(!data){
      var data = file.readFileSync(built.cargo, 'utf-8');//读取数据
      data = JSON.parse(data);
    }

    var create = new Object();
    create.name = item.name;
    create.quantity = parseInt(item.quantity);

    for(var i =0;i<data.category.length;i++){
      if(item.category == data.category[i].text){
        data.items[i].push(create);

        data = JSON.stringify(data);
        file.writeFileSync(built.cargo,data,'utf8');
        return "创建成功！";
      }
    }
    if(i == data.category.length){
      return "未找到类别，请先创建类别！";
    }
}

function createCate(item){
  var data = file.readFileSync(built.cargo, 'utf-8');//读取数据
  data = JSON.parse(data);

  var create = new Object();
  create.value = data.category.length;
  create.text = item.name;

  data.category.push(create);
  data.items.push(new Array());

  data = JSON.stringify(data);
  file.writeFileSync(built.cargo,data,'utf8');
  return "创建成功！";
}

module.exports = {
  createItem:createItem,
  createCate:createCate
};
