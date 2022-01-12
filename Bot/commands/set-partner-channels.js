module.exports = {
  name: "set-partner-channels",
  aliases: ["spc"],
  category: "الإعـدادات",
  description: "تحديد قنوات الشراكة في السيرفر",
  expectedArgs: "<قناة> <نوعها>",
  minArgs: 2,
  maxArgs: 2,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  cooldown: "3s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "الغرفة",
      description: "الغرفة المراد التعامل عليها",
      required: true,
      type: 7,
    },
    {
      name: "نوع_الغرفة",
      description: "تحديد نوع الغرفة",
      required: true,
      type: 3,
      choices: [
        {
          name: "غرفة_نشر_الشراكات",
          value: "channel",
        },
        {
          name: "غرفة_إستقبال_الطلبات_(غرفة_سرية!!)",
          value: "request",
        },
      ],
    },
  ],
  init: (client, instance) => {},
  callback: async ({
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
    const db = require("../functions/database");
    const { MessageEmbed } = require("discord.js");
    if (!args[0])
      return {
        custom: true,
        content: "**من فضلك حدد القناة**",
        allowedMentions: { repliedUser: false },
      };
    const nochanneltybeembed = new MessageEmbed()
      .setTimestamp()
      .setColor("#FF0000")
      .setTitle("⚠️ يرجى تحديد نوع القناة ⚠️")
      .addField(
        "request",
        "**القناة اللتي سيرسل البوت طلبات الشراكات فيها**",
        false
      )
      .addField("channel", "**القناة اللي سيرسل فيها اعلانات الشراكات**", false)
      .addField(
        "مثال",
        `**\`${message ? prefix : "/"}spc <channel> request\`**`,
        false
      )
      .setFooter({
        text: user.tag,
        iconURL: user.avatarURL({ dynamic: true }),
      });
    if (!(message ? args[1] : interaction.options.getString("نوع_الغرفة")))
      return {
        custom: true,
        embeds: [nochanneltybeembed],
        allowedMentions: { repliedUser: false },
      };
    if (
      (message ? args[1] : interaction.options.getString("نوع_الغرفة")) !==
        "request" &&
      (message ? args[1] : interaction.options.getString("نوع_الغرفة")) !==
        "channel"
    ) {
      nochanneltybeembed.setTitle(`\⚠️ يرجي تحديد نوع قناة صحيح \⚠️`);
      return {
        custom: true,
        embeds: [nochanneltybeembed],
        allowedMentions: { repliedUser: false },
      };
    } else {
      const selectedChannel = message
        ? guild.channels.cache.get(args[0]) ||
          guild.channels.cache.find(
            (channel) => channel.name.toLowerCase() === args[0]
          ) ||
          message.mentions.channels.first() ||
          message.channel
        : interaction.options.getChannel("الغرفة");
      if (!selectedChannel || !selectedChannel.send)
        return {
          custom: true,
          content: "**👀 | لم أصل للقناة**",
          allowedMentions: { repliedUser: false },
        };
      if (!guild.channels.cache.get(selectedChannel.id))
        return {
          custom: true,
          content: "**❌ | لا يمكنك إستعمال قنوات من سيرفرات أخرى**",
          allowedMentions: { repliedUser: false },
        };
      selectedChannel.send({
        content: `\\✅ | <#${selectedChannel.id}>\n**تم الوصول للقناة وجاري تدوين المعلومات**`,
        allowedMentions: { repliedUser: false },
      });
      let path;
      if (
        (message ? args[1] : interaction.options.getString("نوع_الغرفة")) ===
        "request"
      )
        path = "partner_requests";
      if (
        (message ? args[1] : interaction.options.getString("نوع_الغرفة")) ===
        "channel"
      )
        path = "partner_channels";
      let datafile = (await db.get(path)) || {};
      datafile[guild.id] = selectedChannel.id;
      db.set(path, datafile);
      if (
        (message ? args[1] : interaction.options.getString("نوع_الغرفة")) ===
        "request"
      ) {
        return "**✅ | تم تحديد قناة طلبات الشراكة**";
      } else if (
        (message ? args[1] : interaction.options.getString("نوع_الغرفة")) ===
        "channel"
      ) {
        return "**✅ | تم تحديد قناة إرسال الشراكات**";
      } else {
        return "**✅ | هناك خطب ما لكن تم تحديد القناة**";
      }
    }
  },
};
