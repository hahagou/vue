(function ($) {

	'use strict';
	
	$("body").niceScroll({
		railpadding: {
			top: 0,
			right: 3,
			left: 0,
			bottom: 0
		},
		scrollspeed: 100,
		zindex: "auto",
		autohidemode: false,
		cursorwidth: "4px",
		cursorcolor: "rgba(255, 255, 255, .2)",
		cursorborder: "rgba(52, 40, 104, 0.1)"
	});
    // ------------------------------------------------------- //
    // Preloader
    // ------------------------------------------------------ //
	/*$(window).on("load", function () {
		$(".loader").fadeOut();
		$("#preloader").delay(350).fadeOut("slow");
	});*/
	
	// ------------------------------------------------------- //
	// Sidebar Functionality
	// ------------------------------------------------------ //
	var navstas = "close";
	$('#toggle-btn').on('click', function (e) {
		e.preventDefault();
		$(this).toggleClass('active');

		// $('.side-navbar').toggleClass('shrinked');

		if (navstas=="close"){
			$(".side-navbar li:not(:first-child) > a").attr({
				"aria-expanded":true,
				"class":"collapsed"
			})
			$(".side-navbar .sub").addClass('show');
			navstas = "open";
		}else if(navstas == "open"){
			$(".side-navbar li:not(:first-child) > a").attr({
				"aria-expanded":false,
				"class":""
			})
			$(".side-navbar .sub").removeClass('show');
			navstas = "close";
		}
		$(".sidebar-scroll").getNiceScroll().resize();

		// if ($(window).outerWidth() > 1183) {
		// 	if ($('#toggle-btn').hasClass('active')) {
		// 		$('.navbar-header .brand-small').hide();
		// 		$('.navbar-header .brand-big').show();
		// 	} else {
		// 		$('.navbar-header .brand-small').show();
		// 		$('.navbar-header .brand-big').hide();
		// 	}
		// }

		if ($(window).outerWidth() < 1183) {
			$('.navbar-header .brand-small').show();
		}
	});
	// Close dropdown after click
	// $(function () {
	//     $(".side-navbar li a").click(function(event) {
	// 	    $(".collapse").collapse('hide');
	//     });
	// });
	
    // ------------------------------------------------------- //
    // Dynamic Height
    // ------------------------------------------------------ //	
	$(window).resize(function(){
	    var height = $(this).height() - $(".header").height() + $(".main-footer").height()
	    $('.d-scroll').height(height);
	})

	$(window).resize();
	
    // ------------------------------------------------------- //
    // Auto Height Scrollbar
    // ------------------------------------------------------ //
	$(window).resize(function() {
		$('.auto-scroll').height($(window).height() - 130);
	});

	$(window).trigger('resize');
	
    // ------------------------------------------------------- //
    // Back To Top
    // ------------------------------------------------------ //
    $(function () {
        // Show or hide the sticky footer button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 350) {
                $('.go-top').fadeIn(100);
            } else {
                $('.go-top').fadeOut(200);
            }

            var outerHeight = $(this).height();
            var innerHeight = $(document).height();
            if ($(this).scrollTop() < innerHeight-outerHeight) {
                $('.go-bottom').fadeIn(100);
            } else {
                $('.go-bottom').fadeOut(200);
            }
        });

        // Animate the scroll to top
        $('.go-top').click(function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: 0
            }, 800);
        })

        $('.go-bottom').click(function (event) {
            event.preventDefault();

            $('html, body').animate({
                scrollTop: ($(document).height())-($(window).height()),
        }, 800);
        })

        $('.scroll-box').scroll(function () {
            if ($(this).scrollTop() > 350) {
                $(this).find('.scroll-box-go-top').fadeIn(100);
            } else {
                $(this).find('.scroll-box-go-top').fadeOut(200);
            }
            var outerHeight = $(this).height();
            var innerHeight = $(this).find('table').eq(0).height();
            if ($(this).scrollTop() < innerHeight-outerHeight) {
                $(this).find('.scroll-box-go-bottom').fadeIn(100);
            } else {
                $(this).find('.scroll-box-go-bottom').fadeOut(200);
            }
        });
        // Animate the scroll to top
        $('.scroll-box .scroll-box-go-top').click(function (event) {
            event.preventDefault();

            $('.scroll-box').animate({
                scrollTop: 0
            }, 800);
        })

        $('.scroll-box .scroll-box-go-bottom').click(function (event) {
            event.preventDefault();

            $('.scroll-box').animate({
                scrollTop: ($('.scroll-box').eq(0).find('table').eq(0).height())-($('.scroll-box').eq(0).height()),
            }, 800);
        })

		//初始化
        if ($(this).scrollTop() < ($('.scroll-box').eq(0).find('table').eq(0).height())-($('.scroll-box').eq(0).height())) {
            $(this).find('.scroll-box-go-bottom').fadeIn(100);
        } else {
            $(this).find('.scroll-box-go-bottom').fadeOut(200);
        }
        if ($(this).scrollTop() < $(document).height()-$(window).height()) {
            $('.go-bottom').fadeIn(100);
        } else {
            $('.go-bottom').fadeOut(200);
        }
    }); 

    // ------------------------------------------------------- //
    // Custom Checkbox (check, heart, star)
    // ------------------------------------------------------ //
	$('.checkbox').click(function(){
        $(this).toggleClass('is-checked');
    });
		
    // ------------------------------------------------------- //
    // Check / Uncheck all checkboxes
    // ------------------------------------------------------ //
    $("#check-all").change(function () {
        $("input:checkbox").prop('checked', $(this).prop("checked"));
    });

    // ------------------------------------------------------- //
    // Card Close
    // ------------------------------------------------------ //
    $('a.remove').on('click', function (e) {
        e.preventDefault();
        $(this).parents('.col-remove').fadeOut(500);
    });

	// ------------------------------------------------------- //
	// Sidebar Scrollbar
	// ------------------------------------------------------ //	
	$(".sidebar-scroll").niceScroll({
		cursorcolor: "transparent",
		cursorborder: "transparent",
		cursoropacitymax: 0,
		boxzoom: false,
		autohidemode: "hidden",
		scrollspeed: 450,
		cursorcolor: "rgba(255, 255, 255, .2)",
		cursorborder: "rgba(52, 40, 104, 0.1)"
	});
	$(".side-navbar").on("click",function(){
		$(".sidebar-scroll").getNiceScroll().resize();
	})

	// ------------------------------------------------------- //
	// Widget Scrollbar
	// ------------------------------------------------------ //	
	$(".widget-scroll").niceScroll({
		railpadding: {
			top: 0,
			right: 3,
			left: 0,
			bottom: 0
		},
		scrollspeed: 100,
		zindex: "auto",
		autohidemode: "leave",
		cursorwidth: "4px",
		cursorcolor: "rgba(52, 40, 104, 0.1)",
		cursorborder: "rgba(52, 40, 104, 0.1)"
	});

	// ------------------------------------------------------- //
	// Table Scrollbar
	// ------------------------------------------------------ //	
	$(".table-scroll").niceScroll({
		railpadding: {
			top: 0,
			right: 0,
			left: 0,
			bottom: 0
		},
		scrollspeed: 100,
		zindex: "auto",
		autohidemode: "leave",
		cursorwidth: "4px",
		cursorcolor: "rgba(255, 255, 255, .2)",
		cursorborder: "rgba(52, 40, 104, 0.1)"
	});

	// ------------------------------------------------------- //
	// Offcanvas Scrollbar
	// ------------------------------------------------------ //	
	$(".offcanvas-scroll").niceScroll({
		railpadding: {
			top: 0,
			right: 2,
			left: 0,
			bottom: 0
		},
		scrollspeed: 100,
		zindex: "auto",
		hidecursordelay: 800,
		cursorwidth: "3px",
		cursorcolor: "rgba(52, 40, 104, 0.1)",
		cursorborder: "rgba(52, 40, 104, 0.1)",
		preservenativescrolling: true,
		boxzoom: false
	});

	// ------------------------------------------------------- //
	// Search Box
	// ------------------------------------------------------ //
	$('#search').on('click', function (e) {
		e.preventDefault();
		$('.search-box').slideDown();
	});
	$('.dismiss').on('click', function () {
		$('.search-box').slideUp();
	});
	
	// ------------------------------------------------------- //
	// Adding slide effect to dropdown
	// ------------------------------------------------------ //
    $('.dropdown').on('show.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
    });

    $('.dropdown').on('hide.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
    });

	// ------------------------------------------------------- //
	// Options hover effect to dropdown
	// ------------------------------------------------------ //
	$('.widget-options > .dropdown, .actions > .dropdown, .quick-actions > .dropdown').hover(function () {
		$(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(350);
	}, function () {
		$(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(350);
	});
	
	// ------------------------------------------------------- //
	// Offcanvas Sidebar
	// ------------------------------------------------------ //
	$(function () {
		//open
		$('.open-sidebar').on('click', function (event) {
			event.preventDefault();
			$('.off-sidebar').addClass('is-visible');
		});
		//close
		$('.off-sidebar').on('click', function (event) {
			if ($(event.target).is('.off-sidebar') || $(event.target).is('.off-sidebar-close')) {
				$('.off-sidebar').removeClass('is-visible');
				event.preventDefault();
			}
		});
	});

	// ------------------------------------------------------- //
	// Close Modal After Time Period
	// ------------------------------------------------------ //
	$(function () {
		$('#delay-modal').on('show.bs.modal', function () {
			var myModal = $(this);
			clearTimeout(myModal.data('hideInterval'));
			myModal.data('hideInterval', setTimeout(function () {
				myModal.modal('hide');
			}, 2500));
		});
	});

})(jQuery);