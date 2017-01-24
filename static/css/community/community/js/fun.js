// JavaScript Document
$.fn.extend({
    //select美化.start
	seleFn:function(){
		$(this).each(function(){
			var _method=$(this),_parent=null;
			if(_method.parent('label').attr('cmenu')=='true'||_method.attr('cmenu')=='true') return false;
			var	len = $(this).children("option").length, str = "",
				w = $(this).width()+parseInt($(this).css('padding-right'))+parseInt($(this).css('padding-left')),
				stype= ($(this).attr('stype')=='liandong')?"stype='liandong'":"",
				ldname=($(this).attr('stype')=='liandong')?"ldname='"+$(this).attr('ldname')+"'":"",
			    border  = "<span class='seleJs'><span class=\"seleTB\" "+stype+ldname+"></span><div class=\"apps_seleMenu\"></div></span>";
			_method.hide().before(border);
			_method.attr('cmenu','true');
			var _seleMenu=_method.prev().find('.apps_seleMenu');
			_seleMenu.html(_method.html().replace(/option/gi,'p').replace(/optgroup/gi,'h5'))/*.width(_seleMenu.width()>w-8?_seleMenu.width()+20:w-8);取消宽度保持与SELECT一致*/
			_seleMenu.find('h5').each(function(){$(this).html($(this).attr('label'))});
			_seleMenu.find('p').each(function(){if('disabled'==$(this).attr('disabled')) $(this).addClass('undis')});
			if(_seleMenu.height()>196){_seleMenu.css({'overflow-y':'auto','height':196});}
			var _seleTB=_method.prev().find('.seleTB');
			_seleTB.width(w-24).html(_method.children("option:selected")?_method.children("option:selected").html():$(this).children("option")[0].innerHTML);
		})//end each
		
		var _seleMenu=$('.apps_seleMenu'),_seleMenuP=$('.apps_seleMenu p'),_seleTB=$('.seleTB'),
		CreatS={
			init:function(){
				this.seleJsFun();
				this.linkAge();
			},
			seleJsFun:function(){
				//$("body").unbind().bind('click',function(e){e.stopPropagation();_seleMenu.hide();})
                $(document).click(function(e){e.stopPropagation();_seleMenu.hide();});
				_seleMenuP.hover(function(){if('disabled'!=$(this).attr('disabled')) $(this).addClass('on');},function(){$(this).removeClass('on');});
				_seleTB.unbind('click').bind('click',function(e){
					e.stopPropagation();
					_seleMenu.hide();$(this).next().toggle();$('.seleJs').css('z-index',0);
					$(this).parent().css('z-index',999);
				})
				_seleMenuP.each(function(){
					if('disabled'==$(this).attr('disabled')) return;
					$(this).die().live("click",function(){
					var seleIndex = $(this).index(),_seleTB=$(this).closest('.seleJs').find('.seleTB'),
						_method=$(this).closest('.seleJs').next(),_seleMenu=$(this).parent();
					_seleTB.html($(this).html()).attr("tvalue",$(this).attr("value")).trigger('change');
					_method[0].selectedIndex = seleIndex;
					_method.trigger('change');
					_seleMenu.hide();
					})
				})
			},
			linkAge:function(){
				var _ld=$("span[stype='liandong']"),	
					txt=["--请选择--","<p value=''>--请选择--</p>","<option value=''>--请选择--</option>"];
				if(_ld.length==0) return false;
				_ld.unbind('change').bind('change',function(){
					var ldname=$(this).attr('ldname');
					var	ldgroup=$("span[ldname='"+ldname+"']");
					var	ldlen=$("span[ldname='"+ldname+"']").length;
					var	ldindex=$("span[ldname='"+ldname+"']").index($(this));
					var	nsel=ldgroup.eq(ldindex+1);
					var	tvalue=$(this).attr('tvalue');
					if(""==tvalue){
						for(var i=ldindex+1;i<ldlen;i++){ ldgroup.eq(i).html(txt[0]).next().html(txt[1]);}
						return false;
					}
					$.ajax({
					   type: "POST",url: actpath,data: "value="+tvalue,dataType :"json",async: false,
					   success: function(msg){
						nsel.html(txt[0]).next().html(txt[1]).parent().next().html(txt[2]);
						for(var i in msg){
							var p=document.createElement('p');
							nsel.next().append('<p value="'+msg[i][0]+'">'+msg[i][1]+'</p>');
							nsel.parent().next().append('<option value="'+msg[i][0]+'">'+msg[i][1]+'</option>');
						};
						nsel.next().width('auto');
						nsel.next().find("p").bind("click",function(){
							var nowObj=$(this).parent().prev(),seleObj=$(this).closest('.seleJs').next();
							var seleIndex = $(this).index();
							seleObj[0].selectedIndex = seleIndex;
							seleObj.trigger('change');
							nowObj.html($(this).html()).attr("tvalue",$(this).attr("value")).trigger('change');
							$(this).parent().hide();
						}).hover(function(){$(this).addClass('on');},function(){$(this).removeClass('on');});
					   }//end success
					})//end ajax
				})//end change
			}//end linkAge
		}
		CreatS.init();
	},
    //select美化.over

    //选项卡.start
	tabControl:function(tab,con,mor){
		$(this).each(function(){
			var _method=this;
            $(this).find(tab).each(function(i){
                $(this).click(function(){
				if(this.className=='more'){return false;}
				$(this).addClass('on').siblings().removeClass('on');
				$(_method).find(con).addClass('dis_none');
                $(_method).find(con).eq(i).removeClass('dis_none');
				return false;
				});
         	});                                               
			$(this).find(mor).click(function(){
				window.location.href=$(this).attr('href');
			});
		});
	},
	//选项卡.over
	//图片滑动切换.start
	divMove:function(left,right,cont,tag,maxLen,lrNo,where){
		$(this).each(function(){
			var oLeft=$(this).find('i.'+right),
				oRight=$(this).find('i.'+left),
				oCont=$(this).find(cont),
				oWhere=$(this).find(where),
				w=oCont.find(tag).width()+parseInt(oCont.find(tag).css('margin-right')),
				len=oCont.find(tag).length,
				index=0,_method=this,
				maxL=maxLen?maxLen:1,
				leftNo=lrNo?lrNo+'r':right+'_none',
				rightNo=lrNo?lrNo+'l':left+'_none';
               if(len<=maxL){oLeft.addClass(leftNo)};//当图片个数少于展示的个数，右边按钮不可点。
			oCont.width(w*len);
             
			oLeft.live('click',function(){
				if($(this).attr('class').indexOf(leftNo)>0){return false;}
				index+=maxLen;
				if(index>0){oRight.removeClass(rightNo);}
				if(index>=len-maxL){$(this).addClass(leftNo);}
				oCont.stop(true,false).animate({'left':-1*index*w},800);
				oWhere.eq(index).addClass('on').siblings().removeClass('on');
			});
			oRight.live('click',function(){
				if($(this).attr('class').indexOf(rightNo)>0){return false;}
				index-=maxLen;
				if(index>=0){oLeft.removeClass(leftNo);}
				if(index<=0){$(this).addClass(rightNo);}
				oCont.stop(true,false).animate({'left':-1*index*w},800);
				oWhere.eq(index).addClass('on').siblings().removeClass('on');
			});
		});
	},
	//图片滑动切换.over
	
	//弹窗.start
	jumpBox:function(style){
		var _method=$(this);
		var clientWidth = _method.innerWidth(), clientHeight = _method.innerHeight();		
		center(_method,style);
		$("body select").css('visibility','hidden');
		$("body .popWrap select").css('visibility','visible');//修改
		_method.find("*[name='close']").click(function(ev){
			ev.preventDefault();
			$("body select").css('visibility','visible');			
			_method.hide();
			$("#screen").hide();
			return false;
		})
		_method.find("*[name='close'] img").hover(function(){
			$(this).attr('src','http://www.wuhaneduyun.cn:21001/statics_dev/common/images/ico/close-popho.png');	
		},function(){
			$(this).attr('src','http://www.wuhaneduyun.cn:21001/statics_dev/common/images/ico/close-pop.png');	
		})
		$("#screen").css({'display':'block','width':'100%','height':$(document).height()});		
		if(_method.is(":hidden")){$(window).bind('resize',function(){center(_method,style)});}
	},
	Rewardjumn:function(style){var obj=$(this); rewardjum(obj,style);
},
	Newjump:function(style){
		var _Obj=$(this);
		middcen(_Obj,style);
		$("body select").css('visibility','hidden');
		$("body .popWin select").css('visibility','visible');
		_Obj.find("*[name='close']").click(function(ev){
			ev.preventDefault();
			$("body select").css('visibility','visible');
			_Obj.hide();
			$("#Wscreen").hide();
			return false;
		});
		if(_Obj.is(":hidden")){$(window).bind('resize',function(){middcen(_Obj,style)});}
	},
	//弹窗.over
	//checkbox.美化.start
	checkboxFn:function(){
		$(this).each(function(){
			var _method=$(this);
			var disable=_method.attr("disabled")=="disabled"?" disabled=\"disabled\"":"";
			var str=_method.attr("checked")=="checked"?"ckboxBtn_on":"ckboxBtn";
			var cls=_method.attr("disabled")=="disabled"?"c888":"";
			if("ckboxBtn_on"==str && ""!=disable) str="ckboxBtn_disabled";
			if('none'==_method.parent().css('display')||_method.css('display')=='none') return false;
			//过滤html标签
			var text = _method.parent().text().replace(/</g, '&lt;');
				text = text.replace(/>/g, '&gt;');
			
			_method.parent().hide().before("<label name=\""+_method.attr("name")+"\" class=\"ckboxTb\"><span class=\""+cls+"\">"+text+"</span></label>"); 		
			var _parent=_method.parent().prev();
			_parent.prepend("<span class='"+str+"' "+disable+"></span>");
			_parent.hover(function(){_method.css({"cursor":"pointer"})},function(){_method.css({"cursor":"normal"})});
			_parent.bind('click',function(event){
	            if(event.target.tagName=='LABEL'){
	            }else{
					var obj=_parent.find("span").eq(0);
					if(_method.attr("disabled")=="disabled"){ return false;}
					obj.attr('class',obj.attr('class')=='ckboxBtn'?'ckboxBtn_on':'ckboxBtn');	
					_method.attr('checked',obj.attr('class')=='ckboxBtn'?false:true);
				}
			})
		})
	},
    //checkbox美化.over
	
	checkboxDie:function(){
		$(this).each(function(){
			var _m=$(this);
			_m.parent().show().prev(".ckboxTb").remove();
		})
	},

    //checkbox全选.start
    allCheckCmenu:function(_obj){
		$(this).each(function(){
			$("input[type='checkbox']").checkboxFn();
			var _method=$(this);
			_method.prev().click(function(){
				if('checked'==_method.find("input").attr('checked')){
					_obj.attr('checked','checked');
					_obj.each(function(){$(this).parent().prev().find('span').eq(0).attr('class','ckboxBtn_on');})
				}else{
					_obj.attr('checked',false);
					_obj.each(function(){$(this).parent().prev().find('span').eq(0).attr('class','ckboxBtn');})
				}
			})
		})
	},
    //checkbox全选.over
    
	//DIVselect美化.start
	divSeleFn:function(){
		$(this).each(function(){
			var _method= this;
			var _cur   = $(_method).find('.sele_cur');
			var _drop  = $(_method).find('.sele_drop');
            var _dropAll = $('.sele_drop').not(_drop);
			$(_method).click(function(){
                _cur.toggleClass('open');
				_drop.toggle().css('z-index','9999999');
                //$(this).parents().siblings().find('.sele_drop').hide();
                 _dropAll.hide();
				return false;
			})
			$(_method).find('.sele_drop ul li').click(function(){
				_cur.removeClass('open').children('p').text($(this).text());
				_drop.hide();
				return false;
			}).hover(
				function(){$(this).addClass('hover');},
				function(){$(this).removeClass('hover');}
			);
		})
		$(document).click(function(){
			$('.sele_drop').hide();
			$('.sele_cur').removeClass('open');  
			
		})
	},
    //DIVselect美化.over
    //radio美化.start
    radioFn:function(callback){
		$(this).each(function(){
			var _method=$(this);
			if(_method.parent('label').css('display')=='none'||_method.css('display')=='none') return false;
			_method.parent().hide().before("<label name=\""+$(this).attr("name")+"\" class=\"radioTb\"><span>"+_method.parent().text()+"</span></label>");
			var _parent=_method.parent().prev();
			var str=_method.attr("checked")=="checked"?"radioBtn_on":"radioBtn";
			var disable=_method.attr("disabled")=="disabled"?" disabled=\"disabled\"":"";
			_parent.prepend("<span class='"+str+"' "+disable+"></span>");
			_parent.hover(function(){_method.css({"cursor":"pointer"})},function(){_method.css({"cursor":"normal"})});
			_parent.unbind().bind('click',function(){
				var obj=_parent.find("span").eq(0);
				var nm=$(this).attr("name");
				if(obj.attr("disabled")=="disabled"){ return false;}
				$(".radioTb").each(function(){
					if($(this).attr('name')==nm){
						$(this).find("span:eq(0):not([disabled='disabled'])").attr('class','radioBtn');
					}
				})
				obj.attr('class',obj.attr('class')=='radioBtn'?'radioBtn_on':'radioBtn');	
				_method.attr('checked',true);
				if('function'==typeof(callback)){callback();}
			})
		})//radio美化.over
	},
    //评分功能.start
	grade:function(valObj,scoreObj,resObj){
		var resObj=resObj||false;
		$(this).click(function(event){
			var event=event||window.event;
			var l=$(this).width();
			var b = 2;
			var result = "涓€鑸�";
			var score=Math.ceil((event.pageX-$(this).offset().left)/(2*l)*10)*2;
			$(this).find('em').width(score*10+'%');
			valObj.val(score);	
			scoreObj&&scoreObj.html(score/b+".0分");
			switch (score) {				
				case 0:result="\5f88\5dee";break;
				case 2:result="\4e0d\597d";break;
 				case 4: result="\4e00\822c";break;
				case 6:result="\4e00\822c";break;	
				case 8:result="\5f88\597d";break;
				default:result="\5f88\597d";break;
				};
			resObj&&resObj.html(result)	
		})
	},//评分功能.over
	grade3:function(valObj){
		var onoff = true;
		var inum = 0;
		$(this).on('mouseover mousemove',function(event){
			var event=event||window.event;
			getGrade($(this),event);
		});
		
		$(this).mouseout(function(){
			if(!onoff){
				$(this).find('em').width(inum*10+'%');
			}else{
				$(this).find('em').width(0);
			}
		});
		$(this).click(function(event){
			var event=event||window.event;
			inum = getGrade($(this),event);
			valObj.val(inum/2);
			onoff = false;
		});
		function getGrade(obj,ev){
			var l=obj.width();
			var b = 2;
			var score=Math.ceil((ev.pageX-obj.offset().left)/(2*l)*10)*2;
			obj.find('em').width(score*10+'%');
			return score;
		}
	},//评分功能.over
    //模拟上传框.start
    	fileTxFn:function(){
		$(this).each(function(){
			if(0==$(this).width()) return false;
			var _method=$(this),w=$(this).width();
			$(this).height(0).width(0).before("<span class='apps_fn_fileCss'><input type='text' class='apps_hdlt apps_w180' value='"+$(this).val()+"' readonly='readonly' /> <input class='apps_btn3 apps_w100' type='button' value='涓婁紶'></span>");
			var _parent=_method.prev('span');
			_parent.unbind().bind('click',function(){_method.click();return false;})
			_method.unbind('change').bind('change',function(){_parent.find("input[type='text']").val(_method.val());return false;})
		})
	},//模拟上传框.over

	//下拉匹配
	inpMatching:function(arr){
		var m=$(this),allHTML='',
			emInp=$(this).find('input'),
			holdBox=$(this).find('.holdbox');
		var matching={
			holdIndex:0,
			init:function(){
				for(var i=0;i<arr.length;i++){
					allHTML+='<a href="#" groupid="'+arr[i][1]+'">'+arr[i][0]+'</a> ';
				}
				holdBox.css('top',emInp.outerHeight())
			},
			showFindUL:function(string){
				if(''!=string && ''!=string.replace(/(^\s*)|(\s*$)/g,'')){
					var re=eval('/'+string+'/ig'),schresult=[],html='';
					for(var i=0;i<arr.length;i++){
						if(null!=arr[i][0].match(re)){html+='<a href="#" groupid="'+arr[i][1]+'">'+arr[i][0]+'</a> ';}
					}
					if(html!=''){ holdBox.html(html).show();}
					else{holdBox.html('').hide();}
				}else{
					if(allHTML!='') holdBox.html(allHTML).show();
				}
			},
			hideUL:function(event){
				holdBox.children('a').removeClass('on');
				holdBox.html('').hide();
				this.holdIndex=0;
			}
		}//end matching
		matching.init();
		if(navigator.userAgent.indexOf('MSIE') >= 0){
			emInp[0].attachEvent('onpropertychange', function(event) {matching.showFindUL(emInp.val());})
		}else{
			emInp[0].addEventListener('input',function(){matching.showFindUL(emInp.val());})
		}
		emInp.bind('focus',function(event){matching.showFindUL(emInp.val());})
		emInp.bind('click',function(event){event.stopPropagation();})
		$(document).bind('click',function(event){
			var event=event||window.event;
			if('holdbox'!=event.target.className){matching.hideUL();}	
		})
		holdBox.delegate('a', 'click', function(event) {
			emInp.val($(this).html()).attr('groupid',$(this).attr('groupid'));
			matching.hideUL();
			return false;
		});
		holdBox.delegate('a','mouseover',function(event){$(this).addClass('on');matching.holdIndex=$(this).index();})
		holdBox.delegate('a','mouseout',function(event){$(this).removeClass('on');matching.holdIndex=0;})
		emInp.bind('keydown',function(event){
			if(event.keyCode==38){
				var h=holdBox.find('a').outerHeight();
				matching.holdIndex--;
				matching.holdIndex=matching.holdIndex==0?arr.length:matching.holdIndex;
				holdBox.find('a').removeClass('on').eq(matching.holdIndex-1).addClass('on');
				if(matching.holdIndex>=5){
					holdBox.scrollTop((matching.holdIndex-5)*h);
				}else{holdBox.scrollTop(0);}
			}else if(event.keyCode==40){
				var h=holdBox.find('a').outerHeight();
				matching.holdIndex++;
				matching.holdIndex=matching.holdIndex==arr.length+1?1:matching.holdIndex;
				holdBox.find('a').removeClass('on').eq(matching.holdIndex-1).addClass('on');
				if(matching.holdIndex>5){
					holdBox.scrollTop((matching.holdIndex-5)*h);
				}else{holdBox.scrollTop(0);}
			}else if(event.keyCode==13){
				var chooseEm=holdBox.children('a').eq(matching.holdIndex-1);
				emInp.val(chooseEm.html()).attr('groupid',chooseEm.attr('groupid'));
				matching.hideUL();
				return false;
			}
		})
	},
	
	//鼠标悬停列表
	hoverList:function(){
		var _method=$(this);
		_method.each(function() {
			var hoverL=$(this).find("*[name='hoverList']");
			$(this).mouseover(function(){
				$(this).addClass('on').siblings().removeClass('on');
				hoverL.width()>200?hoverL.width(200):'';
				hoverL.stop(true,true).slideDown(300);
				hoverL.css({"position":"absolute","z-index":"999"})
			})
			$(this).mouseleave(function(){
				$(this).removeClass('on');
				hoverL.stop(true,true).slideUp(300);
				hoverL.css({"position":"absolute","z-index":"-1"})
			})
            
        });
	},
	
	//九宫图片
	showImgList:function(i,filepath){
		$(this).each(function() {
			var _method=$(this),
				_parent=$(this).closest(".con-showimg"),
				html='',
				length=$(this).parent().children("li").length,
				fileName=$(this).find("img").attr('filename');
				html=_parent.find('.con-showimglist').html();
				_parent.find(".smlImgList").html(html);
				_parent.find(".con-showimglistbox").hide();
				_parent.find(".con-showimgbox").show();
				var album = new Album0(_parent,'.bimg img','.smlImgList','.con-pprev','.con-pnext','.prevbtn','.nextbtn',i,'','','.imgurl',filepath);
				album.init();
			_parent.find(".putaway").click(function(){
				_parent.find(".con-showimglistbox").show()
				_parent.find(".con-showimgbox").hide();
				return false;
			})
            return false;
        });
	} ,
    //radio_tab.start
    radioTabFn:function(){
	    $(this).each(function(){
	       var _method = $(this);
	       var _radio = _method.find("input[type='radio']");
	       var _con = _method.find(".con > div"); 
	        _method.find(".con > div:first").show();
	        _radio.each(function(index){//循环绑定事件  
	        	$(this).click(function(){  if($(this).attr("checked")){_con.hide();_con.eq(index).show();} })
	       	});  
	     })
    },
    //radio_tab.over
    
	//checkbox 美化(checkbox不被包含在lable里面).start
    hcheckbox:function(options){
		this.each(function () {
			var _this = $(this);
			var oChkAll = _this.find('label.chkAll');
			$(':checkbox+label', this).each(function() {
				$(this).addClass('checkbox');
				if ($(this).prev().is(':disabled') == false) {
					if ($(this).prev().is(':checked')) $(this).addClass("checked");
				} else {
					$(this).addClass('disabled');
				}
			}).click(function(event) {
				if (!$(this).prev().is(':checked')) {
					$(this).addClass("checked").prev()[0].checked = true;
					if(oChkAll[0]) {
						var aLabel = _this.find(':checkbox+label').not('.chkAll');
						aLabel.each(function (index) {
							if(!$(this).prev().is(':checked')) return false;
							if(index >= aLabel.length - 1) oChkAll.addClass('checked').prev()[0].checked = true;
						});
					}
				} else {
					$(this).removeClass('checked').prev()[0].checked = false;
					if(oChkAll.hasClass('checked')) oChkAll.removeClass('checked').prev()[0].checked = false;
				}
				event.stopPropagation();
			}).prev().hide();
			oChkAll.click(function () { //增加全选
				var bFlag = $(this).prev().is(':checked');
				_this.find(':checkbox+label').each(function () {
					if(bFlag) {
						$(this).addClass("checked").prev()[0].checked = true;
					} else {
						$(this).removeClass('checked').prev()[0].checked = false;
					}
				});
			});
		});
	},
	//checkbox 美化(checkbox不被包含在lable里面).over

	//checkbox 美化(checkbox被包含在lable里面).start 
    hcheckbox2:function(chkItem,chkAll){
		this.each(function () {
			var _this = $(this);
			var oChkAll = chkAll? _this.find(chkAll):_this.find('label.chkAll');
			var chkCell = chkItem? chkItem:'label';
			$(chkCell, this).each(function() {
				$(this).addClass('checkbox');
				if ($(this).children().is(':disabled') == false) {
					if ($(this).children().is(':checked')) $(this).addClass("checked");
				} else {
					$(this).addClass('disabled');
				}
			}).click(function(event) {
				if (!$(this).children().is(':checked')) {
					$(this).addClass("checked").children()[0].checked = true;
					if(oChkAll[0]) {
						var aLabel = _this.find('label.checkbox').not('.chkAll');
						aLabel.each(function (index) {
							if(!$(this).children().is(':checked')) return false;
							if(index >= aLabel.length - 1) {
								oChkAll.addClass('checked').children()[0].checked = true;
							}
						});
					}
				} else {
					$(this).removeClass('checked').children()[0].checked = false;
					if(oChkAll.hasClass('checked')) oChkAll.removeClass('checked').children()[0].checked = false;
				}
				event.stopPropagation();
			}).children().hide();
			oChkAll.click(function () { //增加全选
				var bFlag = $(this).children().is(':checked');
				if(chkCell.indexOf('label') == 0) chkCell = chkCell+'.checkbox';
				_this.find(chkCell).each(function () {
					if(bFlag) {
						$(this).addClass("checked").children()[0].checked = true;
					} else {
						$(this).removeClass('checked').children()[0].checked = false;
					}
				});
			});
		});
	},
 	//checkbox 美化(checkbox被包含在lable里面).over

 	//radio 美化(radio不被包含在lable里面).start
    hradio:function(options){
		var self = this;
		return this.each(function () {
			var _this = $(this);
			$(':radio+label',this).each(function(){
				$(this).addClass('hRadio');
				if($(this).prev().is(":checked")) {
					$(this).addClass('hRadio_Checked'); 
					_this.find(':radio+label').not($(this)).removeClass("hRadio_Checked");
				}
			}).click(function(event){
				_this.find(':radio+label').not($(this)).removeClass("hRadio_Checked");
				if(!$(this).prev().is(':checked')){
					$(this).addClass("hRadio_Checked");
					$(this).prev()[0].checked = true;
				}
				event.stopPropagation();
			}).prev().hide();
		});
	},
	//radio 美化(radio不被包含在lable里面).over

	//radio 美化(radio被包含在lable里面).start
	hradio2:function(options){
		var self = this;
		return this.each(function () {
			var _this = $(this);
			$('label',this).each(function(){
				$(this).addClass('hRadio');
				if($(this).children().is(":checked")) {
					$(this).addClass('hRadio_Checked');
					_this.find('label').not($(this)).removeClass("hRadio_Checked");
				}
			}).click(function(event){
				_this.find('label').not($(this)).removeClass("hRadio_Checked");
				if(!$(this).children().is(':checked')){
					$(this).addClass("hRadio_Checked");
					$(this).children()[0].checked = true;
				}
				event.stopPropagation();
			}).children().hide();
		});
	},
	//radio 美化(radio被包含在lable里面).over  
	
	//评分 保留一位小数点 start
	grade2: function (options) {
		$(this).click(function (ev) {
			var iNum = (ev.pageX - $(this).offset().left) / $(this).width();
			if(iNum > 0.9) {
				iNum = 1;
			} else if(iNum < 0.1) {
				iNum = 0;
			}
			$(this).children('.grade_inner').css('width', parseInt(iNum * 70)).parents('.grade_wrap').find('i').text((iNum * 5).toFixed(1)).parents('.grade_wrap').find('input').val((iNum * 5).toFixed(1));
		});
	},
	//改版select
	Selebox:function(){
		$(this).each(function() {
            var Myobj = $(this);		
			var Ocur = Myobj.find(".qjf_selecur");
			var Odrop = Myobj.find(".qjf_seledrop");
			var Owidth = Myobj.width();				
			Myobj.click(function(ev){
				$(this).css("z-index",2);									
				Odrop.css({'z-index':9999,width:Owidth}).toggle();
				if($.browser.msie&&parseInt($.browser.version) <= 6&&Myobj.find(".qjf_seledrop").height()>196)
				{
					Myobj.find(Odrop).css("height","196px")
				}
				$(".qjf_selediv").not($(this)).css("z-index",1);
				$(".qjf_selediv").not($(this)).find(".qjf_seledrop").hide();
				ev.stopPropagation();
				$(document).click(function(){
					$(".qjf_seledrop").hide();	
				})
			});
			Ocur.width($(this).width()>Owidth?$(this).outerWidth():Owidth).hover(
				function(){$(this).addClass("bluebor")},
				function(){$(this).removeClass("bluebor")}
			);
			Odrop.find("a").click(function(){
				Ocur.find("p").html($(this).html());
				Odrop.hide();
				return false;
			});
			
        });	
	},
	SeleautoBox:function(){
		$(this).each(function() {    
				        
			$(".qjf_seleautocur").hover(
				function(){$(this).addClass("bluebor")},
				function(){$(this).removeClass("bluebor")}
			);
			var Myobj = $(this);
			var oInp = Myobj.find('input.selRes');
			Myobj.find(".qjf_seleautodrop a").each(function () {
				if($(this).hasClass('active')) {
					Myobj.find(".qjf_seleautocur p").html($(this).html());
					if(oInp[0]) oInp.val($(this).attr('value'));
					return false; 
				}
			});
			Myobj.unbind().live('click',function(ev){
				var Ocur = $(this).find(".qjf_seleautocur");
				var Odrop = $(this).find(".qjf_seleautodrop");	
				var Owidth = $(this).width();	
						
				$(this).css("z-index",3);							
				Odrop.toggle(0,function(){
					$(this).css({'z-index':9999,"width":parseInt(Odrop.css('width'))>Owidth?Odrop.css('width'):Owidth});					
				});				
				if($.browser.msie&&parseInt($.browser.version) <= 6&&Myobj.find(".qjf_seleautodrop").height()>196 && !$.support.style)
				{
					Myobj.find(Odrop).css({"height":"196px","overflow-y":"scroll"});
				}
				$(".qjf_seleautodiv").not($(this)).css("z-index",1);
				$(".qjf_seleautodiv").not($(this)).find(".qjf_seleautodrop").hide();				
				ev.stopPropagation();
				$(document).click(function(){
					$(".qjf_seleautodrop").hide();	
				});				
				Odrop.find("a").live('click', function(){
					Ocur.find("p").html($(this).html());
					Odrop.hide();
					$(this).addClass('active').siblings().removeClass('active');
					if(oInp[0]) oInp.val($(this).attr('value'));
					return false;
				});
			});		
        });	
	},
	DldropBox:function(parmtit,parmcon){
		var Myobj = $(this),Ocur = $(this).find(parmtit),Odrop = $(this).find(parmcon),Owidth = $(this).width();
		Ocur.hover(function(){$(this).addClass("bluebor")},function(){$(this).removeClass("bluebor")});
		Myobj.each(function(){   				
			$(this).click(function(ev){
				$(this).css("z-index",Myobj.length);					
				Odrop.toggle(0,function(){$(this).css({"z-index":Myobj.length+1,"width":Odrop.width()>Owidth?Odrop.width():Owidth});});	
				if($.browser.msie&&parseInt($.browser.version) <= 6&&Odrop.height()>196 && !$.support.style)
				{
					Odrop.css({"height":"196px","overflow-y":"scroll"});
				}
				Myobj.not($(this)).css("z-index",0);					
				Myobj.not($(this)).find(Odrop).hide();				
				ev.stopPropagation();
				$(document).click(function(){Odrop.hide();});				
				Odrop.find("a").click(function(){
					$(this).parents('dd').siblings('dt').find("em").html($(this).html());
					Odrop.hide();
					return false;
				});
			});		
		});	
	},//传参下自适应模拟下拉
	//分页跳转框输入弹出效果
	inputPageFocus:function(opts){
		  var set = $.extend({
		    btnClass:''
		  },opts||{});
		  var btnClass = set.btnClass;
		  var This = $(this);
		  This.live('click',function(ev){
			  $(this).next(btnClass).stop(true).animate({'left':36});
			  ev.stopPropagation();
		  });
		  $(document).live('click', function (){
		  	 This.next(btnClass).stop(true).animate({'left':0});
		  });
	},
	//数据联动 - 下拉匹配
	downMatching: function (arr) {
		var oInp = $(this).find('.inp');
		var oFlow = $(this).find('.downFlow');
		var sAllHtml = '';
		var iNum = -1;
		
		for(var i = 0; i < arr.length; i++) {
			sAllHtml += '<a href="javascript:void(0)" groupid="' + arr[i][1] + '">' + arr[i][0] + '</a>';
		}
		
		oFlow.html(sAllHtml);
		
		oFlow.css('top', oInp.outerHeight(true));
		oInp.focus(function () {
			oFlow.show();
			matching();
		}).click(function (event) {
			event.stopPropagation();
		});
		
		if(window.addEventListener) {
			oInp[0].addEventListener('input', function () {
				matching();
			}, false);
		} else {
			oInp[0].attachEvent('onpropertychange', function () {
				matching();
			});
		}
		
		oFlow.find('a').live('click', function() {
			oInp.val($(this).text()).attr('groupid', $(this).attr('groupid'));
			oFlow.hide().html('');
		});	
		
		$(document).click(function () {
			oFlow.hide().html('');
		});
		
		oInp.live('keydown', function (event) {
			var iHeight = oFlow.find('a').height();
			if(event.keyCode == 40) {
				iNum++;
				if(iNum >= oFlow.find('a').length) {
					iNum = 0;
					oFlow.scrollTop(0);
				}
				if(iNum >= 5) {
					oFlow.scrollTop((iNum - 4) * iHeight);
				}
				oFlow.find('a').eq(iNum).addClass('active').siblings().removeClass('active');
			} else if (event.keyCode == 38) {
				iNum--;
				if(iNum < 0) {
					iNum = oFlow.find('a').length - 1;
				}
				if(iNum >= 5) {
					oFlow.scrollTop((iNum - 4) * iHeight);
				} else if (iNum < 5) {
					oFlow.scrollTop(0);
				}
				oFlow.find('a').eq(iNum).addClass('active').siblings().removeClass('active');
			} else if (event.keyCode == 13) {
				oInp.val(oFlow.find('a').eq(iNum).html());
				iNum = -1;
				oFlow.scrollTop(0).hide().html('');
			}
		});
		
		function matching() {
			if(oInp.val() != '') {
				var aRes = oInp.val().split(' ');
				var sHtml = '';
				for(var j = 0; j < aRes.length; j++) {
					var res = eval('/'+aRes[j]+'/ig');
					for(var i = 0; i < arr.length; i++) {
						if(arr[i][0].match(res) != null) {
							if(!arr[i][2]) {
							sHtml += '<a href="javascript:void(0)" groupid="' + arr[i][1] + '">' + arr[i][0] + '</a>';
							}
							arr[i][2] = true;
						}
					}
				}
				
				for(var n = 0; n < arr.length; n++) {
					arr[n][2] = false;
				}
				if(sHtml == '') {
					oFlow.hide();
				} else {
					oFlow.show().html(sHtml);
				}
			} else {
				oFlow.show().html(sAllHtml);
			}
			iNum = -1;
		}
	}
});

