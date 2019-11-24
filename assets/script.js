$(function(){
    var NOTES="ABCDEFGHZ";
    var sounds={};
    var hangSvgLoaded=false;
    var isTouch = "ontouchstart" in window;
    var iOS=navigator.userAgent.match(/iPhone|iPad|iPod/i);
  //  document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;
    var simplified=location.search.indexOf("simple") !=-1;
    Howler.mobileAutoEnable=false;
    var isMobile =isTouch;
    var notesPlayed=0;
    var isDefaultInstrument=location.search.indexOf("v=2")==-1;
    var MIN_COUNT_LAYER =isDefaultInstrument? 4:1;
    var FIRST_LAYER = isDefaultInstrument? 3 : -1;
    $("body").addClass(isTouch?"mobile":"desktop");
    if(simplified)
         $("body").addClass("simple");
    if(isTouch)

       $("body").addClass(iOS?"ios":"non-ios")

    var width = function(){
        var dpi = window.devicePixelRatio ||1;
        return parseInt(parseInt(Math.round(($("body").width() / 640),0)) * 640 * dpi) ;
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
    $(".hello.screen").addClass("ready");
    //document.body.addEventListener('touchmove', function(event) {
    //    event.preventDefault();
    //}, false);
    var images=["assets/background.jpg","assets/hang.png"];
    var preloadedImages=images.length;
    var readyToPlay=false;
    $(".container").load("assets/hang.min.svg",function(){
        hangSvgLoaded=true;
        $(".note").on("touchstart", function () {
            $(this).attr("class", "note active");
        });
        $(".note").on("touchend", function () {
            $(this).attr("class", "note");
        });
        $(".note").on(isTouch?"touchstart":"mousedown", function (event) {

            playNote($(this).attr("data-note"));
        });
        $("#sound-help").appendTo(".container");
        checkReadyToPlay();
    });
    //$.get("assets/hang.svg",function(svg){
    //    $(svg).find("svg").prependTo(".container")
    //    hangSvgLoaded=true;
    //    checkReadyToPlay();
    //});
    function checkReadyToPlay(){
        if(readyToPlay ==false && preloadedImages ==0 && currentLayer >MIN_COUNT_LAYER && hangSvgLoaded)
        {
            $(".container").css("background-image","url(" + images[0] +")");
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
                    src: ["samples/mp3/" +(isDefaultInstrument? "" : "2/") + letter  + layer + ".mp3",
                        "samples/ogg/" + (isDefaultInstrument? "" : "2/") + letter  + layer +  ".ogg"],
                    onload:countHandler,
                    onloaderror:function(){

                        sounds[letter]= removeFromArray(sounds[letter],this);
                        countHandler();
                    }}));

        });

    }
    var currentLayer=FIRST_LAYER;
    function loadNextLayer(){
        checkReadyToPlay();
          currentLayer+=1;
        if(currentLayer < (simplified? 6:6))
          loadSoundLayer(currentLayer,loadNextLayer);
    }
    loadNextLayer();



    var playNote = function (letter)
    {
        //   $(this).attr("class","note pulse");
        notesPlayed++;
        if(notesPlayed > 10)
        $("#sound-help").addClass("hidden");
        var k = Math.random();
        //k = realPressure;
        var sound = sounds[letter][Math.floor(k*sounds[letter].length )];
        //for(var i=0;i< sounds[letter].length;i++)
        //{
        //    if(sounds[letter][i].playing())
        //        sounds[letter][i].stop();
        //}
        //console.log(sound)

        sound.play();
       //if(simplified)
        //setTimeout(function(){
        //    $(".note[data-note='" + letter +"']" ).attr("class","note");
        //},1500);
    }
    //    var mobileEnabled=!isTouch;
    //if(!mobileEnabled)
    //{
    //    $(".note").one("mousedown", function (event) {
    //        if(!mobileEnabled)
    //        {
    //            playNote($(this).attr("data-note"));
    //            mobileEnabled=true;
    //        }
    //
    //    });
    //}



    $("body").on("keydown",function(evt){
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        var charStr = String.fromCharCode(charCode);
        var el=$(".note[data-key='" + charStr.toUpperCase() + "']");
        if(el.length)
        {
            el.trigger("touchstart");
            el.trigger("mousedown");
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
    //$(".sad-screen").on("touchend",function(){
    //    $(".sad-screen").hide();
    //
    //
    //});


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

    $(".hello.screen").on("touchend",function(){
        if(readyToPlay)
          playNote("A");
    });
    $(".sound.screen").on("click",function(){
        $(".sound.screen").addClass("hidden");
        $("#sound-help").removeClass("hidden");
    });
    $(".hello.screen").on("click",function(){
        if(readyToPlay)
        {
            $(".hello.screen").addClass("hidden");
            if(isMobile)
            {
                $(".sound.screen").addClass("ready");
            }
        }

    });
    $(".help.screen").on("click",function(){
        $(".help.screen").addClass("hidden");
    })
    $("#sound-help").on("click",function(){
        $(".help.screen").removeClass("hidden");
    })
});