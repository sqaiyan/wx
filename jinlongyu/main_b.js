var ww = $(window).width();
var wh = $(window).height();
var pic_url='';//图片服务器地址
var resResutl='';
var share_data = {
	link: window.location,
	img: 'images/logo.jpg',
	title: window.title,
	desc: ''
}
$(function() {
	$(document).snowfall({ flakeCount:100,minSize:3});//雪花
	var prms = '';
	$.ajax({ 
		url: "../rest/v1/upload/getUserUpload/"+$("#openId").val(), 
		 dataType:'json',
		success: function(res){
		prms=res;
      }});
	setTimeout(function() {
		$('#loadingwrap').hide();
		//获取分享内容
		if (prms.result==1) {
			spage('page_card');
			//栗子url:?zf=fdfwerwer&gmum=arrow.jpg&mum=ferwr.png
			$('#page_card .gmum').css('background-image', 'url('+pic_url+'../' + prms.imagMap['gmum'] + ')').
			siblings('.mum').css('background-image', 'url('+pic_url+'../' + prms.imagMap['mum'] + ')').
			siblings('.gfath').css('background-image', 'url('+pic_url+'../' + prms.imagMap['gfath'] + ')').
			siblings('.fath').css('background-image', 'url('+pic_url+'../' + prms.imagMap['fath'] + ')').
			siblings('.child').css('background-image', 'url('+pic_url+'../' + prms.imagMap['child'] + ')');
			var zf = prms.content? decodeURI(prms.content) : '祝福捻成绒线，为您织一件红色毛衣，前身是平安后身是幸福；吉祥是肩膀，如意在袖子里；领子蕴藏体贴，口袋盛满快乐！让我的心陪伴你度过新年！';
			$('#page_card .card_wrap').show().find('.card_detail span').html(zf);
			return;
		}
		spage('page1');
	}, 100)
	$('#page1').on('click', function(e) {
			$('#page1').addClass('acthide');
				setTimeout(function() {
					$('#page1').removeClass('acthide');
					spage('page2')
				}, 1000)
		
		return;
		var event = e.originalEvent;
		var touches = event.touches;
		if (touches.length==2) {
			var x1 = touches[0].clientX;
			var y1 = touches[0].clientY;
			var x2 = touches[1].clientX;
			var y2 = touches[1].clientY;
			var dis = Math.pow((Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)), 0.5);
			if (dis >= ww / 3 && Math.abs(x1 - x2) > 5 * Math.abs(y1 - y2)) 
			{
				$('#page1').addClass('acthide');
				setTimeout(function() {
					$('#page1').removeClass('acthide');
					spage('page2');
				}, 1000)
			}

		}

	});
	$('#jly_wrap ,.maincnt').height(wh);
	$('.pd_cnt').height(wh-120);
	$('#card_write_zf select').change(function() {
		var v = $(this).val();
		$('#select span').html($(this).find('option:selected').html())
		$('#textarea textarea').val(v);
		ck_txt();
	});
	$('#card_write_zf textarea').change(function(){
		
		ck_txt();
	})
});
function ck_txt(){
	var zf=$('#card_write_zf textarea').val();
		if(zf==''){
			$('#card_wrap .page_btn span').html('制作贺卡');
			return 0;
		}else{
			$('#card_wrap .page_btn span').html('保存');
			return 1;
		}
}
function mplay(o){
	$(o).toggleClass('pause')	
	if($(o).hasClass('pause')){
		document.getElementById('audio').pause();
	}else{
		document.getElementById('audio').play();
	}
}
//page，弹窗内容
function page2_detail(i, c) {
	$('.page_d').removeClass('dshow');
	if (!c) {
		$('#page2_d' + i).addClass('dshow');
	}
}
//显示主体
function spage(page) {
	$('.maincnt').hide();
	$('#' + page).show();
}
var gets = 0;
//提交祝福语
function page3_make(o) {
		var zf = $('#card_write_zf textarea').val();
		if (!ck_txt()) {
			alert("千言万语都是情，总结一句行不行？");
			$('#card_write_zf textarea').focus();
			return;
		}
		if (gets) {
			var bjp = $('#card_wrap');
			//分享链接
			share_data.link = share_data.link + '?zf=' + zf + '&gmum=' + bjp.find('.gmum').data('imglink') + '&mum=' + bjp.find('.mum').data('imglink') + '&gfath=' + bjp.find('.gfath').data('imglink') + '&fath=' + bjp.find('.fath').data('imglink') + '&child=' + bjp.find('.child').data('imglink');
			share_data.desc = zf;//分享内容
			document.title=share_data.desc;
			$('#wx_share').toggle();
			return;
		}
		$.ajax({ url: "../rest/v1/upload/saveContent/"+$("#openId").val()+'/'+zf, success: function(result){
			
	      }});
		$('#card_write_zf').hide();
		$('#card_wrap .topic').removeClass('select_topic');
		$('#card_wrap .card_wrap').show().find('.card_detail span').html(zf);
		$(o).html('分享贺卡');
		gets =1;
	}
	//图片及时预览	
