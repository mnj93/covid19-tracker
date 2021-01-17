import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from "numeral";

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ caseType }) {
  const [chartData, setChartData] = useState([]);

  const buildChartData = (data, caseType) => {
    const _chartData = [];
    let lastChartDataPoint;
    console.log('building chart data with type ', caseType);
    Object.keys(data[caseType]).forEach(date => {
      if(lastChartDataPoint){
        const obj = {
          x: date,
          y: data[caseType][date] - lastChartDataPoint
        }
        _chartData.push(obj);
      }
      lastChartDataPoint = data[caseType][date];
    });
    return _chartData;
  }

  useEffect(() => {
    const fetchChartData = async () => {
      const response = await fetch('https://corona.lmao.ninja/v2/historical/all?lastdays=120', requestOptions);
      const data = await response.json();

      const chartData = buildChartData(data, caseType);

      console.log("chart data =>>>> ", chartData);
      setChartData(chartData);
      // console.log(data);
    }
    fetchChartData();
  }, [caseType])
  return (
    <div className="lineGraph">
      {
        chartData?.length > 0 ? <Line
        data={
          {
            datasets:[
            {
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: chartData
            }
          ]
        }
        }
        options={options}
      /> : null
      }

    </div>
  )
}

export default LineGraph;
