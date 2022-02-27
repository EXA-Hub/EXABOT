import React, { Component } from "react";
import { Stage, Layer, Transformer, Text, Image, Rect } from "react-konva";
import useImage from "use-image";
// import jimp from "jimp";

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

const Avatar = ({ data }) => {
  const [image] = useImage(data.url);
  return (
    <Image
      name="Avatar"
      draggable
      image={image}
      x={data.x}
      y={data.y}
      width={data.width || 128}
      height={data.height || 128}
      fill={data.fill}
      rotation={data.rotation}
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
          "https://media.discordapp.net/attachments/865036175705112596/919683698851479592/20191115_213644.jpg",
      },
      AvatarData: {
        url: this.props.user.avatarURL,
        x: 60,
        y: 120,
        width: 128,
        height: 128,
        fill: "#ffff00",
        rotation: 0,
      },
      TextData: {
        text: this.props.user.discordTag,
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
    const { TextData, StageData } = this.state.data;
    return (
      <Stage
        onClick={this.handleStageClick}
        width={StageData.width}
        height={StageData.height}
      >
        <Layer>
          <Rect
            fill="red"
            height={StageData.height}
            width={StageData.width}
            x={0}
            y={0}
          />
          <Avatar data={this.state.data.AvatarData} />
          <Text
            name="text"
            draggable
            text={TextData.text}
            x={TextData.x}
            y={TextData.y}
            fill={TextData.fill}
            fontSize={TextData.fontSize}
          />
          <TransformerComponent
            selectedShapeName={this.state.selectedShapeName}
          />
        </Layer>
      </Stage>
    );
  }
}
