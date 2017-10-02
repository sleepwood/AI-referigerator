var file = require('fs');

function deleteItem(item){
  var data = file.readFileSync('../../cargo.json', 'utf-8');//读取数据
  var modify = false;
  if(item.name == ""){
    return "名称未定义！";
  }

  data = JSON.parse(data);

  for(var i=0;i<data.items.length;i++){
    for(var j=0;j<data.items[i].length;j++){
      if(item.name == data.items[i][j].name){
          data.items[i].splice(j,1);
          modify = true;
          break;
        }
      }
    }

  if(modify){
    data = JSON.stringify(data);
    file.writeFileSync('../../cargo.json',data,'utf8');
    return "修改成功！已经保存！";
  }
  else{
    return "未找到内容，需要新建参数！";
  }
}

function deleteCate(item){
  var data = file.readFileSync('../../cargo.json', 'utf-8');//读取数据
  if(item.tag == ""){
    return "有参数未定义！";
  }

  data = JSON.parse(data);

  if(item.tag <= data.category.length){
    data.category.splice(item.tag,1);
    data.items.splice(item.tag,1);

    data = JSON.stringify(data);
    file.writeFileSync('../../cargo.json',data,'utf8');
    return "删除类别成功！";
  }
  else{
    return "未找到要修改的类别！";
  }
}

module.exports = {
  deleteItem:deleteItem,
  deleteCate:deleteCate
};
