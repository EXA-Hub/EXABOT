const express = require("express");
const app = express();
app.listen(55555, () => {
  console.log(`localhost:55555`);
});

const Canvas = require("canvas");
Canvas.registerFont("fonts/dg-bebo-b.ttf", { family: "DG-Bebo-B" });

const degreesToRads = (deg) => (deg * Math.PI) / 180.0;
const radsToDegrees = (rad) => (rad * 180) / Math.PI;
var text2png = require("text2png");
const _ = require("lodash");

app.get("/", async (req, res) => {
  const help = [
    "GET /welcome/1?tag={number}&name={string}&memberCount={number}[&background={image-url}&avatar={avatar-url}]",
  ];
  res.json(help);
});

app.get("/welcome/1", async (req, res) => {
  if (!req.query.name) return res.send(`${"/test/img?name="}`);
  if (!req.query.tag) return res.send(`${"/test/img?tag="}`);
  if (!req.query.memberCount) return res.send(`${"/test/img?memberCount="}`);
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage(
    req.query.background ||
      "https://cdn.discordapp.com/attachments/851746618138951691/894676615894802473/20191115_213644.png"
  );
  let x = 0;
  let y = 0;
  ctx.drawImage(background, x, y);

  const pfp = await Canvas.loadImage(
    req.query.avatar ||
      "https://cdn.discordapp.com/avatars/709512157821403186/8e620e4b55eb080a7ae265f52de88097.png"
  );
  x = canvas.width / 2 - pfp.width / 2;
  y = 25;
  ctx.drawImage(pfp, x, y);

  ctx.fillStyle = "#ffffff";
  ctx.font = "35px DG-Bebo-B";
  let text = `مرحبا ${req.query.name}#${req.query.tag}`;
  x = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, x, 60 + pfp.height);

  ctx.font = "30px DG-Bebo-B";
  text = `العضو رقم #${req.query.memberCount}`;
  x = canvas.width / 2 - ctx.measureText(text).width / 2;
  ctx.fillText(text, x, 100 + pfp.height);

  res.set("Content-Type", "image/png");
  res.send(`${canvas.toBuffer()}`);
});

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

