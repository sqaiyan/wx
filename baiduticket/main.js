var step = 0;
var touchdown = 0;
var downY = 0;
var downY2 = 0;
var moveY = 0;
var moveing = 0;
var moveTop = 0;
var upORdown = 0;
var onoff = false;
var HH = $(window).height();
var ud = "";
var touchsize = $('#animwrap .anim-swip').size();
var obj = document.getElementById("ticket_wrap");
function notnull(i){
	return (''!=i)&&(i!='undefined')
}

$(function() {
	var params = getUrlVars();
	var start=params['start'];
	var end=params['end'];
	var triptime=params['gotime'];
	triptime=decodeURI(triptime)
	var d=new Date(triptime);
	if(notnull(start)&&(notnull(end)&notnull(triptime))&&(d!='Invalid Date')){
		showticket(start,end,triptime,d)
	}else{
		setTimeout(function() {
								page_init();
								}, 10);
	}
})
//显示票信息
function showticket(start,end,time,d){
	$('#loadingwrap').fadeOut();
	$('#userticket').fadeIn(1000).find('.theader .fl').html(decodeURI(start)).siblings('.fr').html(decodeURI(end));
	$('#userticket .ticketdate').html(decodeURI(time));
	var md=decodeURI(time);
	$('#ut_tips span').html((d.getMonth()+1)+"月"+d.getDate()+'日')
}

function page_init() {
	$('#loadingwrap').fadeOut();
	$('#userticket').hide();
	$('#animwrap').fadeIn(1000);
	$('#ticket_wrap,.anim-swip').css('height', HH);
	$('#animwrap .anim-swip').css('top',HH);
	$('#ticket_wrap .anim-swip:first').removeClass('hide').addClass('active').css('top',0);
	setTimeout(function(){enteracitve(0)},500);
	var today = new Date();
	//today.setDate(today.getDate() + 1)
	var year = today.getFullYear();
	var m = today.getMonth() + 1;
	var d = today.getDate();
	var time = year + '-' + m + '-' + d;
	$('#gotime').val(time);
	obj.addEventListener("mousedown", down, false);
	obj.addEventListener("mousemove", move, false);
	obj.addEventListener("mouseup", up, false);
	obj.addEventListener("touchstart", down, false);
	obj.addEventListener("touchmove", move, false);
	obj.addEventListener("touchend", up, false);
	document.getElementById('music').play();
	$('body').on('resize', function() {
		$('#ticket_wrap,#animwrap,body').css({
			'left': 0,
			'top': 0,
			'width':'100%',
			'height':HH
		})
	});
}
    var imgUrl = "http://qp.liveapp.cn/images/logo.jpg"; //缩略图地址
    var lineLink = "http://qp.liveapp.cn/index.html"; //分享的链接地址
    var descContent = '看完就任性的回家吧！'; //摘要信息
    var shareTitle = '致：身未动，心已在回家路上的人。'; //分享的标题
    var appid = ''; //你的公众号的APPId
function geticket() {
	var start = $('#start').val();
	var end = $('#end').val();
	var gotime = $.trim($('#gotime').val())
	if (!$.trim(start)) {
		$('#start').focus();
		return;
	}
	if (!$.trim(end)) {
		$('#end').focus();
		return;
	}
	if (!$.trim(gotime)) {
		$('#gotime').focus();
		return;
	}
	var inputdate=new Date(gotime)
	if (inputdate=='Invalid Date') {
		$('#gotime').val('').attr('placeholder', '例子:2015-01-01').focus();
		return;
	}
	$('#hasticket').addClass('active').fadeIn('slow', function() {
		$(this).removeClass('hide')
	});
	$('#hasticket .theader .fl').html(start).siblings('.fr').html(end);
	$('#hasticket .ticketdate').html(gotime);
	 descContent='我已经买了从'+start+'到'+end+'的火车票，想任性的回家就快来看看吧!';
	lineLink=lineLink+'?start='+start+'&end='+end+'&gotime='+gotime
	lineLink=encodeURI(lineLink);
	obj.removeEventListener("mousedown", down, false);
	obj.removeEventListener("mousemove", move, false);
	obj.removeEventListener("mouseup", up, false);
	obj.removeEventListener("touchstart", down, false);
	obj.removeEventListener("touchmove", move, false);
	obj.removeEventListener("touchend", up, false);
}

function down(event) {
	if (moveing == 1) return;
	if (step < 0) {
		step = 0;
		return
	} else if (step > touchsize - 1) {
		step = touchsize - 1;
		return
	}

	onoff = true;
	moveing = 0;
	if (event.targetTouches) {
		downY = event.targetTouches[0].pageY;
		downY2 = event.targetTouches[0].pageY;
	} else if (event.touches) {
		var touch = event.touches[0];
		downY = touch.pageY;
		downY2 = touch.pageY;
	} else {
		downY = event.pageY;
		downY2 = event.pageY;
	}
}

