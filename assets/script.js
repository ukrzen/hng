$(function(){
    var NOTES="ABCDEFGH";
    var sounds={};
    var images=["assets/background.jpg","assets/hang.png"];
    var preloadedImages=images.length;
    var readyToPlay=false;
    function checkReadyToPlay(){
        if(readyToPlay ==false && preloadedImages ==0 && currentLayer >=2)
        {
            $(".not-ready").removeClass("not-ready");
            $("svg").attr("class","");
            readyToPlay=true;
        }

    }
    images.forEach(function(url){
        var img = new Image();
        img.class="preload";
        function loadHandler(){
                preloadedImages--;
                if(preloadedImages==0)
                {
                    checkReadyToPlay();
                }
                $(this).remove();
        }
        img.addEventListener('load', loadHandler, false);
        img.addEventListener('error',loadHandler, false);
        img.src=url;
        $(img).appendTo("body");
    });
    function loadSoundLayer(layer,success)
    {
        var notes = NOTES.split("");
        var loadedNotes=notes.length;
        if(layer< 10)
        layer= "0" + layer;
        function countHandler()
        {
            loadedNotes--;
            if(loadedNotes==0)
                success();
        }
        notes.forEach(function (letter) {
            if(!sounds[letter])
               sounds[letter] =[];

                sounds[letter].push( new Howl({
                    urls: ["samples/" + letter  + layer + ".wav.mp3",
                        "samples/" + letter  + layer +  ".wav.ogg"],

                    onload:countHandler,
                    onloaderror:countHandler}));

        });

    }
    var currentLayer=1;
    function loadNextLayer(){
          currentLayer+=1;
        if(currentLayer < 12)
          loadSoundLayer(currentLayer,loadNextLayer);
    }
    loadNextLayer();

    $(".note").on("touchstart",function() {
        $(this).attr("class", "note active");
    });
    $(".note").on("touchend",function() {
        $(this).attr("class", "note");
    });
    $(".note").on("touchstart mousedown",function(event){

     //   $(this).attr("class","note pulse");
        var letter = $(this).attr("data-note");
        var sound = sounds[letter][Math.floor(Math.random()*sounds[letter].length )];
        for(var i=0;i< sounds[letter].length;i++)
        {
            sounds[letter][i].stop();
        }

        sound.play();
        event.preventDefault();
        setTimeout(function(){
            $(".note[data-note='" + letter +"']" ).attr("class","note");
        },1500);

    });
    $("body").on("keydown",function(evt){
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
        var el=$(".note[data-key='" + charStr.toUpperCase() + "']");
        if(el.length)
        {
            el.trigger("touchstart");
        }
    });
    $("body").on("keyup",function(evt){
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
        var el=$(".note[data-key='" + charStr.toUpperCase() + "']");
        if(el.length)
        {
            el.trigger("touchend")

        }
    });
});