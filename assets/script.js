$(function(){
    var NOTES="ABCDEFGHZ";
    var sounds={};
    var isTouch = "ontouchstart" in window;
    var iOS=navigator.userAgent.match(/iPhone|iPad|iPod/i);
    document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    if (document.fullscreenEnabled && isTouch) {
        requestFullscreen(document.documentElement);
    }
    $("body").addClass(isTouch?"mobile":"desktop");
    if(isTouch)

       $("body").addClass(iOS?"ios":"non-ios")

    var width = function(){
        var dpi = window.devicePixelRatio ||1;
        return parseInt(Math.round(($("body").width() / 640),0)) * 640 * dpi ;
    };
    function removeFromArray(array, value) {
        var idx = array.indexOf(value);
        if (idx !== -1) {
            array.splice(idx, 1);
        }
        return array;
    }
    $("body").on("touchmove",function(event){
        event.preventDefault();
    });
    //document.body.addEventListener('touchmove', function(event) {
    //    event.preventDefault();
    //}, false);
    var images=["https://lh3.googleusercontent.com/-XVMcX9Sx26I/Voe2e4WTvoI/AAAAAAAAAjc/9slfuMjOj1U/s" + width() +"-Ic42/background.jpg","assets/hang.png"];
    var preloadedImages=images.length;
    var readyToPlay=false;
    function checkReadyToPlay(){
        if(readyToPlay ==false && preloadedImages ==0 && currentLayer >3)
        {
            $(".container").css("background-image","url(" + images[0] +")")
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
        //$(img).appendTo("body");
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
                    onloaderror:function(){

                        sounds[letter]= removeFromArray(sounds[letter],this);
                        countHandler();
                    }}));

        });

    }
    var currentLayer=3;
    function loadNextLayer(){
        checkReadyToPlay();
          currentLayer+=1;
        if(currentLayer < 15)
          loadSoundLayer(currentLayer,loadNextLayer);
    }
    loadNextLayer();

        $(".note").on("touchstart", function () {
            $(this).attr("class", "note active");
        });
        $(".note").on("touchend", function () {
            $(this).attr("class", "note");
        });

    function playNote(letter)
    {
        //   $(this).attr("class","note pulse");

        var k = Math.random();
        //k = realPressure;
        var sound = sounds[letter][Math.floor(k*sounds[letter].length )];
        for(var i=0;i< sounds[letter].length;i++)
        {
            if(sounds[letter][i].pos() !=0)
                sounds[letter][i].stop();
        }
        //console.log(sound)

        sound.play();

        setTimeout(function(){
            $(".note[data-note='" + letter +"']" ).attr("class","note");
        },1500);
    }

        $(".note").on(isTouch?"touchstart":"mousedown", function (event) {
            playNote($(this).attr("data-note"));
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



    //
    //var CPBPressureNone   =      0.0;
    //var CPBPressureLight =       0.1;
    //var  CPBPressureMedium =       0.3;
    //var  CPBPressureHard    =     0.8;
    //var CPBPressureInfinite =   2.0;
    //var   pressureValues =[];
    //for(var i=0;i<30;i++)
    //    pressureValues.push(0.0);
    //
    //var currentPressureValueIndex =0 ;
    //var setNextPressureValue = 0;
    //var KNumberOfPressureSamples=5;
    //var  minimumPressureRequired =CPBPressureMedium;
    //var realPressure=0.5;
    //var maximumPressureRequired= CPBPressureInfinite;
    //setInterval(function(){
    //setNextPressureValue=KNumberOfPressureSamples;
    //},400)
    //window.ondevicemotion = function(event) {
    //    var sz=30;
    //    var a = event.acceleration.z;
    //    pressureValues[currentPressureValueIndex%sz] = a;
    //
    //    if (setNextPressureValue > 0) {
    //
    //        // calculate average pressure
    //        var total = 0.0;
    //        for (var loop=0; loop<sz; loop++) total += Math.abs(pressureValues[loop]);
    //        var average = total / sz;
    //
    //        // start with most recent past pressure sample
    //        if (setNextPressureValue == KNumberOfPressureSamples) {
    //            var mostRecent = pressureValues[(currentPressureValueIndex-1)%sz];
    //            pressure = Math.abs(average - mostRecent);
    //        }
    //
    //        // caluculate pressure as difference between average and current acceleration
    //        var diff = Math.abs(average - event.acceleration.z);
    //        if (pressure < diff) pressure = diff;
    //        setNextPressureValue--;
    //
    //        if (setNextPressureValue == 0) {
    //            if (pressure >= minimumPressureRequired && pressure <= maximumPressureRequired) {
    //
    //                realPressure=pressure;
    //                if(realPressure > 2)
    //                    realPressure=2;
    //                realPressure = ((realPressure -0.1) /2);
    //                document.title=realPressure;
    //                //alert(realPressure);
    //            }
    //            else
    //            {
    //
    //            }
    //        }
    //    }
    //
    //    currentPressureValueIndex++;
    //};
    $(".sad-screen").on("click",function(){
       $(".sad-screen").hide();
    });
});