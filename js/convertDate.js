function convertDates(name, date) { 
    try { 
	var calanderFrom = $.calendars.instance(name);
	var date = calanderFrom.parseDate('dd/mm/yyyy', date);
	var jd = calanderFrom.newDate(date).toJD();
    } 
    catch (e) {
        console.log(e); 
        return; 
    } 
	
	if(name == 'gregorian')
	{
		var convertTo = 'ummalqura';
	}
	else if(name == 'ummalqura')
	{
		var convertTo = 'gregorian';
	}
	
	try {
	var calanderTo = $.calendars.instance(convertTo);
	var date = calanderTo.fromJD(jd);
	date = date.formatDate('dd/mm/yyyy');
    return date;
	}
	catch (e) {
        console.log(e); 
        return; 
    } 
}