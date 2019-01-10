//#region activating Picker
$(document).ready(function() {
    dateTimePicker('.dateTimePicker', {
        hasDatePicker: true,
        hasTimePicker: true
    });
});
//#endregion Activating Picker

var defaultOptions = {
    hasDatePicker: true, 
    hasTimePicker: false,
    language: 'en'
};

function dateTimePicker(elem, options) {
    if (options == null)
        options = defaultOptions;
    
    $(elem).each(function(){
        $(this).wrap(inputGrp);
        if (options.hasTimePicker)
            $(this).after(timeBtn);

        if (options.hasDatePicker)
            $(this).after(dateBtn);

        $($(this).nextAll()).wrapAll(btnWrapper);

        if (options.hasTimePicker)
            $(this).calendarsPicker({
                buttonTrigger: $(this).parent().children('.input-group-append').children('.dateBtn')
            });

        if (options.hasDatePicker) {
            $(this).popover({
                content: getTimePickerHtml(this),
                placement: 'bottom',
                toggle: 'popover',
                trigger: 'manual',
                template: timePickerTemplate,
                html: true,
                closeOnDocClick: true
            })
                .on('show.bs.popover', function () {
                    $('.popover').remove();
                })
                .on('shown.bs.popover', function () {
                    AppendButtonActions(this);
                    var trans = $('.popover').css('transform');
                    var newTrans = trans.substring(trans.indexOf('(') + 1, trans.length - 1)
                        .split(',');
                    newTrans[4] = $(this).offset().left;
                    $('.popover').css('transform', 'matrix(' + newTrans.join(', ') + ')');
                });

            // to close popper when clicked somewhere else
            $('html').on('click', function (e) {
                $('[data-toggle=popover]').each(function () {
                    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                        $(this).parent().prev().popover('hide');
                    }
                });
            });

            $(this).next().children('.timeBtn').click(function () {
                $(this).parent().prev().popover('toggle');
            });
        }
    });
}

//#region setting default options
$.calendarsPicker.defaultOptions["yearRange"] = 'c-70:c+10';
$.calendarsPicker.defaultOptions["dateFormat"] =  'dd/mm/yyyy';
$.calendarsPicker.defaultOptions["showAnim"] =  '';
$.calendarsPicker.defaultOptions["showOnFocus"] =  false;
// $.calendarsPicker.regionalOptions["prevText"] could be set
//#endregion setting default options

// #region button group html
var plugin = $.calendarsPicker; // Singleton instance
var dateBtn = '<button class="btn btn-outline-secondary dateBtn" type="button"><i class="fa fa-calendar"></i></button>';
var timeBtn = '<button class="btn btn-outline-secondary timeBtn" id="trigger" value="timepicker" data-toggle="popover" type="button"><i class="fa fa-clock-o"></i></button>';
var btnWrapper = '<div class="input-group-append"/>';
var inputGrp = '<div class="input-group dateTimePickerInputGrp"/>';
var timePickerTemplate = '<div class="popover dateTimePicker" role="tooltip"><h3 class="popover-header"></h3><div class="popover-body"></div></div>';
// #endregion button group html

//#region adding buttonTrigger option
$.calendarsPicker.regionalOptions[""].buttonTrigger = null;

$.calendarsPicker._instSettings = function(elem, options) { // jshint unused:false
    //buttonTrigger
    if (options.buttonTrigger) {
        $(options.buttonTrigger).click(function(){
            plugin.toggle(elem);
        });
    }
    return {selectedDates: [], drawDate: null, pickingRange: false,
        inline: ($.inArray(elem[0].nodeName.toLowerCase(), ['div', 'span']) > -1),
        get: function(name) { // Get a setting value, computing if necessary
            if ($.inArray(name, ['defaultDate', 'minDate', 'maxDate']) > -1) { // Decode date settings
                return this.options.calendar.determineDate(this.options[name], null,
                    this.selectedDates[0], this.get('dateFormat'), this.getConfig());
            }
            if (name === 'dateFormat') {
                return this.options.dateFormat || this.options.calendar.local.dateFormat;
            }
            return this.options[name];
        },
        curMinDate: function() {
            return (this.pickingRange ? this.selectedDates[0] : this.get('minDate'));
        },
        getConfig: function() {
            return {dayNamesShort: this.options.dayNamesShort, dayNames: this.options.dayNames,
                monthNamesShort: this.options.monthNamesShort, monthNames: this.options.monthNames,
                calculateWeek: this.options.calculateWeek, shortYearCutoff: this.options.shortYearCutoff};
        }
    };
}

