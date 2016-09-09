// Configuations
var RESERVATION_NAME = "李玄";
var RESERVATION_EMAIL = "hsuan.lee@agoda.com";
var RESERVATION_PHONE = "+886939686300";
var RESERVATION_PEOPLE = "2";
var RESERVATION_DATE = "2016-09-23";
var RESERVATION_TIME = "19:00";

// Setup environment
var reservationStartHour = 4 - (new Date().getTimezoneOffset() / 60); // 12pm in Taiwan
var reservationStartTime = 
    moment(RESERVATION_DATE)
    .add(reservationStartHour, "hours")
    .subtract(13, "days");

function waitUntilBookAvailable() {
    var currentMoment = moment();
    if (currentMoment.isAfter(reservationStartTime)) {
        christopherSays(["It's time!"]);
        sendRequest();
    } else {
        christopherSays([
            "Not yet!",
            currentMoment.format("YYYY-MM-DD HH:mm:ss") + " (current)",
            reservationStartTime.format("YYYY-MM-DD HH:mm:ss") + " (target)",
            "Request will be sent " + reservationStartTime.fromNow()
        ]);
        setTimeout(waitUntilBookAvailable, 1000);
    }
}

function christopherSays(message) {
    $("#Christopher").html(message.join('<br>'));
    console.log("[Christopher]: " + message.join('\n'));
}

function sendRequest() {
    var requestBody = {
        "access_token": "",
        "restaurant_id": "2128",
        "datetime": RESERVATION_DATE + " " + RESERVATION_TIME + ":00",
        "people": RESERVATION_PEOPLE,
        "email": RESERVATION_EMAIL,
        "name": RESERVATION_NAME,
        "tel": RESERVATION_PHONE,
        "gender": "F",
        "receive": 1,
        "source": "PARTNER_1952",
        "share_partner_id": "2",
        "phone_country_code": "tw",
        "locale": "zh_TW"
    }
    $.ajax({
        type: "POST",
        cache: false,
        url: "https://api.eztable.com/v3/reservations/",
        data: requestBody,
        complete: function (req, textStatus) {
            christopherSays(textStatus);
        }
    });
}

$("body").append(
    $("<div></div>")
    .css("position", "fixed")
    .css("left", "10px")
    .css("bottom", "10px")
    .css("z-index", "1000")
    .css("padding", "5px")
    .css("border", "1px solid gray")
    .css("border-radius", "5px")
    .css("background-color", "white")
    .append($("<span>Christopher : </span>"))
    .append($("<span id=\"Christopher\"></span>").css("color", "gray"))
);

// Start looper
setTimeout(waitUntilBookAvailable, 1000);