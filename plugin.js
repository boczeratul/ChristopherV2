// Configuations
var RESERVATION_NAME = "李玄";
var RESERVATION_EMAIL = "hsuan.lee@agoda.com";
var RESERVATION_PHONE = "+886939686300";
var RESERVATION_PEOPLE = "2";
var RESERVATION_DATE = "2016-09-24";
var RESERVATION_TIME = "12:00";

// Setup environment
var retries = 4;
var reservationStartHour = 4 - (new Date().getTimezoneOffset() / 60); // 12pm in Taiwan
var reservationStartTime = 
    moment(RESERVATION_DATE)
    .add(reservationStartHour, "hours")
    .subtract(13, "days")
    .subtract(1, "seconds");

function waitUntilBookAvailable() {
    var currentMoment = moment();
    if (currentMoment.isAfter(reservationStartTime)) {
        christopherSays(["It's time!"]);
        sendRequest();
    } else {
        christopherSays([
            "Not yet!",
            "I will send your request " + reservationStartTime.fromNow(),
            currentMoment.format("YYYY-MM-DD HH:mm:ss") + " (current)",
            reservationStartTime.format("YYYY-MM-DD HH:mm:ss") + " (target)"
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
        "datetime": RESERVATION_DATE + " " + RESERVATION_TIME,
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
            christopherSays([
                textStatus
            ]);
            if (textStatus === "error" && retries--) {
                setTimeout(sendRequest, 500)
            }
        }
    });
}

$("body").append(
    $("<div></div>")
    .css("position", "fixed")
    .css("left", "0")
    .css("right", "0")
    .css("top", "0")
    .css("bottom", "0")
    .css("z-index", "999")
    .css("background-color", "rgba(0, 0, 0, 0.5)")
    .append(
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
    )
);

// Fill in necessary fields
$('#reservation_form').removeClass('inactive');
$('#name').val(RESERVATION_NAME);
$('#email').val(RESERVATION_EMAIL);
$('#phone').val(RESERVATION_PHONE);
$('#readable_date').val(RESERVATION_DATE);
$('#people').val(RESERVATION_PEOPLE);
$('#quota_unavailable_message').hide();
$('#quotas').html(
    $('<li id="datetime">' + RESERVATION_TIME + '</li>')
    .data('time', RESERVATION_TIME)
    .data('prepay_required', false)
    .data('premium', false)
    .data('premium_products', false)
    .data('datetime', RESERVATION_DATE + ' ' + RESERVATION_TIME)
    .data('plan_id', 0)
    .addClass('reservation-btn')
);

// Start looper
setTimeout(waitUntilBookAvailable, 1000);