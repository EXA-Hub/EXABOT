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
      backend + `/api/guilds/${this.props.guild.id}/logs/${this.props.type}`
    );

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labelsData.data.labels,
        datasets: [
          {
            data: labelsData.data.data,
            label: `عدد ال${this.props.name}`,
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
            text: `معلومات متنوعة عن ال${this.props.name} في الخادم - (${this.props.type})`,
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
      <Card key={this.props.type}>
        معلومات المجتمع: {this.props.guild.name}
        <div>
          <canvas id="myChart" ref={this.chartRef} />
        </div>
      </Card>
    );
  }
}
