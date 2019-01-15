/* Time Picker extension
   Written by Abdullah Alhussain */

/* Get time selected within the popover. */
function getTimePickerSelectedTime() {
    var timeObj = {};
    timeObj.hour = $('.timepicker-hour').text();
    timeObj.minute = $('.timepicker-minute').text();
    timeObj.period = $('.timepicker-period').text();
    return timeObj;
}

/* Get time selected from the input value.
@param {element} the input selector. */
function getInputTime(element) {
    return disassembleTime($(element).val().split(' ')[1] +
        " " +
        $(element).val().split(' ')[2]);
}

/* Format time object to h:mm tt
@param {time} time object. */
function formatTime(time) {
    return time.hour + ":" + time.minute + " " + time.period;
}

/* Disassemble time string into time object
@param {time} time string. */
function disassembleTime(time) {
    var timeObj = {};
    timeObj.hour = time.split(" ")[0].split(":")[0];
    timeObj.minute = time.split(" ")[0].split(":")[1];
    timeObj.period = time.split(" ")[1];
    return timeObj;
}

/* Get now time as a time object */
function getCurrentTime() {
    var currentdate = new Date();
    var currentHour = (((currentdate.getHours() + 11) % 12) + 1).toString();
    if (currentHour.length == 1)
        currentHour = "0" + currentHour;

    var currentMinute = currentdate.getMinutes().toString();
    if (currentMinute.length == 1)
        currentMinute = "0" + currentMinute;

    return {
        hour: currentHour,
        minute: currentMinute,
        period: currentdate.getHours() >= 12 ? "PM" : "AM"
    }
}


function getSelectedTime(element) {
    if ($('.popover.dateTimePicker').length)
    {
        return getTimePickerSelectedTime();
    }
    else if(typeof $(element).val().split(' ')[1] !== "undefined")
    {
        return getInputTime(element);
    }
    else {
        return getCurrentTime();
    }
}

function getSelectedDate(element) {
    var date = $(element).val().split(' ')[0];
    if (date)
    {
        return date;
    }
    
    else
    {
        var datePickerOptions = $(element).calendarsPicker('option');
        return datePickerOptions.calendar.today().formatDate(datePickerOptions.dateFormat);
    }
}

function onChange(element) {
    $(element).val(getSelectedDate(element) + ' ' + formatTime(getSelectedTime(element)));
}

function incrementHour(element) {
    currentHour = parseInt($('.timepicker-hour').text());
    if (currentHour == 12)
        currentHour = 1;
    else
        currentHour = currentHour + 1;
    currentHourString = currentHour.toString();
    if (currentHourString.length < 2)
        currentHourString = '0' + currentHourString;
    $('.timepicker-hour').text(currentHourString);
    onChange(element);
}

function incrementMinute(element) {
    currentMinute = parseInt($('.timepicker-minute').text());
    if (currentMinute == 59)
        currentMinute = 00;
    else
        currentMinute = currentMinute + 1;
    currentMinuteString = currentMinute.toString();
    if (currentMinuteString.length < 2)
        currentMinuteString = '0' + currentMinuteString;
    $('.timepicker-minute').text(currentMinuteString);
    onChange(element);
}

function decrementHour(element) {
    currentHour = parseInt($('.timepicker-hour').text());
    if (currentHour == 1)
        currentHour = 12;
    else
        currentHour = currentHour - 1;
    currentHourString = currentHour.toString();
    if (currentHourString.length < 2)
        currentHourString = '0' + currentHourString;
    $('.timepicker-hour').text(currentHourString);
    onChange(element);
}

function decrementMinute(element) {
    currentMinute = parseInt($('.timepicker-minute').text());
    if (currentMinute == 00)
        currentMinute = 59;
    else
        currentMinute = currentMinute - 1;
    currentMinuteString = currentMinute.toString();
    if (currentMinuteString.length < 2)
        currentMinuteString = '0' + currentMinuteString;
    $('.timepicker-minute').text(currentMinuteString);
    onChange(element);
}

function timepickerPeriod(element) {
    if ($('.timepicker-period').text() == 'PM')
        $('.timepicker-period').text('AM');
    else if ($('.timepicker-period').text() == 'AM')
        $('.timepicker-period').text('PM');
    onChange(element);
}

function AppendButtonActions(element) {
    $(document).ready(function () {
        $('.increment-hour').click(function () {
            incrementHour(element);
        });

        $('.increment-minute').click(function () {
            incrementMinute(element);
        });

        $('.decrement-hour').click(function () {
            decrementHour(element);
        });

        $('.decrement-minute').click(function () {
            decrementMinute(element);
        });

        $('.timepicker-period').click(function () {
            timepickerPeriod(element);
        });
    });
}

function getTimePickerHtml(element) {
    var SelectedTime = getSelectedTime(element);
    template = timePickerHTML
    .replace("{{Hour}}", SelectedTime.hour)
    .replace("{{Minute}}", SelectedTime.minute)
    .replace("{{Period}}", SelectedTime.period);
    return template;
}

var timePickerHTML = "<div class='timepicker'>" +
    "<input class='selectedDate d-none'/>" +
    "<table>" +
    "<tbody>" +
    "<tr>" +
    "<td>" +
    "<button title='Increment Hour' class='timepickerclickable change increment-hour'>" +
    "<span class='fa fa-arrow-up'>" +
    "</span>" +
    "</button>" +
    "</td>" +
    "<td class='separator'>" +
    "</td>" +
    "<td>" +
    "<button title='Increment Minute' class='timepickerclickable change increment-minute'>" +
    "<span class='fa fa-arrow-up'></span>" +
    "</button>" +
    "</td>" +
    "<td class='separator'></td>" +
    "</tr>" +
    "<tr>" +
    "<td>" +
    "<span class='timepicker-hour' data-time-component='hours' title='Pick Hour' data-action='showHours'>{{Hour}}</span>" +
    "</td>" +
    "<td class='separator'>:</td>" +
    "<td><span class='timepicker-minute' data-time-component='minutes' title='Pick Minute' data-action='showMinutes'>{{Minute}}</span></td>" +
    "<td><button class='timepickerclickable timepicker-period' data-action='togglePeriod' tabindex='-1' title='Toggle Period'>{{Period}}</button></td>" +
    "</tr>" +
    "<tr>" +
    "<td>" +
    "<button title='Decrement Hour' class='timepickerclickable change decrement-hour'>" +
    "<span class='fa fa-arrow-down'></span>" +
    "</button>" +
    "</td>" +
    "<td class='separator'></td>" +
    "<td>" +
    "<button title='Decrement Minute' class='timepickerclickable change decrement-minute'>" +
    "<span class='fa fa-arrow-down'></span>" +
    "</button>" +
    "</td>" +
    "<td class='separator'></td>" +
    "</tr>" +
    "</tbody>" +
    "</table>" +
    "</div>";