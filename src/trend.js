import '@babel/polyfill';
import trendChart from './shared-js/trend-chart.js'
import {arrayQuartiles, objArrayToSortedNumArray} from './js/helpers.js'
import {Dashboard} from './js/dashboard.js'

import './css/dashboard.css'
import logo from './assets/sf_logo_white.png'

var sfLogo = new Image()
sfLogo.src = logo
sfLogo.alt = 'SF Dept of Environment'
sfLogo.style.height = '60px';
sfLogo.style.width = '184px';
document.getElementsByClassName('navbar-brand')[0].appendChild(sfLogo)

/* page elements */
var trendHistogramElement = d3.select('#trend-histogram')
var width = 650;
var trendHistogram = trendChart()
    .width(width)
    .height(300)
    .range([0, 1650])
    .tickFormat(d3.format(',d'))

Dashboard.displayPage = 'trend'

/** @function handlePropertyTypeResponse
 * do something with the returned data
 * @param {array} rows - returned from consumer.query.getRows
 */
Dashboard.handlePropertyTypeResponse = function (rows) {
    Dashboard.cleanAndFilter(rows)
    let trendVals = Dashboard.singleBuildingData['weather_normalized_trends'].reverse();

    /* draw histogram for ghg */
    trendHistogram
        .range([0, d3.max(trendVals)])
        .colorScale(Dashboard.color.total_ghg_emissions_intensity_kgco2e_ft2)
        .bins(100)
        .yAxisLabel('Energy Use Intensity (kBtu/sqft)')
    trendHistogramElement.datum(trendVals).call(trendHistogram)
    Dashboard.populateInfoBoxes(Dashboard.singleBuildingData, Dashboard.categoryData, Dashboard.floorAreaRange)

    $('#view-load').addClass('hidden')
    $('#view-content').removeClass('hidden')
}

setTimeout(Dashboard.setSidePanelHeight, 1000)

Dashboard.startQuery()
