"use strict"; $("#basic_demo").owlCarousel({ loop: !0, margin: 10, nav: !0, responsive: { 0: { items: 1 }, 600: { items: 3 }, 1000: { items: 5 } } }), $("#single_slide").owlCarousel({ loop: !0, margin: 10, nav: !0, items: 1, animateOut: "fadeOut", animateIn: "fadeIn", smartSpeed: 450 }), $("#single_slide_autoplay").owlCarousel({ items: 1, loop: !0, margin: 10, autoplay: !0, autoplayTimeout: 3e3, autoplayHoverPause: !0 }), $(".play").on("click", function () { $("#single_slide_autoplay").trigger("play.owl.autoplay", [3e3]) }), $(".stop").on("click", function () { $("#single_slide_autoplay").trigger("stop.owl.autoplay") }), $("#withloop").owlCarousel({ center: !0, items: 2, loop: !0, margin: 10, responsive: { 600: { items: 4 } } }), $("#nonloop").owlCarousel({ center: !0, items: 2, loop: !1, margin: 10, responsive: { 600: { items: 4 } } }), $("#dashboard_slide").owlCarousel({ items: 1, loop: !0, margin: 10, autoplay: !1, autoplayTimeout: 2e3, dots: !1, autoplayHoverPause: !0 }), $("#dashboard_slide2").owlCarousel({ items: 1, loop: !0, margin: 10, autoplay: !0, autoplayTimeout: 3e3, dots: !1, autoplayHoverPause: !0 });