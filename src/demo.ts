import { CurveLineChart } from "./CurveLineChart";
import { CurveDoughnutChart } from "./CurveDoughnutChart";

const container = document.getElementById('charts');

const lineChart = new CurveLineChart(container);
lineChart.draw([1, 6e18, 1000000000, 1, 3e18, 2000000000], 990000000);

const doughnutChart = new CurveDoughnutChart(container);
doughnutChart.draw([4,0,0,2,3,1000,3,0,0,2000000000000000000,2000], 1322, 20);
