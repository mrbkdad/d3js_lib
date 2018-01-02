/*
basic function for d3js
- line, area, arc, boxplot
*/

/*
scatter plot
data structure

var plotData = {
  width:500,
  height:500,
  pad:30,
  r:5,
  data:[
    {x:5,y:22000},
    {x:3,y:18000},
    {x:10,y:88000},
  ]
};

additional things
tickSizet : tick line size
ticks : the number of display on the screen

style : user preference => css
*/
function scatter(data,parrent=null){
  //extent, scale, axis
  var xExtent = d3.extent(data.data,(d)=>{
    return d.x;
  });
  var yExtent = d3.extent(data.data,(d)=>{
    return d.y;
  });
  var xScale = d3.scaleLinear().domain(xExtent)
    .range([data.pad,data.width-data.pad]);
  var yScale = d3.scaleLinear().domain(yExtent)
    .range([data.height-data.pad,data.pad]);
  var xAxis = d3.axisBottom().scale(xScale)
    .tickSize(-data.height+2*data.pad);//.ticks(4);
  var yAxis = d3.axisLeft().scale(yScale)
    .tickSize(-data.width+2*data.pad);//.ticks(16)

  // create svg
  var svg = null;
  if(parrent==null){
    var svg = d3.select('body').append('svg')
      .attr('width',data.width).attr('height',data.height);
  }else{
    svg = parrent;
    svg.attr('width',data.width).attr('height',data.height)
  }
  //plot axis
  svg.append('g').attr('id','xAxisG').call(xAxis)
  .attr('transform','translate(0,'+(data.height-data.pad)+')');
  svg.append('g').attr('id','yAxisG').call(yAxis)
  .attr('transform','translate('+data.pad+',0)');

  //plot scatter
  svg.selectAll('circle').data(data.data).enter()
    .append('circle').attr('r',data.r)
    .attr('cx',(d)=>{return xScale(d.x);})
    .attr('cy',(d)=>{return yScale(d.y);});
}

/*
box plot
data structure

var plotData = {
  width:500,
  height:500,
  pad:30,
  r:5,
  data:[
    {x:5,median:50,max:80,min:30,q1:45,q3:70},
  ]
};

additional things
tickSizet : tick line size
ticks : the number of display on the screen

style : user preference => css

draw_box_plot(p,d) : draw box plot
draw_one_box_plot(p,d) : draw one box object
caution : one box plot's data must be % number expect x.
*/
function draw_one_box_plot(p,d){
  // data structure : max,min,median,q1,q3
  p.append('line').attr('class','range')
    .attr('x1',0).attr('x2',0)
    .attr('y1',d.max-d.median)
    .attr('y2',d.min-d.median);
  //Max, Min line
  p.append('line').attr('class','max')
    .attr('x1',-10).attr('x2',10)
    .attr('y1',d.max-d.median)
    .attr('y2',d.max-d.median);
  p.append('line').attr('class','min')
    .attr('x1',-10).attr('x2',10)
    .attr('y1',d.min-d.median)
    .attr('y2',d.min-d.median);
  //quantile box
  p.append('rect').attr('width',20)
    .attr('x',-10)
    .attr('y',d.q3-d.median)
    .attr('height',d.q1-d.q3)
    .attr('fill','lightgray').style('stroke','black')
    .style('opacity',0.9);
  //median line
  p.append('line').attr('class','min')
    .attr('x1',-10).attr('x2',10)
    .attr('y1',0).attr('y2',0)
    .style('stroke','gray').style('stroke-width','4px');

}
