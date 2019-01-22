import '@babel/polyfill';
import histogramChart from './shared-js/histogram-chart.js'
import {rankBuildings} from './js/dataManipulation.js'
import {arrayQuartiles, objArrayToSortedNumArray} from './js/helpers.js'
import {Dashboard} from './js/dashboard.js'
import legend from './shared-js/legend.js'
import './css/dashboard.css'

import logo from './assets/sf_logo_white.png'
var sfLogo = new Image()
sfLogo.src = logo
sfLogo.alt = 'SF Dept of Environment'
sfLogo.style.height = '60px';
sfLogo.style.width = '184px';
document.getElementsByClassName('navbar-brand')[0].appendChild(sfLogo)

/* page elements */
var estarHistogramElement = d3.select('#energy-star-score-histogram')
var estarWidth = 500;
var estarHistogram = histogramChart()
  .width(estarWidth)
  .height(250)
  .shadeArea(Dashboard.colorSwatches.shaded)
  .range([0, 110])
  .tickFormat(d3.format(',d'))

Dashboard.displayPage = 'estar'

/** @function handlePropertyTypeResponse
 * do something with the returned data
 * @param {array} rows - returned from consumer.query.getRows
 */
Dashboard.handlePropertyTypeResponse = function (rows) {
  Dashboard.singleBuildingData.PropertyInGroup = true;

  Dashboard.cleanAndFilter(rows)
  let estarVals = objArrayToSortedNumArray(Dashboard.categoryData, 'latest_energy_star_score')
  estarVals = estarVals.filter(function (d) { return d > 0 })

  let euiVals = objArrayToSortedNumArray(Dashboard.categoryData, 'latest_site_eui_kbtu_ft2')
  euiVals = euiVals.filter(function (d) { return d > 1 && d < 1000 })

  if (Object.keys(Dashboard.groups).indexOf(Dashboard.singleBuildingData.property_type_self_selected) === -1) {
    // no local ranking on estar if not in one of groups
    Dashboard.singleBuildingData.PropertyInGroup = false;
  }
  else {
    Dashboard.singleBuildingData.localRank = rankBuildings(Dashboard.singleBuildingData.ID, Dashboard.categoryData);
  }
  var estarQuartiles = arrayQuartiles(estarVals)
  Dashboard.color.energy_star_score.domain(estarQuartiles)
  Dashboard.color.ranking.domain([ 0.25 * Dashboard.singleBuildingData.localRank[1],
    0.5 * Dashboard.singleBuildingData.localRank[1],
    0.75 * Dashboard.singleBuildingData.localRank[1] ])
  if (Dashboard.singleBuildingData.PropertyInGroup) {

    /* draw histogram for energy star */
    estarHistogram
        .colorScale(Dashboard.color.energy_star_score)
        .bins(20)
        .xAxisLabel('Energy Star Score')
        .yAxisLabel('# of Buildings')
    estarHistogramElement.datum(estarVals).call(estarHistogram)
    legend('energy_star_score', 'Building Percentile', Dashboard.colorSwatches, true)
    if (Dashboard.singleBuildingData.latest_benchmark === 'Complied') {
      estarHistogramElement.call(Dashboard.addHighlightLine,
          Dashboard.singleBuildingData.latest_energy_star_score,
          estarHistogram,
          Dashboard.singleBuildingData.building_name)
      d3.selectAll('.local-ranking-container').classed('hidden', false)
    }
  }
  else {
    d3.selectAll('.local-ranking-container').classed('hidden', true);
    d3.selectAll('.chart-title').classed('hidden', true);
    d3.selectAll('.estar-ranking-text').classed('hidden', true);
    d3.selectAll('.estar-non-local-ranking').classed('hidden', false);
  }


  Dashboard.populateInfoBoxes(Dashboard.singleBuildingData, Dashboard.categoryData, Dashboard.floorAreaRange)

  $('#view-load').addClass('hidden')
  $('#view-content').removeClass('hidden')
}

setTimeout(Dashboard.setSidePanelHeight, 1000)

Dashboard.startQuery()
