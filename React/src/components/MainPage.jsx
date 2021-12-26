import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";

export default class MainPage extends Component {
  render() {
    return (
      <div>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            جرب شيئا آخر
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">أرسل</Dropdown.Item>
            <Dropdown.Item href="#">أعجبني</Dropdown.Item>
            <Dropdown.Item href="#">لأ</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
