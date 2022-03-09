const { ICallbackObject } = require("wokcommands");
const { MessageEmbed } = require("discord.js");
const db = require("../functions/database");
const config = require("../data/config");
const { client } = require("../index");
/**
client.temps.channels;
client.temps.unregisterChannel("");
client.temps.registerChannel("", {
  childCategory: "",
  // إختياري
  childMaxUsers: 3,
  // textChannelAsThreadParent: "",
  //   ثوابت
  threadArchiveDuration: "MAX",
  childAutoDeleteIfEmpty: true,
  childAutoDeleteIfOwnerLeaves: false,
  childTextFormat: (str, count) => `#${count} - ${str}`,
  childTextFormatRegex: /^#\d+ \-/,
  childVoiceFormat: (str, count) => `#${count} - ${str}`,
  childVoiceFormatRegex: /^#\d+ \-/,
  childBitrate: 64,
  childCanBeRenamed: true,
  childOverwriteRolesAndUsers: config.devs.map((dav) =>
    client.users.cache.get(dav)
  ),
  childPermissionOverwriteOptions: {
    SEND_MESSAGES: true,
    EMBED_LINKS: null,
    ATTACH_FILES: false,
  },
});
 */
let tempChannelData = {
  childCategory: "",
  // إختياري
  childMaxUsers: 3,
  textChannelAsThreadParent: null,
  // ثوابت
  threadArchiveDuration: "MAX",
  childAutoDeleteIfEmpty: true,
  childAutoDeleteIfOwnerLeaves: false,
  childTextFormat: (str, count) => `#${count} - ${str}`,
  childTextFormatRegex: /^#\d+ \-/,
  childVoiceFormat: (str, count) => `#${count} - ${str}`,
  childVoiceFormatRegex: /^#\d+ \-/,
  childBitrate: 64 * 1000,
  childCanBeRenamed: true,
  childOverwriteRolesAndUsers: config.devs.map((dav) =>
    client.users.cache.get(dav)
  ),
  childPermissionOverwriteOptions: {
    SEND_MESSAGES: true,
    EMBED_LINKS: null,
    ATTACH_FILES: false,
  },
};
module.exports = {
  name: "temps",
  aliases: ["temp"],
  category: "الإداريـة",
  description: "صنع وحذف الغرف المؤقتة",
  expectedArgs: "<create/remove/show> [صوتية] [جامعة] [عدد الضيوف] [غرفة]",
  minArgs: 1,
  maxArgs: 5,
  syntaxError: "× خطأ ×",
  permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
  // cooldown: "",
  //   globalCooldown: "1h",
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "show",
      description: "إظهار الغرف المؤقتة",
      type: 1,
    },
    {
      name: "remove",
      description: "حذف غرفة مؤقتة",
      type: 1,
      options: [
        {
          name: "الصوتية",
          description: "حذف هذه الصوتية",
          required: true,
          type: 7,
        },
      ],
    },
    {
      name: "create",
      description: "إضافة غرفة جديدة",
      type: 1,
      options: [
        {
          name: "الصوتية",
          description: "تحديد الصوتية",
          required: true,
          type: 7,
        },
        {
          name: "الجامعة",
          description: "تحديد الجامعة",
          required: true,
          type: 7,
        },
        {
          name: "عدد_الضيوف",
          description: "تحديد أفصى عدد للضيوف",
          required: false,
          type: 4,
        },
        {
          name: "الغرفة",
          description: "تحديد الغرفة الأساسية إذا أردت غرفة فرعية",
          required: false,
          type: 7,
        },
      ],
    },
  ],
  /**
   *
   * @param {client} client
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
    const type = message ? args[0] : interaction.options.getSubcommand();
    let data = [];
    if (type === "remove" || type === "create")
      data = await db.get("temp-channels").data;
    if (!data) data = [];
    switch (type) {
      case "show":
        const channels = client.temps.channels.filter((c) =>
          guild.channels.cache.has(c.channelId)
        );
        const fields = channels.map((c) => {
          const guildChannel = guild.channels.cache.get(c.channelId);
          if (!guildChannel)
            return { name: "\u200B", value: "\u200B", inline: false };
          return {
            name: `${guildChannel.name} - ${guildChannel}`,
            value: `👥 أقصى عدد للأفراد: ${
              c.options.childMaxUsers
            }\n🖇️ الغرفة الأساسية: ${
              c.options.textChannelAsThreadParent
                ? `<#${
                    guild.channels.cache.get(
                      c.options.textChannelAsThreadParent
                    ).id
                  }>`
                : "غير موجودة ❌"
            }`,
            inline: false,
          };
        });
        const embed = new MessageEmbed()
          .setColor(config.bot.color.hex)
          .setTitle("جامعات الغرف المؤقتة في المجتمع")
          .addFields(fields);
        return { custom: true, embeds: [embed] };
      case "remove":
        const targetChannel = message
          ? message.mentions.channels.first() ||
            guild.channels.cache.get(args[1])
          : interaction.options.getChannel("الصوتية");
        if (
          !targetChannel ||
          client.temps.channels.size === 0 ||
          targetChannel.type !== "GUILD_VOICE" ||
          !client.temps.channels.has(targetChannel.id)
        )
          return "**💢 | صوتية غير موجودة**";
        data.filter((c) => c.channelID !== targetChannel.id);
        await db.set("temp-channels", { data });
        client.temps.unregisterChannel(targetChannel.id);
        return "**✅ | تم الحذف بنجاح**";
      case "create":
        const channelID = message
          ? message.mentions.channels.first() ||
            guild.channels.cache.get(args[1])
          : interaction.options.getChannel("الصوتية");
        if (!channelID || channelID.type !== "GUILD_VOICE")
          return "**💢 | صوتية غير موجودة**";
        if (!channelID.parent) return "**💢 | يجب أن تنضم الصوتية لجامعة**";
        const childCategory = message
          ? message.mentions.channels[1] || guild.channels.cache.get(args[2])
          : interaction.options.getChannel("الجامعة");
        if (!childCategory || childCategory.type !== "GUILD_CATEGORY")
          return "**💢 | جامعة غير موجودة**";
        const childMaxUsers =
          (message
            ? parseInt(args[3])
            : interaction.options.getInteger("عدد_الضيوف")) || 3;
        if (isNaN(childMaxUsers)) return "**💢 | عدد غير موجود**";
        const textChannelAsThreadParent = message
          ? message.mentions.channels[2] || guild.channels.cache.get(args[4])
          : interaction.options.getChannel("الغرفة");
        if (
          textChannelAsThreadParent &&
          textChannelAsThreadParent.type !== "GUILD_TEXT"
        )
          return "**💢 | غرفة غير موجودة**";
        data.push({
          channelID,
          childMaxUsers,
          childCategory: childCategory.id,
          textChannelAsThreadParent: textChannelAsThreadParent
            ? textChannelAsThreadParent.id
            : null,
        });
        tempChannelData.childCategory = childCategory.id;
        tempChannelData.childMaxUsers = childMaxUsers;
        if (textChannelAsThreadParent)
          tempChannelData.textChannelAsThreadParent = textChannelAsThreadParent;
        await db.set("temp-channels", { data });
        client.temps.registerChannel(channelID, tempChannelData);
        client.temps.registerChannel(channelID, tempChannelData);
        return "**✅ | تم إنشاء الغرفة**";
      default:
        return `× ${
          message ? prefix : "/"
        }temps <create/remove/show> [جامعة] [عدد الأعضاء] [غرفة] ×`;
    }
  },
};