function move(event) {
	if (step < 0 || step > touchsize - 1) {
		return
	}
	event.stopPropagation(); //
	event.preventDefault(); //
	if (event.targetTouches) {
		moveY = event.targetTouches[0].pageY;
	} else if (event.touches) {
		var touch = event.touches[0];
		moveY = touch.pageY;
	} else {
		moveY = event.pageY;
	}
	if (onoff == true) {	
		upORdown = moveY - downY; //
		console.log('开始地点：'+downY2+'``````目前地点:'+moveY+'``````'+upORdown)
		//向上滑或下滑
		if (upORdown > 0) {
			if (moveing == 0) {
				step--;
				$("#animwrap .anim-swip").addClass("hide");
				$("#animwrap .anim-swip").removeClass("show");
				$("#animwrap .anim-swip").removeClass("active");
				$("#animwrap .anim-swip").eq(step + 1).removeClass("active");
				$("#animwrap .anim-swip").eq(step + 1).addClass("show");
				$("#animwrap .anim-swip").eq(step).css({
					top: -HH
				}).removeClass("hide")
				$("#animwrap .anim-swip").eq(step).addClass("active");
				ud = "down";
				moveing = 1;
			} else {
				moveTop = parseInt($(".active").css("top"));
				$(".active").css({
					//top: moveTop + upORdown
					//'transform':'translateY('+moveY+'px)';初始定位在滑动开始出
					'transform':'translateY('+(moveY-downY2)+'px)'//定位在默认位置底部
				});
			}
		} else if (upORdown <= 0) {
			if (moveing == 0) {
						step++;
						$("#animwrap .anim-swip").addClass("hide");
						$("#animwrap .anim-swip").removeClass("show");
						$("#animwrap .anim-swip").removeClass("active");
						$("#animwrap .anim-swip").eq(step - 1).removeClass("active");
						$("#animwrap .anim-swip").eq(step - 1).addClass("show");
						$("#animwrap .anim-swip").eq(step).css({
							//top: HH
						}).removeClass("hide")
						$("#animwrap .anim-swip").eq(step).addClass("active");
						ud = "up";
						moveing = 1;
			} else {
				moveTop = parseInt($(".active").css("top"));
				$(".active").css({
					//top: moveTop + upORdown
					//'transform':'translateY('+-(HH-moveY)+'px)'初始定位在滑动开始出
					'transform':'translateY('+-(downY2-moveY)+'px)'//定位在默认位置底部
				});
			}
		}

	}
	downY = moveY;
}
//--------------------释放
function up(event) {
	onoff = false;
	if (step < 0) {
		moveing = 0;
		step = 0;
		return;
	} else if (step > touchsize - 1) {
		moveing = 0;
		step = touchsize - 1;
		return;
	}
	var ylong = Math.abs(moveY - downY2)
	//向下拉
	if (ud == "down") { //upORdown>0
		if (moveing == 1) {
			if (ylong > HH / 6) {
				$('.active').addClass('swip-animation').css('transform','translate(0px,'+HH+'px)');
				setTimeout(function(){enteracitve(step);},1000)
			} else {
					step++;
					$("#animwrap .anim-swip").addClass("hide");
					$("#animwrap .anim-swip").removeClass("show");
					$("#animwrap .anim-swip").removeClass("active");
					$("#animwrap .anim-swip").eq(step).removeClass("active");
					$("#animwrap .anim-swip").eq(step-1).addClass("show").css({'transform':'translate(0px,0px)','top':-HH});
					$("#animwrap .anim-swip").eq(step).removeClass("hide")
					$("#animwrap .anim-swip").eq(step).addClass("active");
					moveing = 0;
					upORdown = 0;
					ud = "";
			}
		}
		//向上拉
	} else if (ud = "up") { //upORdown <0
		if (moveing == 1) {
			//拉动幅度大则移动整体，否则还原
			if (ylong > HH / 6) {
				$('.active').addClass('swip-animation').css('transform','translate(0px,'+-HH+'px)');
				setTimeout(function(){enteracitve(step);},1000)
			} else { 
				step--;
				$("#animwrap .anim-swip").addClass("hide");
				$("#animwrap .anim-swip").removeClass("show");
				$("#animwrap .anim-swip").removeClass("active");
				$("#animwrap .anim-swip").eq(step + 1).removeClass("active").addClass("show");
				$("#animwrap .anim-swip").eq(step +1).css('transform','translate(0px,0px)');
				$("#animwrap .anim-swip").eq(step).removeClass("hide").addClass("active");
				moveing = 0;
				upORdown = 0;
				ud = "";
			}

		}
	}
}

function musicplay(o){
	$(o).toggleClass('stop').find('span').toggle();
	if($(o).hasClass('stop')){
		document.getElementById('music').pause();
	}else{
		document.getElementById('music').play();
	}
}

function enteracitve(i) {
		moveing = 0;
		upORdown = 0;
		ud = "";
		$('#animwrap .anim-swip').removeClass('anim-star').removeClass('swip-animation').eq(i).addClass('anim-star');
	}

var decToHex = function(str) {
    var res=[];
    for(var i=0;i < str.length;i++)
        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u"+res.join("\\u");
}
var hexToDec = function(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}
 function getUrlVars(){ 

var vars =[], hash; 

var hashes = window.location.href.slice(window.location.href.indexOf('?')+1).split('&'); 

for(var i = 0; i < hashes.length; i++) { 

hash = hashes[i].split('='); 

vars.push(hash[0]); 

vars[hash[0]] = hash[1]; 

} 
return vars; 
} 