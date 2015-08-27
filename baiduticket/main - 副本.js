
		var step=0;
		var touchdown=0;
		var downY=0;
		var downY2=0;
		var moveY=0;
		var moveing=0;
		var moveTop=0;
		var upORdown=0;
		var onoff=false;
		var HH=$(window).height();
		var ud="";
		var touchsize=$('#animwrap .anim-swip').size();
		var obj=document.getElementById("ticket_wrap");
		$(function(){
			setTimeout(function(){page_init()},3000);
		})
		
		function page_init(){
			$('#loadingwrap').hide();
			$('#animwrap').fadeIn(1000);
			$('#ticket_wrap,.anim-swip').css('height',HH);
			$('#ticket_wrap .anim-swip:first').removeClass('hide').addClass('active');
			enteracitve(0);
			var today=new Date();
				today.setDate(today.getDate()+1)
				var year=today.getFullYear();
				var m=today.getMonth()+1;
				var d=today.getDate();
				var time=year+'-'+m+'-'+d;
			$('#gotime').val(time)
			obj.addEventListener("mousedown",down,false);
			obj.addEventListener("mousemove",move,false);
			obj.addEventListener("mouseup",up,false);
			obj.addEventListener("touchstart",down,false);
			obj.addEventListener("touchmove",move,false);
			obj.addEventListener("touchend",up,false);
			
			$('body').on('resize',function(){
				$('#ticket_wrap,#animwrap,.anim-swip,body').css({'left':0,'top':0})
			});
		}
			//微信share
			function wxshare(type){
				if(type){
					$('#wxshare').show()
				}else{
					$('#wxshare').hide()
				}
			}
			 	
      WeixinApi.ready(function(Api) {
				$('.ticket_btn').attr('id','shareok');
 				// 微信分享的数据
			 	var shareData = {
			 				appId:'',
                            imgUrl:'http://qp.liveapp.cn/images/anim9_m1.png',
                            link:'http://qp.liveapp.cn/index.html',
                            desc:'看完就任性地回家吧!',
                            title:'致：身未动，心已在回家路上的人。'
            };
    

    // 分享的回调
    var wxCallbacks = {
        favorite : false,
        // async:true,
        // ready : function() {
        //     this.dataLoaded({
        //     });
        // },
        confirm : function(resp) {
            // alert("分享成功，msg=" + resp.err_msg);
        }
    };
    Api.shareToFriend(shareData, wxCallbacks);
    Api.shareToTimeline(shareData, wxCallbacks);
    Api.shareToWeibo(shareData, wxCallbacks);
    Api.generalShare(shareData,wxCallbacks);
});
			 	
			function geticket(){
				var start=$('#start').val();
				var end=$('#end').val();
				var gotime=$.trim($('#gotime').val())
				if(!$.trim(start)){
					$('#start').focus();
					return;
				}
				if(!$.trim(end)){
					$('#end').focus();
					return;
				}
				if(!$.trim(gotime)){
					$('#gotime').focus();
					return;
				}
				if(!new Date(gotime)||(new Date(gotime)<new Date())){
					$('#gotime').val('').attr('placeholder','请输入您的出行日期').focus();
					return;
				}
				$('.ticketresult').addClass('active').fadeIn('slow',function(){$(this).removeClass('hide')});
				$('#theader .fl').html(start).siblings('.fr').html(end);
				$('#ticketdate').html(gotime);
				
				obj.removeEventListener("mousedown",down,false);
				obj.removeEventListener("mousemove",move,false);
				obj.removeEventListener("mouseup",up,false);
				obj.removeEventListener("touchstart",down,false);
				obj.removeEventListener("touchmove",move,false);
				obj.removeEventListener("touchend",up,false);
			}
			
function down(event){
			if(moveing==1)return;
			if(step<0){
				step=0;
				return
				}else if(step>touchsize-1){
					step=touchsize-1;
					return
				}
				
			onoff=true;
			moveing=0;
			if (event.targetTouches) {
					downY = event.targetTouches[0].pageY;
					downY2 = event.targetTouches[0].pageY;
				}else if(event.touches){
					var touch = event.touches[0];
					downY=touch.pageY;
					downY2=touch.pageY;
				}else{
					downY=event.pageY;
					downY2=event.pageY;
				}
			}
		