$.calendarsPicker._checkExternalClick = function(event) {
    if (!plugin.curInst) {
        return;
    }
    var elem = $(event.target);

    if (elem.closest('.' + plugin._popupClass + ',.' + plugin._triggerClass).length === 0 &&
        !elem.hasClass(plugin._getMarker())
        &&
        (
            plugin.curInst.options.buttonTrigger == null ||
            ($(event.target)[0] != $(plugin.curInst.options.buttonTrigger)[0] &&
            $($(event.target).parent())[0] != $(plugin.curInst.options.buttonTrigger)[0])
        )
    )
    {
        plugin.hide(plugin.curInst);
    }
}

/*Toggle a popup datepicker.
 * @memberof CalendarsPicker
 * @param {Event|Element} elem a focus event or the control to use.
 * @example $(selector).datepick('toggle') */
$.calendarsPicker.toggle = function(elem) {
    if (!elem) {
        return;
    }
    var inst = this._getInst(elem);
    if (inst.div == null) {
        plugin.show(elem);
    }
    else {
        plugin.hide(elem);
    }
},
//#endregion adding buttonTrigger option

//#region adding Date Picker option
$.calendarsPicker.regionalOptions[""].Datepicker = false;
// $.calendarsPicker.defaultRenderer.Datepicker = false;
$.calendarsPicker._updateInput = function(elem, keyUp) {
    var inst = this._getInst(elem);
    if (!$.isEmptyObject(inst)) {
        var value = '';
        var altValue = '';
        var sep = (inst.options.multiSelect ? inst.options.multiSeparator :
            inst.options.rangeSeparator);
        var calendar = inst.options.calendar;
        var dateFormat = inst.get('dateFormat');
        var altFormat = inst.options.altFormat || dateFormat;
        var settings = {localNumbers: inst.options.localNumbers};
        for (var i = 0; i < inst.selectedDates.length; i++) {
            value += (keyUp ? '' : (i > 0 ? sep : '') +
                calendar.formatDate(dateFormat, inst.selectedDates[i], settings));
            altValue += (i > 0 ? sep : '') +
                calendar.formatDate(altFormat, inst.selectedDates[i], settings);
        }
        if (!inst.inline && !keyUp) {
            $(elem).val(value + ' ' + formatTime(getSelectedTime(elem)));
        }
        $(inst.options.altField).val(altValue);

        if ($.isFunction(inst.options.onSelect) && !keyUp && !inst.inSelect) {
            inst.inSelect = true; // Prevent endless loops
            inst.options.onSelect.apply(elem, [inst.selectedDates]);
            inst.inSelect = false;
        }
        $(elem).change();
    }
}

