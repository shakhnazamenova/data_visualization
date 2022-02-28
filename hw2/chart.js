async function drawLineChart() {
  // 1. Access data
  let data = await d3.json('my_weather_data.json');

  //console.table(dataset[0]);

  const yAccessor = (d) => d.temperatureMax;

  const yAccessor2 = (d) => d.temperatureLow;

  const dateParser = d3.timeParse('%Y-%m-%d');
  const xAccessor = (d) => dateParser(d.date);

// median
  const medianVal = d3.median(data, yAccessor);
  const medianVal2 = d3.median(data, yAccessor2);

  const disVal = d3.deviation(data, yAccessor);
  const disVal2 = d3.deviation(data, yAccessor2);

  console.log(medianVal);
  console.log(medianVal2);

  // 2. Create chart dimensions

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 600,
    margin: {
      top: 45,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw canvas

  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = wrapper
    .append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  // // 4. Create scales

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor2))
    .range([dimensions.boundedHeight, 0]);

  console.log(yScale(32));

  // console.log(d3.extent(dataset, yAccessor));

  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds
    .append('rect')
    .attr('x', 0)
    .attr('width', dimensions.boundedWidth)
    .attr('y', freezingTemperaturePlacement)
    .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr('fill', '#e0f3f3');

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const lineGenerator = d3.line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const lineGenerator2 = d3.line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor2(d)));

  const line = bounds
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', '#676fac')
    .attr('stroke-width', 2);

  const line2 = bounds.append("path")
    .attr("d", lineGenerator2(data))
    .attr("fill","none")
    .attr("stroke","#a46fac")
    .attr("stroke-width", 1)

  const legendGroup = wrapper.append("g")
  .attr("transform", `translate(${500},${dimensions.width < 800
  ? dimensions.boundedHeight - 600 : dimensions.boundedHeight * 1.2
  })`)

  const legendTitle = legendGroup.append("text")
    .attr("y", -23)
    .attr("class", "legend-title")
    .text(medianVal)

  const legendGroup2 = wrapper.append("g")
    .attr("transform", `translate(${800},${dimensions.width < 800
    ? dimensions.boundedHeight - 600 : dimensions.boundedHeight * 1.2
    })`)

  const legendTitle2 = legendGroup2.append("text")
    .attr("y", -23)
    .attr("class", "legend-title")
    .text(medianVal2)

  const legendGroup3 = wrapper.append("g")
      .attr("transform", `translate(${100},${dimensions.width < 800
      ? dimensions.boundedHeight - 600 : dimensions.boundedHeight * 1.2
      })`)

  const legendTitle3 = legendGroup3.append("text")
      .attr("y", -23)
      .attr("class", "legend-title")
      .text(disVal)

  const legendGroup4 = wrapper.append("g")
          .attr("transform", `translate(${1000},${dimensions.width < 800
          ? dimensions.boundedHeight - 600 : dimensions.boundedHeight * 1.2
          })`)

  const legendTitle4 = legendGroup4.append("text")
          .attr("y", -23)
          .attr("class", "legend-title")
          .text(disVal2)

  const yAxisGenerator = d3.axisLeft().scale(yScale);

  const yAxis = bounds.append('g').call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`);
}

drawLineChart();