//执行分页跳转框输入弹出效果
$(function(){
	$(".num_text").inputPageFocus({
	  btnClass:'.anim'
	});
});


//居中
function center(obj,style, pos) {
	var _obj=obj;
	var screenWidth = $(window).width(), screenHeight = $(window).height(); 
	var scrolltop = $(document).scrollTop();
	var objLeft = (screenWidth - obj.width())/2 + 'px';
	var objTop = (screenHeight - obj.outerHeight(true))/2 + scrolltop + 'px';
	obj.css({position:'fixed',left: objLeft, top: objTop,'display': 'block'});
	if($.browser.msie&&parseInt($.browser.version) <= 6&& !$.support.style)
	{
		obj.css({'position':'absolute'});	
	}
	if(true==style){
		objTop = (screenHeight - obj.outerHeight(true))/2+'px';
		obj.css({top:objTop});
		if(pos && typeof pos.top == 'number') { obj.css('top', pos.top); }
		if(pos && typeof pos.left == 'number') { obj.css('left', pos.left); }
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { 
			$(window).bind('scroll', function() { 
				objTop = (screenHeight - obj.outerHeight(true))/2 + $(document).scrollTop()+'px';
				obj.css({top:objTop});
				if(pos && typeof pos.top == 'number') { obj.css('top', $(document).scrollTop() + pos.top); }
			});
			objTop = ($(window).height() - obj.outerHeight(true))/2 + $(document).scrollTop()+'px';
			obj.css({top:objTop});	
			if(pos && typeof pos.top == 'number') { obj.css('top', $(document).scrollTop() + pos.top); }
		}
	}else{
		$(window).unbind('scroll');
	}
}	
function middcen(Opo,style){
	var OpoLeft = ($(window).width() - Opo.width())/2+'px';
	var OpoTop = ($(window).height() - Opo.outerHeight(true))/2 + $(document).scrollTop()+'px';
	Opo.css({'position':'fixed',left:OpoLeft, top: OpoTop,'z-index':999999,'display':'block'});
	if($.browser.msie&&parseInt($.browser.version) <= 6&& !$.support.style)
	{
		Opo.css({'position':'absolute'});	
	}	
	$("body").append('<div id="Wscreen"></div');
	$("#Wscreen").css({'position':'absolute','left':0,'top':0,'display':'block','width':'100%','height':$(document).height()});
	if(true==style){		
		OpoTop = ($(window).height() - Opo.outerHeight(true))/2+'px'
		Opo.css({top:OpoTop});
		
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { 
			$(window).bind('scroll', function() { 			
				OpoTop = ($(window).height() - Opo.outerHeight(true))/2 + $(document).scrollTop()+'px';
				Opo.css({top:OpoTop});
			});	
			OpoTop = ($(window).height() - Opo.outerHeight(true))/2 + $(document).scrollTop()+'px';
			Opo.css({top:OpoTop});
		} 
	}else{
		$(window).unbind('scroll');
	}
}
/*淡入淡出小弹出居中位置*/
function rewardjum(obj,style){
	var objLeft = ($(window).width() - obj.width())/2 + 'px' ;
	var objTop = ($(window).height() - obj.outerHeight(true))/2 + $(document).scrollTop() + 'px';
	obj.css({'position':'fixed',left:objLeft, top: objTop,'z-index':999999,'display':'block'});
	if($.browser.msie&&parseInt($.browser.version) <= 6&& !$.support.style)
	{
		obj.css({'position':'absolute'});	
	}	
	if(true==style){
		objTop = ($(window).height() - obj.outerHeight(true))/2 + 'px';
		obj.css({top:objTop});
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { 
			$(window).bind('scroll', function() { 
				objTop = ($(window).height() - obj.outerHeight(true))/2 + $(document).scrollTop() + 'px';
				obj.css({top:objTop});
			});	
			objTop = ($(window).height() - obj.outerHeight(true))/2 + $(document).scrollTop() + 'px';
			obj.css({top:objTop});
		}
	}else{
		$(window).unbind('scroll');
	}
}

