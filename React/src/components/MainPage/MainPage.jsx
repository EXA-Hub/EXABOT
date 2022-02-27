import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Dropdown,
  FormControl,
  Tab,
  Row,
  Nav,
  Col,
} from "react-bootstrap";
import MusicCard from "./guildSettings/musicCard";
import WelcomeCard from "./guildSettings/welcomeCard";
import { Switch, useDarkreader } from "react-darkreader";
import Graphs from "./charts/charts";
import { useAlert } from "react-alert";

const {
  servers,
  login,
  user,
  logout,
  guild,
  add,
  backend,
} = require("../../data");
const { getData } = require("../api/getData");

const cards = servers.map((server) => {
  return (
    <div className="column" key={server.title}>
      <Card className="card">
        <Card.Img variant="top" src={server.image} alt={server.title} />
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

function guildsIcons(guilds) {
  return guilds.map((guildData) => {
    return (
      <div key={guildData.id} className="column p-5">
        <div className="card">
          <img
            className="circular--square card"
            src={
              guildData.icon
                ? `https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.png?size=2048`
                : "https://cdn.discordapp.com/avatars/865052410841792532/c9d03e1001a8cee703e486f810623533.png?size=2048"
            }
            alt={guildData.name}
          />
          <Button
            className="top p-2 m-2"
            href={`?guild=${guildData.id}`}
            style={{ textDecoration: "none" }}
          >
            {guildData.name}
          </Button>
        </div>
      </div>
    );
  });
}

function guildsMenu(guildData, guilds) {
  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href="/"
      ref={ref}
      style={{ textDecoration: "none" }}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const [value, setValue] = useState("");
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="أبحث عن مجتمعك..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul
            className="list-unstyled"
            style={{
              maxHeight: "250px",
              overflow: "auto",
            }}
          >
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value)
            )}
          </ul>
        </div>
      );
    }
  );
  let num = 0;
  const guildsMenu = guilds.map((menuGuildData) => {
    if (menuGuildData.id === guildData.id) {
      return (
        <Dropdown.Item eventKey={`${++num}`} key={menuGuildData.id} active>
          {menuGuildData.name}
        </Dropdown.Item>
      );
    } else {
      return (
        <Dropdown.Item
          key={`${++num}`}
          eventKey={`${++num}`}
          onClick={() => (window.location.href = "/?guild=" + menuGuildData.id)}
        >
          {menuGuildData.name}
        </Dropdown.Item>
      );
    }
  });
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={CustomToggle}
        variant="success"
        id="dropdown-custom-components"
      >
        {guildData.name}
      </Dropdown.Toggle>
      <Dropdown.Menu as={CustomMenu}>{guildsMenu}</Dropdown.Menu>
    </Dropdown>
  );
}

const loginUrl = () => (window.location.href = login);
const logoutUrl = () => (window.location.href = logout);

// window.open(logout, "logout Pop Up", "width=500,height=" + window.innerHeight);

const params = new URLSearchParams(window.location.search);
const guildID = params.get("guild");

