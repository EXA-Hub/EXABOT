module.exports = {
  name: "report",
  aliases: [],
  category: "أوامر خـاصـة",
  description: "الإبلاغ على خطأ في البوت",
  expectedArgs: "<الإبلاغ>",
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
      name: "الإبلاغ",
      description: "يرجى إرسال الإبلاغ",
      required: true,
      type: 3,
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
    if (interaction)
      interaction.reply({ content: `**👍 | نشكرك على التبليغ**` });
    const config = require("../data/config.js");
    const reportserver = client.guilds.cache.get(config.support.server.id);
    const reportchannel = reportserver.channels.cache.get(
      config.support.server.report.channel.id
    );
    const {
      MessageEmbed,
      MessageButton,
      MessageActionRow,
    } = require("discord.js");
    const invitebtn = new MessageButton()
      .setURL(config.support.server.invite.link)
      .setStyle("LINK")
      .setLabel("روم الإقتراحات");
    const reportinvite = await channel
      .createInvite({
        maxAge: 0, // 0 = infinite expiration
        maxUses: 0, // 0 = infinite uses
      })
      .catch(console.error);
    let reportembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("× إبلاغ على خطأ ×")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
        url: reportinvite.url,
      })
      .setThumbnail(client.user.avatarURL())
      .setDescription(
        message ? args.join(" ") : interaction.options.getString("الإبلاغ")
      )
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL() });
    const btns = new MessageActionRow().addComponents(invitebtn);
    if (!args[0]) {
      channel.send({
        content: "> **\\⭕ يرجى إعطاء رسالة إخبارية بالخطأ \\⭕**",
      });
      const filter = (msg) => msg.author == user;
      channel
        .awaitMessages({
          filter,
          max: 1,
          time: 60 * 1000,
          errors: ["الزمن"],
        })
        .then((msg) => {
          msg = msg.first();
          reportchannel
            .send({ embeds: [reportembed.setDescription(msg.content)] })
            .then((msg) => {
              msg.react("🟢");
              msg.react("🔴");
              channel.send({
                content: "> ***تم إيصال إبلاغك بنجاح***",
                components: [btns],
              });
            });
        });
    } else {
      reportchannel
        .send({
          embeds: [
            reportembed.setDescription(
              message
                ? args.join(" ")
                : interaction.options.getString("الإبلاغ")
            ),
          ],
        })
        .then((msg) => {
          msg.react("🟢");
          msg.react("🔴");
          channel.send({
            content: "> ***تم إيصال إبلاغك بنجاح***",
            components: [btns],
          });
        });
    }
  },
};