//clear placeholder
(function(f,h,$){var a="placeholder" in h.createElement("input"),d="placeholder" in h.createElement("textarea"),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":b,"blur.placeholder":e}).data("placeholder-enabled",true).trigger("blur.placeholder");return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data("placeholder-enabled")&&l.hasClass("placeholder")?"":m.value},set:function(m,n){var l=$(m);if(!l.data("placeholder-enabled")){return m.value=n}if(n==""){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass("placeholder")){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate("form","submit.placeholder",function(){var l=$(".placeholder",this).each(b);setTimeout(function(){l.each(e)},10)})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr("placeholder")&&o.hasClass("placeholder")){if(o.data("placeholder-password")){o=o.hide().next().show().attr("id",o.removeAttr("id").data("placeholder-id"));if(m===true){return o[0].value=n}o.focus()}else{l.value="";o.removeClass("placeholder");l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==""){if(l.type=="password"){if(!p.data("placeholder-textinput")){try{q=p.clone().attr({type:"text"})}catch(n){q=$("<input>").attr($.extend(g(this),{type:"text"}))}q.removeAttr("name").data({"placeholder-password":true,"placeholder-id":o}).bind("focus.placeholder",b);p.data({"placeholder-textinput":q,"placeholder-id":o}).before(q)}p=p.removeAttr("id").hide().prev().attr("id",o).show()}p.addClass("placeholder");p.attr("isInit",true);p[0].value=p.attr("placeholder")}else{p.removeClass("placeholder")}}}(this,document,jQuery));$(function(){$("input, textarea").placeholder();if(!window.addEventListener){$(document).ajaxStop(function(){var inputs=$("input, textarea");inputs.each(function(index){if(!$(this).attr("isInit")&&!$(this).data("placeholder-enabled")){$(this).placeholder()}})})}});

/*
* 20161021
* by chentian
* */
(function ($) {
	$.more=function (currentDOM,showDom) {
		currentDOM.each(function () {
			$(this).on('mouseenter mouseleave',function (event) {
				if(event.type=='mouseenter'){
					$(this).find(showDom).show();
				}else if(event.type=='mouseleave'){
					$(this).find(showDom).hide();
				}

			});
		});
	}
})(jQuery);