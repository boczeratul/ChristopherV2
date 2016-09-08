// Configuations
var RESERVATION_NAME = "李玄";
var RESERVATION_EMAIL = "hsuan.lee@agoda.com";
var RESERVATION_PHONE = "+886939686300";
var RESERVATION_PEOPLE = "2";
var RESERVATION_DATE = "2016-09-22";
var RESERVATION_TIME = "19:00";

// Setup environment
var reservationStartTime = 4 - (new Date().getTimezoneOffset() / 60); // 12pm in Taiwan

function waitUntilNoon() {
    if (Date.now().getHours() >= reservationStartTime) {
        christopherSays("It's time!");
        //$("#submit-btn").click();
        sendRequest();
    } else {
        christopherSays("Not yet, current time " + moment().format("hh:mm:ss"));
        setTimeout(waitUntilNoon, 1000);
    }
}

function christopherSays(message) {
    $("#Christopher").html(message);
    console.log("[Christopher]: " + message);
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

// Fill in necessary fields
$("#reservation_form").removeClass("inactive");
$("#name").val(RESERVATION_NAME);
$("#email").val(RESERVATION_EMAIL);
$("#phone").val(RESERVATION_PHONE);
$("#readable_date").val(RESERVATION_DATE).change();
$("#people").val(RESERVATION_PEOPLE).change();
$("#quota_unavailable_message").hide();
$("#quotas").html(
    $("<li id=\"datetime\">" + RESERVATION_TIME + "</li>")
    .data("time", RESERVATION_TIME)
    .data("prepay_required", false)
    .data("premium", false)
    .data("premium_products", false)
    .data("datetime", RESERVATION_DATE + " " + RESERVATION_TIME)
    .data("plan_id", 0)
    .addClass("reservation-btn")
);
$("li#datetime").click();
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
setTimeout(waitUntilNoon, 1000);