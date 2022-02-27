import React, { Component } from "react";
import { Stage, Layer, Transformer, Text, Image, Rect } from "react-konva";
import { Card } from "react-bootstrap";
import useImage from "use-image";
import jimp from "jimp";

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;
    const selectedNode = stage.findOne("." + selectedShapeName);
    if (selectedNode === this.transformer.node()) {
      return;
    }
    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={(node) => {
          this.transformer = node;
        }}
      />
    );
  }
}

const BackgroundImage = ({ data }) => {
  const [image] = useImage(data.background);
  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={data.width || 720}
      height={data.height || 480}
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
        fill: "#ffff00",
        x: 60,
        y: 120,
        width: 128,
        height: 128,
        rotation: 0,
      },
      TextData: {
        text: this.props.user ? "{{discordTag}}" : "EXA-BOT™#1076",
        x: 60,
        y: 120,
        fontSize: 12,
        fill: "#ffff00",
      },
    },
  };
  handleStageClick = (e) => {
    this.setState({
      selectedShapeName: e.target.name(),
    });
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
    jimp
      .read(state.data.StageData.background)
      .then((img) => {
        if (!img) return;
        state.data.StageData.height = img.bitmap.height;
        state.data.StageData.width = img.bitmap.width;
        this.setState(state);
      })
      .catch((err) => {
        if (err) return console.error(err);
      });
    const AvatarImg = () => {
      const { AvatarData } = this.state.data;
      const [image] = useImage(this.state.data.AvatarData.url);
      return (
        <Image
          name="Avatar"
          draggable
          image={image}
          x={this.state.data.AvatarData.x}
          y={this.state.data.AvatarData.y}
          width={this.state.data.AvatarData.width || 128}
          height={this.state.data.AvatarData.height || 128}
          fill={this.state.data.AvatarData.fill}
          rotation={this.state.data.AvatarData.rotation}
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
        <Stage
          onClick={this.handleStageClick}
          width={this.state.data.StageData.width}
          height={this.state.data.StageData.height}
          className="container"
        >
          <Layer>
            <Rect
              fill="blue"
              height={this.state.data.StageData.height}
              width={this.state.data.StageData.width}
              x={0}
              y={0}
            />
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
              onDragEnd={(e) => {
                state.data.TextData.x = e.target.attrs.x;
                state.data.TextData.y = e.target.attrs.y;
                this.setState(state);
              }}
            />
            <TransformerComponent
              selectedShapeName={this.state.selectedShapeName}
            />
          </Layer>
        </Stage>
        <input
          defaultValue={this.state.data.StageData.background}
          style={{ color: "white" }}
          onChange={(e) => {
            state.data.StageData.background = e.target.value;
            this.setState(state);
            if (!e.target.value || e.target.value.length < 0) return;
            jimp
              .read(e.target.value)
              .then((img) => {
                if (!img) return (e.target.style.color = "RED");
                state.data.StageData.height = img.bitmap.height;
                state.data.StageData.width = img.bitmap.width;
                this.setState(state);
                e.target.style.color = "white";
              })
              .catch((err) => {
                if (err) return (e.target.style.color = "RED");
              });
          }}
        />
        <input
          value={this.state.data.AvatarData.x}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.AvatarData.x = value || state.data.AvatarData.x;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.AvatarData.y}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.AvatarData.y = value || state.data.AvatarData.y;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.AvatarData.width}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.AvatarData.width = value || state.data.AvatarData.width;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.AvatarData.height}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.AvatarData.height =
              value || state.data.AvatarData.height;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.AvatarData.rotation}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.AvatarData.rotation =
              value || state.data.AvatarData.rotation;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.TextData.x}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.TextData.x = value || state.data.TextData.x;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.TextData.y}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.TextData.y = value || state.data.TextData.y;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.TextData.fontSize}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            state.data.TextData.fontSize =
              value || state.data.TextData.fontSize;
            this.setState(state);
          }}
        />
        <input
          value={this.state.data.TextData.text}
          onChange={async (e) => {
            state.data.TextData.text = e.target.value;
            this.setState(state);
          }}
        />
        <input
          type="color"
          value={state.data.TextData.fill}
          onInputCapture={(e) => {
            state.data.TextData.fill = e.currentTarget.value;
            this.setState(state);
          }}
        />
      </Card>
    );
  }
}