function move(event){
			if(step<0||step>touchsize-1){
				return
				}
			event.stopPropagation();//
			event.preventDefault();//
			if (event.targetTouches) {
					moveY = event.targetTouches[0].pageY;
			}else if(event.touches){
				var touch = event.touches[0];
				moveY=touch.pageY;
				}else {
					moveY=event.pageY;
					}
			upORdown=moveY-downY; //
			if(onoff==true){
				//向上滑或下滑
				var r=upORdown>0?moveY:$(window).height()-moveY;
				//a=();
				//console.log(upORdown+'``````downY:'+downY+'```````:moveY'+moveY)
				if(upORdown>0){
							if(moveing==0){
								step--;
								$("#animwrap .anim-swip").addClass("hide");
								$("#animwrap .anim-swip").removeClass("show");
								$("#animwrap .anim-swip").removeClass("active");
								$("#animwrap .anim-swip").eq(step+1).removeClass("active");
								$("#animwrap .anim-swip").eq(step+1).addClass("show");
								$("#animwrap .anim-swip").eq(step).css({top:-HH}).removeClass("hide")
								$("#animwrap .anim-swip").eq(step).addClass("active");
								ud="down";
								moveing=1;
							}else{	
								r = (1- Math.abs(.1 * r / $(window).height())).toFixed(6);
								moveTop=parseInt($(".active").css("top"));	
								$(".active").css({top:moveTop+upORdown});
								//$('.show').css('transform',"translate(0,"+a+"px) scale("+r+")");
								}
					}else if(upORdown<=0){ 
								if(moveing==0){
									step++;
									$("#animwrap .anim-swip").addClass("hide");
									$("#animwrap .anim-swip").removeClass("show");
									$("#animwrap .anim-swip").removeClass("active");
									$("#animwrap .anim-swip").eq(step-1).removeClass("active");
									$("#animwrap .anim-swip").eq(step-1).addClass("show");
									$("#animwrap .anim-swip").eq(step).css({top:HH}).removeClass("hide")
									$("#animwrap .anim-swip").eq(step).addClass("active");
									ud="up";
									moveing=1;
									
								}else{
									//a=-a;
									r = (1 - Math.abs(.1 * r / $(window).height())).toFixed(6);
									moveTop=parseInt($(".active").css("top"));
									$(".active").css({top:moveTop+upORdown});
								//	$('.show').css('transform',"translate(0,"+a+"px) scale("+r+")");
									}
						}
					
				}
			downY=moveY;
			}
	
function up(event){
			onoff=false;
			if(step<0){
				moveing=0;
				step=0;
				return;
				}else if(step>touchsize-1){
					moveing=0;
					step=touchsize-1;
					return;
				}
			var ylong=Math.abs(moveY-downY2)
			if(ud=="down"){//upORdown>0
				if(moveing==1){
					if(ylong>HH/6){
						$(".active").animate({top:"0px"},600,function (){
							moveing=0;
							upORdown=0;
							ud="";
							enteracitve(step);
							})
						}else{
							$(".active").animate({top:-HH},600,function(){
									step++;
									$("#animwrap .anim-swip").addClass("hide");
									$("#animwrap .anim-swip").removeClass("show");
									$("#animwrap .anim-swip").removeClass("active");
									$("#animwrap .anim-swip").eq(step).removeClass("active");
									$("#animwrap .anim-swip").eq(step).addClass("show");
									$("#animwrap .anim-swip").eq(step-1).css({top:-HH}).removeClass("hide")
									$("#animwrap .anim-swip").eq(step-1).addClass("active");
									moveing=0;
									upORdown=0;
									ud="";
								});
							}
					}
				}else if(ud="up"){//upORdown <0
					if(moveing==1){
							if(ylong>HH/6){
								$(".active").animate({top:"0px"},600,function (){moveing=0;upORdown=0;ud="";enteracitve(step);})
								}else{
									$(".active").animate({top:HH},600,function(){
											step--;
											$("#animwrap .anim-swip").addClass("hide");
											$("#animwrap .anim-swip").removeClass("show");
											$("#animwrap .anim-swip").removeClass("active");
											$("#animwrap .anim-swip").eq(step+1).removeClass("active");
											$("#animwrap .anim-swip").eq(step+1).css({top:HH}).addClass("show");
											$("#animwrap .anim-swip").eq(step).css({top:"0px"}).removeClass("hide")
											$("#animwrap .anim-swip").eq(step).addClass("active");
											moveing=0;
											upORdown=0;
											ud="";
										});
									}

						}
				}
		}
	function enteracitve(i){
		//var active=$('#animwrap .anim-swip').eq(i);
		//$('.show').css('transform',"translate(0,0) scale(1)");
		$('#animwrap .anim-swip').removeClass('anim-star').eq(i).addClass('anim-star');
		//if($(active).hasClass('anim2')){
			//$(active).find('.radius').fadeIn('slow')
		//}
	}
