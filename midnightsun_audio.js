function makeAudio(playclass,pauseclass,errorclass,callback){
    $(".posts").initialize(function(){
        var $post = $(this);
    	$post.find(".audio").each(function(){
    		var $this = $(this);
    		var audioSrc = decodeURIComponent($this.find("iframe.tumblr_audio_player").attr("src").split("audio_file=")[1].split("&")[0]);
    		var newAudio = document.createElement("audio");
    		var newSrc = document.createElement("source");
    		newSrc.src = audioSrc;
    		newAudio.appendChild(newSrc);
    		newAudio.onloadedmetadata = function(){
    			$this.find(".timeleft").text("-"+convertTime(newAudio.duration));
                        $this.find(errorclass).remove();
                        if(!$(playclass).length){
                            var $play = $this.find(".play");
                            var playcon = document.createElement("span");
                            playcon.classList += playclass;
                            $play.appendChild(playcon);
                        }
                        if(!$(pauseclass).length){
                            var $play = $this.find(".play");
                            var pausecon = document.createElement("span");
                            pausecon.classList += pauseclass;
                            $play.appendChild(pausecon);
                        }
    		};
    		$this.prepend(newAudio);
    		$this.find(".playtime").text("00:00");
    		$this.find("iframe.tumblr_audio_player").parent(".audio_player").parent().remove();
    		$this.find(".pause").hide();
    	});
    	$post.find(".play").on("click",function(e){
    		var $this = $(this).parents(".audio");
    		$this.find("audio")[0].play();
    		var allSibs = $post.siblings().find("audio");
    		for(var k=0; k<allSibs.length; k++){
    			allSibs[k].pause();
    		};
    		$post.siblings().find(".play").show();
    		$post.siblings().find(".pause").hide();
    		$(this).hide().siblings(".pause").show();
    	});
    	$post.find(".pause").on("click",function(e){
    		var $this = $(this).parents(".audio");
    		$this.find("audio")[0].pause();
    		$(this).hide().siblings(".play").show();
    	});
    	$post.find(".audio audio").on("timeupdate", function () {
            var thisAudio = $(this)[0];
    		var curStr = convertTime(thisAudio.currentTime);
    		var durStr = "-"+convertTime((thisAudio.duration-thisAudio.currentTime));
            var value = (100 / thisAudio.duration) * thisAudio.currentTime;
    		var $par = $(this).parents(".audio");
    		$par.find(".playtime").text(curStr);
    		$par.find(".timeleft").text(durStr);
    		$par.find(".seekbar").slider("value",value);
        });
    	$post.find(".seekbar").slider({
          	range:"min",
          	value:0,
          	min:0,
          	max:100,
          	slide:function(event, ui) {
    			var thisAudio = $(this).parents(".audio").find("audio")[0];
                        var currentTime = ui.value / (100 / thisAudio.duration);
                        thisAudio.currentTime = currentTime;
          	}
        });
    	$post.find(".audio audio").each(function(){
    		var track = $(this)[0],
                    $parent = $(this).parent();
    		track.onerror = function(){
    			errFunc($parent,callback);
    		};
    		track.onstalled = function(){
    			errFunc($parent,callback);
    		};
    		track.onaborted = function(){
    			errFunc($parent,callback);
    		};
    	});
    });
}
function convertTime(totalSeconds){
	var hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	var minutes = Math.floor(totalSeconds / 60);
	var seconds = Math.floor(totalSeconds % 60);
	hours = hours > 0 ? String(hours).padStart(2, "0")+":" : "";
	minutes = String(minutes).padStart(2, "0")+":";
	seconds = String(seconds).padStart(2, "0");
	return hours+minutes+seconds;
}
function errFunc($el,call){
	var $play = $el.find(".play");
	var errIcon = document.createElement("span");
	errIcon.classList += errorclass;
	$play.remove(playclass);
	$play.remove(pauseclass);
	$play[0].appendChild(errIcon);
	if(!typeof call === "undefined")
	    call();
}