window.URL = window.URL || window.webkitURL;

//请返回imglink(test.jpg) 作为背景图片赋值给对应父元素li，一并赋值data-imglink属性
//$(obj).parents('li').css('background-image','url('+pic_url+'/images/'+imglink+')').data('imglink',imglink)
function upalbum(obj) {
	var openId = $("#openId").val();
	var files = obj.files,
		img = new Image();
	if (window.URL) {
		//  alert(files[0].name + "," + files[0].size + " bytes");
		img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
		img.onload = function(e) {
			window.URL.revokeObjectURL(this.src); //图片加载后，释放object URL
			if (notimg(files[0].name, files[0].size)) {
				alert('请选择5m以内的图片');
				return;
			}
			var data = new FormData();
		    data.append('id', openId);
		    data.append('name', obj.name);
		    data.append('file', files[0]);
		    $.ajax({
		        url: '../rest/v1/upload/uploadFile',
		        type: 'POST',
		        data: data,
		        processData: false,  // 告诉jQuery不要去处理发送的数据
		        contentType: false  // 告诉jQuery不要去设置Content-Type请求头
		    }).done(function(ret){
		        ret.filePath=ret.filePath||1;
			    addimg(ret.filePath,obj.name);
		    });
//			addimg(obj, img)
		}
		img.onerror = function() {
			alert('请选择一个图片文件');
		}
	} else if (window.FileReader) {
		//opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
		var reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = function(e) {
			//alert(files[0].name + ",```````````````" +e.total + " bytes");
			if (notimg(files[0].name, e.total)) {
				alert('请选择5m以内的图片');
				return;
			}
			img.src = this.result;
			// $(obj).parents('li').css('background-image','url('+this.result+')')
//			addimg(obj, img);
			var data = new FormData();
		    data.append('id', openId);
		    data.append('name', obj.name);
		    data.append('file', files[0]);
		    $.ajax({
		        url: '../rest/v1/upload/uploadFile',
		        type: 'POST',
		        data: data,
		        processData: false,  // 告诉jQuery不要去处理发送的数据
		        contentType: false  // 告诉jQuery不要去设置Content-Type请求头
		    }).done(function(ret){
		        if (ret.result=='0') {
		           ret.filePath=ret.filePath||1;
			    addimg(ret.filePath,obj.name);
		        }
		    });
			img.onerror = function() {
				$(obj).siblings('img').remove();
				alert('请选择一个图片文件');
			}

		}
	} else {
		//ie
		obj.select();
		obj.blur();
		var nfile = document.selection.createRange().text;
		document.selection.empty();
		img.src = nfile;
		img.onload = function() {
			// alert(nfile+","+img.fileSize + " bytes");
			if (notimg(nfile, img.fileSize)) {
				alert('请选择5m以内的图片nnnnnnnn');
				return;
			}
			var data = new FormData();
		    data.append('id', openId);
		    data.append('name', obj.name);
		    data.append('file', files[0]);
		    $.ajax({
		        url: '../rest/v1/upload/uploadFile',
		        type: 'POST',
		        data: data,
		        processData: false,  // 告诉jQuery不要去处理发送的数据
		        contentType: false  // 告诉jQuery不要去设置Content-Type请求头
		    }).done(function(ret){
		        if (ret.result=='0') {
		        	ret.filePath=ret.filePath||1;
			   		 addimg(ret.filePath,obj.name);
		        }
		    });
//			addimg(obj, img)
		}
	}
}

function notimg(name, size, type) {
	//return false;有的手机获取name为type，type为空,多坑爹啊
	//if(!(/\.(?:jpg|JPG|png|gif)$/.test(name)||/image\/\w+/.test(file.type))){
	if ((size / Math.pow(1024, 3)) > 5) {
		return true;
	}
}

function addimg(src,pclass) {
	var li = $('#card_wrap .select_topic .'+pclass);
	if(src==1){
		li.css('background-images','url(images/add_album.png)');
	}else{
		li.css('background-images','url(../'+src+')').data('imglink',src);	
		ck_txt()
	}
}


function getUrlVars() {
	var vars = [];
	$.ajax({ 
		url: "../rest/v1/upload/getUserUpload/"+$("#openId").val(), 
		 dataType:'json',
		success: function(res){
		if(res.result==1){
			vars=res.imagMap;
			vars.push('zf',res.content)
		}
      }});
	return vars;
}