import React, { useState, useEffect } from "react";
import { Card, Button, FormCheck, Form } from "react-bootstrap";
import { useAlert } from "react-alert";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

export default function MainPage(props) {
  const alert = useAlert();
  const [songData, setSongData] = useState(null);
  const [filters, setFilters] = useState(<div></div>);
  const [volume, setVolume] = useState(50);

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
      <div className="input-group mb-3" key="upCard">
        <input
          type="text"
          className="form-control"
          defaultValue="ضع إسم الأغنية"
          onChange={(e) => {
            setSongData({ songName: e.target.value });
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") playSong();
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
              spv("stop");
            }}
            className="ms-2 mt-1"
          >
            إيقاف
          </Button>
          <Button
            onClick={() => {
              spv("pause");
            }}
            className="ms-2 mt-1"
          >
            إيقاف مؤقت
          </Button>
          <Button
            onClick={() => {
              spv("skip");
            }}
            className="ms-2 mt-1"
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
            <option value="0">التكرار متوقف</option>
            <option value="1">تكرار الأغنية</option>
            <option value="2">تكرار القائمة</option>
          </Form.Select>
        </h6>
      </div>
    </Card>
  );
}
