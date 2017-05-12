var tokens;
var time;
var SpeechRecognition = SpeechRecognition;
var SpeechRecognitionEvent = SpeechRecognitionEvent;
var SpeechGrammarList = SpeechGrammarList;
var map;
var infowindow;
var input;
var inputToken;
var totalResults;
var currentDate = "27 April 2017";
$(".inputBox").keyup(function(event) {
    if (event.keyCode == 13) {

        input = $('.inputBox').val();
        tokens = input.split(" ");
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i] == "atm" || tokens[i] == "cafe" || tokens[i] == "police" || tokens[i] == "hospital" || tokens[i] == "park" || tokens[i] == "school" || tokens[i] == "gym" || tokens[i] == "restaurant") {
                inputToken = tokens[i];


            } else {
                inputToken = input;
            }
        }
        $('.responses').append("<div class='userResponse'>" + input + "</div>");
        $(document.body).append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDLA8_sK5PltVRroSqLz8sMUSci823qH0A&libraries=places&callback=initMap" async defer></script>');
        $('.mapBox').append(' <div class="mapContainer"> <div id="map"></div></div>');
        $('.inputBox').val('');

    } else {
        $('.consoleClick').click(function() {
            input = $('.inputBox').val();
            $('.responses').append("<div class='userResponse'>" + input + "<br></div>");
            $(document.body).append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDLA8_sK5PltVRroSqLz8sMUSci823qH0A&libraries=places&callback=initMap" async defer></script>');
            $('.mapBox').append(' <div class="mapContainer"> <div id="map"></div></div>');
            $('.inputBox').val('');
        })

    }

});


function initMap() {
    navigator.geolocation.getCurrentPosition(showPosition);

    function showPosition(position) {

        var pyrmont = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: pyrmont,
            radius: 1000,
            type: inputToken
        }, callback);
    }
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        totalResults = results.length;
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }

    }
}
var i = 1;

function createMarker(place) {
    if (i < totalResults) {
        $('.responses').append("<div class='botResponse'><b>" + i + ")&nbsp" + place.name + "</b></div><br>");

        $('.responses').append("<div class='botResponse'>" + place.vicinity + "</div><br><br>");
        i++;
    }
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location

    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);

        infowindow.open(map, this);

    });

}



