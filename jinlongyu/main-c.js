$.ajax({
	//要用post方式      
	type: "get",
	//方法所在页面和方法名      
	url: "http://my.liveapp.cn/open/interface/get_jsconfig?url=xxx",
	async: true,
	success: function(data) {
		var configDate = $.parseJSON(data);
		wx.config({
			debug: false,
			appId: configDate.data.appId,
			timestamp: configDate.data.timestamp,
			nonceStr: configDate.data.nonceStr,
			signature: configDate.data.signature,
			jsApiList: ['checkJsApi', 'onMenuShareTimeline',
				'onMenuShareAppMessage', 'onMenuShareQQ',
				'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems',
				'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
				'translateVoice', 'startRecord', 'stopRecord',
				'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice',
				'uploadVoice', 'downloadVoice', 'chooseImage',
				'previewImage', 'uploadImage', 'downloadImage',
				'getNetworkType', 'openLocation', 'getLocation',
				'hideOptionMenu', 'showOptionMenu', 'closeWindow',
				'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
				'addCard', 'chooseCard', 'openCard'
			]
		});
	},
	error: function(err) {
		alert("error");
	}
});
var ww = wh = imgw = imgh = 0;
var curli;
var cut_w = 280,
	cut_h = 350; //cut-width,height
var theimg = new Image();
var cur_imgw = cur_imgh = 0;
var scale_s = cur_scale = 1,
	translateX = 0,
	translateY = 0,
	curx = cury = rate_deg = 0,
	ctx_w, ctx_h;
var overf = touct = false;
var thecover, ctx;
var result_imgsrc = '';
var pic_url = ''; //图片服务器地址
var resResutl = '';
var gets = 0;
var share_data = {
	link: window.location,
	img: 'images/logo.jpg',
	title: window.title,
	desc: ''
};
var _transform='';
$(function() {
	ww = $(window).width();
	wh = $(window).height();
	cover_h = wh - 100;
	$('#cut_wrap').height(cover_h);
	
	////获取分享内容
	$.ajax({
		url: "../rest/v1/upload/getUserUpload/" + $("#openId").val(),
		dataType: 'json',
		success: function(res) {
			var prms = res;
			if (res.result == 1) {
				$('#loadingwrap').hide();
				spage('page_card');
				$('#page_card .gmum img').attr('src', '../' + res.imagMap['gmum'] || '');
				$('#page_card .mum img').attr('src', '../' + res.imagMap['mum'] || '');
				$('#page_card .gfath img').attr('src', '../' + res.imagMap['gfath'] || '');
				$('#page_card .fath img').attr('src', '../' + res.imagMap['fath'] || '');
				$('#page_card .child img').attr('src', '../' + res.imagMap['child'] || '');
				var zf = res.content ? decodeURI(res.content) : '祝你年年都有鱼+羊，天天都是小鲜肉！';
				$('#page_card .card_wrap').show().find('.card_detail span').html(zf);
				return;
			} else {
				setTimeout(function() {
					$('#loadingwrap').hide();
					spage('page1');
				}, 1500)
			}
		},error:function(a,b,c){
			setTimeout(function() {
				$('#loadingwrap').hide();
					spage('page1');
				}, 1500)
		}
	});

	$('#page1').on('touchstart', function() {
		$('#music span').removeClass('pause');
		document.getElementById('audio').play();
	});
	var page1=document.getElementById("page1");
	var page1_pich=new Hammer.Manager(page1);
	page1_pich.add(new Hammer.Pan({
		threshold: 0,
		pointers: 0
	}));
	page1_pich.add(new Hammer.Rotate({
		threshold: 0
	})).recognizeWith(mc.get('pan'));
	page1_pich.add(new Hammer.Pinch({
		threshold: 0
	}));
	page1_pich.on("pinchstart pinchmove", page1_pinchon);
	page1_pich.on("pinchend", page1_pinchoff);
	var page1_pinchon=function(e){
		var scale=e.scale;
	};
	var page1_pinchoff=function(e){
		var scale=e.scale;
		if(scale>0){
			alert('放大打开')
		}else{
			alert('缩小')
		}
	}
	/*
	.on('touchmove', function(e) {
		var event = e.originalEvent;
		var touches = event.touches;
		if (touches.length == 2) {
			var x1 = touches[0].clientX;
			var y1 = touches[0].clientY;
			var x2 = touches[1].clientX;
			var y2 = touches[1].clientY;
			var dis = Math.pow((Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)), 0.5);
			if (dis >= ww / 3 && Math.abs(x1 - x2) > 5 * Math.abs(y1 - y2)) {
				$('#page1').addClass('acthide');
				setTimeout(function() {
					$('#page1').removeClass('acthide');
					spage('page2');
				}, 1000)
			}

		}

	});*/
	$('#jly_wrap ,.maincnt').height(wh);
	$('.select_topic li i').on('click tap', function() {
		$(this).siblings('input').trigger('click')
	});
	$('#card_write_zf select').change(function() {
		var v = $(this).val();
		$('#select span').html($(this).find('option:selected').html());
		$('#textarea textarea').val(v);
		ck_txt();
	});
	$('#card_write_zf textarea').change(function() {
		ck_txt();
	})
});

