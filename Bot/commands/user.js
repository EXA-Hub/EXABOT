module.exports = {
  name: "user",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "معلومات عضو ما!",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "شخص",
      description: "الشخص المراد التعرف عليه",
      required: true,
      type: 6,
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
    const config = require("../data/config.js");
    const targetMember = message
      ? message.mentions.members.first() ||
        guild.members.cache.get(args[0]) ||
        member
      : interaction.options.getMember("شخص");
    const targetUser = targetMember.user;

    if (!targetUser || !targetMember)
      return "**❌ | لا أستطيع العثور على العضو**";

    const status = targetMember.presence
      ? targetMember.presence.status
      : "offline";
    const roles = targetMember.roles.cache
      .map((r) => `<@&${r.id}> |`)
      .join(` `);

    let inviteCount = 0;

    if (status.includes("dnd")) statusFull = ":red_circle: | DND";
    if (status.includes("offline")) statusFull = ":black_circle: | Offline";
    if (status.includes("online")) statusFull = ":green_circle: | Online";
    if (status.includes("idle")) statusFull = ":yellow_circle: | Idle";

    const { MessageEmbed } = require("discord.js");

    const embedColor = targetUser.hexAccentColor || config.bot.color.hex;

    let embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription("معلومات العضو", true)
      .addField("الإسم بالكامل:", `${targetUser.tag}`, true)
      .addField("أيدي:", `${targetUser.id}`, true)
      .addField(
        "تاريخ الإنضمام للسيرفر:",
        `<t:${Math.floor(member.joinedAt / 1000)}:F>`,
        true
      )
      .addField(
        "تاريخ إنشاء الحساب:",
        `<t:${Math.floor(
          targetUser.createdTimestamp / 1000
        )}:d> <t:${Math.floor(user.createdTimestamp / 1000)}:T>`,
        true
      )
      .addField("مجموع عدد الدعوات:", `${inviteCount}`, true)
      .addField("الرتب:", `${roles}`, false)
      .addField("الحالة:", `${statusFull}`, true)
      .setThumbnail(targetUser.avatarURL({ dynamic: true, size: 1024 }))
      .setFooter({
        text: client.user.username,
        iconURL: client.user.avatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: targetUser.tag,
        iconURL: targetUser.avatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return { custom: true, embeds: [embed] };
  },
};
