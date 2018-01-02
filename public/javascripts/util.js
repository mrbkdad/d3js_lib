var leftpad= function(str, len, pad){
	var s= str+'';
	var c = pad || '0';
	while(s.length< len) s= c+ s;
	return s;
}
var yyyymmdd = function(del){
	var today = new Date();
	var del = del || '-';
	today = today.getFullYear() + del +
		padZero(today.getMonth()+1,2) + del +
		padZero(today.getDate(),2);
var hhmi = function(del){
	var today = new Date();
	var del = del || ':';
	time = today.getHours() + del + today.getMinutes();
}
