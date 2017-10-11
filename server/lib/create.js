var file = require('fs');

function createItem(item,data){
    if(!data){
      var data = file.readFileSync('../../cargo.json', 'utf-8');//读取数据
      data = JSON.parse(data);
    }

    var create = new Object();
    create.name = item.name;
    create.quantity = parseInt(item.quantity);

    for(var i =0;i<data.category.length;i++){
      if(item.category == data.category[i].text){
        data.items[i].push(create);

        data = JSON.stringify(data);
        file.writeFileSync('../../cargo.json',data,'utf8');
        return "创建成功！";
      }
    }
    if(i == data.category.length){
      return "未找到类别，请先创建类别！";
    }
}

function createCate(item){
  var data = file.readFileSync('../../cargo.json', 'utf-8');//读取数据
  data = JSON.parse(data);

  var create = new Object();
  create.value = data.category.length;
  create.text = item.name;

  data.category.push(create);
  data.items.push(new Array());

  data = JSON.stringify(data);
  file.writeFileSync('../../cargo.json',data,'utf8');
  return "创建成功！";
}

module.exports = {
  createItem:createItem,
  createCate:createCate
};
