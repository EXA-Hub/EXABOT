const fs = require("fs");
const path = require("path");
const { Client } = require("discord.js");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "تجربة",
  aliases: ["جرب", "مثال"],
  category: "الألـعـاب",
  description: "جرب البوت",
  expectedArgs: "[كلام]",
  minArgs: 0,
  maxArgs: -1,
  syntaxError: "× خطأ ×",
  permissions: [],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: false,
  slash: "both",
  /**
   *
   * @param {Client} client
   */
  init: (client, instance) => {},
  /**
   * @param {ICallbackObject} ICallbackObject
   *
   */ callback: async ({
    guild,
    member,
    user,
    message,
    channel,
    args,
    text,
    client,
    prefix,
    instance,
    interaction,
  }) => {
    let responses = require("../data/responses.json");
    const min = 0;
    const max = responses.length;
    const random = Math.floor(Math.random() * (+max - +min) + +min);
    let content = responses[random]
      .toString()
      .replace("{{prefix}}", message ? instance.getPrefix(guild) || "." : "/");
    if (content.includes("{{giftCode}}")) {
      const db = require("../functions/database");
      let { gifts } = (await db.get("gifts")) || {};
      const maxGift = gifts.length;
      const randomGift = Math.floor(Math.random() * (+maxGift - +min) + +min);
      console.log(gifts);
      content = content.replace(
        "{{giftCode}}",
        gifts[randomGift]
          ? gifts[randomGift].code
          : "غير موجود \n" +
              "يمكنك إضافة هدية بواسطة الأمر\n" +
              ".gifts add <هدية> <رمز>"
      );
    }
    if (args[0] === "add" && require("../data/config").devs.includes(user.id)) {
      const response = text.replace(`${args[0]} `, "");
      responses.push(response);
      fs.writeFile(
        path.join(process.cwd(), "data/responses.json"),
        JSON.stringify(responses, 1, 1),
        console.error
      );
    }
    if (content.includes("{{YTZAMPX}}")) {
      let videos = require("../data/YTZAMPX.json");
      const maxVid = videos.length;
      const randomVid = Math.floor(Math.random() * (+maxVid - +min) + +min);
      content = content.replace(
        "{{YTZAMPX}}",
        `https://youtu.be/${videos[randomVid].id}`
      );
    }
    return {
      custom: true,
      content,
      allowedMentions: { repliedUser: false },
    };
  },
};
