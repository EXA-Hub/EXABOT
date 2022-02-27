import React, { useState, useEffect } from "react";
import { Card, Spinner, Carousel } from "react-bootstrap";
import Chart from "./chart";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

function render(types, props) {
  if (types) {
    return Object.keys(types).map((type) => (
      <Carousel.Item key={type}>
        <Chart guild={props.guild} type={type} name={types[type]} />
      </Carousel.Item>
    ));
  } else
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
}

export default function LineChart(props) {
  const [types, setTypes] = useState();

  useEffect(() => {
    getData(backend + `/api/guilds/${props.guild.id}/logs`).then(({ data }) => {
      setTypes(data);
    });
  }, [props.guild.id]);

  return (
    <Card>
      <Carousel>{render(types, props)}</Carousel>
    </Card>
  );
}
