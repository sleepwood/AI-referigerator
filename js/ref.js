		var category = [];
		var userPicker = new mui.PopPicker();
		var showUserPickerButton = null;
		var url = "http://127.0.0.1:3000";

		i18next.init({
			lng: 'zh',
			debug: true,
			fallbackLng:'zh'
		})

		i18next.on('languageChanged', () => {
  		updateContent();
		});

		mui.init();
		var app = new Vue({
			el:'#app',
			data:{
				cargo:{},
				mescroll: null,
				options:{
					general: {
			        version: null,
			        title: "",
			        showVoid: true,
			        language:""
			    },
					warns:{
						show:true,
						level:0,
						brandary:[]
					}
				},
				translation:[],
				title:"",
				optitle:"设置"
			},
			created:function(){
				this.init();
			},
			mounted: function() {
				//创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
				//解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
				var self = this;
				self.mescroll = new MeScroll("index", {
						down: {
							auto:false,
							callback: downRefresh, //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
						},
						up: {
							use: false //上拉加载的回调
						},
						empty:{ //配置列表无任何数据的提示
							warpId:"index",
//						icon : "../res/img/mescroll-empty.png" ,
						  tip : "亲,暂无相关数据哦~" ,
//						  	btntext : "去逛逛 >" ,
//						  	btnClick : function() {
//						  		alert("点击了去逛逛按钮");
//						  	}
						}
					})
			},
			methods:{
				init:function(){
					request('/lang',null,'translation');
					mui.getJSON(
						url+"/initApp",null,function(res){
								app.cargo = res.cargo;
								app.options = res.option;
								console.log(app.options);
								console.log(app.cargo);
								app.title = app.options.general.title;

								i18next.changeLanguage(app.options.general.language);
								initI18n();
								initOptions();
						},'json'
					)
				},
				numWarning:function(quantity){
					if(app.options.warns.show){
						for(var i = 0;i<app.options.warns.level-1;i++){
							if(quantity >= app.options.warns.brandary[i] && i == 0){
								return 'mui-badge-success';
							}
							else{
								if(i == 0 && app.options.warns.level >2){//三级数量预警判断
									continue;
								}
								else if(quantity < app.options.warns.brandary[i]){
									return 'mui-badge-danger';
								}
								else if(quantity >= app.options.warns.brandary[i]){
									return 'mui-badge-warning';
								}
							}
						}
					}
					else{
						return 'mui-badge-primary';
					}
				}
			},
		});

		(function($, doc){
			$.ready(function(){
				//设置菜单和内容滚动
				$('#offCanvasSideScroll').scroll();
				$('#index').scroll();

				 $.later(function(){
				 	//数据调用以初始化选择器
					category = app.cargo.category;
					console.log();
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
				},100);
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

			//导航栏开启设置菜单
			$('#menu').on('tap','.menu-option',function(event){
				$('.mui-off-canvas-wrap').offCanvas('close');

				var content = document.getElementById('content');
				content.className += ' mui-page';
				var menu = document.getElementById('menu');
				menu.className += ' mui-page';

				var option = document.getElementById('option');
				option.className = 'mui-pages';
			});

			//导航栏关闭设置菜单
			$('#option').on('tap','.option-btn',function(event){
				var content = document.getElementById('content');
				content.className = content.className.replace(/ mui-page/,"");
				var menu = document.getElementById('menu');
				menu.className = menu.className.replace(/ mui-page/,"");

				var option = document.getElementById('option');
				option.className = 'mui-page';
			});

			//设置界面进入关于界面
			$('#option').on('tap','.to-about',function(event){
				var choise = document.getElementById('choise');
				choise.className += ' mui-page';
				var btn = document.getElementsByClassName('option-btn');
				btn[0].className = 'mui-icon mui-icon-left-nav about-btn';
				app.optitle = "关于";

				var about = document.getElementById('about');
				about.className = 'mui-about';
			});
			//设置界面进入总览界面
			$('#option').on('tap','.to-general',function(event){
				var choise = document.getElementById('choise');
				choise.className += ' mui-page';
				var btn = document.getElementsByClassName('option-btn');
				btn[0].className = 'mui-icon mui-icon-left-nav general-btn';
				app.optitle = "总览";

				var about = document.getElementById('general');
				about.className = 'mui-pages';
			});
			//设置界面进入数字预警界面
			$('#option').on('tap','.to-warn',function(event){
				var choise = document.getElementById('choise');
				choise.className += ' mui-page';
				var btn = document.getElementsByClassName('option-btn');
				btn[0].className = 'mui-icon mui-icon-left-nav warn-btn';
				app.optitle = "数量预警";

				var warn = document.getElementById('warn');
				warn.className = 'mui-pages';
			});

			//关于页面回退设置界面
			$('#option').on('tap','.about-btn',function(event){
				var choise = document.getElementById('choise');
				choise.className = choise.className.replace(/ mui-page/,"");
				app.optitle = "设置";

				var about = document.getElementById('about');
				about.className = 'mui-page';
				this.className = 'mui-icon mui-icon-left-nav option-btn';
			});
			//总览页面回退设置界面
			$('#option').on('tap','.general-btn',function(event){
				if(app.title == ""){
					mui.toast("标题不能为空！",{
						duration: 'short',
						type: 'div'
					});
					return;
				}

				var choise = document.getElementById('choise');
				choise.className = choise.className.replace(/ mui-page/,"");
				app.optitle = "设置";

				app.options.general.title = app.title;
				request('/option/general',app.options.general,'options.general');

				var about = document.getElementById('general');
				about.className = 'mui-page';
				this.className = 'mui-icon mui-icon-left-nav option-btn';
			});
			//数量预警回退设置界面
			$('#option').on('tap','.warn-btn',function(event){
				for(var i=0;i<app.options.warns.brandary.length;i++){
					if(app.options.warns.level == 2 && app.options.warns.brandary[i] == -1 && i == 1){//排除等级为二的情况（等级为二 brandary[1]== －1）
						break;
					}
					if(app.options.warns.brandary[i] == "" || app.options.warns.brandary[i] <= 0){
						mui.toast("请输入有效数据！",{
							duration: 'short',
							type: 'div'
						});
						return;
					}
				}
				if(parseInt(app.options.warns.brandary[0]) <= parseInt( app.options.warns.brandary[1])){
					mui.toast("数据要递减！",{
						duration: 'short',
						type: 'div'
					});
					return;
				}

				var choise = document.getElementById('choise');
				choise.className = choise.className.replace(/ mui-page/,"");
				app.optitle = "设置";

				if(app.options.warns.level == 2){
					app.options.warns.brandary[1] = -1;
				}

				request('/option/warn/',app.options.warns,'options.warns')
				console.log(app.options.warns.brandary);

				var warn = document.getElementById('warn');
				warn.className = 'mui-page';
				this.className = 'mui-icon mui-icon-left-nav option-btn';
			});

			//侧滑菜单返回首页
			$('#menu').on('tap','.index-link',function(event){
				$('.mui-off-canvas-wrap').offCanvas('close');

				var index = document.getElementById('index');
				index.className = "mui-content mui-scroll-wrapper";
				app.title = app.options.general.title;

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
			$('#index').on('tap', '.item-modify', function(event) {
				var elem = this;
				selectItem = elem.parentNode.parentNode;
				/* 开启修改页面 */
				var items = document.getElementById('index');
				items.className = 'mui-content mui-scroll-wrapper mui-page';
				var modifys = document.getElementById('modify');
				modifys.className = 'mui-content mui-scroll-wrapper';
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
				app.title = app.options.general.title;
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
				app.title = app.options.general.title;
			});

			//删除已有项目信息；
			$('#index').on('tap', '.item-delete', function(event) {
				var li = this.parentNode.parentNode;
				mui.confirm('确认删除该条记录？', 'AI-HOME', btnArray, function(e) {
					if(e.index == 0) {
						request("/item/delete",{"name": li.firstElementChild.innerHTML});
						refresh();
					}
				});
				$.swipeoutClose(li);
			});

			//点击减少数量
			$('#index').on('tap', '.item-num', function(event) {
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

	function initOptions(){//动态设置开关初始值
		var show = document.getElementById('num-switch');
		var showVoid = document.getElementById('void-switch');
		var language = document.getElementById('language-switch');
		var night = document.getElementById('night-switch');

		if(app.options.warns.show == "true"){
			show.className = "mui-switch mui-active";
		}
		else{
			show.className = "mui-switch";
		}
		if(app.options.general.showVoid == "true"){
			showVoid.className = "mui-switch mui-active";
		}
		else{
			showVoid.className = "mui-switch";
		}
		if(app.options.general.language == "zh"){
			language.className = "mui-switch mui-active";
		}
		else{
			language.className = "mui-switch";
		}
		if(app.options.general.night_mode == "true"){
			night.className = "mui-switch mui-active";
			CSSManage("css/night_mode.css");
		}
		else{
			night.className = "mui-switch";
		}
	}

	//设置页面 —— 数量预警功能开关
	document.getElementById("num-switch").addEventListener("toggle",function(event){
  if(event.detail.isActive){
		app.options.warns.show = true;
  }else{
		app.options.warns.show = false;
  }
	})
	//设置页面 —— 显示空列表功能开关
	document.getElementById("void-switch").addEventListener("toggle",function(event){
	if(event.detail.isActive){
		app.options.general.showVoid = true;
	}else{
		app.options.general.showVoid = false;
	}
	})
	//设置页面 —— 多语言功能开关
	document.getElementById("language-switch").addEventListener("toggle",function(event){
	if(event.detail.isActive){
		app.options.general.language = "zh";
		i18next.changeLanguage("zh");
	}else{
		app.options.general.language = "en";
		i18next.changeLanguage("en");
	}
	})
	//设置页面 —— 夜间模式开关
	document.getElementById("night-switch").addEventListener("toggle",function(event){
	if(event.detail.isActive){
		app.options.general.night_mode = true;
		CSSManage("css/night_mode.css");
	}else{
		app.options.general.night_mode = false;
		CSSManage("css/night_mode.css");
	}
	})

	//设置界面 —— 数量预警层级滑块
	document.getElementById('inline-range').addEventListener('input',function(){
			app.options.warns.level = this.value;
	});

	//修改完项目之后对主页面进行更新
	function refresh(){
		request("/init",null,'cargo');
	}
	function downRefresh(){
		request("/init",null,'cargo');
		app.mescroll.endSuccess(app.cargo);
	}
	//封装ajax请求 模块化代码
	function request(urls,data,option){
		urls = url + urls;
		mui.getJSON(
			urls,data,function(res){
					Vue.set(app,option,res);
					console.log(res);
			},'json'
		)
	}
	//i18n初始化
	function initI18n(){
		var temp = [];
		for(var i in app.translation){
			i18next.addResources(i, 'translation', app.translation[i]);
			temp.push(i);
		}

		i18next.languages = temp;
		updateContent();
	}
	//i18n绑定div
	function updateContent(){
		document.getElementById('menu_index').innerHTML = i18next.t('index');
		document.getElementById('menu_item').innerHTML = i18next.t('add_item');
		document.getElementById('menu_cate').innerHTML = i18next.t('cate_manage');
		document.getElementById('menu_setting').innerHTML = i18next.t('options');
		document.getElementById('sub_title').innerHTML = i18next.t('sub_title');
		document.getElementById('menu_footer').innerHTML = i18next.t('footer');
		document.getElementById('item_name').innerHTML = i18next.t('item_name');
		document.getElementById('item_num').innerHTML = i18next.t('item_num');
		document.getElementById('item_cate').innerHTML = i18next.t('item_cate');
		document.getElementById('item_submit').innerHTML = i18next.t('submit');
		document.getElementById('item_cancel').innerHTML = i18next.t('cancel');
		document.getElementById('option_general').innerHTML = i18next.t('general');
		document.getElementById('option_warn').innerHTML = i18next.t('warn');
		document.getElementById('option_about').innerHTML = i18next.t('option_about');
		document.getElementById('set_title').innerHTML = i18next.t('set_title');
		document.getElementById('option_about').innerHTML = i18next.t('option_about');
		document.getElementById('show_Void').innerHTML = i18next.t('show_Void');
		document.getElementById('language').innerHTML = i18next.t('language');
		document.getElementById('night_mode').innerHTML = i18next.t('night_mode');
		document.getElementById('warn_switch').innerHTML = i18next.t('warn_switch');
		document.getElementById('warn_level').innerHTML = i18next.t('warn_level');
		document.getElementById('about_content').innerHTML = i18next.t('about');
	}
	//夜间模式CSS 切换
	function CSSManage(path){
		var switchs = true;
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
		var links = document.getElementsByTagName('link');
		for(var i = 0;i<links.length;i++){
			if(links[i].href.search(path) != -1){
				head.removeChild(links[i]);
				switchs = false;
			}
		}
		if(switchs){
			var link = document.createElement('link');
	    link.href = path;
	    link.rel = 'stylesheet';
	    head.appendChild(link);
		}
	}
