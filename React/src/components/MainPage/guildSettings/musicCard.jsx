import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useAlert } from "react-alert";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

export default function MainPage(props) {
  const alert = useAlert();
  const [songData, setSongData] = useState(null);

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
          if (err) {
            alert.show(err.response.data.message.toString(), {
              timeout: 5 * 2000,
              type: "error",
            });
          }
        });
    } else
      return alert.show("يرجى كتابة أسم الأغنية", {
        timeout: 5 * 2000,
        type: "info",
      });
  }

  function stop() {
    getData(backend + `/api/guilds/${props.guild.id}/music/stop`)
      .then(({ data }) => {
        alert.show(data.message, {
          timeout: 5 * 2000,
          type: "success",
        });
      })
      .catch((err) => {
        if (err) {
          alert.show(err.response.data.message.toString(), {
            timeout: 5 * 2000,
            type: "error",
          });
        }
      });
  }

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
          <Button onClick={stop}>إيقاف</Button>
        </div>
      </div>
    </Card>
  );
}
