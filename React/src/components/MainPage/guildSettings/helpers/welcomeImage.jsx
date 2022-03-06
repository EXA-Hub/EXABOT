import React, { Component } from "react";
import { Image as KonvaImage, Stage, Layer, Text, Circle } from "react-konva";
import { Card, Form, Button } from "react-bootstrap";
import TransformerComponent from "./transformer";
import useImage from "use-image";
import axios from "axios";

const { backend } = require("../../../../data");
const welcomeTextHint = "{{name}} {{tag}} {{discordTag}} {{memberCount}}";
const BackgroundImage = ({ data }) => {
  const [image] = useImage(data.background);
  return (
    <KonvaImage
      x={0}
      y={0}
      fillPatternImage={image}
      width={image ? image.width : data.width || 720}
      height={image ? image.height : data.height || 480}
    />
  );
};

export default class welcomeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedShapeName: "Avatar",
      data: this.props.welcomeImageData,
    };
  }
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
      const Shape = this.state.data.AvatarData.circle ? Circle : KonvaImage;
      return (
        <Shape
          name="Avatar"
          draggable
          image={image}
          fillPatternImage={image}
          fillPatternOffset={{
            x: this.state.data.AvatarData.circle
              ? (image
                  ? image.width
                  : this.state.data.AvatarData.width || 128) / 2
              : this.state.data.AvatarData.width,
            y: this.state.data.AvatarData.circle
              ? (image
                  ? image.height
                  : this.state.data.AvatarData.height || 128) / 2
              : this.state.data.AvatarData.height,
          }}
          x={this.state.data.AvatarData.x}
          y={this.state.data.AvatarData.y}
          offset={
            this.state.data.AvatarData.circle
              ? {
                  x: 0,
                  y: 0,
                }
              : {
                  x: parseInt(this.state.data.AvatarData.width) / 2,
                  y: parseInt(this.state.data.AvatarData.height) / 2,
                }
          }
          width={this.state.data.AvatarData.width || 128}
          height={this.state.data.AvatarData.height || 128}
          scaleX={this.state.data.AvatarData.scaleX}
          scaleY={this.state.data.AvatarData.scaleY}
          rotation={this.state.data.AvatarData.rotation}
          cornerRadius={20}
          onDragEnd={(e) => {
            const { x, y } = e.target.attrs;
            Object.keys({ x, y }).forEach((key) => {
              const avatarData = {
                x,
                y,
              };
              AvatarData[key] = avatarData[key];
            });
            this.setState(state.data);
          }}
          onTransformEnd={(e) => {
            const { x, y, rotation, scaleX, scaleY } = e.target.attrs;
            Object.keys({
              x,
              y,
              scaleX,
              scaleY,
              rotation,
            }).forEach((key) => {
              const avatarData = {
                x,
                y,
                scaleX,
                scaleY,
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
        <div dir="rtl">
          <Stage
            onClick={this.handleStageClick}
            width={this.state.data.StageData.width}
            height={this.state.data.StageData.height}
            style={{
              transform: "translate(-50%, -50%)",
              // position: "absolute",
              height: "50%",
              width: "40%",
              left: "50%",
              top: "50%",
            }}
          >
            <Layer>
              <BackgroundImage data={this.state.data.StageData} />
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
                fontFamily="sans"
                onDragEnd={(e) => {
                  console.log(e);
                  state.data.TextData.x = e.target.attrs.x;
                  state.data.TextData.y = e.target.attrs.y;
                  this.setState(state);
                }}
                rotation={this.state.data.TextData.rotation}
                onTransformEnd={(e) => {
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
              <AvatarImg />
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
            value={this.state.data.AvatarData.scaleX}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.scaleX =
                value || state.data.AvatarData.scaleX;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="عرض لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "عرض صورة العضو"
          </span>
        </div>
        <div className="input-group mb-3">
          <input
            value={this.state.data.AvatarData.scaleY}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              state.data.AvatarData.scaleY =
                value || state.data.AvatarData.scaleY;
              this.setState(state);
            }}
            type="number"
            className="form-control"
            placeholder="طول لصورة العضو"
          />
          <span className="input-group-text" id="basic-addon2">
            "طول صورة العضو"
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
            <Form>
              <Form.Check
                label=" "
                type="switch"
                id="circleSwitch"
                checked={this.state.data.AvatarData.circle}
                onChange={(e) => {
                  state.data.AvatarData.circle = e.target.checked;
                  this.setState(state);
                }}
              />
            </Form>
            "محور صورة العضو"
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
        <Button
          variant="primary"
          onClick={async () => {
            await axios({
              headers: {},
              method: "POST",
              data: this.state.data,
              withCredentials: true,
              url: backend + `/api/guilds/${this.props.guild.id}/welcome`,
            })
              .then(({ data }) => {
                this.props.alert.show(data.message, {
                  timeout: 5 * 2000,
                  type: "success",
                });
              })
              .catch((err) => {
                if (err) {
                  this.props.alert.show(err.response.data.message.toString(), {
                    timeout: 5 * 2000,
                    type: "error",
                  });
                }
              });
          }}
        >
          حفظ.
        </Button>
      </Card>
    );
  }
}
