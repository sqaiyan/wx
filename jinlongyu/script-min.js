function upalbumal(obj) {
	var openId = $("#openId").val();
	var files = obj.files;
	if (window.FileReader) {
		//opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
		var reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onerror = function() {
			alert('读取文件出错，请重试！');
			$('#canvas').hide();
		};
		reader.onload = function(e) {
			if (notimg(files[0].name, e.total)) {
				alert('请选择5m以内的图片');
				return;
			}
			result_imgsrc = this.result;
			theimg.src = this.result;
			theimg.onload = function() {
				theimg.id = 'cut_img';
				$('#cut_wrap').find('img').remove();
				$('#cut_wrap').append(theimg);
				curli = obj.name;
				cutimg();
			}
		}
	} else if (window.URL) {
		result_imgsrc = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
		theimg.src = result_imgsrc;
		theimg.onload = function(e) {
			window.URL.revokeObjectURL(this.src); //图片加载后，释放object URL
			if (notimg(files[0].name, files[0].size)) {
				alert('请选择5m以内的图片');
				return;
			}
			theimg.id = 'cut_img';
			$('#cut_wrap').find('img').remove();
			$('#cut_wrap').append(theimg);
			curli = obj.name;
			cutimg();
		}
	} else {
		alert('手机不支持读取本机照片');
	}
};
var curdeg = 0,
	cur_scale = 1,
	isanimate=false;

function cutimg() {
	$('#canvas').show();
	//$('#cut_cover').bind('touchy-rotate', rotate);
	//$('#cut_cover').bind('touchy-pinch', handleTouchyPinch);
	//$('#cut_cover').bind('touchy-drag', handleTouchyDrag);
	var el = document.getElementById("cut_cover");
	var mc = new Hammer.Manager(el);
	mc.add(new Hammer.Pan({
		threshold: 0,
		pointers: 0
	}));
	mc.add(new Hammer.Rotate({
		threshold: 0
	})).recognizeWith(mc.get('pan'));
	mc.add(new Hammer.Pinch({
		threshold: 0
	})).recognizeWith([mc.get('pan'), mc.get('rotate')]);
	mc.on("panstart panmove", onPan);
	mc.on("panend", onPanend);
	mc.on("rotatestart rotatemove", onRotate);
	mc.on("rotateend", onRotateend);
	mc.on("pinchstart pinchmove", onPinch);
	mc.on("pinchend", onPinchend);
};
var onPan = function(ev) {
	curx = translateX + ev.deltaX;
	cury = translateY + ev.deltaY;
	resetimg();
};
var onPanend = function(ev) {
	translateX = curx;
	translateY = cury;
};
var onRotate = function(e) {
	curdeg = rate_deg + e.rotation;
	resetimg();
};
var onRotateend = function(e) {
	rate_deg = curdeg;
};
var onPinch = function(e) {
	cur_scale = scale_s * e.scale;
	cur_scale = cur_scale > 4 ? 4 : (cur_scale < 0.2 ? 0.2 : cur_scale);
	resetimg();
};
var onPinchend = function(e) {
	scale_s = cur_scale;
};
var reqAnimationFrame = (function () {
	    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
	        window.setTimeout(callback, 1000 / 60);
	    };
	})();
function resetimg() {
	reset_img();
//	if(!isanimate){
//	reqAnimationFrame(reset_img);
//		isanimate=true;
//	}
};
function reset_img(){
	$('#cut_img').css(_transform, 'translate(' + curx + 'px, ' + cury + 'px) scale(' + cur_scale + ',' + cur_scale + ') rotate(' + curdeg + 'deg)');
	isanimate=false;
}
	//关闭

function cutexit() {
	$('#canvas').hide();
	translateX =curx=translateY =cury=rate_deg=curdeg = 0,
	scale_s =cur_scale= 1;
	overf = touct = false;
	$('#card_wrap a:first').html('确定').siblings('a').show();
	$('#cut_img').attr('src','').css(_transform, 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale_s + ',' + scale_s + ') rotate(' + rate_deg + 'deg)');
}

