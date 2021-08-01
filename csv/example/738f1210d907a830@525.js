export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# EPA Emissions Bar`
)});
  main.variable(observer("chart_bar")).define("chart_bar", ["d3","width","height","color","data","x","y","tooltip","hoverColor","xAxisPos","xAxisNeg","yAxis"], function(d3,width,height,color,data,x,y,tooltip,hoverColor,xAxisPos,xAxisNeg,yAxis)
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  // Positive values
  const rect_pos = svg
    .append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(data.map(d => (d.Value > 0 ? d : { Value: 0 })))
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", height - y(0))
    .attr("height", 0)
    .attr("width", x.bandwidth())
    .on('mouseover', function(d, i) {
      tooltip
        .html(`<div>Percent Change: ${d3.format(".1%")(d.Value)}</div>`)
        .style('visibility', 'visible');
      d3.select(this)
        .transition()
        .attr('fill', hoverColor);
    })
    .on('mousemove', function() {
      tooltip
        .style('top', d3.event.pageY - 10 + 'px')
        .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function() {
      tooltip.html(``).style('visibility', 'hidden');
      d3.select(this)
        .transition()
        .attr('fill', color);
    });

  rect_pos
    .transition()
    .ease(d3.easeLinear)
    .duration(1200)
    .attr('y', d => y(d.Value))
    .attr('height', d => y(0) - y(d.Value));
  //.delay((d, i) => i * 100);

  // Negative values
  const rect_neg = svg
    .append("g")
    .attr("fill", 'hsl(0, 80%, 60%)') // red, but just not too bright
    .selectAll("rect")
    .data(data.map(d => (d.Value < 0 ? d : { Value: 0 })))
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", d => height - y(0))
    .attr("height", 0)
    .attr("width", x.bandwidth())
    .on('mouseover', function(d, i) {
      tooltip
        .html(`<div>Percent Change: ${d3.format(".1%")(d.Value)}</div>`)
        .style('visibility', 'visible');
      d3.select(this)
        .transition()
        .attr('fill', hoverColor);
    })
    .on('mousemove', function() {
      tooltip
        .style('top', d3.event.pageY - 10 + 'px')
        .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function() {
      tooltip.html(``).style('visibility', 'hidden');
      d3.select(this)
        .transition()
        .attr('fill', 'hsl(0, 80%, 60%)');
    });

  rect_neg
    .transition()
    .ease(d3.easeLinear)
    .duration(1200)
    .attr('y', d => height - y(0))
    .attr('height', d => y(0) - y(-d.Value));
  //.delay((d, i) => i * 100 * 3);

  svg.append("g").call(xAxisPos);

  svg.append("g").call(xAxisNeg);

  svg.append("g").call(yAxis);

  // svg
  //   .append("text")
  //   .attr("y", margin.top / 4)
  //   .attr("x", margin.left)
  //   .attr("dy", "1em")
  //   .style("text-anchor", "middle")
  //   .text("Percent Change")
  //   .style("font-size", 12);

  return svg.node();
}
);
  main.variable(observer("tooltip")).define("tooltip", ["d3"], function(d3){return(
d3
  .select('body')
  .append('div')
  .attr('class', 'd3-tooltip')
  .style('position', 'absolute')
  .style('z-index', '10')
  .style('visibility', 'hidden')
  .style('padding', '10px')
  .style('background', 'rgba(0,0,0,0.6)')
  .style('border-radius', '4px')
  .style('color', '#fff')
  .style('font-size', "18px")
  .style('font-weight', 250)
  .style('font-family', 'FreeMono, monospace')

  .text('a simple tooltip')
)});
  main.variable(observer("hoverColor")).define("hoverColor", function(){return(
'#eec42d'
)});
  main.variable(observer("data_raw")).define("data_raw", ["d3"], function(d3){return(
d3.csv(
  "https://raw.githubusercontent.com/isaack8/final-project-cse412/main/data/EPA_percent_change.csv",
  d3.autoType
)
)});
  main.variable(observer("sort")).define("sort", ["d3"], function(d3){return(
data => data.sort((a, b) => d3.descending(a.Value, b.Value))
)});
  main.variable(observer("data")).define("data", ["sort","data_raw"], function(sort,data_raw){return(
sort(data_raw)
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3
  .scaleBand()
  .domain(d3.range(data.length))
  .range([margin.left, width - margin.right])
  .padding(0.1)
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin)
{
  // Find the largest absolute value
  const absMax = d3.max(data, d => Math.abs(d.Value))
  // Use that for the scale
  return d3.scaleLinear()
    .domain([-absMax, absMax]).nice()
    .range([height - margin.bottom, margin.top])
}
);
  main.variable(observer("xAxisPos")).define("xAxisPos", ["height","d3","x","data"], function(height,d3,x,data){return(
g => g
    .attr("transform", `translate(0,${height / 2})`)
    .call(d3.axisBottom(x).tickFormat(i => data[i].Source).tickSizeOuter(0))
    .selectAll('g.tick')
      .attr('display', i => data[i].Value < 0 ? 'none' : '')
)});
  main.variable(observer("xAxisNeg")).define("xAxisNeg", ["height","d3","x","data"], function(height,d3,x,data){return(
g => g
    .attr("transform", `translate(0,${height / 2})`)
    .call(d3.axisTop(x).tickFormat(i => data[i].Source).tickSizeOuter(0))
    .selectAll('g.tick')
      .attr('display', i => data[i].Value > 0 ? 'none' : '')
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, data.format).tickFormat(function(d){return d*100+ "%"}))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y))
)});
  main.variable(observer("color")).define("color", function(){return(
"steelblue"
)});
  main.variable(observer("height")).define("height", function(){return(
300
)});
  main.variable(observer("width")).define("width", function(){return(
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
{ top: 30, right: 60, bottom: 30, left: 60 }
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
