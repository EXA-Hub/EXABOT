const fs = require("fs");
const path = require("path");
(async () => {
  const usetube = require("usetube");
  let videos = await usetube.getChannelVideos("UC6vW-VOn6_n-jixi7QEFL5A");
  fs.writeFileSync(
    path.join(process.cwd(), "data/YTZAMPX.json"),
    JSON.stringify(videos),
    console.error
  );
})();
