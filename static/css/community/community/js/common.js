$(document).ready(function() { //
    //门户.start
    //门户顶部control-tips关闭
    $(".control-tips .w1000 .close").click(function() {
        $(this).parents(".control-tips").hide();
    });
    //门户顶部control-tips  hover效果
    $(".control-tips .w1000 .close").hover(function() {
        $(this).toggleClass("hover");
    });
    //门户顶部导航hover效果
    var curindex = $(".portalhead .nav ul li").index($(".portalhead .nav ul li.cur"));
    $(".portalhead .nav ul li").on({
        mouseenter: function() {
            $(this).addClass("cur").siblings().removeClass("cur");

        },
        mouseleave: function() {
            $(".portalhead .nav ul li").removeClass("cur");
            $(".portalhead .nav ul li").eq(curindex).addClass("cur");
        }
    });
    //门户.over
    //topbar.start  
    //topbar menu hover效果
    $(".topbar .menu ul li.m1,.topbar .menu ul li.m22,.topbar .menu ul li.m3,.topbar .menu ul li.m4,.topbar .menu ul li.m5,.topbar .menu ul li.m6,.topbar .menu ul li.m33").hover(function() {
        $(this).toggleClass("hover");
    });
    //topbar1资源下拉
    $(".topbar .menu ul li.m2").hover(function() {
        $(this).find(".dropSource").toggle();
        $(this).toggleClass("hover")
    });
    //topbar1资源专题下拉(武汉)
    $(".topbar .menu ul li.m7").hover(function() {
        //$(this).find(".dropSource_s").toggle();
        $(this).toggleClass("hover")
    });
    //topbar-1应用下拉
    $(".spaceTopBar2014 .menu ul li.m3").hover(function() {
        $(this).find(".dropApp").show();
        $(this).addClass("hover");
    },
    function() {
        $(this).find(".dropApp").hide();
        $(this).removeClass("hover");
    });
    //空间topbar3右侧班级和学校下拉
    $(".topbar li.class,.topbar li.school").hover(function() {
        $(this).find("dl").toggle();
        $(this).toggleClass("hover");
    });
    //空间topbar-4右侧设置图标下拉		   
    $(".topbar li.opt").hover(function() {
        $(this).toggleClass("hover");
        $(this).find(".dropOpt").toggle();
    });
    //空间topbar-5右侧信息图标下拉		   
    $(".topbar li.mail").hover(function() {
        $(this).toggleClass("hover");
        $(this).find(".dropMsg").toggle();
    });
    //顶部搜索框click,focus效果
    $(".topbar .search .schInp").on('focus click',
    function() {
        var sinp = $(this);
        if (sinp.val() == '请输入关键字') {
            $(this).attr("value", "");
            $(this).parent("form").parent(".search").addClass("bgwhite");
        }
        return false;
    });
    $(".topbar .search .schInp").on('blur',
    function() {
        var sinp = $(this);
        if (sinp.val() == '') {
            sinp.val("请输入关键字");
            sinp.parent("form").parent(".search").removeClass("bgwhite");
        }
    });
    //顶部搜索按钮hover效果
    $(".topbar .search .schBtn").hover(function() {
        $(this).parents(".search").toggleClass("btnhover");
    });
	//topbar.over   
    //space header.start
    //空间header区域导航hover效果
	var browser_url = window.location.href.toLowerCase();
	var h_a = $('.spaceMenu a');
	$.each(h_a, function(){
		var u = $(this).attr('href').toLowerCase();
		if(u.indexOf('center/person/index') >= 0 && browser_url.indexOf('center/person/index') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}
		if(u.indexOf('post') >= 0 && browser_url.indexOf('post') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}
		if(u.indexOf('cms-portal') >= 0 && browser_url.indexOf('cms-portal') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}			
		if(u.indexOf('talbum') >= 0 && browser_url.indexOf('talbum') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}	
		if(u.indexOf('addresslist') >= 0 && browser_url.indexOf('addresslist') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}						
	});
	
	var h_a = $('.spModular_nav ul.nav a');	
	$.each(h_a, function(){
		var u = $(this).attr('href').toLowerCase();
		if(u.indexOf('space/person/index') >= 0 && browser_url.indexOf('space/person/index') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}
		if(u.indexOf('post') >= 0 && browser_url.indexOf('post') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}
		if(u.indexOf('cms-portal') >= 0 && browser_url.indexOf('cms-portal') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}			
		if(u.indexOf('talbum') >= 0 && browser_url.indexOf('talbum') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}	
		if(u.indexOf('addresslist') >= 0 && browser_url.indexOf('addresslist') >= 0){
			$(this).addClass("cur").siblings().removeClass("cur");	
		}						
	});	
	
	
    //space header.over
    //国家专用
    //顶部搜索框click,focus效果
    $(".topbar_nation .search .schInp").on('focus click',
    function() {
        var sinp = $(this);
        if (sinp.val() == '请输入关键字') {
            $(this).attr("value", "");
            $(this).parent("form").parent(".search").addClass("bgwhite");
        }
        return false;
    });
    $(".topbar_nation .search .schInp").on('blur',
    function() {
        var sinp = $(this);
        if (sinp.val() == '') {
            sinp.val("请输入关键字");
            sinp.parent("form").parent(".search").removeClass("bgwhite");
        }
    });
    //顶部搜索按钮hover效果
    $(".topbar_nation .search .schBtn").hover(function() {
        $(this).parents(".search").toggleClass("btnhover");
    });
	$(".topbar_nation li.class,.topbar_nation li.school").hover(function() {
        $(this).find("dl").toggle();
        $(this).toggleClass("hover");
    });
    //空间topbar-4右侧设置图标下拉		   
    $(".topbar_nation li.opt").hover(function() {
        $(this).toggleClass("hover");
        $(this).find(".dropOpt").toggle();
    });
    //空间topbar-5右侧信息图标下拉		   
    $(".topbar_nation li.mail").hover(function() {
        $(this).toggleClass("hover");
        $(this).find(".dropMsg").toggle();
    });
	
	
	
	
    //同步资源课程列表鼠标hover变色
    $(".prepare-lessons .lessons-con ul.item-list li").on({
        mouseenter: function() {
            $(this).addClass("hover");
        },
        mouseleave: function() {
            $(this).removeClass("hover");
        }
    });
    //多行表格鼠标hover后td变色效果
    $(".checkbox_table tr").hover(function() {
        $(this).toggleClass("hover");
    });
    //给需要透明的PNG图片所在容器增加class="png_bg"
    $(".topbar .menu li,.topbar .menu li a,.topbar .navOpt li a,.topbar .navOpt li a span,.topbar .userMenu li.class a").addClass("png_bg");
    $(".star,.star em,.star_show em,.star_show,.popInner .close img,.app_star,.tips-box-txt i,.btn-sub span, .grade_outer, .grade_inner, .grade_outer2").addClass("png_bg");
    //门户首页png透明
    $(".portalHeader a.logo,.portalHeader .slogan,.control-tips .w1000 .close,.portalhead .logo a,.portalhead .nav li a,.portalhead .nav li,#kinMaxShow .txt-mask img").addClass("png_bg");
    //门户空间头部应用下拉图片左右滚动初始化
    $("*[name='imgMove']").divMove('licon', 'ricon', '*[name="imgMovebox"] ul', 'li', 6, '', '');
    //反馈弹窗
    $('.feedback').click(function() {
        $(".feedback-popbox").jumpBox(true);
        //推迟feedback验证码加载
        var src = "/index.php?r=portal/site/verify" + "&tm=" + Math.random();
        $("#verify").attr("src", src);
        return false
    });
})