import React, { Component } from "react";
import Chart from "chart.js/auto";
import { Card } from "react-bootstrap";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

export default class LineChart extends Component {
  chartRef = React.createRef();

  async componentDidMount() {
    const ctx = this.chartRef.current.getContext("2d");

    const labelsData = await getData(
      backend + `/api/guilds/${this.props.guild.id}/logs/labels`
    );
    const bansData = await getData(
      backend + `/api/guilds/${this.props.guild.id}/logs/bans`
    );

    console.log(bansData);

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labelsData.data.labels,
        datasets: [
          {
            data: labelsData.data.data,
            label: "عدد الغرف",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "معلومات متنوعة عن الخادم الخاص بك",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
          },
        },
      },
    });
  }

  render() {
    return (
      <Card>
        معلومات المجتمع: {this.props.guild.name}
        <div>
          <canvas id="myChart" ref={this.chartRef} />
        </div>
      </Card>
    );
  }
}