$.calendarsPicker._generateContent = function(elem, inst) {
    var monthsToShow = inst.options.monthsToShow;
    monthsToShow = ($.isArray(monthsToShow) ? monthsToShow : [1, monthsToShow]);
    inst.drawDate = this._checkMinMax(
        inst.drawDate || inst.get('defaultDate') || inst.options.calendar.today(), inst);
    var drawDate = inst.drawDate.newDate().add(-inst.options.monthsOffset, 'm');
    // Generate months
    var monthRows = '';
    for (var row = 0; row < monthsToShow[0]; row++) {
        var months = '';
        for (var col = 0; col < monthsToShow[1]; col++) {
            months += this._generateMonth(elem, inst, drawDate.year(),
                drawDate.month(), inst.options.calendar, inst.options.renderer, (row === 0 && col === 0));
            drawDate.add(1, 'm');
        }
        monthRows += this._prepare(inst.options.renderer.monthRow, inst).replace(/\{months\}/, months);
    }
    var picker = this._prepare(inst.options.renderer.picker, inst).replace(/\{months\}/, monthRows).
        replace(/\{weekHeader\}/g, this._generateDayHeaders(inst, inst.options.calendar, inst.options.renderer));
    // Add timePicker
    if (inst.options.timePicker) {
        picker = picker.replace('<div class="calendars-ctrl">', timePickerHTML + '<div class="calendars-ctrl">');
    }
    // Add commands
    var addCommand = function(type, open, close, name, classes) {
        if (picker.indexOf('{' + type + ':' + name + '}') === -1) {
            return;
        }
        var command = inst.options.commands[name];
        var date = (inst.options.commandsAsDateFormat ? command.date.apply(elem, [inst]) : null);
        picker = picker.replace(new RegExp('\\{' + type + ':' + name + '\\}', 'g'),
            '<' + open + (command.status ? ' title="' + inst.options[command.status] + '"' : '') +
            ' class="' + inst.options.renderer.commandClass + ' ' +
            inst.options.renderer.commandClass + '-' + name + ' ' + classes +
            (command.enabled(inst) ? '' : ' ' + inst.options.renderer.disabledClass) + '">' +
            (date ? date.formatDate(inst.options[command.text], {localNumbers: inst.options.localNumbers}) :
            inst.options[command.text]) + '</' + close + '>');
    };
    for (var name in inst.options.commands) {
        if (inst.options.commands.hasOwnProperty(name)) {
            addCommand('button', 'button type="button"', 'button', name,
                inst.options.renderer.commandButtonClass);
            addCommand('link', 'a href="javascript:void(0)"', 'a', name,
                inst.options.renderer.commandLinkClass);
        }
    }
    picker = $(picker);
    if (monthsToShow[1] > 1) {
        var count = 0;
        $(inst.options.renderer.monthSelector, picker).each(function() {
            var nth = ++count % monthsToShow[1];
            $(this).addClass(nth === 1 ? 'first' : (nth === 0 ? 'last' : ''));
        });
    }
    // Add datepicker behaviour
    var self = this;
    function removeHighlight(elem) {
        (inst.inline ? $(elem).closest('.' + self._getMarker()) : inst.div).
            find(inst.options.renderer.daySelector + ' a').
            removeClass(inst.options.renderer.highlightedClass);
    }
    picker.find(inst.options.renderer.daySelector + ' a').hover(
            function() {
                removeHighlight(this);
                $(this).addClass(inst.options.renderer.highlightedClass);
            },
            function() {
                removeHighlight(this);
            }).
        click(function() {
            self.selectDate(elem, this);
        }).end().
        find('select.' + this._monthYearClass + ':not(.' + this._anyYearClass + ')').
        change(function() {
            var monthYear = $(this).val().split('/');
            self.showMonth(elem, parseInt(monthYear[1], 10), parseInt(monthYear[0], 10));
        }).end().
        find('select.' + this._anyYearClass).click(function() {
            $(this).css('visibility', 'hidden').
                next('input').css({left: this.offsetLeft, top: this.offsetTop,
                width: this.offsetWidth, height: this.offsetHeight}).show().focus();
        }).end().
        find('input.' + self._monthYearClass).change(function() {
            try {
                var year = parseInt($(this).val(), 10);
                year = (isNaN(year) ? inst.drawDate.year() : year);
                self.showMonth(elem, year, inst.drawDate.month(), inst.drawDate.day());
            }
            catch (e) {
                // Ignore
            }
        }).keydown(function(event) {
            if (event.keyCode === 13) { // Enter
                $(event.elem).change();
            }
            else if (event.keyCode === 27) { // Escape
                $(event.elem).hide().prev('select').css('visibility', 'visible');
                inst.elem.focus();
            }
        });
    // Add keyboard handling
    var data = {elem: inst.elem[0]};
    picker.keydown(data, this._keyDown).keypress(data, this._keyPress).keyup(data, this._keyUp);
    // Add command behaviour
    picker.find('.' + inst.options.renderer.commandClass).click(function() {
            if (!$(this).hasClass(inst.options.renderer.disabledClass)) {
                var action = this.className.replace(
                    new RegExp('^.*' + inst.options.renderer.commandClass + '-([^ ]+).*$'), '$1');
                plugin.performAction(elem, action);
            }
        });
    // Add classes
    if (inst.options.isRTL) {
        picker.addClass(inst.options.renderer.rtlClass);
    }
    if (monthsToShow[0] * monthsToShow[1] > 1) {
        picker.addClass(inst.options.renderer.multiClass);
    }
    if (inst.options.pickerClass) {
        picker.addClass(inst.options.pickerClass);
    }
    // Resize
    $('body').append(picker);
    var width = 0;
    picker.find(inst.options.renderer.monthSelector).each(function() {
        width += $(this).outerWidth();
    });
    picker.width(width / monthsToShow[0]);
    // Apeend timePicker actions
    if (inst.options.timePicker) {
        AppendButtonActions(elem, inst);
    }
    // Pre-show customisation
    if ($.isFunction(inst.options.onShow)) {
        inst.options.onShow.apply(elem, [picker, inst.options.calendar, inst]);
    }
    return picker;
}
//#endregion adding Date Picker option