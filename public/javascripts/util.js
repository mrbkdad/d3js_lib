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

//JSON Data => Stack Data for area plot
// element : {x, y} => y : array(accumulative data)
function make_stack_data(data){
	var stack_arr=[];
	var col = data.columns;
	data.forEach((d)=>{
			var el = {x:d[col[0]],y:[]};
		for(i in col.slice(1)){
			el.y.push(parseInt(d[col[i]])+(el.y.length==0?0:el.y[el.y.length-1]));
			}
			stack_arr.push(el);
	});
	return stack_arr;
}