function cutok() {
		if (theimg.width > 640) {
			imgw = 640;
			imgh = (theimg.height * 640) / (theimg.width);
		} else {
			imgw = theimg.width;
			imgh = theimg.height;
		}
		var i = new Image();
		var tempcanvas = document.createElement('canvas');
		var tempctx = tempcanvas.getContext('2d');
		tempcanvas.width = ww;
		tempcanvas.height = wh - 100;
		tempctx.fillStyle = 'rgba(255,255,255,.1)'; //填充
		tempctx.fillRect(0, 0, ww, (wh - 100));
		tempctx.translate(translateX + imgw / 2, translateY + imgh / 2);
		tempctx.scale(scale_s, scale_s);
		tempctx.rotate(rate_deg * Math.PI / 180);
		tempctx.drawImage(theimg, -imgw / 2, -imgh / 2, imgw, imgh);
		i.src = tempcanvas.toDataURL();
		i.onload = function() {
			var res = document.createElement('canvas');
			var res_ctx = res.getContext('2d');
			res.width = cut_w; //中间圆圈可是区域宽高
			res.height = cut_h;
			res_ctx.drawImage(i, -(ww - cut_w) / 2, -(wh - 100 - cut_h) / 2, i.width, i.height);
			var reimg = new Image();
			var rdata = res.toDataURL();
			reimg.src = rdata;
			reimg.onload = function() {
				$('.select_topic .' + curli).find('.cur_wrap').html(reimg);
				var openId = $("#openId").val();
				var data = new FormData();
				data.append('id', openId);
				data.append('name', curli);
				data.append('file', rdata);
				$('#card_wrap a:first').html('loading...').siblings('a').hide();
				cutexit();
//				$.ajax({
//					url: '../rest/v1/upload/uploadFile',
//					type: 'POST',
//					data: data,
//					processData: false, // 告诉jQuery不要去处理发送的数据
//					contentType: false, // 告诉jQuery不要去设置Content-Type请求头
//					success: function(ret) {
//						//$('#' + curli + '_i').attr('src','../'+ret.filePath);
//						cutexit();
//					},
//					error: function(a, b, c) {
//						$('.select_topic .' + curli).find('.cur_wrap').html('');
//						cutexit();
//						alert('存储失败');
//					}
//				})
			}
		}
	}
	/*

	var rotate = function(e, phase, $target, data) {
		if (phase === 'move') {
			if (!touct) {
				return;
			}
			rate_deg += data.degreeDelta;
			$('#cut_img').css(_transform, 'translate(' + curx + 'px, ' + cury + 'px) scale(' + scale_s + ',' + scale_s + ') rotate(' + rate_deg + 'deg)');
		}

	};
	//拖动
	var handleTouchyDrag = function(event, phase, $target, data) {
		var movePoint = data.movePoint,
			startPoint = data.startPoint,
			velocity = data.velocity;
		switch (phase) {
			case 'start':
				break;
			case 'move':
				touct = false;
				curx = (translateX + movePoint.x - startPoint.x);
				cury = (translateY + movePoint.y - startPoint.y);
				$('#cut_img').css(_transform, 'translate(' + curx + 'px, ' + cury + 'px) scale(' + scale_s + ',' + scale_s + ') rotate(' + rate_deg + 'deg)');
				break;
			case 'end':
				translateX = curx;
				translateY = cury;
				$('#cut_img').css(_transform, 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale_s + ',' + scale_s + ') rotate(' + rate_deg + 'deg)');
				break;
		}
	};
	//缩放
	var handleTouchyPinch = function(e, $target, data) {
		if (scale_s * data.scale > 4 || scale_s * data.scale < 0.2) return;
		scale_s = scale_s * data.scale;
		touct = true;
		$('#cut_img').css(_transform, 'translate(' + curx + 'px, ' + cury + 'px) scale(' + scale_s + ',' + scale_s + ') rotate(' + rate_deg + 'deg)');

	};
	 */