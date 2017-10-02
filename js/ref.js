		var data = 0;
		var category = [];
		var userPicker = new mui.PopPicker();
		var showUserPickerButton = null;
		(function($, doc){
			$.ready(function(){
				//设置菜单和内容滚动
				$('#offCanvasSideScroll').scroll();
				$('#items').scroll();

				$.ajax({
				 	type:"get",
				 	url:"http://127.0.0.1:3000/init",
				 	async:true,
				 	dataType:"json",
				 	success:function(res){
				 		console.log(res);
				 		data = res;
				 		console.log(data)
				 		}
				});

				 $.later(function(){
				 	//数据调用以初始化选择器
					category = data.category;
					//初始化结束给选择器赋值
					userPicker.setData(category);
					showUserPickerButton = doc.getElementById('showUserPicker');
					showUserPickerButton.innerHTML = category[0].text;
					showUserPickerButton.addEventListener('tap', function(event) {
						userPicker.show(function(items) {
							console.log(items);
							showUserPickerButton.innerHTML = items[0].text;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);
					//初始化列表
					for(var i = 0;i<category.length;i++){
						var div = document.createElement('div');//添加一个新的div标签
						div.className = "item";
						div.innerHTML = "<div class='title'>"+category[i].text+"</div>";//div里的内容
						var items = document.getElementsByClassName('mui-scroll');
						var ul = document.createElement('ul');
						ul.className = "mui-table-view";
						div.appendChild(ul);
						items[1].appendChild(div);
					}
					//初始化列表项
					for(var i = 0;i<category.length;i++){
						var cate = document.getElementsByClassName('item');
						for(var j = 0;j<data.items[i].length;j++){
							var li = document.createElement('li'); //在列表下新建一个项目
							li.className = 'mui-table-view-cell';
							li.innerHTML = "<div class='mui-slider-handle'>" + data.items[i][j].name + "</div><div class='mui-slider-left mui-disabled'>" +
							"<a class='mui-btn mui-btn-red item-delete'>删除</a><a class='mui-btn mui-btn-blue item-modify'>修改</a>" +
							"</div><span class='mui-badge mui-badge-primary item-num'>" + data.items[i][j].quantity + "</span>";
							cate[i].lastElementChild.appendChild(li);
						}
					}

					//初始化类别操作列表
					for(var i = 0;i<category.length;i++){
						var manage = document.getElementById('catelist');
						var li = document.createElement('li'); //在列表下新建一个项目
						li.className = 'mui-table-view-cell';
						li.innerHTML = '<div class="mui-slider-handle" value="'+data.category[i].value+'">' + data.category[i].text + '</div><div class="mui-slider-left mui-disabled">' +
							'<a class="mui-btn mui-btn-red cate-delete">删除</a><a href="#modify" class="mui-btn mui-btn-blue cate-modify">修改</a>' +
							'</div>';
						manage.appendChild(li);
					}
				 },100);
			});
			$.init();

			//阻止手势侧滑
			var offCanvasWrapper = mui('.mui-off-canvas-wrap');
			var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
				offCanvasInner.addEventListener('drag', function(event) {
    				event.stopPropagation();
			});
		})(mui,document);

		(function($) {
			//导航栏按钮控制侧滑菜单
			$('body').on('tap','.mui-icon-bars',function(event){
				if($('.mui-off-canvas-wrap').offCanvas().isShown()){
					$('.mui-off-canvas-wrap').offCanvas('close');
				}
				else{
					$('.mui-off-canvas-wrap').offCanvas('show');
				}
			});

			//导航栏开启关于菜单
			$('#menu').on('tap','.menu-about',function(event){
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable mui-page';
				var about = document.getElementById('about');
				about.className = 'mui-about';

				mui('.mui-off-canvas-wrap').offCanvas().close();
			});

			//导航栏关闭关于菜单
			$('#about').on('tap','.about-btn',function(event){
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable';
				var about = document.getElementById('about');
				about.className = 'mui-page';
			});

			//添加新的项目
			$('#menu').on('tap', '.create-item', function(event) {
				/* 开启修改页面 */
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable mui-page';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-pages';
				modifys.firstElementChild.lastElementChild.innerHTML = "添加项目";
				showUserPickerButton.innerHTML = data.category[0].text;

				mui('.mui-off-canvas-wrap').offCanvas().close();
			});

			var selectCate = null; //当前项目的类别
			//修改已有项目信息
			$('.lists').on('tap', '.item-modify', function(event) {
				var elem = this;
				selectItem = elem.parentNode.parentNode;
				/* 开启修改页面 */
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable mui-page';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-pages';
				setTimeout(function() {
					$.swipeoutClose(selectItem);
				}, 0);

				var name = document.getElementById('modify-name');
				name.value = selectItem.firstElementChild.innerHTML.trim();
				var num = document.getElementById('modify-num');
				num.value = selectItem.lastElementChild.innerHTML.trim();
				selectCate = selectItem.parentNode.parentNode.firstElementChild.innerHTML;
				showUserPickerButton.innerHTML = selectCate;
			});

			//项目编辑页面——提交操作
			$('#modify').on('tap', '.modify-load', function(event) {
				var name = document.getElementById('modify-name');
				var num = document.getElementById('modify-num');
				var cate = document.getElementById('showUserPicker');
				//从编辑界面进入则进入编辑页面
				if(selectItem) {
					if(name.value.trim() != ""){
						//调用数据库进行修改
						selectItem.firstElementChild.innerHTML = name.value.trim();
						selectItem.lastElementChild.innerHTML = num.value.trim();
					}
					else{
						mui.toast("请输入有效数据！",{
							duration: 'short',
							type: 'div'
						});
					}
					if(cate.innerHTML != selectCate){//调整物品的类别
						var low = 0;
						for(var i =0;i<category.length;i++){//提取选择类别的索引
							if(category[i].text == cate.innerHTML){
								low  = i;
							}
						}

						var items = mui('.item');
						var item = items[low];

						var li = document.createElement('li'); //在列表下新建一个项目
						li.className = 'mui-table-view-cell';
						li.innerHTML = '<div class="mui-slider-handle">' + name.value.trim() + '</div><div class="mui-slider-left mui-disabled">;' +
							'<a class="mui-btn mui-btn-red item-delete">删除</a><a href="#modify" class="mui-btn mui-btn-blue item-modify">修改</a>' +
							'</div><span class="mui-badge mui-badge-primary">' + num.value.trim() + '</span>';
						item.lastElementChild.appendChild(li);

					}
					//导入数据文件
					var j =0;
					for(;j<selectItem.parentNode.childNodes.length;j++)
					{
						if(selectItem.firstElementChild.innerHTML == selectItem.parentNode.childNodes[j].firstElementChild.innerHTML)
						{
							break;
						}
					}

					var i =0;
					for(;i<category.length;i++){
						if(category[i].text == selectCate){
							break;
						}
					}
					if(low){//物品类别被调整 会声明low
						selectItem.parentNode.removeChild(selectItem);//先从原来的列表中删除
						data.items[i].splice(j,1);
						var temp = {name:name.value.trim(),quantity:num.value.trim()};
						data.items[low].push(temp);
						console.log(data.items[low]);
					}
					else{
						data.items[i][j].name = name.value.trim();
						data.items[i][j].quantity = num.value.trim();

						console.log(data.items[i]);
					}
					mui.ajax({
						type:"get",
						url:"http://127.0.0.1:3000/modify",
						data:{
							"category":cate.innerHTML,
							"name": name.value.trim(),
							"quantity": num.value.trim()
						},
						async:true,
						dataType:"json",
						success:function(res){
							console.log(res);
							}
						})
				}
				//没有从编辑页面进入则进行添加操作
				else {
					var low = 0;
					for(var i =0;i<category.length;i++){//提取选择类别的索引
						if(category[i].text == cate.innerHTML){
							low  = i;
						}
					}

					var items = mui('.item');
					var item = items[low];
					var li = document.createElement('li'); //在列表下新建一个项目
					li.className = 'mui-table-view-cell';
					li.innerHTML = '<div class="mui-slider-handle">' + name.value.trim() + '</div><div class="mui-slider-left mui-disabled">;' +
						'<a class="mui-btn mui-btn-red item-delete">删除</a><a href="#modify" class="mui-btn mui-btn-blue item-modify">修改</a>' +
						'</div><span class="mui-badge mui-badge-primary">' + num.value.trim() + '</span>';
					item.lastElementChild.appendChild(li);
					var temp = {name:name.value.trim(),quantity:num.value.trim()};
					data.items[low].push(temp);
					console.log(data.items[low]);
				}
				/* 初始化参数 */
				selectItem = null;
				name.value = "";
				num.value = 1;
				/* 关闭修改界面 */
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-page';
			});

			//项目编辑页面——取消操作
			$('#modify').on('tap', '.modify-cancel', function(event) {
				/* 关闭修改界面 */
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-page';
			});

			//删除已有项目信息；
			$('.lists').on('tap', '.item-delete', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				var item = null;
				var cate = null;
				var items = document.getElementsByClassName('item');
				for(var i = 0;i<li.parentNode.childNodes.length;i++){
					if(elem.parentNode.firstElementChild.innerHTML == li.parentNode.childNodes[i].firstElementChild.innerHTML){
						item = i;
					}
				}
				for(var j = 0;j<items.length;j++){
					if(li.parentNode.parentNode.firstElementChild.innerHTML == items[j].firstElementChild.innerHTML){
						cate = j;
					}
				}

				mui.confirm('确认删除该条记录？', 'AI-HOME', btnArray, function(e) {
					if(e.index == 0) {
						li.parentNode.removeChild(li);
						data.items[cate].splice(item,1);
						console.log(data.items);
					}
					else {
						setTimeout(function() {
							$.swipeoutClose(li);
						}, 0);
					}
				});
			});

			//点击减少数量
			$('body').on('tap', '.item-num', function(event) {
				var elem = this;
				var count = elem.innerHTML;
				var item = null;
				var cate = null;
				var items = document.getElementsByClassName('item');

				for(var i = 0;i<elem.parentNode.parentNode.children.length;i++){
					if(elem.parentNode.firstElementChild.innerHTML == elem.parentNode.parentNode.children[i].firstElementChild.innerHTML){
						item = i;
					}
				}
				for(var j = 0;j<items.length;j++){
					if(elem.parentNode.parentNode.parentNode.firstElementChild.innerHTML == items[j].firstElementChild.innerHTML){
						cate = j;
					}
				}
				if(count != 0) {
					elem.innerHTML = --count;

					data.items[cate][item].quantity = count;
				}
				if(count == 0) {
					mui.toast(elem.parentNode.firstElementChild.innerHTML.trim() + ' 已经用光！', {
						duration: 'short',
						type: 'div'
					})
					elem.parentNode.parentNode.removeChild(elem.parentNode);
					data.items[cate].splice(item,1);
				}
			});

			//管理已有类别
			$('#menu').on('tap','.cate-manage',function(){
				var manage = document.getElementById('manage');
				manage.className = 'mui-pages';
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable mui-page';

				$('.mui-off-canvas-wrap').offCanvas().close();
			});

			//添加新的类别
			$('#manage').on('tap','.create-category',function(event){
				mui.prompt('输入新类别的名称','请输入名称','AI-HOME',btnArray,function(e){
					if(e.index == 0){
						if(e.value.trim() != ""){
							var list = document.getElementById('catelist');
							var li = document.createElement('li');
							li.className = 'mui-table-view-cell';
							li.innerHTML = '<div class="mui-slider-handle" value="'+category.length+'">'+e.value.trim()+'</div><div class="mui-slider-left mui-disabled">'
									  	   +'<a class="mui-btn mui-btn-red cate-delete">删除</a><a href="#modify" class="mui-btn mui-btn-blue cate-modify">修改</a>'
									  	   +'</div>';
							list.appendChild(li);
							var temp = {value:category.length,text:e.value};
							category.push(temp);
							userPicker.setData(category);
							//预留上传接口
							console.log(data.category);
						}
						else{
							mui.toast("请输入有效数据！",{
								duration: 'short',
								type: 'div'
							});
						}
					}
				});
			});

			//删除类别及物品
			$('#catelist').on('tap', '.cate-delete', function(event) {
				var elem = this;
				var manage = document.getElementById('catelist');
				console.log(elem.parentNode);
				var index = elem.parentNode.parentNode.firstElementChild.getAttribute("value");
				console.log(index);

				mui.confirm('确认删除该条记录？', 'AI-HOME', btnArray, function(e) {
					if(e.index == 0) {
						manage.removeChild(elem.parentNode.parentNode);
						data.category.splice(index,1);
						data.items.splice(index,1);
						var item = document.getElementsByClassName('item');
						item[index].parentNode.removeChild(item[index]);
					} else {
						setTimeout(function() {
							$.swipeoutClose(elem.parentNode.parentNode);
						}, 0);
					}
				});
			});

			//修改类别名称
			$('#catelist').on('tap','.cate-modify',function(event){
				var elem = this;
				mui.prompt('修改类别名称',elem.parentNode.parentNode.firstElementChild.innerHTML,'AI-HOME',btnArray,function(e){
					if(e.index == 0){
						if(e.value.trim() != ""){
						//修改数据库类别内容
						elem.parentNode.parentNode.firstElementChild.innerHTML = e.value.trim();
						var tag = elem.parentNode.parentNode.parentNode.getElementsByClassName('mui-slider-handle');
						for(var i=0;i<tag.length;i++){
							if(e.value.trim() == tag[i].innerHTML){
								tag = i;
								break;
							}
						}
						data.category[tag].text = e.value.trim();
						console.log(data.category);
					}
					else{
						mui.toast("请输入有效数据！",{
						duration: 'short',
						type: 'div'
					});
					}
					}
					$.swipeoutClose(elem.parentNode.parentNode);
				});
			});

			//管理页面返回
			$('#manage').on('tap', '.cate-cancel', function(event) {
				/* 关闭修改界面 */
				var items = document.getElementById('index');
				items.className = 'mui-off-canvas-wrap mui-draggable';
				var manage = document.getElementById('manage');
				manage.className = 'mui-page';

				refresh();
			});
			var btnArray = ['确认', '取消'];
			var selectItem = null;
		})(mui);

	//修改完分类之后对主页面进行更新
	function refresh(){
		var itenum = document.getElementsByClassName('item').length;//获取类别长度
		console.log(itenum);
		if(itenum == data.category.length){//修改的情况
			mui('.item').each(function(index,element){
				if(data.category[index].text != element.firstElementChild.innerHTML){
					element.firstElementChild.innerHTML = data.category[index].text;
				}
			})
		}
		else if(itenum > data.category.length){//删除的情况
			mui('.item').each(function(index,element){
				var i = 0;
				for(;i<data.category.length;i++){
					if(data.category[i].value == index){
						break;
					}
				}
				if(i < data.category.length-1){
					element.parentNode.removeChild(element);
				}
			})
		}
		else if(itenum < data.category.length){//新增的情况
			var div = document.createElement('div');//添加一个新的div标签
			div.className = "item";
			div.innerHTML = '<div class="title">'+data.category[data.category.length-1].text+'</div>';//div里的内容
			var items = document.getElementsByClassName('mui-scroll');
			var ul = document.createElement('ul');
			ul.className = "mui-table-view lists";
			div.appendChild(ul);
			items[1].appendChild(div);//items[0]是侧边栏 items[1]是主页面 items[2]是分类管理页面
		}
		console.log(data.category);
	}

//上传数据
//	function upload(){
//		mui.ajax('test.json',{
//			data:{
//				category:data.category,
//				items:data.items,
//			},
//			dataType:'json',//服务器返回json格式数据
//			type:'get',//HTTP请求类型
//			timeout:10000,//超时时间设置为10秒；
//			success:function(data){
//				console.log(data);
//			},
//			error:function(xhr,type,errorThrown){
//				alert("上传出错! "+errorThrown+":"+type,"AI-HOME");
//			}
//		});
//	}