app.get("/welcome/data", async (req, res) => {
  /**
   * تجهيز المعلومات المطلوبة
   */
  if (!req.query.data || !req.query.member) return res.send(`${req.query}`);
  const data = JSON.parse(decodeURI(req.query.data));
  const member = JSON.parse(decodeURI(req.query.member));
  if (!data || !member) return res.send(`${(data, member)}`);
  const { memberCount, name, tag } = member;
  const createCanvasWidth = data.StageData.width;
  const createCanvasHeight = data.StageData.height;
  if (!_.isInteger(createCanvasHeight) || !_.isInteger(createCanvasWidth))
    return res.send(`${(createCanvasWidth, createCanvasHeight)}`);
  const pfpX = data.AvatarData.x;
  const pfpY = data.AvatarData.y;
  if (!_.isInteger(Math.floor(pfpX)) || !_.isInteger(Math.floor(pfpY)))
    return res.send(`${(pfpX, pfpY)}`);
  const backgroundImageUrl = data.StageData.background;
  if (!_.isString(backgroundImageUrl) || !validURL(backgroundImageUrl))
    return res.send(`${backgroundImageUrl}`);
  const pfpWidth = data.AvatarData.width;
  const pfpHeight = data.AvatarData.height;
  if (!_.isInteger(Math.floor(pfpWidth)) || !_.isInteger(Math.floor(pfpHeight)))
    return res.send(`${(pfpWidth, pfpHeight)}`);
  const pfpScaleWidth = data.AvatarData.scaleX;
  const pfpScaleHeight = data.AvatarData.scaleY;
  if (
    !_.isInteger(Math.floor(pfpScaleWidth)) ||
    !_.isInteger(Math.floor(pfpScaleHeight))
  )
    return res.send(`${(pfpScaleWidth, pfpScaleHeight)}`);
  const avatarImageUrl = data.AvatarData.url;
  if (!_.isString(avatarImageUrl) || !validURL(avatarImageUrl))
    return res.send(`${avatarImageUrl}`);
  const rotation = data.AvatarData.rotation;
  if (!_.isInteger(Math.floor(rotation))) return res.send(`${rotation}`);
  const circle = data.AvatarData.circle;
  if (!_.isBoolean(circle)) return res.send(`${circle}`);
  const color = data.TextData.fill;
  if (!_.isString(color)) return res.send(`${color}`);
  const messageText = data.TextData.text;
  if (!_.isString(messageText)) return res.send(`${messageText}`);
  const messageTextX = data.TextData.x;
  const messageTextY = data.TextData.y;
  if (
    !_.isInteger(Math.floor(messageTextX)) ||
    !_.isInteger(Math.floor(messageTextY))
  )
    return res.send(`${(messageTextX, messageTextY)}`);
  const messageTextPX = data.TextData.fontSize;
  if (!_.isInteger(messageTextPX)) return res.send(`${messageTextPX}`);
  const messageTextScaleX = data.TextData.scaleX;
  const messageTextScaleY = data.TextData.scaleY;
  if (
    !_.isInteger(Math.floor(messageTextScaleX)) ||
    !_.isInteger(Math.floor(messageTextScaleY))
  )
    return res.send(`${(messageTextScaleX, messageTextScaleY)}`);
  const messageTextRotation = data.TextData.rotation;
  if (!_.isInteger(Math.floor(messageTextRotation)))
    return res.send(`${messageTextRotation}`);

  /**
   * بدأ المشروع النهائي
   */
  const canvas = Canvas.createCanvas(createCanvasWidth, createCanvasHeight);
  const ctx = canvas.getContext("2d");

  ctx.save();
  const background = await Canvas.loadImage(backgroundImageUrl);
  let x = 0;
  let y = 0;
  ctx.drawImage(background, x, y);
  ctx.restore();

  ctx.save();
  const finalMessageText = messageText
    .replace("{{discordTag}}", `${name}#${tag}`)
    .replace("{{memberCount}}", memberCount)
    .replace("{{name}}", name)
    .replace("{{tag}}", tag);
  ctx.font = messageTextPX + "px sans";
  const txtImg = text2png(finalMessageText, {
    font: messageTextPX + "px sans",
    textAlign: "right",
    color: `#${color}`,
  });
  let textImage = await Canvas.loadImage(txtImg);
  let innerWidth = textImage.width * messageTextScaleX;
  let innerHeight = textImage.height * messageTextScaleY;
  x = messageTextX - innerWidth / 2;
  y = messageTextY - innerHeight / 2;
  ctx.translate(x + innerWidth / 2, y + innerHeight / 2);
  ctx.rotate(degreesToRads(messageTextRotation));
  ctx.translate(-(x + innerWidth / 2), -(y + innerHeight / 2));
  ctx.drawImage(
    textImage,
    0,
    0,
    textImage.width,
    textImage.height,
    messageTextX,
    messageTextY,
    textImage.width * messageTextScaleX,
    textImage.height * messageTextScaleY
  );
  ctx.restore();

  ctx.save();
  let pfp = await Canvas.loadImage(avatarImageUrl);
  innerWidth = pfpWidth * pfpScaleWidth;
  innerHeight = pfpHeight * pfpScaleHeight;
  x = pfpX - innerWidth / 2;
  y = pfpY - innerHeight / 2;
  ctx.translate(x + innerWidth / 2, y + innerHeight / 2);
  ctx.rotate(degreesToRads(rotation));
  ctx.translate(-(x + innerWidth / 2), -(y + innerHeight / 2));
  if (circle) {
    ctx.beginPath();
    ctx.ellipse(
      x + innerWidth / 2,
      y + innerHeight / 2,
      innerWidth / 2,
      innerHeight / 2,
      degreesToRads(rotation) / 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.clip();
    ctx.drawImage(pfp, x, y, innerWidth, innerHeight);
  } else ctx.drawImage(pfp, x, y, innerWidth, innerHeight);
  ctx.restore();

  res.set("Content-Type", "image/png");
  res.send(canvas.toBuffer());
});

process
  .on("unhandledRejection", async (reason) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason);
  })
  .on("uncaughtException", async (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
  })
  .on("uncaughtExceptionMonitor", async (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
  })
  .on("multipleResolves", async (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
    console.log(type, promise, reason);
  })
  .on("warning", async (warning) => {
    console.log(" [antiCrash] :: Warning");
    console.log(warning);
  });
