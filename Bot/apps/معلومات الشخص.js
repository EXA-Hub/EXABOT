const {
  Guild,
  GuildMember,
  User,
  Channel,
  Client,
  Interaction,
} = require("discord.js");
const WOKcommands = require("wokcommands");

module.exports = {
  name: "معلومات الشخص",
  type: "user",
  /**
   *
   * @param {{guild: Guild,member: GuildMember,user: User,target: { type: String, id: String },channel: Channel,client: Client,instance: WOKcommands,interaction: Interaction}} data
   */
  run: ({
    guild,
    member,
    user,
    target,
    channel,
    client,
    instance,
    interaction,
  } = data) => {
    if (!target.type === "USER")
      return interaction.reply({
        ephemeral: true,
        content: "**❌ | لا أستطيع العثور على العضو**",
      });

    const config = require("../data/config.js");
    const targetMember = guild.members.cache.get(target.id);
    const targetUser = targetMember.user;

    if (!targetUser || !targetMember)
      return interaction.reply({
        ephemeral: true,
        content: "**❌ | لا أستطيع العثور على العضو**",
      });

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

    return interaction.reply({ embeds: [embed] });
  },
};
