$(document).ready(function() {
    window.getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    if(window.getUrlParameter('token') !== undefined) {
        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
        }

        localStorage.setItem('token', window.getUrlParameter('token'));
    }

    function setRightMenu() {
        var token = localStorage.getItem('token');
        if(token === undefined || token === null) {
            $('#right-menu').html('<a href="/auth">Login</a>')
        } else {
            $('#right-menu').html('<a href="/profile">Profile</a>')
        }
    }

    setRightMenu();

    google.maps.event.addDomListener(window, 'load', function () {
        var places = new google.maps.places.Autocomplete(document.getElementById('address'));
        google.maps.event.addListener(places, 'place_changed', function () {
            var place = places.getPlace();
            var address = place.formatted_address;
            var latitudeLongitude = place.geometry.location;

            var result = "ll:" + latitudeLongitude;
            var ll = result.substr(4);
            window.latlng = ll.slice(0,-1);
        });
    });

    $('#explore-form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

    $('#explore-button').click(function() {
        console.log('www');
    })
});
