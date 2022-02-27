import React, { useState, useEffect } from "react";
import { Card, Button, FormCheck, Form } from "react-bootstrap";
import { useAlert } from "react-alert";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

export default function MusicCard(props) {
  const alert = useAlert();
  const [songData, setSongData] = useState(null);
  const [filters, setFilters] = useState(<div></div>);
  const [volume, setVolume] = useState(50);
  const [displayedContacts, setDisplayedContacts] = useState([]);

  function playSong() {
    if (songData) {
      alert.show("التشغيل جارٍ والرجاء الإنتظار", {
        timeout: 3 * 2000,
        type: "success",
      });
      getData(
        backend +
          `/api/guilds/${props.guild.id}/music/play?songName=${songData.songName}`
      )
        .then(({ data }) => {
          alert.show(data.message, {
            timeout: 5 * 2000,
            type: "success",
          });
        })
        .catch((err) => {
          if (err)
            alert.show(err.response.data.message.toString(), {
              timeout: 5 * 2000,
              type: "error",
            });
        });
    } else
      return alert.show("يرجى كتابة أسم الأغنية", {
        timeout: 5 * 2000,
        type: "info",
      });
  }

  function spv(task) {
    getData(backend + `/api/guilds/${props.guild.id}/music/${task}`)
      .then(({ data }) => {
        alert.show(data.message, {
          timeout: 5 * 2000,
          type: "success",
        });
      })
      .catch((err) => {
        if (err)
          alert.show(err.response.data.message.toString(), {
            timeout: 5 * 2000,
            type: "error",
          });
      });
  }

  function autoPlay(e) {
    getData(backend + `/api/guilds/${props.guild.id}/music/autoPlay`)
      .then(({ data }) => {
        data.autoPlay ? (e.target.checked = true) : (e.target.checked = false);
        alert.show(data.message, {
          timeout: 5 * 2000,
          type: "success",
        });
      })
      .catch((err) => {
        if (err) {
          e.target.checked = false;
          alert.show(err.response.data.message.toString(), {
            timeout: 5 * 2000,
            type: "error",
          });
        }
      });
  }

  useEffect(() => {
    function filtersFunction(e, filter) {
      getData(
        backend + `/api/guilds/${props.guild.id}/music/filter?filter=${filter}`
      )
        .then(({ data }) => {
          data.status ? (e.target.checked = true) : (e.target.checked = false);
          alert.show(data.message, {
            timeout: 5 * 2000,
            type: "success",
          });
        })
        .catch((err) => {
          if (err) {
            e.target.checked = false;
            alert.show(err.response.data.message.toString(), {
              timeout: 5 * 2000,
              type: "error",
            });
          }
        });
    }
    getData(backend + `/api/user/filters`).then(({ data }) => {
      setFilters(
        Object.keys(data).map((filter) => {
          return (
            <FormCheck
              key={filter}
              type="switch"
              label={filter}
              value={filter}
              className="m-2"
              id={filter + "-switch"}
              onChange={(e) => {
                filtersFunction(e, e.target.value);
              }}
              style={{
                display: "inline-block",
                border: "solid",
                borderStyle: "groove double",
                borderWidth: "medium",
                borderColor: "#181a1b",
              }}
            />
          );
        })
      );
    });
  }, [alert, props.guild.id]);

  let Contact = (data) => {
    return (
      <li
        key={data.key}
        style={
          data.lastOne
            ? {
                overflow: "hidden",
                borderBottom: "1px solid #ccc",
                padding: "0 0 20px",
                margin: "0",
              }
            : {
                overflow: "hidden",
                margin: "0 0 20px",
                borderBottom: "1px solid #ccc",
                padding: "0 0 20px",
              }
        }
      >
        <img
          key={data.key}
          src={data.image}
          alt={data.name}
          style={{
            float: "left",
            display: "block",
            width: "50px",
            height: "50px",
            margin: "0 10px 0 0",
          }}
        />
        <span
          key={data.key}
          value={data.name}
          style={{
            display: "block",
            width: "100%",
            fontWeight: "bolder",
            color: "#999000",
          }}
        >
          {data.name}
        </span>
        <span
          key={`${data.key}2`}
          style={{
            fontWeight: "normal",
            fontStyle: "italic",
            color: "#999",
          }}
        >
          {data.artist}
        </span>
      </li>
    );
  };

  let ContactList = () => {
    return (
      <div
        style={{
          position: "absolute",
          width: "50%",
          margin: "50px auto",
        }}
      >
        <ul
          key={`searchUl`}
          style={{
            listStyleType: "none",
            position: "absolute",
            width: "350px",
          }}
        >
          {displayedContacts.map((el, index) => {
            return (
              <Button
                key={el.id}
                value={el.id}
                style={{ width: "100%", backgroundColor: "white" }}
                onClick={(e) => {
                  setSongData({ songName: e.currentTarget.value });
                  document.getElementById("searchBar").value =
                    e.currentTarget.value;
                  setDisplayedContacts([]);
                }}
              >
                <Contact
                  style={{ width: "100%" }}
                  key={el.id}
                  name={el.name}
                  image={el.image}
                  artist={el.artist}
                  lastOne={index === displayedContacts.length - 1}
                />
              </Button>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <Card>
      <h1>نظام الأغاني</h1>
      <div className="input-group mb-3" key="upCard">
        <input
          type="text"
          id="searchBar"
          className="form-control search"
          defaultValue="ضع إسم الأغنية"
          onChange={(e) => {
            setDisplayedContacts([]);
            (async () => {
              const { data } = await getData(
                backend +
                  `/api/guilds/${props.guild.id}/search/${e.target.value}`
              );
              setDisplayedContacts(
                data.map(({ id, title, artist }) => {
                  return {
                    id,
                    name: title,
                    artist,
                    image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                  };
                })
              );
            })();
            setSongData({ songName: e.target.value });
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") playSong();
          }}
        />
        <ContactList />
        <div className="input-group-append" key="upCard">
          <button
            onClick={playSong}
            className="btn btn-outline-secondary"
            id="button-addon2"
            type="button"
            key="play"
          >
            بحث
          </button>
          <Button
            onClick={() => {
              spv("stop");
            }}
            className="ms-2 mt-1"
            key="stop"
          >
            إيقاف
          </Button>
          <Button
            onClick={() => {
              spv("pause");
            }}
            className="ms-2 mt-1"
            key="pause"
          >
            إيقاف مؤقت
          </Button>
          <Button
            onClick={() => {
              spv("skip");
            }}
            className="ms-2 mt-1"
            key="skip"
          >
            تخطي
          </Button>
        </div>
        <div className="container-fluid" key="downCard">
          <FormCheck
            type="switch"
            className="m-2 p-2"
            id="autoplay-switch"
            label="التشغيل التلقائي"
            style={{
              display: "inline-block",
            }}
            onChange={(e) => {
              autoPlay(e);
            }}
          />
          <Form.Label>درجة الصوت:</Form.Label>
          <Form.Range
            className="p-1"
            min="1"
            max="100"
            value={volume}
            style={{
              width: "80%",
              height: "0rem",
              color: "rgb(40 44 45)",
            }}
            onChange={(e) => {
              setVolume(e.target.value);
            }}
            onMouseUp={async (e) => {
              spv(`volume?volume=${e.target.value}`);
            }}
          />
          <Form.Label>{volume}%</Form.Label>
        </div>
        <h6 className="container-fluid">
          المرشحات: {filters}
          <Form.Select
            aria-label="Default select example"
            className="m-2"
            style={{
              width: "50%",
              display: "inline-block",
            }}
            onChange={(e) => {
              spv(`loop?mode=${e.target.value}`);
            }}
          >
            <option value="0" key="0">
              التكرار متوقف
            </option>
            <option value="1" key="1">
              تكرار الأغنية
            </option>
            <option value="2" key="2">
              تكرار القائمة
            </option>
          </Form.Select>
        </h6>
      </div>
    </Card>
  );
}
