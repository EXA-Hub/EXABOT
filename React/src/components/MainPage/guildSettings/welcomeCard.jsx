import React, { useEffect, useState } from "react";
import WelcomeImage from "./helpers/welcomeImage";
import { Spinner } from "react-bootstrap";
import { useAlert } from "react-alert";

const { backend } = require("../../../data");
const { getData } = require("../../api/getData");

export default function MusicCard(props) {
  const alert = useAlert();
  const [welcomeImageData, setWelcomeImageData] = useState(null);

  useEffect(() => {
    getData(`${backend}/api/guilds/${props.guild.id}/welcome`).then(
      ({ data }) => {
        if (Object.keys(data).length) setWelcomeImageData(data);
        else
          setWelcomeImageData({
            StageData: {
              width: 720,
              height: 480,
              background:
                "https://cdn.discordapp.com/attachments/865036175705112596/919683698851479592/20191115_213644.png",
            },
            AvatarData: {
              url: props.user
                ? props.user.avatarURL
                : "https://cdn.discordapp.com/attachments/865036175705112596/947510772689420378/EXA.png",
              x: 60,
              y: 120,
              width: 128,
              height: 128,
              scaleX: 1,
              scaleY: 1,
              rotation: 0,
              circle: true,
            },
            TextData: {
              text: props.user ? "{{discordTag}}" : "EXA-BOT™#1076",
              x: 60,
              y: 120,
              fontSize: 12,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              fill: "#ffff00",
            },
          });
      }
    );
  }, [props.guild.id, props.user]);

  return (
    <>
      {welcomeImageData ? (
        <WelcomeImage
          guild={props.guild}
          user={props.user}
          alert={alert}
          welcomeImageData={welcomeImageData}
        />
      ) : (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جار جلب المعلومات المطلوبة...</span>
        </Spinner>
      )}
    </>
  );
}
