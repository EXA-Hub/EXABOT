import React, { Component } from "react";
import { Image as KonvaImage, Stage, Layer, Text } from "react-konva";
import TransformerComponent from "./helpers/transformer";
import { Card, Button } from "react-bootstrap";
import useImage from "use-image";

const welcomeTextHint = "{{name}} {{tag}} {{discordTag}} {{memberCount}}";
const BackgroundImage = ({ data }) => {
  const [image] = useImage(data.background);
  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={image ? image.width : data.width || 720}
      height={image ? image.height : data.height || 480}
    />
  );
};

export default class welcomeCard extends Component {
  state = {
    selectedShapeName: "",
    data: {
      StageData: {
        width: 720,
        height: 480,
        background:
          "https://cdn.discordapp.com/attachments/865036175705112596/919683698851479592/20191115_213644.png",
      },
      AvatarData: {
        url: this.props.user
          ? this.props.user.avatarURL
          : "https://cdn.discordapp.com/attachments/865036175705112596/947510772689420378/EXA.png",
        x: 60,
        y: 120,
        width: 128,
        height: 128,
        rotation: 0,
        circle: true,
      },
      TextData: {
        text: this.props.user ? "{{discordTag}}" : "EXA-BOT™#1076",
        x: 60,
        y: 120,
        fontSize: 12,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        fill: "#ffff00",
      },
    },
  };
  getImageSize = async (url) => {
    const img = new Image();
    img.src = url;
    img.addEventListener("load", (e) => {
      const { width, height } = e.currentTarget;
      if (width && height) {
        let state = this.state;
        state.data.StageData.width = width;
        state.data.StageData.height = height;
        this.setState();
        return true;
      }
    });
  };
  handleStageClick = (e) => {
    let state = this.state;
    state.selectedShapeName = e.target.name();
    this.setState(state);
  };
  render() {
    let state = this.state;
    let { data } = state;
    let { TextData } = data;
    let memberCount = this.props.guild ? this.props.guild.memberCount : NaN;
    const discordTag = this.props.user
      ? this.props.user.discordTag
      : "EXA-BOT™#1076";
    const [name, tag] = discordTag.split("#");
    const AvatarImg = () => {
      const { AvatarData } = this.state.data;
      const [image] = useImage(this.state.data.AvatarData.url);
      if (this.state.data.AvatarData.circle && image)
        image.className = "circular--square";
      return (
        <KonvaImage
          name="Avatar"
          draggable
          image={image}
          x={this.state.data.AvatarData.x}
          y={this.state.data.AvatarData.y}
          width={this.state.data.AvatarData.width || 128}
          height={this.state.data.AvatarData.height || 128}
          rotation={this.state.data.AvatarData.rotation}
          cornerRadius={20}
          onDragEnd={(e) => {
            const { x, y, width, height, rotation, scaleX, scaleY } =
              e.target.attrs;
            Object.keys({ x, y, width, height, rotation }).forEach((key) => {
              const avatarData = {
                x,
                y,
                width: width * scaleX,
                height: height * scaleY,
                rotation,
              };
              AvatarData[key] = avatarData[key];
            });
            this.setState(state.data);
          }}
          onTransformEnd={(e) => {
            const { x, y, width, height, rotation, scaleX, scaleY } =
              e.target.attrs;
            Object.keys({ x, y, width, height, rotation }).forEach((key) => {
              const avatarData = {
                x,
                y,
                width: width * scaleX,
                height: height * scaleY,
                rotation,
              };
              AvatarData[key] = avatarData[key];
            });
            this.setState(state.data);
          }}
        />
      );
    };
    return (
      <Card>
        <div className="container">
          <Stage
            onClick={this.handleStageClick}
            width={this.state.data.StageData.width}
            height={this.state.data.StageData.height}
            className="container"
            style={{
              position: "relative",
              userSelect: "none",
            }}
          >
            <Layer>
              <BackgroundImage data={this.state.data.StageData} />
              <AvatarImg />
              <Text
                name="text"
                draggable
                text={TextData.text
                  .replace("{{discordTag}}", discordTag)
                  .replace("{{name}}", name)
                  .replace("{{tag}}", tag)
                  .replace("{{memberCount}}", memberCount)}
                x={TextData.x}
                y={TextData.y}
                fill={TextData.fill}
                fontSize={TextData.fontSize}
                scaleX={TextData.scaleX}
                scaleY={TextData.scaleY}
                onDragEnd={(e) => {
                  state.data.TextData.x = e.target.attrs.x;
                  state.data.TextData.y = e.target.attrs.y;
                  this.setState(state);
                }}
                rotation={this.state.data.TextData.rotation}
                onTransformEnd={(e) => {
                  console.log(e.target.attrs);
                  const { x, y, scaleX, scaleY, rotation } = e.target.attrs;
                  Object.keys({ x, y, scaleX, scaleY, rotation }).forEach(
                    (key) => {
                      const textData = {
                        x,
                        y,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        rotation,
                      };
                      TextData[key] = textData[key];
                    }
                  );
                  this.setState(state.data);
                }}
              />
              <TransformerComponent
                selectedShapeName={this.state.selectedShapeName}
              />
            </Layer>
          </Stage>
        </div>
        <div className="my-3">
          <label htmlFor="backgroundImg" className="form-label">
            رفع صورة خلفية من جهازك الشخصي
          </label>
          <input
            className="form-control"
            type="file"
            id="backgroundImg"
            accept="image/png, image/jpeg"
            style={{
              color: "WHITE",
            }}
            onChange={(e) => {
              const image = e.target.files.item(0);
              const fileTypes = [
                "image/apng",
                "image/bmp",
                "image/gif",
                "image/jpeg",
                "image/pjpeg",
                "image/png",
                "image/svg+xml",
                "image/tiff",
                "image/webp",
                "image/x-icon",
              ];
              if (fileTypes.includes(image.type)) {
                const imageUrl = URL.createObjectURL(image);
                if (!imageUrl || imageUrl.length < 0) return;
                state.data.StageData.background = imageUrl;
                this.setState(state);
                this.getImageSize(imageUrl).then((sized) => {
                  if (!sized) e.target.style.color = "WHITE";
                  else e.target.style.color = "RED";
                });
              } else e.target.style.color = "RED";
            }}
          />
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.StageData.background}
            style={{ color: "WHITE" }}
            onChange={(e) => {
              if (!e.target.value || e.target.value.length < 0)
                return (e.target.style.color = "RED");
              state.data.StageData.background = e.target.value;
              this.setState(state);
              this.getImageSize(e.target.value).then((sized) => {
                if (!sized) e.target.style.color = "WHITE";
                else e.target.style.color = "RED";
              });
            }}
            type="text"
            className="form-control"
            placeholder="رابط صورة الخلفية"
          />
          <span className="input-group-text" id="basic-addon2">
            "رابط صورة الخلفية"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.AvatarData.x}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.x = value || state.data.AvatarData.x;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="البعد الأفقي لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "البعد الأفقي لصورة العضو"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.AvatarData.y}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.y = value || state.data.AvatarData.y;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="البعد الرئسي لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "البعد الرئسي لصورة العضو"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.AvatarData.width}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.width =
                value || state.data.AvatarData.width;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="عرض لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "عرض لصورة العضو"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.AvatarData.height}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.height =
                value || state.data.AvatarData.height;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="طول لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "طول لصورة العضو"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.AvatarData.rotation}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.rotation =
                value || state.data.AvatarData.rotation;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="محور لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "محور لصورة العضو"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.TextData.x}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.TextData.x = value || state.data.TextData.x;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="البعد الأفقى لنص الترحيب"
          />
          <span className="input-group-text" id="basic-addon2">
            "البعد الأفقى لنص الترحيب"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.TextData.y}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.TextData.y = value || state.data.TextData.y;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="البعد الرئسي لنص الترحيب"
          />
          <span className="input-group-text" id="basic-addon2">
            "البعد الرئسي لنص الترحيب"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.TextData.scaleX}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.TextData.scaleX = value || state.data.TextData.scaleX;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="عرض نص الترحيب"
          />
          <span className="input-group-text" id="basic-addon2">
            "عرض نص الترحيب"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.TextData.scaleY}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.TextData.scaleY = value || state.data.TextData.scaleY;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="طول نص الترحيب"
          />
          <span className="input-group-text" id="basic-addon2">
            "طول نص الترحيب"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.TextData.fontSize}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.TextData.fontSize =
                value || state.data.TextData.fontSize;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="حجم نص الترحيب"
          />
          <span className="input-group-text" id="basic-addon2">
            "حجم نص الترحيب"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.TextData.rotation}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.TextData.rotation =
                value || state.data.TextData.rotation;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="محور نص الترحيب"
          />
          <span className="input-group-text" id="basic-addon2">
            "محور نص الترحيب"
          </span>
        </div>
        <div className="form-group mb-3">
          <div className="input-group">
            <input
              value={this.state.data.TextData.text}
              onChange={async (e) => {
                state.data.TextData.text = e.target.value;
                this.setState(state);
              }}
              type="text"
              className="form-control"
              placeholder="نص الترحيب"
              aria-describedby="welcomeTextHelp"
              id="welcomeTextHelp"
            />
            <span className="input-group-text" id="basic-addon2">
              <input
                type="color"
                value={state.data.TextData.fill}
                onChange={(e) => {
                  state.data.TextData.fill = e.currentTarget.value;
                  this.setState(state);
                }}
              />
              "نص الترحيب"
            </span>
          </div>
          <small id="welcomeTextHelp" className="form-text text-muted">
            {welcomeTextHint}
          </small>
        </div>
        <Button variant="primary">حفظ.</Button>
      </Card>
    );
  }
}
