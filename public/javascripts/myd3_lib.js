/*
basic function for d3js
- line, area, arc, boxplot
*/

// initialize svg window
//data : width, height, pad, extend{x:[],y:[]}
function init_svg(data){
  d3.select('svg').style('width',data.width).style('height',data.height);
  var xExtent = d3.extent(scatterData[0],(d)=>{
    return d.x;
  });
  var yExtent = d3.extent(scatterData,(d)=>{
    return d.y;
  });
  var xScale = d3.scaleLinear().domain(data.extent.x)
    .range([data.pad,data.width-data.pad]);
  var yScale = d3.scaleLinear().domain(data.extent.y)
    .range([data.height-data.pad,data.pad]);

  var xAxis = d3.axisBottom().scale(xScale)
    .tickSize(-data.height+2*data.pad);;
  var yAxis = d3.axisLeft().scale(yScale)
    .tickSize(-data.widht+2*data.pad);

  //axis
  d3.select('svg').append('g').attr('id','xAxisG').call(xAxis)
  .attr('transform','translate(0,'+(h-p)+')');
  d3.select('svg').append('g').attr('id','yAxisG').call(yAxis)
  .attr('transform','translate('+p+',0)');
  //board
  d3.select('#xAxisG > path.domain').style('display','none');
  d3.select('#yAxisG > path.domain').style('display','none');
  //스케일 계산 함수 리턴
  return function(p,tp='x'){
    if(tp=='x'){
      return xScale(p);
    }else{
      return yScale(p);
    }
  }
}


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
  //border
  svg.select('#xAxisG > path.domain').style('display','none');
  svg.select('#yAxisG > path.domain').style('display','none');

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
function boxplot(data,parrent=null){
  //extent, scale, axis
  var xExtent = d3.extent(data.data,(d)=>{
    return d.x;
  });
  var yExtent = d3.extent(data.data,(d)=>{
    return d.median;
  });

  xExtent[1] = xExtent[1]+1; // box x range +1
  yExtent = [0,100]; // box y range 100%
  var xScale = d3.scaleLinear().domain(xExtent).range([data.pad,data.width-data.pad]);
  var yScale = d3.scaleLinear().domain(yExtent).range([data.height-data.pad,data.pad]);

  var xAxis = d3.axisBottom().scale(xScale).tickSize(-data.height+2*data.pad);
                //.tickValues([1,2,3,4,5,6,7]);//.ticks(7);
  var yAxis = d3.axisRight().scale(yScale).ticks(16).tickSize(-data.width+data.pad);
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
  .attr('transform','translate('+(data.width-data.pad)+',0)');
  //border
  svg.select('#xAxisG > path.domain').style('display','none');
  svg.select('#yAxisG > path.domain').style('display','none');


  svg.selectAll('circle.median')
    .data(data.data).enter()
    .append('circle').attr('class','tweets')
    .attr('r',data.r)
    .attr('cx',(d)=>{return xScale(d.x);})
    .attr('cy',(d)=>{return yScale(d.median)})
    .style('fill','darkgray');

  svg.selectAll('g.box')
    .data(data.data).enter()
    .append('g').attr('class','box')
    .attr('transform',(d)=>{
      return 'translate('+xScale(d.x)+','+yScale(d.median)+')';
    }).each((d,i,n)=>{// n - node list
      //console.log(n);
      var boxData = {
        min:yScale(d.min),
        max:yScale(d.max),
        median:yScale(d.median),
        q1:yScale(d.q1),
        q3:yScale(d.q3)
      }
      draw_one_box_plot(d3.select(n[i]),boxData);
    });
}
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

/*
line plot
data structure

var plotData = {
  width:500,
  height:500,
  pad:30,
  r:5,
  lc:['red','blue','green'],// line group color
  data:[
    {x:5,y:50,c:'grey',line:0},
    //line : group number
  ]
};

additional things
tickSizet : tick line size
ticks : the number of display on the screen

style : user preference => css

lineplot(d,p) : draw line plot
*/
function lineplot(data,line_tp=0,parrent=null){
  //extent, scale, axis
  var xExtent = d3.extent(data.data,(d)=>{
    return d.x;
  });
  var yExtent = d3.extent(data.data,(d)=>{
    return d.y;
  });

  var xScale = d3.scaleLinear().domain(xExtent).range([data.pad,data.width-data.pad]);
  var yScale = d3.scaleLinear().domain(yExtent).range([data.height-data.pad,data.pad]);

  var xAxis = d3.axisBottom().scale(xScale).tickSize(-data.height+2*data.pad);
  var yAxis = d3.axisLeft().scale(yScale).ticks(16).tickSize(-data.width+2*data.pad);
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
  //border
  //svg.select('#xAxisG > path.domain').style('display','none');
  //svg.select('#yAxisG > path.domain').style('display','none');


  //bind data & plot
  svg.selectAll('circle')
    .data(data.data).enter()
    .append('circle').attr('r',5)
    .attr('cx',(d,i)=>{
      return xScale(d.x);
    }).attr('cy',(d,i)=>{
      return yScale(d.y);
    }).style('fill',(d,i)=>{ return d.c;});

  //interpolate
  var interpolate_tp = [d3.curveLinear,d3.curveStepBefore,d3.curveStepAfter,d3.curveBasis,
    d3.curveBasisOpen, d3.curveBasisClosed, d3.curveBundle,d3.curveCardinal,d3.curveCardinal,
    d3.curveCardinalOpen,d3.curveCardinalClosed,d3.curveNatural];
  //line
  var line = d3.line()
    .x((d)=>{ return xScale(d.x)})
    .y((d)=>{ return yScale(d.y)})
    .curve(interpolate_tp[line_tp]);
  for(let i in data.lc){
    svg.append('path')
      .attr('d',line(data.data.filter((d)=>{return d.line==i;})))
      .attr('fill','none')
      .attr('stroke',data.lc[i])
      .attr('stroke-width',2);
  }
}
