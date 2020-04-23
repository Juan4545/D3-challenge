var svgWidth = 660;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

 
 var chosenXAxis = "poverty";
 var chosenYAxis = "healthcare";

function xScale(health_risk_data, chosenXAxis) {
  
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(health_risk_data, d => d[chosenXAxis]) * .9 ,
      d3.max(health_risk_data, d => d[chosenXAxis]) 
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(health_risk_data, chosenYAxis){
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(health_risk_data, d => d[chosenYAxis])  ,
      d3.min(health_risk_data, d => d[chosenYAxis]) * .82
    ])
    .range([0, width]);

  return yLinearScale;

}

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclestext(textGroup, newXScale, chosenXAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));


  return textGroup;
}


d3.csv("assets/data/data.csv").then(function(health_risk_data, err) {
  if (err) throw err;
  var poverty=[];
  var healthcare=[];
  // parse data
  health_risk_data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = + data.age;
    data.income = + data.income;

    data.obesity = + data.obesity;
    data.smokes = + data.smokes;
  });

  console.log(health_risk_data)

 var xLinearScale = xScale(health_risk_data, chosenXAxis);
 var yLinearScale = yScale(health_risk_data, chosenYAxis);

 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

 var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(health_risk_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "#88b3c1")
    .attr("opacity", ".5");

  var textGroup = chartGroup.selectAll('.stateText')
    .data(health_risk_data)
    .enter()
    .append('text')
    .attr('x', d => xLinearScale(d[chosenXAxis]))
    .attr('y', d => yLinearScale(d[chosenYAxis]))
    .attr('dy',3)
    .attr('dx',-6)
    .attr('font-size', '10px')
    .text(function(d){return d.abbr});



      // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var labelsGroup2 = chartGroup.append("g")
    .attr("transform", `translate(${margin.left -80}, ${margin.top})`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x",-35)
    .attr("y", 20)
    .attr("value", "poverty")
    .text("In Poverty");


  var agelabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age(Median)");


  var houselabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Household Income(Median)");



  var lackh = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", -70 - (height / 2))
    .attr("value", "lack")
    .text("Lacks healthcare (%)");




  var smoke = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr("value", "smoke")
    .classed("inactive", true)
    .text("Smoke (%)");

  var obesity = labelsGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obesity (%)");




labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log(value)
      if (value !== chosenXAxis) {
        chosenXAxis = value;

        xLinearScale = xScale(health_risk_data, chosenXAxis);
       
        xAxis = renderXAxes(xLinearScale,xAxis);

        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        textGroup = renderCirclestext(textGroup,xLinearScale,chosenXAxis);

      if (chosenXAxis === "poverty") {
         hairLengthLabel
            .attr("x",0)
            .classed("active", true)
            .classed("inactive", false);
          agelabel
            .classed("active", false)
            .classed("inactive", true);   
          houselabel
            .classed("active", false)
            .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {

          hairLengthLabel
            .attr("x",0)
            .classed("active", false)
            .classed("inactive", true);
          agelabel
            .classed("active", true)
            .classed("inactive", false);   
          houselabel
            .classed("active", false)
            .classed("inactive", true);
          }
          else{

          hairLengthLabel
            .attr("x",0)
            .classed("active", false)
            .classed("inactive", true);
          agelabel
            .classed("active", false)
            .classed("inactive", true);   
          houselabel
            .classed("active", true)
            .classed("inactive", false);


          }

        }

    });

labelsGroup2.selectAll("text")
    .on("click", function() {

    var value2 = d3.select(this).attr("value");
      console.log(value2)
      if (value2 !== chosenYAxis) {
        chosenYAxis = value2;

        yLinearScale = yScale(health_risk_data, chosenYAxis);
       
        yAxis = renderYAxes(yLinearScale,yAxis);



         if (chosenYAxis === "lack") {
         lackh
            .attr("x", 0 - (height / 2))
            .classed("active", true)
            .classed("inactive", false);
          smoke
            .classed("active", false)
            .classed("inactive", true);   
          obesity
            .classed("active", false)
            .classed("inactive", true);
          }
          else if (chosenYAxis === "smoke") {

          lackh
            .attr("x", 0 - (height / 2))
            .classed("active", false)
            .classed("inactive", true);
          smoke
            .classed("active", true)
            .classed("inactive", false);   
          obesity
            .classed("active", false)
            .classed("inactive", true);
          }
          else{

          lackh
            .attr("x", 0 - (height / 2))
            .classed("active", false)
            .classed("inactive", true);
          smoke
            .classed("active", false)
            .classed("inactive", true);   
          obesity
            .classed("active", true)
            .classed("inactive", false);


          }

        }



    });



}).catch(function(error) {
  console.log(error);
});


