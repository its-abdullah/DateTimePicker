/* Time Picker extension for jQuery Calendars
   Written by Abdullah Alhussain */

function generateTime() {
    var time =
        $('.timepicker-hour').text() +
        ':' +
        $('.timepicker-minute').text() +
        ' ' +
        $('.timepicker-period').text();
    return time;
}

function onChange(element) {
    selectedDate = $(element).val().split(' ')[0];
    if (selectedDate === "") {
        var datePickerOptions = $('body > div:nth-child(2) > div > input').calendarsPicker('option');
        selectedDate = datePickerOptions.calendar.today().formatDate(datePickerOptions.dateFormat);
    }
    $(element).val(selectedDate + ' ' + generateTime());
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

var timePickerHTML = "<div class='timepicker'>" + //dropdown-menu
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
    //"<a href='#' tabindex='-1' title='Increment Minute' class='timepickerclickable change increment-minute' data-action='incrementMinutes'>" +
    "<button title='Increment Minute' class='timepickerclickable change increment-minute'>" +
    "<span class='fa fa-arrow-up'></span>" +
    "</button>" +
    "</td>" +
    "<td class='separator'></td>" +
    "</tr>" +
    "<tr>" +
    "<td>" +
    "<span class='timepicker-hour' data-time-component='hours' title='Pick Hour' data-action='showHours'>02</span>" +
    "</td>" +
    "<td class='separator'>:</td>" +
    "<td><span class='timepicker-minute' data-time-component='minutes' title='Pick Minute' data-action='showMinutes'>53</span></td>" +
    "<td><button class='timepickerclickable timepicker-period' data-action='togglePeriod' tabindex='-1' title='Toggle Period'>PM</button></td>" +
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