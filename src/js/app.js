$(document).ready(function(){

  //  if (window.location.protocol == "http:" && window.location.hostname!='localhost') {
    //    window.location = document.URL.replace("http://", "https://");
   // }

    //scroll logic header title
    $(window).scroll(function(i){
        var scrollVar = $(window).scrollTop();
        //$('.top').css({'top': -.1*scrollVar-10 });
        $('#header_title').css({'opacity':( 100-scrollVar )/100+2});

        if(scrollVar>0){
            $('#scroll_down_btn').addClass('hide');
        }else{
            $('#scroll_down_btn').removeClass('hide');
        }
    });

    //menu scripts
    $('#nav').click(function(){
       //$('#toggle-btn').click();
    });
    $('#nav .mainmenu a').click(function(e)
    {
        e.preventDefault();
        var sectionid = $(this).attr('data-target').replace('!', '');

        if($(sectionid).length){

            $('html,body').animate({
                scrollTop: $(sectionid).offset().top
            }, 900);


            $('#toggle-btn').click();

        }
    });

    //orbits screens logic
    $('#circle-orbit-container .orbits').hover(function(){
       $('.lock_open').toggleClass('hidden');
       $('.lock_close').toggleClass('hidden');
    });



    //cube animation

    $(window).mousemove(function(e){
        if ($('#smartcontracts_cube').is(':hover')) {
            $('.cube').removeClass('initial');
            $('.cube').css('transform', 'rotateX(' + -e.pageY + 'deg)' + 'rotateY(' + e.pageX + 'deg)');
        }else{
            $('.cube').addClass('initial');
        }
    });


    //roadmap parallax
    $('#roadmap').parallax({
        imageSrc:'./img/parallax2.jpg'
    });


    //transition elements on scroll with jquery appear and animate.css
    $('.fadeonload').appear({'force_process':true});

    $('.fadeonload').on('appear',function(e,$affected){
        var time=100;$affected.each(function(){
                if($(this).attr('data-animation')){
                    $(this).addClass(
                        $(this).attr('data-animation')).removeClass('fadeonload');
                }else{
                    $(this).addClass('fadeIn').removeClass('fadeonload');
                }
            }
        )
    });




});









