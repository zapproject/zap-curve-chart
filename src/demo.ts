import { CurveLineChart } from "./CurveLineChart";

const container = document.getElementById('charts');

const lineChart = new CurveLineChart(container);
lineChart.draw([1, 6e18, 1000000000, 1, 3e18, 2000000000], 990000000);