$(document).ready(function() {

    $('#mic1').click(function() {
        alert("Listening Now...");
        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            recognition.start();
            recognition.onresult = function(event) {
                $('.messages').attr('value', event.results[0][0].transcript);
            }
            recognition.onerror() = function(event) {
                recognition.stop();
                console.log("Speech Recognition Error" + event);
            }
        }
    })
    $('#mic2').click(function() {
        alert("Listening Now...");
        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            recognition.start();
            recognition.onresult = function(event) {
                $('.messages').attr('value', event.results[0][0].transcript);
            }
            recognition.onerror() = function(event) {
                recognition.stop();
                console.log("Speech Recognition Error" + event);
            }
        }
    })
    $('#mic3').click(function() {
        alert("Listening Now...");
        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";
            recognition.start();
            recognition.onresult = function(event) {
                $('.messages').attr('value', event.results[0][0].transcript);
            }
            recognition.onerror() = function(event) {
                recognition.stop();
                console.log("Speech Recognition Error" + event);
            }
        }
    })

    var dt = new Date();
    console.log(dt.getHours());
    console.log(dt.getMinutes());
    var hr = dt.getHours();
    var min = dt.getMinutes();
    var calchr;
    var ampm;
    setTimeout(function() {

        if (hr > 12) {
            calchr = hr % 12;
            ampm = "PM";
            $('.todayTime').append("<b> " + calchr + " ");
            $('.todayTime').append("<b>:");
            $('.todayTime').append("<b>" + min + "");
            $('.todayTime').append(" ");
            $('.todayTime').append(" <b>" + ampm + "</b> ");
        }

        if (hr < 12) {
            ampm = "AM";
            if (hr == 0) {
                hr = 12;
            }

            $('.todayTime').append(" " + hr + " ");
            $('.todayTime').append(":");
            $('.todayTime').append(" " + min + " ");
            $('.todayTime').append("  ");
            $('.todayTime').append(" " + ampm + " ");



        }
    }, 10);



    $.ajax({
        url: '/newsresponse',
        dataType: 'json',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        complete: function(data) {


            var ctr = 0;

            var name1 = "id";


            while (ctr < 10) {
                var newsId = name1 + ctr;
                var appendId = "#" + newsId;

                $('.allNews').append("<div class='newsContainer' id=" + newsId + ">");
                $(appendId).append('<div class="imageContainer"></div>');
                $(appendId).find(" .imageContainer").append("<img src=" + data.responseJSON.articles[ctr].urlToImage + " class='imageProperty' />")
                $(appendId).find('.imageContainer').append("</div>");
                $(appendId).append("<div class='newsText'> ");
                $(appendId).find('.newsText').append("<div class=titleContainer> <b>" + data.responseJSON.articles[ctr].title + "</b></div>");
                $(appendId).find('.newsText').append("<div class=descriptionContainer> " + data.responseJSON.articles[ctr].description + "</div>");
                $(appendId).find('.newsText').append("<div class=urlContainer> <i>" + data.responseJSON.articles[ctr].url + "</i></div>");
                $('.allNews').append("</div>");
                ctr++;
            }

        }
    });
    $(".buttonTwo").click(function() {
        $('.secondContainer').addClass("display");
        $('.background').addClass("displayOne");

    });
    $(".buttonOne").click(function() {
        $('.thirdContainer').addClass("displayTwo");
        $('.background').addClass("displayOne");

    });
    $(".ssubmit").click(function() {
        alert("Registered successfully");
        $('.secondContainer').removeClass("display");
        $('.background').addClass("displayFive");
        var val = {};
        val.firstname = $('.fName').val();
        val.lastname = $('.lName').val();
        val.password = $('.passWord').val();
        val.rpassword = $('.rPassword').val();
        val.gender = $('.gender').val();
        val.lPassword = $('lPassword').val();
        val.lusername = $('lusername').val();
        execute('response3', val);

    });
    $(".lsubmit").click(function() {
        $('.fourthContainer').addClass("fourDisplay");
        $('.mainContainer').addClass("displayThree");
        $('.thirdContainer').removeClass("displayTwo");
        $('.background').removeClass("displayOne");
        var val = {};
        val.username = $('.lusername').val();
        val.lpassword = $('.lPassword').val();
        execute('response3', val);

    });
    $(".enquiryBlock").click(function() {
        $('.mbotContainer').addClass("botDisplay");
        $('.fourthContainer').removeClass("fourDisplay");
    });
    $(".nearbyBlock").click(function() {
        $('.mainContainerOne').addClass("botDisplayOne");
        $('.fourthContainer').removeClass("fourDisplay");
    });

    $(".newsBlock").click(function() {
        $('.fifthContainer').addClass("botDisplayTwo");
        $('.fourthContainer').removeClass("fourDisplay");
    });
    $(".messages").keyup(function(event) {
        if (event.keyCode == 13) {
            mainFunction();
        } else {
            bind('.sendButton', function() {
                mainFunction();

            })
        }
    });

    function mainFunction() {
        var val = {};
        val.text = $('#ab').val();
        $(".bot").append("<div class='userMessage'>" + val.text + "</div>");
        $('.messages').val('');
        if (val.text == "google") {
            $('.googleSearch').addClass('googleDisplay');
        }
        execute('response', val);
        var mamla2;

        function func(mamla2) {
            $(".bot").append("<div class='botMessage'>" + mamla2 + "</div>");
        }

        $.ajax({
            url: '/response2',
            dataType: 'json',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            complete: function(data) {
                var mamla = data.responseText;

                if (mamla == 1) {
                    mamla = currentDate;
                }
                if (mamla == 2) {
                    if (hr > 12) {
                        mamla = calchr + ":" + min + ampm;
                    }
                    if (hr < 12) {
                        mamla = hr + ":" + min + ampm;
                    }

                }

                func(mamla);
            }
        });
    }
});
