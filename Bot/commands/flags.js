module.exports = {
  name: "flags",
  aliases: ["flag"],
  category: "الإعـدادات",
  description: "تحديد رتب للحسابات النادرة",
  expectedArgs: "<delete/create>",
  minArgs: 1,
  maxArgs: 1,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  cooldown: "1h",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "العملية_المراده_على_الرتب",
      description: "إختيار العملية المراد تنفيذها على الرتب",
      required: true,
      type: 3,
      choices: [
        {
          name: "إنشاء_الرتب_وتوزيعه_على_الأعضاء",
          value: "create",
        },
        {
          name: "حذف_الرتب",
          value: "delete",
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
    const bedges = [
      "DISCORD_EMPLOYEE",
      "PARTNERED_SERVER_OWNER",
      "HYPESQUAD_EVENTS",
      "BUGHUNTER_LEVEL_1",
      "EARLY_SUPPORTER",
      "TEAM_USER",
      "BUGHUNTER_LEVEL_2",
      "VERIFIED_BOT",
      "EARLY_VERIFIED_BOT_DEVELOPER",
      "DISCORD_CERTIFIED_MODERATOR",
      "HOUSE_BRAVERY",
      "HOUSE_BRILLIANCE",
      "HOUSE_BALANCE",
    ];
    const rolesData = {};
    if (args[0] === "delete") {
      if (interaction) interaction.reply({ content: "جاري حذف الرتب" });
      guild.roles.cache.forEach((role) => {
        if (!bedges.includes(role.name.toString())) return;
        // Delete a role
        channel.send({
          allowedMentions: { users: [] },
          content: `> **\`#\` ${role.name.toString()} تم حذف رتبة**`,
        });
        role.delete("The role needed to go").catch(console.error);
      });
    } else if (args[0] === "create") {
      if (interaction) interaction.reply({ content: "جاري إضافة الرتب" });
      bedges.forEach((bedge) => {
        const role = guild.roles.cache.find(
          (role) => role.name.toString() === bedge
        );
        if (role) rolesData[bedge] = role.id;
        else
          guild.roles
            .create({
              name: bedge.toString(),
              color: "BLUE",
              hoist: true,
              mentionable: false,
              reason: "profile bedges roles",
            })
            .then((newRole) => {
              rolesData[bedge] = newRole.id;
            });
        channel.send({
          allowedMentions: { users: [] },
          content: `> **\`#\` ${bedge.toString()} تم إضافة رتبة**`,
        });
      });
      guild.members.cache.forEach((member) => {
        const { Manager } = require("discord-autorole-badges");
        const manager = new Manager(client, rolesData);
        manager.setRole(member);
      });
    } else return "`delete` أو `create`";
  },
};
