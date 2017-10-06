		var category = [];
		var userPicker = new mui.PopPicker();
		var showUserPickerButton = null;
		var url = "http://127.0.0.1:3000";

		mui.init();
		var app = new Vue({
			el:'#app',
			data:{
				cargo:{},
				title:"电冰箱一览表",
			},
			created:function(){
				this.init();
			},
			methods:{
				init:function(){
					request("/init",null,'cargo');
				}
			}
		});

		(function($, doc){
			$.ready(function(){
				//设置菜单和内容滚动
				$('#offCanvasSideScroll').scroll();
				$('#index').scroll();

				 $.later(function(){
				 	//数据调用以初始化选择器
					category = app.cargo.category;
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
				},200);
			});
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
					$('.mui-off-canvas-wrap').offCanvas().close();
				}
				else{
					menu.className = "mui-off-canvas-left";
					$('.mui-off-canvas-wrap').offCanvas('show');
				}
			});

			//导航栏开启关于菜单
			$('#menu').on('tap','.menu-about',function(event){
				$('.mui-off-canvas-wrap').offCanvas('close');

				var items = document.getElementById('app');
				items.className = 'mui-page';
				app.title = "关于应用";

				var about = document.getElementById('about');
				about.className = 'mui-about';
			});

			//导航栏关闭关于菜单
			$('#about').on('tap','.about-btn',function(event){
				var items = document.getElementById('app');
				items.className = 'mui-off-canvas-wrap mui-draggable';
				app.title = "电冰箱一览表";

				var about = document.getElementById('about');
				about.className = 'mui-page';
			});

			//侧滑菜单返回首页
			$('#menu').on('tap','.index-link',function(event){
				$('.mui-off-canvas-wrap').offCanvas('close');

				var index = document.getElementById('index');
				index.className = "mui-content mui-scroll-wrapper";
				app.title = "电冰箱一览表";

				var modify = document.getElementById('modify');
				var manage = document.getElementById('manage');
				var add = document.getElementById('add');
				add.className = "mui-icon mui-action-menu mui-icon-plus mui-pull-right create-category mui-page";
				modify.className = "mui-page";
				manage.className = "mui-page";

				request("/init",null,'cargo');
			});

			//侧滑菜单跳转项目管理
			$('#menu').on('tap', '.create-item', function(event) {
				/* 开启修改页面 */
				var modifys = document.getElementById('modify');
				modifys.className = "mui-content mui-scroll-wrapper";
				app.title = "添加项目";
				showUserPickerButton.innerHTML = app.cargo.category[0].text;

				var items = document.getElementById('index');
				items.className = "mui-page";
				var manage = document.getElementById('manage');
				manage.className = "mui-page";
				var add = document.getElementById('add');
				add.className = "mui-icon mui-action-menu mui-icon-plus mui-pull-right create-category mui-page";
				mui('.mui-off-canvas-wrap').offCanvas().close();
			});

			//侧滑菜单跳转类别管理
			$('#menu').on('tap','.cate-manage',function(){
				var manage = document.getElementById('manage');
				manage.className = "mui-content mui-scroll-wrapper";
				var add = document.getElementById('add');
				add.className = "mui-icon mui-action-menu mui-icon-plus mui-pull-right create-category";
				app.title = "类别管理";

				var items = document.getElementById('index');
				items.className = "mui-page";
				var modify = document.getElementById('modify');
				modify.className = "mui-page";
				mui('.mui-off-canvas-wrap').offCanvas().close();
			});

			var selectCate = null; //当前项目的类别
			//修改已有项目信息
			$('.lists').on('tap', '.item-modify', function(event) {
				var elem = this;
				selectItem = elem.parentNode.parentNode;
				/* 开启修改页面 */
				var items = document.getElementById('index');
				items.className = 'mui-content mui-scroll-wrapper mui-page';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-off-canvas-wrap mui-pages';
				app.title = "修改项目";

				setTimeout(function() {
					$.swipeoutClose(selectItem);
				}, 100);

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
							request("/item/modify",{
								"category":cate.innerHTML,
								"name": name.value.trim(),
								"quantity": num.value.trim()
							});
					}
					else{
						mui.toast("请输入有效数据！",{
							duration: 'short',
							type: 'div'
						});
					}
				}
				//没有从编辑页面进入则进行添加操作
				else {
					if(name.value.trim() != ""){
						request("/item/create",{
							"category":cate.innerHTML,
							"name": name.value.trim(),
							"quantity": num.value.trim()
						});
					}
					else{
						mui.toast("请输入有效数据！",{
							duration: 'short',
							type: 'div'
						});
					}
				}

				/* 初始化参数 */
				selectItem = null;
				name.value = "";
				num.value = 1;
				/* 关闭修改界面 */
				var items = document.getElementById('index');
				items.className = 'mui-content mui-scroll-wrapper';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-page';
				app.title = "电冰箱一览表";
				refresh();
			});

			//项目编辑页面——取消操作
			$('#modify').on('tap', '.modify-cancel', function(event) {
				var name = document.getElementById('modify-name');
				var num = document.getElementById('modify-num');
				/* 初始化参数 */
				selectItem = null;
				name.value = "";
				num.value = 1;
				/* 关闭修改界面 */
				var items = document.getElementById('index');
				items.className = 'mui-content mui-scroll-wrapper';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-page';
				app.title = "电冰箱一览表";
			});

			//删除已有项目信息；
			$('.lists').on('tap', '.item-delete', function(event) {
				var li = this.parentNode.parentNode;
				mui.confirm('确认删除该条记录？', 'AI-HOME', btnArray, function(e) {
					if(e.index == 0) {
						request("/item/delete",{"name": li.firstElementChild.innerHTML});
						refresh();
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
				var item = elem.parentNode.firstElementChild.innerHTML;
				var count = elem.innerHTML;
				count --;
				if(count == 0){
					mui.toast(item +" 已用完！",{
						duration: 'short',
						type: 'div'
					});
				}
				request("/item/number",{"name": item});
				refresh();
			});

			//添加新的类别
			$('body').on('tap','.create-category',function(event){
				mui.prompt('输入新类别的名称','请输入名称','AI-HOME',btnArray,function(e){
					if(e.index == 0){
						if(e.value.trim() != ""){
							request("/category/create",{"name": e.value.trim()});
							refresh();
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
				var index = elem.parentNode.parentNode.firstElementChild.getAttribute("value");
				console.log(index);

				mui.confirm('确认删除该条记录？', 'AI-HOME', btnArray, function(e) {
					if(e.index == 0) {
							request("/category/delete",{"tag":index});
							refresh();
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
				var tag = elem.parentNode.parentNode.firstElementChild.getAttribute("value");
				console.log(tag);
				mui.prompt('修改类别名称',elem.parentNode.parentNode.firstElementChild.innerHTML,'AI-HOME',btnArray,function(e){
					if(e.index == 0){
						if(e.value.trim() != ""){
						//修改数据库类别内容
						request("/category/modify",{
							"tag":tag,
							"name": e.value.trim()
						});
						refresh();
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

			var btnArray = ['确认', '取消'];
			var selectItem = null;
		})(mui);

	//修改完项目之后对主页面进行更新
	function refresh(){
		request("/init",null,'cargo');
	}
	//封装ajax请求 模块化代码
	function request(urls,data,option){
		urls = url + urls;
		mui.getJSON(
			urls,data,function(res){
				if(option){
					Vue.set(app,option,res);
					console.log(res);
				}
			},'json'
		)
	}
