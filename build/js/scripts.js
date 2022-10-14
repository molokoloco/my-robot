/*
    Copyright : Julien Guézennec © 2022 https://julienweb.fr
    Repository : https://github.com/molokoloco/medoucine/

    + https://getbootstrap.com/docs/5.2/getting-started/introduction/
*/

$(function() {

    "use strict";

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

    var kKeys = [], konami = '38,38,40,40,37,39,37,39,66,65'; // ↑ ↑ ↓ ↓ ← → ← → B A
    var k = function(e){
        kKeys.push(e.keyCode);
        if ((' '+kKeys.toString()+' ').indexOf(konami) >= 0) {
            kKeys = [];
            $('body').append('<audio src="https://julienweb.fr/chat.mp3" autoplay></audio>');
        }
    }
    $(document).keydown(k);

    // Form Cabinet -------------------------------------------------- //

    $('#btnCabinet').click(function() { // Reset form
        $('form.was-validated').removeClass('was-validated');
        setTimeout(function() {
            $('#cabinetForm .modal-body').html(`<div class="row">
                <div class="col col-12 ms-3 mb-3">
                    <h5 class="text-center">On s'appelle plutôt ? :-) <a href="tel:+33678135439">+33 6 61 75 64 98</a></h5>
                </div>
            </div>`);
        }, 16000)
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
        { label: "Réflexologie", value: "Réflexologie" },
        { label: "Médecine traditionnelle chinoise", value: "Médecine traditionnelle chinoise" },
        { label: "Sophrologie", value: "Sophrologie" },
        { label: "Ayurvéda", value: "Ayurvéda" },
        { label: "Hypnose", value: "Hypnose" },
        { label: "Shiatsu", value: "Shiatsu" },
        { label: "Psychothérapies", value: "Psychothérapies" },
        { label: "Nutrition", value: "Nutrition" },
        { label: "Aaromathérapie", value: "Aromathérapie" },
        { label: "Ostéopathie", value: "Ostéopathie" },
        { label: "Thérapies brèves", value: "Thérapies brèves" },
        { label: "Auriculothérapie", value: "Auriculothérapie" }
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
    var consultationsListeInput = new SelectPure("#consultationsListe", {
        options: consultationsListe,
        multiple: true,
        autocomplete: true,
        value: ["Naturopathie", "Réflexologie"],
        icon: "fa fa-times",
        inlineIcon: false,
        onChange: buildSortable
    });

    buildSortable(["Naturopathie", "Réflexologie"]); // init first default list

    $('body').on('click', '.closeSortable', function() { // link to Remove one sortable item
        var value = $(this).parent().data('value');
        $(".select-pure__selected-label").each(function() {
            if ($(this).text() == value) {
                $(this).find('i').click(); // simulate close by user on the main selectPure so "onChange: buildSortable" call us again
            }
        });
    });

    var wait = false;
    var $consultationsForm = $("#consultationsForm");

    $consultationsForm.submit(function(event) {
        event.preventDefault();
        event.stopPropagation();

        // 3s minimun
        if (wait) return false;
        wait = true;
        setTimeout(function() { wait = false; }, 3000);

        var data = [];
        $('#consultationsOrder li').each(function() { // Get sortable values
            data.push($(this).data('value'));
        });

        var isValid = data.length;
        if (isValid) {
            data = JSON.stringify(data);
            alert("Voici le contenu du formulaire envoyé au serveur :\n\n " + data);
            $('#consultations').modal('hide');
        } else {
            $('#consultationsForm .invalid-feedback').show();
        }
        return false;
    });

});