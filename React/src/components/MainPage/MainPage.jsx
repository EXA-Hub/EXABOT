import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
const { servers, login, user, logout, backend } = require("../../data");
const { getData } = require("../api/getData");

const cards = servers.map((server) => {
  return (
    <div className="column" key={server.title}>
      <Card className="card">
        <Card.Img variant="top" src={server.image} />
        <Card.Body>
          <Card.Title>{server.title}</Card.Title>
          <Card.Text>{server.text}</Card.Text>
          <Button variant="primary" href={server.invite} target="_blank">
            {server.button}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
});

// const { buttons } = require("../../data");
// const btns = buttons.map((button) => {
//   return (
//     <div className="column">
//       <Card className="card">
//         <Card.Img variant="top" src={button.image} />
//         <Card.Body>
//           <Card.Title>{button.title}</Card.Title>
//           <Card.Text>{button.text}</Card.Text>
//           <Button variant="primary" onClick={button.function()}>
//             {button.button}
//           </Button>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// });

const loginAPIURL = () => (window.location.href = login);
const logoutAPIURL = () => (window.location.href = logout);

export default function MainPage(props) {
  const [userData, setuserData] = useState(null);
  getData(user)
    .then(({ data }) => {
      setuserData(data);
    })
    .catch((err) => {
      console.log(err);
    });

  const [coins, setCoins] = useState("0");
  getData(backend + "/api/user/coins")
    .then(({ data }) => {
      setCoins(data);
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>
      <header className="p-3 bg-dark bg-opacity-50 text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="/"
              className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
            >
              {/* <svg
                  className="bi me-2"
                  width="40"
                  height="32"
                  role="img"
                  aria-label="Bootstrap"
                >
                  <use xlink:href="#bootstrap"></use>
                </svg> */}
            </a>
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a href="/" className="nav-link px-2 text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="nav-link px-2 text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="/" className="nav-link px-2 text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/" className="nav-link px-2 text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/" className="nav-link px-2 text-white">
                  About
                </a>
              </li>
            </ul>
            <div className="text-end">
              {userData ? (
                <button
                  type="button"
                  className="btn btn-outline-danger me-2"
                  onClick={logoutAPIURL}
                >
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-success me-2"
                  onClick={loginAPIURL}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <h1 className="container-fluid fs-1 badge text-muted">
        {userData ? userData.discordTag : "EXA-BOT™"}
        <p
          style={{
            fontFamily: "Michroma, sans-serif",
          }}
        >
          $<span>{coins}</span>
        </p>
      </h1>
      <div className="text-dark text-muted row">{cards}</div>
      <div className="container fixed-bottom">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <a
              href="/"
              className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
            >
              {/*<svg className="bi" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>*/}
            </a>
            <span className="text-muted">© 2021 EXA, Inc</span>
          </div>
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <a className="text-muted" href="/">
                {/*<svg className="bi" width="24" height="24"><use xlink:href="#twitter"></use></svg>*/}
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="/">
                {/*<svg className="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg>*/}
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="/">
                {/*<svg className="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg>*/}
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
