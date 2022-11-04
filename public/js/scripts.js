/*
    Copyright : Julien Guézennec © 2022 https://julienweb.fr
    Repository : https://github.com/molokoloco/medoucine/

    + https://getbootstrap.com/docs/5.2/getting-started/introduction/
*/

$(function() {

    "use strict";

    $('#year').text(new Date().getFullYear());
    $('#depuis').text(new Date().getFullYear() - 1998);

    // var mobile = $(window).width() < 768 ? true : false;
    // $(window).on('resize', function() {
    //     mobile = $(window).width() < 768 ? true : false;
    //     if (!mobile) removeParallax('#card1');
    //     else makeParallax('#card1');
    // });

    // Div behing canvas prevent event...

    // var $canvas = $('canvas').focus(),
    //     canvas = $canvas[0],
    //     int = null;

    // $("body")
    //     .on('click dblclick hover mousedown mouseenter mouseleave mouseout mouseover mouseup mousemove', function( event ) { //  
    //          if (!int) int = setTimeout(function() {
    //             canvas.dispatchEvent(new MouseEvent(event.type, event));
    //             //console.log(event.type, event);
    //             int = null;
    //          }, 100);
    //     });

    // $(window).on('mousewheel', function( event ) {
    //     //if (!int) int = setTimeout(function(e) {
    //         $("main").scrollTop($("main").scrollTop() - event.originalEvent.wheelDelta)
    //         //int = null;
    //     //}, 100, event);
    // });

    // $( "main > .container section" )
    //     .draggable({
    //         axis: 'y',
    //         scroll: true,
    //         scrollSensitivity: 100,
    //         scrollSpeed: 100//,
    //         //containment: "parent"
    //     });

    // https://monim67.github.io/bootstrap-datetimepicker/
    // https://bootstrap-datepicker.readthedocs.io/en/latest/

    $('#cabinetHeureDebut,#cabinetHeureFin').each(function() { // TimePicker
        $(this).datetimepicker({
            format: 'HH:mm',
            locale: 'fr',
            allowInputToggle: true,
            showClose: true,
            showClear: true,
            showTodayButton: true
        });
    });

    $('#cabinetDate,#cabinetDateRepetition').each(function() { // DatePicker
        $(this).datetimepicker({
            format: 'dddd DD MMM yyyy',
            locale: 'fr',
            allowInputToggle: true,
            showClose: true,
            showClear: true,
            showTodayButton: true
        });
    });

    // Konami -------------------------------------------------- //

    var bonus = function() {
        $('body').append('<audio src="https://julienweb.fr/chat.mp3" autoplay></audio>');
    }

    var kKeys = [], konami = '38,38,40,40,37,39,37,39,66,65'; // ↑ ↑ ↓ ↓ ← → ← → B A
    $(document).keydown(function(e) {
        kKeys.push(e.keyCode);
        if ((' '+kKeys+' ').indexOf(konami) >= 0) {
            kKeys = [];
            bonus();
        }
    });

    // Form Cabinet -------------------------------------------------- //

    $('#btnCabinet').click(function() { // Reset form
        $('form.was-validated').removeClass('was-validated');
        setTimeout(function() {
            bonus();
            $('#cabinetForm .modal-body').html(`<div class="row">
                <div class="col col-12 ms-3 mb-3">
                    <h5 class="text-center">On s'appelle plutôt ? :-) <a href="tel:+33678135439">+33 6 61 75 64 98</a></h5>
                </div>
            </div>`);
        }, 15000)
    });

    $('#cabinetRecurent').click(function() { // Show/Hide Créneau récurent option
        var $this = $(this);
        if ($this.is(':checked')) { // Open it
            $('#cabinetRecurentOptions').slideDown();
        } else { // Open it
            $('#cabinetRecurentOptions').slideUp();
        }
    });

    var wait = false;
    var $cabinetForm = $("#cabinetForm");

    $cabinetForm.submit(function(event) {
        event.preventDefault();
        event.stopPropagation();

        // 3s minimun
        if (wait) return false;
        wait = true;
        setTimeout(function() { wait = false; }, 3000);

        var isValid = $cabinetForm[0].checkValidity();
        $cabinetForm.addClass('was-validated');
        if (isValid) {
            var data = JSON.stringify($(this).serializeArray());
            alert("Voici le contenu du formulaire envoyé au serveur :\n\n " + data);
            $('#cabinet').modal('hide');
        }
        return false;
    });

    // Form consultations -------------------------------------------------- //

    $('#btnConsultations').click(function() {
        $('form.was-validated').removeClass('was-validated');
    });

    const consultationsListe = [
        { label: "Naturopathie", value: "Naturopathie" },
        { label: "Réflexologie", value: "Reflexologie" },
        { label: "Médecine traditionnelle chinoise", value: "Medecine_traditionnelle_chinoise" },
        { label: "Sophrologie", value: "Sophrologie" },
        { label: "Ayurvéda", value: "Ayurveéda" },
        { label: "Hypnose", value: "Hypnose" },
        { label: "Shiatsu", value: "Shiatsu" },
        { label: "Psychothérapies", value: "Psychotherapies" },
        { label: "Nutrition", value: "Nutrition" },
        { label: "Aaromathérapie", value: "Aromatherapie" },
        { label: "Ostéopathie", value: "Osteopathie" },
        { label: "Thérapies brèves", value: "Therapies_breves" },
        { label: "Auriculothérapie", value: "Auriculotherapie" }
    ];

    var updateSortableOrder = function() {
        setTimeout(function() { // wait sortable DOM update
            $('#consultationsOrder .sortableOrder').each(function(j) {
                $(this).html(j + 1);
            });
        }, 1000);
    };

    // https://api.jqueryui.com/sortable/
    // https://jqueryui.com/sortable/
    $("#consultationsOrder")
        .sortable({
            placeholder: "ui-state-highlight",
            forcePlaceholderSize: true,
            revert: true
        })
        .on("sortchange", function(event, ui) {
            updateSortableOrder();
        })
        .disableSelection();

    var buildSortable = function(value) { // Build Sortable consultations Liste
        // console.log('buildSortable', value);
        var html = '';
        for (var i = 0; i < value.length; i++) {
            html += '<li class="ui-state-default" data-value="' + value[i].replace(/"/g, "'") + '"><i class="bi bi-grip-vertical"></i><span class="sortableOrder">' + (i + 1) + '</span>-' + value[i] + ' <a href="#" class="closeSortable"><i class="bi bi-x"></i></a></li >';
        }
        $("#consultationsOrder").html(html).sortable("refresh"); // Update new content
        $('#consultationsForm .invalid-feedback').hide();
    };

    // https://www.cssscript.com/demo/multi-select-autocomplete-selectpure/
    // var consultationsListeInput = new SelectPure("#consultationsListe", {
    //     options: consultationsListe,
    //     multiple: true,
    //     autocomplete: true,
    //     value: ["Naturopathie", "Réflexologie"],
    //     icon: "fa fa-times",
    //     inlineIcon: false,
    //     onChange: buildSortable
    // });

    // buildSortable(["Naturopathie", "Réflexologie"]); // init first default list

    // $('body').on('click', '.closeSortable', function() { // link to Remove one sortable item
    //     var value = $(this).parent().data('value');
    //     $(".select-pure__selected-label").each(function() {
    //         if ($(this).text() == value) {
    //             $(this).find('i').click(); // simulate close by user on the main selectPure so "onChange: buildSortable" call us again
    //         }
    //     });
    // });

    // var wait = false;
    // var $consultationsForm = $("#consultationsForm");

    // $consultationsForm.submit(function(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     // 3s minimun
    //     if (wait) return false;
    //     wait = true;
    //     setTimeout(function() { wait = false; }, 3000);

    //     var data = [];
    //     $('#consultationsOrder li').each(function() { // Get sortable values
    //         data.push($(this).data('value'));
    //     });

    //     var isValid = data.length;
    //     if (isValid) {
    //         data = JSON.stringify(data);
    //         alert("Voici le contenu du formulaire envoyé au serveur :\n\n " + data);
    //         $('#consultations').modal('hide');
    //     } else {
    //         $('#consultationsForm .invalid-feedback').show();
    //     }
    //     return false;
    // });


    // Better Mobile NavBar -------------------------------------------------- //

    $('.nav-link').on('click', function() { // auto-close bootstrap menu
        $('.navbar-toggler').click().blur();
    });

    // Menu -------------------------------------------------- //

    var elem = document.documentElement;

    function openFullscreen() {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    }

    function closeFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }

    $('#screen').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!$(this).data('fullscreen')) {
            openFullscreen();
            $(this)
                .data('fullscreen', true)
                .html('<i class="bi bi-fullscreen-exit"></i>')
                .blur();
        }
        else {
            closeFullscreen()
            $(this)
                .data('fullscreen', false)
                .html('<i class="bi bi-arrows-fullscreen"></i>')
                .blur();
        }
        return false;
    });

    $('#collapseCards').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(this).data('collapse')) {
            $('#card1').removeClass('moveLeft');
            $('#card2').removeClass('moveRight');
            $('#card3').removeClass('moveLeft');
            $('#card4').removeClass('moveRight');
            $(this).data('collapse', false).blur();
        }
        else {
            $('#card1').addClass('moveLeft');
            $('#card2').addClass('moveRight');
            $('#card3').addClass('moveLeft');
            $('#card4').addClass('moveRight');
            $(this).data('collapse', true).blur();
        }
        return false;
    });

    // Switch FR/EN -------------------------------------------------- //

    window.visitorLang = 'fr';

    var setLanguage = function() {
        $('#collapseCards').data('collapse', false);
        if (window.visitorLang == 'en') {
            $('#card1').addClass('moveLeft');
            $('#card2').addClass('moveRight');
            $('#card3').removeClass('moveLeft');
            $('#card4').removeClass('moveRight');
            $('.nav-item a[href="#fr"]').removeClass('active');
            $('.nav-item a[href="#en"]').addClass('active');
            $('.bullshit').text('No blabla!');
        }
        else {
            $('#card3').addClass('moveLeft');
            $('#card4').addClass('moveRight');
            $('#card1').removeClass('moveLeft');
            $('#card2').removeClass('moveRight');
            $('.nav-item a[href="#en"]').removeClass('active');
            $('.nav-item a[href="#fr"]').addClass('active');
            $('.bullshit').text('No bullshit!');
        }
    };

    if (window.location.hash && window.location.hash == '#en') {
        window.visitorLang = 'en';
        setLanguage();
    }

    $(window).on('hashchange', function() {
        if (window.location.hash && window.location.hash == '#en') window.visitorLang = 'en';
        else window.visitorLang = 'fr';
        setLanguage();
    });

    // Cards parallax -------------------------------------------------- //

    // var makeParallax = function (element) {
        
    //     let mouseX, mouseY, intOut, intMov;
    //     let transformAmount = 20;

    //     element = $(element);
    //     const centerX = element.offset().left + element.width() / 2;
    //     const centerY = element.offset().top + element.height() / 2;

    //     console.log('centerX', centerX, 'centerY', centerY);

    //     var moveIt = function(mouseX, mouseY) {
    //         intMov = null;

    //         const percentX = (mouseX - centerX) / (element.width() / 2);
    //         const percentY = -((mouseY - centerY) / (element.height() / 2));
    //         element.css('transform', 'rotateY(' + percentX * transformAmount + 'deg) rotateX(' + percentY * transformAmount + 'deg)');

    //         console.log('mouseX', mouseX, 'mouseY', mouseY, 'percentX', percentX, 'percentY', percentY)
    //     };

    //     element.on('mousemove', function transformPanel(mouseEvent) {
    //         mouseX = mouseEvent.pageX;
    //         mouseY = mouseEvent.pageY;
            
    //         const percentX = (mouseX - centerX) / (element.width() / 2);
    //         const percentY = -((mouseY - centerY) / (element.height() / 2));
    //         element.css('transform', 'rotateY(' + percentX * transformAmount + 'deg) rotateX(' + percentY * transformAmount + 'deg)');

    //         console.log('mouseEvent.pageX', mouseEvent.pageX, 'percentX', percentX, 'percentY', percentY)

    //         if (!intMov) intMov = setTimeout(moveIt, 300, mouseEvent.pageX, mouseEvent.pageY);
    //     });

    //     element.on('mouseenter', function handleMouseEnter() {
    //         if (intOut) clearTimeout(intOut); 
    //         intOut = setTimeout(element.css('transition', ''), 100);
    //         element.css('transition', 'transform 0.1s');
    //     });

    //     element.on('mouseleave', function handleMouseLeave() {
    //         if (intOut) clearTimeout(intOut);
    //         intOut = setTimeout(element.css('transition', ''), 100);
    //         element.css('transition', 'transform 0.1s');
    //         element.css('transform', 'rotateY(0deg) rotateX(0deg)');
    //     });

    // };

    // var removeParallax = function (element) {
    //     element = $(element);
    //     element.off('mousemove');
    //     element.off('mouseenter');
    //     element.off('mouseleave');
    // };

    // if (!mobile) makeParallax('#card1');
    // //makeParallax('#card2');
});