export default function MainPage(props) {
  const alert = useAlert();

  const theme = localStorage.getItem("Theme") === "true" ? true : false;
  const [isDark, { toggle }] = useDarkreader(theme);
  const [userData, setUserData] = useState(null);
  const [guildData, setGuildData] = useState(null);
  const [guilds, setGuilds] = useState(<h1>لا يوجد مجتمعات</h1>);
  const [guildSettingsData, setGuildSettingsData] = useState({ prefix: "." });
  const [guildBody, setGuildBody] = useState(null);

  useEffect(() => {
    getData(user)
      .then(({ data }) => {
        setUserData(data);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          alert.show("لم يتم تسجيل الدخول", {
            timeout: 5000,
            type: "error",
          });
        }
      });
  }, [alert]);

  useEffect(() => {
    (async () => {
      const guildsData = (await userData) ? await userData.guilds : [];
      setGuilds(guildsData);
    })();
  }, [userData]);

  useEffect(() => {
    if (guildID) {
      getData(guild + `/${guildID}`)
        .then(({ data }) => {
          setGuildData(data);
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            alert.show("لم يتم العثور على المجتمع في قاعدة البيانات", {
              timeout: 5000,
              type: "error",
            });
            window.open(
              add + `?guildID=${guildID}`,
              "add Pop Up",
              "width=500,height=" + window.innerHeight
            );
          }
        });
    }
  }, [alert]);

  useEffect(() => {
    if (!guildID) return;
    getData(backend + `/api/guilds/${guildID}/prefix/get`)
      .then(({ data }) => {
        setGuildSettingsData({ prefix: data.prefix.prefix || "." });
        setGuildBody(true);
      })
      .catch((err) => {
        if (err) {
          console.error(err);
          alert.show("لا توجد بادئة للمجتمع", {
            timeout: 5000,
            type: "error",
          });
          setGuildBody(null);
        }
      });
  }, [alert]);

  function setPrefix() {
    getData(
      backend +
        `/api/guilds/${guildID}/prefix/set?prefix=${guildSettingsData.prefix}`
    )
      .then(({ data }) => {
        setGuildSettingsData({ prefix: data });
        alert.show("تم بنجاح", {
          timeout: 5000,
          type: "success",
        });
      })
      .catch((err) => {
        if (err)
          alert.show("خطأ", {
            timeout: 5000,
            type: "error",
          });
      });
  }

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
              <li key="Home">
                <a key="Home" href="/" className="nav-link px-2 text-white">
                  الصفحة الرئيسية
                </a>
              </li>
              <li key="GitHub">
                <a
                  key="GitHub"
                  href="https://github.com/EXA-Hub/EXABOT"
                  className="nav-link px-2 text-white"
                >
                  المشروع
                </a>
              </li>
              <li key="Support">
                <a
                  key="Support"
                  href="https://discord.gg/n9AQZ6qjNc"
                  className="nav-link px-2 text-white"
                >
                  الدعم الفني
                </a>
              </li>
              <li key="Studio">
                <a
                  key="Studio"
                  href="https://discord.gg/aEkKZQfZuk"
                  className="nav-link px-2 text-white"
                >
                  فريق التطوير
                </a>
              </li>
              <li key="who">
                <a
                  key="who"
                  href="https://discord.gg/e4ewVXcKCs"
                  className="nav-link px-2 text-white"
                >
                  من نحن؟
                </a>
              </li>
            </ul>
            <Switch
              checked={isDark}
              onChange={(e) => {
                toggle();
                localStorage.setItem("Theme", isDark ? false : true);
              }}
            />
            <div className="text-end p-1 m-1">
              {userData ? (
                <button
                  type="button"
                  className="btn btn-outline-danger me-2"
                  onClick={logoutUrl}
                >
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-success me-2"
                  onClick={loginUrl}
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
          <span style={{ color: "lime" }} className="flick">
            ${userData ? userData.coins : "0"}
          </span>
        </p>
      </h1>
      <div
        className="text-dark text-muted row"
        style={{
          marginRight: "0px",
          marginLeft: "0px",
        }}
      >
        {guildData ? (
          <div key="guilds">
            <div
              key="guildsMenu"
              className="container-fluid fs-1 badge text-muted"
            >
              {guildsMenu(guildData, guilds)}
            </div>
            {guildBody ? (
              <div key="guildBody">
                <div className="container-fluid fs-5 badge">
                  <input
                    style={{ width: "50%" }}
                    defaultValue={guildSettingsData.prefix || "."}
                    onChange={(e) =>
                      setGuildSettingsData({ prefix: e.target.value })
                    }
                  ></input>
                  <Button className="m-2" onClick={setPrefix}>
                    حفظ البادئة
                  </Button>
                </div>
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey="welcomeCard"
                  key="TabContainer"
                >
                  <Row>
                    <Col sm={3} key="sm3">
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item key="data">
                          <Nav.Link eventKey="Data" key="data">
                            معلومات المجتمع
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item key="MusicCard">
                          <Nav.Link eventKey="MusicCard" key="MusicCard">
                            الموسيقى
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item key="welcomeCard">
                          <Nav.Link eventKey="welcomeCard" key="welcomeCard">
                            تعديل الترحيب
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item key="second">
                          <Nav.Link eventKey="second" key="second">
                            آخر
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                    <Col sm={9} key="sm9">
                      <Tab.Content key="TabContent">
                        <Tab.Pane eventKey="Data" key="data">
                          <Graphs guild={guildData} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="MusicCard" key="MusicCard">
                          <div key="MusicCard">
                            <MusicCard guild={guildData} />
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="welcomeCard" key="welcomeCard">
                          <WelcomeCard guild={guildData} user={userData} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second" key="second">
                          مرحبا
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            ) : (
              <h1>× حدث خطأ ما ×</h1>
            )}
          </div>
        ) : userData ? (
          guildsIcons(guilds)
        ) : (
          cards
        )}
      </div>
      <div key="footer" className="container bottom">
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
            <li key="twitter" className="ms-3">
              <a className="text-muted" href="/">
                {/*<svg className="bi" width="24" height="24"><use xlink:href="#twitter"></use></svg>*/}
              </a>
            </li>
            <li key="instagram" className="ms-3">
              <a className="text-muted" href="/">
                {/*<svg className="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg>*/}
              </a>
            </li>
            <li key="facebook" className="ms-3">
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
