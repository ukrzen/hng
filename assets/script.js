$(function(){
    var NOTES="ABCDEFGHZ";
    var sounds={};
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
    var images=["https://lh3.googleusercontent.com/-XVMcX9Sx26I/Voe2e4WTvoI/AAAAAAAAAjc/9slfuMjOj1U/s" + width() +"-Ic42/background.jpg","assets/hang.png"];
    var preloadedImages=images.length;
    var readyToPlay=false;
    function checkReadyToPlay(){
        if(readyToPlay ==false && preloadedImages ==0 && currentLayer >=3)
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
                        countHandler();
                        sounds[letter]= removeFromArray(sounds[letter],this);
                    }}));

        });

    }
    var currentLayer=3;
    function loadNextLayer(){
        checkReadyToPlay();
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
        //console.log(sound)
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
    //var ACCELEROMETER_SAMPLES= 25,REJECT_SAMPLES=3;
    //var counter = ACCELEROMETER_SAMPLES + REJECT_SAMPLES;
    //var power = 0,x= 0,y= 0,x0= 0,y1= 0,x1= 0;
    //$("body").on("touchend",function() {
    //    if(counter < ACCELEROMETER_SAMPLES + REJECT_SAMPLES) return;
    //    alert(power);
    //    counter = 0;
    //    power = 0;
    //});
    //
    //window.ondevicemotion = function(event) {
    //
    //    var z = event.accelerationIncludingGravity.z;
    //    y = filterFactorSlider.value * (y + a - x);
    //    x = a;
    //
    //    x0 = a;
    //
    //    y0 = -0.5792*x1 + 0.5792*x0 - 0.1584*y1;
    //
    //    y1 = y0;
    //
    //    x1 = x0;
    //
    //
    //    if(counter > ACCELEROMETER_SAMPLES + REJECT_SAMPLES) return;  //анализ завершен
    //    if(counter++ > ACCELEROMETER_SAMPLES -1 ) return; //проверяем диапазон "отдыха" анализатора
    //    a = Math.abs(y0); // не заморачиваемся знаком ускорения :)
    //     power += a; // интегрируем
    //    if(counter == ACCELEROMETER_SAMPLES) {
    //        power *=Math.pow(power, 1)*1;
    //        ; // масштабируем скорость
    //        console.log(power);
    //    }
    //}
});