function histogramChart () {
    var margin = {top: 5, right: 5, bottom: 40, left: 50},
        width = 600,
        height = 300

    var color = d3.scale.threshold()
    // .range(["#f7f7f7","#252525"]);

    var histogram = d3.layout.histogram(),
        x = d3.scale.ordinal().rangeRoundBands([0, width], .05),
        y = d3.scale.linear(),
        xAxis = d3.svg.axis().scale(x).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left")

    var xAxisLabel = ''
    var yAxisLabel = ''

    var shadeArea = false

    function chart(selection) {
        selection.each(function(data) {

            // Update the x-scale.
            x   .domain( data.map(function(d) { return d.year; }) );
                // .range([0, width - margin.left - margin.right]);

            // Update the y-scale.
            y   .domain([0, d3.max(data, function(d) { return d.value + 15; })])
                .range([height - margin.top - margin.bottom, 0]);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            var shadedArea = gEnter.append('g').attr('class', 'shaded')
            gEnter.append("g").attr("class", "bars");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // Update the bars.
            var bar = svg.select(".bars").selectAll(".bar").data(data);
            bar.enter().append("rect").attr('class', 'bar');
            bar.exit().transition().duration(1000).attr('fill', '#fff' ).remove();
            bar .attr("x", function(d) { return x(d.year); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return y.range()[0] - y(d.value); })
                .attr("fill", "#3f7297")
                .order();
            bar.transition().duration(1000);

            // Add value labels.
            var label = svg.selectAll(".text").data(data);
            label.enter().append("text").attr('class', 'label')
                .attr("x", (function(d) {
                    return labelPosition(x.rangeBand(), x(d.year), margin.left);
                }))
                .attr("y", (function(d) { return y.range()[0] / 2 + y(d.value) / 2;}))
                .attr("dy", "1em")
                .attr("fill", "#ffffff")
                .text(function(d) { return d.value; });

            // Add percentage labels.
            var label = svg.selectAll(".text").data(data);
            label.enter().append("text").attr('class', "label pct-label")
                .attr("x", (function(d) {
                    return labelPosition(x.rangeBand(), x(d.year), margin.left);
                }))
                .attr("y", (function(d) { return y(d.value) - 20;}))
                .attr("dy", "1em")
                .attr('fill', (function(d) {
                    if (d.pctChange <= 0) {
                        return 'green';
                    }
                    else {
                        return 'red';
                    }
                }))
                .text(function(d) {
                    if (d.pctChange <= 0) {
                        return '\u2193' + (d.pctChange * -1) + '%';
                    }
                    else {
                        return '\u2191' + d.pctChange + '%';
                    }
                });

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0," + y.range()[0] + ")")
                .call(xAxis)
            svg.selectAll('.xlabel').remove()
            svg.append('text')
                .attr("transform", "translate(" + (width ) + "," + (height - 4) + ")")
                .attr('class', 'axis axislabel xlabel')
                .style("text-anchor", "end")
                .text(xAxisLabel)

            // Update the y-axis.
            g.selectAll(".y.axis")
                .attr("transform", "translate(" + x.range()[0] + ",0)")
                .call(yAxis)
            svg.selectAll('.ylabel').remove()
            svg.append('text')
                .attr("transform", "translate(" + (margin.left - 35) + "," + (margin.top) + ")rotate(-90)")
                .attr('class', 'axis axislabel ylabel')
                .style("text-anchor", "end")
                .text(yAxisLabel)
        });
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        for (prop in _) {
            margin[prop] = _[prop];
        }
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.colorRange = function(_) {
        if (!arguments.length) return color.range();
        color.range(_);
        return chart;
    };

    chart.colorDomain = function(_) {
        if (!arguments.length) return color.domain();
        color.domain(_);
        return chart;
    };

    chart.colorScale = function(_) {
        if (!arguments.length) return {domain: color.domain(), range: color.range()};
        color = _;
        return chart;
    };

    chart.xAxisLabel = function(_) {
        if (!arguments.length) return xAxisLabel;
        xAxisLabel = _;
        return chart;
    };

    chart.yAxisLabel = function(_) {
        if (!arguments.length) return yAxisLabel;
        yAxisLabel = _;
        return chart;
    };

    chart.xScale = function(_) {
        if (!arguments.length) return x;
        return chart;
    };
    chart.yScale = function(_) {
        if (!arguments.length) return y;
        return chart;
    };

    chart.shadeArea = function(_) {
        if (!arguments.length) return shadeArea;
        shadeArea = _;
        return chart;
    };

    // Expose the histogram's value, range and bins method.
    d3.rebind(chart, histogram, "value", "range", "bins");

    // Expose the axis' tickFormat method.
    d3.rebind(chart, xAxis, "tickFormat");
    d3.rebind(chart, yAxis, "tickFormat");

    return chart;
}

function labelPosition(width, position, offset) {
    return (width / 2) + position + offset;
}

module.exports = histogramChart