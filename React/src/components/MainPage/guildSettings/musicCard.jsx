import React, { useState, useEffect } from "react";
import { Card, Button, FormCheck } from "react-bootstrap";
import { useAlert } from "react-alert";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

export default function MainPage(props) {
  const alert = useAlert();
  const [songData, setSongData] = useState(null);
  const [filters, setFilters] = useState(<div></div>);

  function playSong() {
    if (songData) {
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

  function sp(task) {
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

  return (
    <Card>
      <h1>نظام الأغاني</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          defaultValue="ضع إسم الأغنية"
          onChange={(e) => {
            setSongData({ songName: e.target.value });
          }}
        />
        <div className="input-group-append">
          <button
            onClick={playSong}
            className="btn btn-outline-secondary"
            id="button-addon2"
            type="button"
          >
            بحث
          </button>
          <Button
            onClick={() => {
              sp("stop");
            }}
            className="ms-2 mt-1"
          >
            إيقاف
          </Button>
          <Button
            onClick={() => {
              sp("pause");
            }}
            className="ms-2 mt-1"
          >
            إيقاف مؤقت
          </Button>
          <Button
            onClick={() => {
              sp("skip");
            }}
            className="ms-2 mt-1"
          >
            تخطي
          </Button>
        </div>
        <div className="container-fluid">
          <FormCheck
            type="switch"
            className="m-2"
            id="autoplay-switch"
            label="التشغيل التلقائي"
            style={{ display: "inline-block" }}
            onChange={(e) => {
              autoPlay(e);
            }}
          />
          <h6>المرشحات: {filters}</h6>
        </div>
      </div>
    </Card>
  );
}
