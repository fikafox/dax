(function($){
    $.fn.photoLight = function(){
        return this.click(function(){
            var lbArray = [];
            var arrayContents = {"width":$(this).data('width'), "height":$(this).data('height'), "low_res":$(this).data("lowres"), "high_res":$(this).data('highres')};
            lbArray.push(arrayContents);
            Tumblr.Lightbox.init(lbArray,1);
            $('body').toggleClass('tumblr_lightbox_active');
            return false;
        });
    }
    $.fn.soundCloud = function(options){
        var settings = $.extend({
            accentColour:"#151515"
        }, options);
        var color = settings.accentColour;
        return this.each(function(){
            $(this).attr({ src: $(this).attr('src').split('&')[0] + '&amp;liking=false&amp;sharing=false&amp;auto_play=false&amp;show_comments=false&amp;continuous_play=false&amp;buying=false&amp;show_playcount=false&amp;show_artwork=true&amp;origin=tumblr&amp;color=' + color.split('#')[1], height: 20, width: '100%' });
        });
    }
}(jQuery));
function liege(accentColour){
    $(".posts").initialize(function(){
        var $this = $(this);
        $this.find(".soundcloud_audio_player").soundCloud({
            accentColour:accentColour
        });
        $this.find("a.read_more").parent("p").addClass("rm");
	$this.find(".photolight").photoLight();
        $this.fitVids({customSelector:"iframe[src*='www.tumblr.com/video']"});
        undoPhotoset({
            'posts': '.esp.text', 
            'text class': '', 
            'photoset class': 'photo'
        },false);
        initPhotosets(function(){
            $(".initialized_photoset").each(function(){
            	var $tp = $(this),
                    $tpp = $tp.parents(".posts").find(".permabar");
            	if($tp.parent().hasClass("text")){
            		$tp.parent().addClass("caption").removeClass("photo");
            		$tp.insertAfter($tpp);
            		$tp.wrap("<"+"div class='photo'"+"><"+"/div+"+">");
            	}
            });
        });
    });
}
function highlight(name,tag,iconclass){
    var readData, insert;
    var url = "https://"+name+".tumblr.com/api/read/json?&tagged="+tag; 
    $.getScript(url, function(){ 
        readData = tumblr_api_read;
        for (var i = 0; $(".pxf").length<3; i++){
            var posts = readData.posts[i];
            var type = posts["type"];
            var link = posts["url"];
            switch(type){
                case "photo":
                    var img = posts["photo-url-1280"];
                    insert = '<'+'a class="pxf" title="view post" href="'+link+'">';
                    insert += '<'+'img src="'+img+'" class="px">';
                    insert += '<'+'/a'+'>';
                    $("#featured").append(insert);
                    break;
                default:
                    insert = '<'+'a class="pxf" title="view post" href="'+link+'">';
                    insert += '<'+'span class="'+iconclass+'"><'+'/span'+'>';
                    insert += '<'+'/a'+'>';
                    $("#featured").append(insert);
                    break;
            } //end switch
        } //end for 
    }); 
}
function startTime(){
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var ampm;
    var n;
    switch(today.getDay()){
        case 0:
            n = "Sun";
            break;
        case 1:
            n = "Mon";
            break;
        case 2:
            n = "Tue";
            break;
        case 3:
            n = "Wed";
            break;
        case 4:
            n = "Thu";
            break;
        case 5:
            n = "Fri";
            break;
        case 6:
            n = "Sat";
            break;
    }
    m = checkTime(m);
    if (h >= 12){
        h -= 12;
        ampm = "PM";
    }
    else {
        if (h == 0)
            h = 12;
        ampm = "AM";
    }
    document.getElementById('time').innerHTML = n + " " + h + ":" + m + " " + ampm;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) 
        i = "0" + i;
    return i;
}
function fluidWidth(){
    if (matchMedia) {
        var breakPoint1 = window.matchMedia("screen and (max-width:960px)");
        breakPoint1.addListener(widthChangeOne);
        widthChangeOne(breakPoint1);
    }
    // breakpoint 1: screen less than 1080px
    function widthChangeOne(breakPoint1){
        if (breakPoint1.matches) {
            /* less than 1080px */
            $("aside").trigger("sticky_kit:detach");
        } else {
            /* more than 960px */
            $("aside").stick_in_parent({
                offset_top:60
            });
            $(window).resize(function(){
                $(document.body).trigger("sticky_kit:recalc");
            });
        }
    }
    widthChangeOne(breakPoint1);
}
$(document).ready(function(){
    $(document).tooltip({
        track:true
    });
    $("#sp").click(function(e){
        $("#searchbox").fadeIn();
        $("body").addClass("hideover");
        e.preventDefault();
    });
    $(".fade").click(function(){
        $(".popup").fadeOut();
        $("body").removeClass("hideover");
    });
    var credit = document.createElement("a");
    credit.id = "opus";
    credit.href = "http://magnusthemes.tumblr.com";
    credit.title = "midnight sun theme by magnusthemes";
    var ic = document.createElement("span");
    ic.className = "typcn typcn-code-outline";
    credit.appendChild(ic);
    document.getElementById("ic").appendChild(credit);
    startTime();
    fluidWidth();
});