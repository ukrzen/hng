$(function(){
    var NOTES="ABCDEFGH";
    var sounds={};
    $("#preloader").on("load",function(){
        $(".container").removeClass("not-ready");
        $("svg").attr("class","");
        $("#preloader").remove();
        $("svg").appendTo(".container");
    });

    NOTES.split("").forEach(function (letter) {
        sounds[letter] =[];
        for(var i=3;i<= 9;i++)
        {
            sounds[letter].push( new Howl({
                urls: ["samples/" + letter + "0" + i + ".wav.mp3",
                    "samples/" + letter  + "0" + i +  ".wav.ogg"]
            }));
        }
    });

    $(".note").on("touchstart",function() {
        $(this).attr("class", "note active");
    });
    $(".note").on("touchend",function() {
        $(this).attr("class", "note");
    });
    $(".note").on("touchstart mousedown",function(event){

        $(this).attr("class","note pulse");
        var letter = $(this).attr("data-note");
        var sound = sounds[letter][Math.floor(Math.random()*6 )];
        for(var i=0;i< 6;i++)
        {
            sounds[letter][i].stop();
        }

        sound.play();
        event.preventDefault();
        setTimeout(function(){
            $(".note[data-note='" + letter +"']" ).attr("class","note");
        },600);

    });
    $("body").on("keydown",function(evt){
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
        var el=$(".note[data-key='" + charStr.toUpperCase() + "']");
        if(el.length)
        {
            el.trigger("mousedown");
        }
    });
});