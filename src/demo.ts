import { CurveLineChart } from "./CurveLineChart";
import { CurveDoughnutChart } from "./CurveDoughnutChart";
import { CurveSvgLineChart } from "./CurveSvgLineChart";
import { CurveDoughnutChartSvg } from "./CurveDoughnutChartSvg";
import { BondHistoryLineChart } from "./BondHistoryLineChart";
import { BondHistorySvgLineChart } from "./BondHistorySvgLineChart";

const container = document.getElementById('charts');

const lineChart = new CurveLineChart(container, {maxDots: 150});
lineChart.draw([1, 6e18, 1000000000, 1, 3e18, 2000000000], 990000000);

const svgChart = new CurveSvgLineChart(container);
svgChart.draw([1, 6e18, 1000000000, 1, 3e18, 2000000000], 990000000);

const svgChart2 = new CurveSvgLineChart(container, undefined, {
  backgroundColor: 'white',
  borderColor: 'black',
  pointBorderColor: 'black',
  pointBackgroundColor: 'black',
}, {
  shadowRadius: 0,
});
svgChart2.draw([2, 0, 1, 10, 3, 0, 0, 1, 20, 2, 0, 1, 50], 10);

const lineChart2 = new CurveLineChart(
  container,
  {maxDots: 150},
  {
    backgroundColor: 'white',
    borderColor: 'black',
    pointBorderColor: 'black',
    pointBackgroundColor: 'black',
  },
  {
    shadowBlur: 0,
    shadowColor: 'black',
    shadowRadius: 1,
  }
);
lineChart2.draw([2, 0, 1, 10, 3, 0, 0, 1, 20, 2, 0, 1, 50], 10);

const doughnutChart = new CurveDoughnutChart(container);
doughnutChart.draw([4,0,0,2,3,1000,3,0,0,2000000000000000000,2000], 1322, 20);

const doughnutChartSvg = new CurveDoughnutChartSvg(container);
doughnutChartSvg.drawSvg([4,0,0,2,3,1000,3,0,0,2000000000000000000,20000], 10000, 1020);

const historyChart = new BondHistoryLineChart(container);
const historySvgChart = new BondHistorySvgLineChart(container);
historyChart.draw([1,2,3,4,5,7,99,1]);
historySvgChart.draw([1,2,3,4,5,7,99,1]);



window.addEventListener("resize", e => {
  svgChart.updateWidth(container.offsetWidth);
  svgChart.draw([1, 6e18, 1000000000, 1, 3e18, 2000000000], 990000000);
});