const { client } = require("../index");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "suggest",
  aliases: ["sug"],
  category: "أوامر خـاصـة",
  description: "أرسل أفكارك وإقتراحاتك وآراءك لمبرمجين وإدارة البوت",
  expectedArgs: "<الإقتراح>",
  minArgs: 0,
  maxArgs: -1,
  syntaxError: "",
  permissions: [],
  cooldown: "5m",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "الإقتراح",
      description: "يرجى إرسال الإقتراح",
      required: true,
      type: 3,
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
    if (interaction)
      interaction.reply({ content: `**👍 | نشكرك على إقتراحك**` });
    const config = require("../data/config.js");
    const sugserver = client.guilds.cache.get(config.support.server.id);
    const sugchannel = sugserver.channels.cache.get(
      config.support.server.suggestion.channel.id
    );
    const {
      MessageEmbed,
      MessageButton,
      MessageActionRow,
    } = require("discord.js");
    const invitebtn = new MessageButton()
      .setURL(config.support.server.invite.link)
      .setStyle("LINK")
      .setLabel("غرفة الإقتراحات");
    let sugembed = new MessageEmbed()
      .setTimestamp()
      .setColor(config.bot.color.hex)
      .setTitle("\\✔️ إقتراح جديد \\✔️")
      .setThumbnail(client.user.avatarURL())
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({ text: guild.name, iconURL: guild.iconURL() });
    const btns = new MessageActionRow().addComponents(invitebtn);
    if (!args[0]) {
      channel.send({ content: "> **\\⭕ يرجى إرسال إقتراحك \\⭕**" });
      const filter = (msg) => msg.author == user;
      channel
        .awaitMessages({
          filter,
          max: 1,
          dispose: true,
          time: 60 * 1000,
          idle: 60 * 1000,
          errors: ["الزمن"],
        })
        .then((msg) => {
          msg = msg.first();
          if (!msg || !msg.concat)
            return channel.send({
              content: "**💢 | تم إلغاء العملية**",
              components: [btns],
            });
          sugchannel
            .send({ embeds: [sugembed.setDescription(msg.content)] })
            .then((msg) => {
              msg.react("🟢");
              msg.react("🔴");
              channel.send({
                content: "> ***تم إيصال إقتراحك بنجاح***",
                components: [btns],
              });
            });
        });
    } else {
      sugchannel
        .send({
          embeds: [
            sugembed.setDescription(
              message
                ? args.join(" ")
                : interaction.options.getString("الإقتراح")
            ),
          ],
        })
        .then((msg) => {
          msg.react("🟢");
          msg.react("🔴");
          channel.send({
            content: "> ***تم إيصال إقتراحك بنجاح***",
            components: [btns],
          });
        });
    }
  },
};
