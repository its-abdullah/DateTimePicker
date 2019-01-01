/* http://keith-wood.name/calendars.html
   Arabic localisation for Gregorian/Julian calendars for jQuery.
   Khaled Al Horani -- خالد الحوراني -- koko.dw@gmail.com.
   Updated by Fahad Alqahtani April 2016. */
/* NOTE: monthNames are the original months names and they are the Arabic names,
   not the new months name فبراير - يناير and there isn't any Arabic roots for these months */
(function($) {
	'use strict';
	$.calendars.calendars.gregorian.prototype.regionalOptions.ar = {
		name: 'Gregorian',
		epochs: ['BCE', 'CE'],
        monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', '	اغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        monthNamesShort: 'يناير_فبراير_مارس_أبريل_مارس_يونيو_يوليو_اغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
		dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
		dayNamesShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
		dayNamesMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
		digits: $.calendars.substituteDigits(['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']),
		dateFormat: 'dd/mm/yyyy',
		firstDay: 1,
		isRTL: true
	};
	if ($.calendars.calendars.julian) {
		$.calendars.calendars.julian.prototype.regionalOptions.ar =
			$.calendars.calendars.gregorian.prototype.regionalOptions.ar;
	}
})(jQuery);
