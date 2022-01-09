const data = require("./data/json.json");
const video = data.filter((file) => file.hasVideo && file.hasAudio);
const audio = data.filter((file) => !file.hasVideo && file.hasAudio);
console.log(video.length);
console.log(audio.length);
video.forEach((v) => console.log(v.qualityLabel));
audio.forEach((v) => console.log(v));