function ck_txt() {
	var zf = $('#card_write_zf textarea').val();
	if (zf == '') {
		$('#card_wrap .page_btn span').html('制作贺卡');
		return 0;
	} else {
		$('#card_wrap .page_btn span').html('保存');
		return 1;
	}
}
;
function mplay(o) {
		$(o).toggleClass('pause');
		if ($(o).hasClass('pause')) {
			document.getElementById('audio').pause();
		} else {
			document.getElementById('audio').play();
		}
	};
	//page，弹窗内容
function page2_detail(i, c) {
		$('.page_d').removeClass('dshow');
		if (!c) {
			$('#page2_d' + i).addClass('dshow');
		}
};
	//显示主体

function spage(page) {
	$('.maincnt').hide();
	$('#' + page).show();
};
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
		share_data.desc = zf; //分享内容
		share_data.title = zf;
		$('#wx_share').toggle();
		return;
	}
	document.title = zf;
	$.ajax({
		url: "../rest/v1/upload/saveContent/" + $("#openId").val() + '/' + zf,
		success: function(result) {
		}
	});
	$('#card_write_zf').hide();
	$('#card_wrap .topic').removeClass('select_topic');
	$('#card_wrap .card_wrap').show().find('.card_detail span').html(zf);
	$(o).html('分享贺卡');
	gets = 1;
};

function notimg(name, size, type) {
	//return false;有的手机获取name为type，type为空,多坑爹啊
	//if(!(/\.(?:jpg|JPG|png|gif)$/.test(name)||/image\/\w+/.test(file.type))){
	if ((size / Math.pow(1024, 3)) > 5) {
		return true;
	}
};

function getUrlVars() {
		var vars = [];
		$.ajax({
			url: "../rest/v1/upload/getUserUpload/" + $("#openId").val(),
			dataType: 'json',
			success: function(res) {
				if (res.result == 1) {
					vars = res.imagMap;
					vars.push('zf', res.content)
				}
			}
		});
		return vars;
	}
	//--------------
wx.ready(function() {
	document.querySelector('#onMenuShareAppMessage').onclick = function() {
		wx.onMenuShareAppMessage({
			title: share_data.title,
			desc: share_data.desc,
			link: share_data.link,
			imgUrl: share_data.img,
			trigger: function(res) {
				alert('用户点击发送给朋友');
			},
			success: function(res) {
				alert('已分享');
			},
			cancel: function(res) {
				alert('已取消');
			},
			fail: function(res) {
				alert(JSON.stringify(res));
			}
		});
		alert('已注册获取“发送给朋友”状态事件');
	};
});
//style
var _elementStyle = document.createElement('div').style;
var _vendor = (function() {
	var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
		transform,
		i = 0,
		l = vendors.length;
	for (; i < l; i++) {
		transform = vendors[i] + 'ransform';
		if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
	}
	return false;
})();

function _prefixStyle(style) {
	if (_vendor === false) return false;
	if (_vendor === '') return style;
	return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
};
 _transform = _prefixStyle('transform');