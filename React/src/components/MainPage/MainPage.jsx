import React, { Component } from "react";
import "./MainPage.css";
import { Button } from "react-bootstrap";

export default class MainPage extends Component {
  render() {
    return (
      <div>
        <header className="container-fluid p-3 mb-2 bg-dark text-white bg-opacity-75">
          <a href="/" id="logo" className="">
            <img
              src="https://cdn.discordapp.com/avatars/865052410841792532/c9d03e1001a8cee703e486f810623533.png?size=24"
              alt=""
            />
            EXA-BOT™
          </a>
          <div className="float-end ">
            <Button variant="dark">الأوامر</Button>{" "}
            <Button variant="dark">لوحة التحكم</Button>{" "}
            <Button variant="dark">الدعم</Button>{" "}
            <Button variant="dark">تسجيل الدخول</Button>
          </div>
        </header>
        <div className="container-xxl"></div>
      </div>
    );
  }
}
