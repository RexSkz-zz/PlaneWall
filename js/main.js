var page_max = 3;
var max_save_length = 50;
var status = "free";
// Control
var control = new Object();
control.rollUp = function(){
	if(status != "free")return;
	control.pause();
	status = "busy";
	if (jQuery(".Wall_screw").children().length != 0){
		thisobj = jQuery(".Wall_screw").children().first();
		jQuery(".Wall_stage").prepend(thisobj);
		thisobj.animate({left:"-285px"},0);
		thisobj.show();
		jQuery(".Wall_stage").children(".Wall_ul").animate({left:"+=285px"},250,"linear",function(){
			if (jQuery(".Wall_stage").children().length > page_max){
				thisobj = jQuery(".Wall_stage").children().last();
				thisobj.hide();
				jQuery(".Wall_over").append(thisobj);
			}
			while (jQuery(".Wall_over").children().length > max_save_length){
				jQuery(".Wall_over").children().first().remove();
			}
			status = "free";
		});
	}else{
		jQuery(".Wall_stage").children(".Wall_ul").animate({left:"+=50px"},125).animate({left:"-=50px"},250,function(){
			status = "free";
		});
	}
}
control.rollDown = function(){
	if(status != "free")return;
	control.pause();
	status = "busy";
	if (jQuery(".Wall_over").children().length != 0){
		thisobj = jQuery(".Wall_over").children().last();
		jQuery(".Wall_stage").append(thisobj);
		thisobj.animate({left:"855px"},0);
		thisobj.show();
		jQuery(".Wall_stage").children(".Wall_ul").animate({left:"-=285px"},250,"linear",function(){
			if (jQuery(".Wall_stage").children().length > page_max){
				thisobj = jQuery(".Wall_stage").children().first();
				thisobj.hide();
				jQuery(".Wall_screw").prepend(thisobj);
			}
			status = "free";
		});
	}else{
		jQuery(".Wall_stage").children(".Wall_ul").animate({left:"-=50px"},125).animate({left:"+=50px"},250,function(){
			status = "free";
		});
	}
}
control.pause = function() {
	clearTimeout(runState.screw);
	state.pause = 'pause';
	jQuery(".Wall_pause").css({background:"url("+plugPosi+"/images/pause.png)"});
}
control.mycontinue = function(){
	control.screw();
	state.pause = 'continue';
	jQuery(".Wall_pause").css({background:"url("+plugPosi+"/images/start.png)"});
}
control.screw = function(){
	if(status != "free")return;
	if (jQuery(".Wall_screw").children().length != 0){
		status = "busy";
		thisobj = jQuery(".Wall_screw").children().first();
		jQuery(".Wall_stage").prepend(thisobj);
		thisobj.animate({left:"-285px"},0);
		thisobj.show();
		jQuery(".Wall_stage").children(".Wall_ul").animate({left:"+=335px"},250).animate({left:"-=50px"},125,function(){
			if (jQuery(".Wall_stage").children().length > page_max){
				thisobj = jQuery(".Wall_stage").children().last();
				thisobj.hide();
				jQuery(".Wall_over").append(thisobj)
			}
			while (jQuery(".Wall_over").children().length > max_save_length){
				jQuery(".Wall_over").children().first().remove();
			}
			status = "free";
		});
	}
	runState.screw = setTimeout(function(){
		control.screw();
	},timeLag);
}
control.getCont = function(){
	if (state.ajax == "free"){
		jQuery.ajax();
	}
	state.getCont = setTimeout(function(){
		control.getCont();
	},timeLag);
};
control.showRoof = function(){
	if (status == "busy") return;
	control.pause();
	var Container = "<div id=\"Wall_roof_container\"></div>";
	jQuery(".PlaneWall").append(Container);
	jQuery("#Wall_roof_container").fadeOut(0);
	jQuery("#Wall_roof_container").fadeIn(255,function(){
		jQuery(".Wall_main").fadeOut(125);
	});
	var DOM = "<div id=\"Wall_roof\"></div>";
	jQuery("#Wall_roof_container").append(DOM);
	DOM = jQuery("#Wall_roof");
	var zIndex = 1;
	jQuery("*").each(function(){
		var index = jQuery(this).css("z-index");
		if ((index != "auto") && (index >= zIndex)) zIndex = index+1;
	});
	DOM.fadeOut(0);
	DOM.parent = jQuery(".Wall_main");
	DOM.css({position:"absolute",top:"50%",width:"840px",height:"440px",margin:"-220px 0 0 -840px","background":"url("+plugPosi+"/images/screen.png) no-repeat bottom right","z\-index":zIndex,"font-family":"黑体"});
	DOM.fadeIn(250);
	jQuery("body").click(function(){
		//DOM.animate({left:"-=50px"},125).animate({left:"1640px"},250,function(){
			//DOM.fadeOut(50,function(){
				jQuery("*").each(function(){
					var index = jQuery(this).css("z-index");
					if ((index != "auto") && (index > zIndex)) jQuery(this).remove();
				});
				jQuery("#Wall_roof").remove();
				jQuery(".Wall_main").fadeIn(0,function(){
					jQuery("#Wall_roof_container").fadeOut(500,function(){
						jQuery("#Wall_roof_container").remove();
						if (state.pause == 'pause') setTimeout(control.mycontinue(),1000);
					});
				});
			//});
		//});
	});
}
control.showBigScreen = function(ul){
	if (status == "busy") return;
	var DOM = ul.clone(true);
	DOM.css({paddingLeft:"0px"});
	jQuery(DOM).click(function(){ return false; });
	DOM.parent = jQuery("#Wall_roof");
	DOM.css({margin:0,position:"absolute",width:"270px",height:"440px"});
	var tDom = DOM.find(".Wall_cont");
	tDom.css({textAlign:"left",height:"260px"});
	var shortIF = tDom.attr("shorten");
	if (shortIF == "true") tDom.text(tDom.data("value"));
	DOM.attr({big:"stage"});
	var index = jQuery("#Wall_roof").css("z-index")+1;
	DOM.css({"z-index":index});
	jQuery("#Wall_roof").append(DOM);
	DOM.animate({left:0,width:"840px"});
	jQuery("#Wall_roof").animate({top:"50%",marginTop:"-220px",left:"50%",marginLeft:"-370px"},300).animate({marginLeft:"-=50px"},125);
	DOM.find(".Wall_content").css({width:"800px"});
	fontAuto(tDom,9999);
}
jQuery.ajaxSetup({
	url	: "./plugin.php?id=PlaneWall:PlaneWall&action=ajax",
	type : "POST",
	timeout : ajaxTimeOut,
	data : {WallID:WallID,lastpos:lastpos},
	beforeSend : function(){
		state.ajax = "lock";
	},
	complete : function(){
		state.ajax = "free";
	},
	dataFilter : function(data){
		data = data.replace(/(<br \/>|<br>|<br >|\n)/g,"");
		data = data.replace(/(\[attach\].*\[\/attach\])/g,"");
		return data;
	},
	success : function(data){
		if (data != "empty"){
			jQuery(".Wall_pre").append(data);
			jQuery(".Wall_pre").children(".Wall_ul").each(function(){DOMDeal(this);});
			var DOM = jQuery(".Wall_pre").children();
			jQuery(".Wall_screw").append(DOM);
			jQuery(".Wall_main").find(".Wall_ul").each(function(){
				if (Number(jQuery(this).attr("pos")) > lastpos) lastpos = Number(jQuery(this).attr("pos"));
			});
			jQuery.ajaxSetup({data:{lastpos:lastpos}});
		}
	}
});
function DOMDeal(obj){
	jQuery(obj).find(".quote").remove();
	jQuery(obj).find(".pstatus").remove();
	jQuery(obj).find("font").removeAttr("size");
	fontAuto(jQuery(obj).find(".Wall_cont"),40);
	var uname = jQuery(obj).find("b");
	var text = uname.text();
	var length = text.length;
	var width = uname.width();
	var height = uname.height();
	var size = Math.floor(width/length);
	if (size > height) size = height;
	uname.css({"font-size":size-3+"px"});
}
function fontAuto(obj,max){
	var width = jQuery(obj).width();
	var height = jQuery(obj).height();
	var text = jQuery(obj).text();
	var len = 0;
	var count = 0;
	for(var i=0; i<text.length; i++){
		if (text[i].match(/[^\x00-\xff]/ig) != null)count+=0.6;
		len++;
	}
	len+=count;
	var imgCount = jQuery(obj).find("img").length;
	len += imgCount;
	if (len > max){
		jQuery(obj).data("value",text);
		var newText = "";
		len = 0;
		for(var i=0; i<text.length; i++){
			if(len + 3 >= max)break;
			newText += text[i];
			if (text[i].match(/[^\x00-\xff]/ig) == null)len++;
			else len+=1.6;
		}
		text = newText;
		text += "...";
		jQuery(obj).text(text);
		jQuery(obj).attr("shorten","true");
		length = text.length;
	}
}
jQuery(document).ready(function(){
	jQuery(".Wall_stage").mousewheel(function(objEvent, intDelta){
		if(intDelta>0)control.rollUp();
		else control.rollDown();
	});
	jQuery("body").keydown(function(event){ 
		if(event.keyCode==37)control.rollUp();
		else if(event.keyCode==39)control.rollDown();
		/*else if(event.keyCode==10 || event.keyCode==32){
			if(state.pause=='pause')control.mycontinue();
			else control.pause();
		}*/
	 });
	jQuery(".Wall_button").animate({opacity:1},1000);
	control.getCont();
	control.screw();
	jQuery(".Wall_control button").mouseover(function(){
		jQuery(this).animate({opacity:1},0);
	});
	jQuery(".Wall_control button").mouseout(function(){
		jQuery(this).animate({opacity:0.4},0);
	});
	jQuery(".Wall_pause").click(function(){
		if (state.pause == 'continue') control.pause();
		else if (state.pause == 'pause') control.mycontinue();
	});
	jQuery(".Wall_up").click(function(){
		control.rollUp();
	});
	jQuery(".Wall_down").click(function(){
		control.rollDown();
	});
	jQuery(".Wall_ul").live("click",function(){
		control.showRoof();
		control.showBigScreen(jQuery(this));
	});
});
