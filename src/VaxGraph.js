import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      backgroundColor: "00ff00",
    },
  },
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("0,0");
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
function VaxGraph({ casesType, selectedCountry }) {
  const [cases, setCases] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const url =
      selectedCountry == "worldwide"
        ? "https://disease.sh/v3/covid-19/historical/all?lastdays=30"
        : `https://disease.sh/v3/covid-19/historical/${selectedCountry}?lastdays=30`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data = data["timeline"] ? data["timeline"] : data;
        const c = [];
        const l = [];
        for (const [date, value] of Object.entries(data[casesType])) {
          console.log(date, value);
          c.push(value);
          l.push(date);
        }
        setLabels(l);
        setCases(c);
      });
  }, [casesType, selectedCountry]);
  return (
    <div>
      {Object.keys(cases).length != 0 ? (
        <Line
          options={options}
          data={{
            labels: labels,
            datasets: [
              {
                label: "cases",
                data: cases,
                borderColor: casesType == "recovered" ? "green" : "red",
                backgroundColor:
                  casesType == "recovered"
                    ? "rgba(100,255,100,0.5)"
                    : "rgba(255,100,100,0.5)",
              },
            ],
          }}
        />
      ) : (
        <h1>h</h1>
      )}
    </div>
  );
}

export default VaxGraph;
