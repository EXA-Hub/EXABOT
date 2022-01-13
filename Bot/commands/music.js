const { Client, MessageEmbed } = require("discord.js");
const config = require("../data/config");
const wok = require("wokcommands");
module.exports = {
  name: "music",
  aliases: [],
  category: "الإعـدادات",
  description: "التحكم في الغرف الموسيقية في المجتمع",
  expectedArgs: "<run/end>",
  minArgs: 1,
  maxArgs: 1,
  syntaxError: "× ؛خطأ ما؛ ×",
  permissions: ["MANAGE_CHANNELS", "ADMINISTRATOR", "MANAGE_GUILD"],
  // cooldown: '',
  globalCooldown: "1m",
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "العملية",
      description: "نوع_العملية_المراد_تنفيذها",
      required: true,
      // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
      type: 3,
      choices: [
        {
          name: "تفعيل_التشغيل_من_خلال_غرفة-الموسيقى",
          value: "run",
        },
        {
          name: "إلغاء_التفعيل_التشغيل_من_خلال_غرفة_الموسيقى",
          value: "end",
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   */
  init: (client, instance) => {},
  /**
   * @param {wok.ICallbackObject} ICallbackObject
   *
   */
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
  } = ICallbackObject) => {
    const wrongCmdEmbed = new MessageEmbed()
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .addField(
        `\`${message ? prefix : "/"}music <info/run/end>\``,
        "تشغيل وإيقاف التدوين ورؤية المعلومات",
        false
      )
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}music`);
    const operation = args[0];
    const db = require("../functions/database");
    if (interaction) interaction.reply({ content: "جاري البدأ ✔" });
    const MusicChannelsData = (await db.get("MusicChannels")) || {};
    switch (operation) {
      case "run":
        if (MusicChannelsData[guild.id]) {
          return {
            custom: true,
            content: "> ❌ **×؛ توجد بالفعل غرفة موسيقية ؛×** ❌",
          };
        } else {
          guild.channels
            .create("غرفة الموسيقى", {
              type: "GUILD_TEXT",
              topic:
                "<a:m1:820786593975369738><a:u1:820790154637738035><a:s1:820789726301650964><a:i1:820786131435651082><a:c1:820785595734687764>",
              rateLimitPerUser: 3,
              reason: "إنشاء غرفة موسيقية",
            })
            .then((MusicChannel) => {
              const botOwner = client.users.cache.get(config.owner);
              MusicChannel.send({
                embeds: [
                  new MessageEmbed()
                    .setTitle("أرسل إسم أغنية")
                    .setColor(config.bot.color.hex)
                    .setURL(`${config.dashboard.react}/?guild=${guild.id}`)
                    .setDescription("أرسل إسم أغنية وسيقوم البوت فورا بتشغيلها")
                    .setFooter({
                      text: `Bot Developer: ${botOwner.tag}`,
                      iconURL: botOwner.avatarURL({ dynamic: true, size: 256 }),
                    })
                    .setAuthor({
                      name: guild.name,
                      iconURL: guild.iconURL({
                        dynamic: true,
                        size: 256,
                      }),
                      url: config.support.server.invite.link,
                    })
                    .setImage(config.youtube.music.banner)
                    .setTimestamp(),
                ],
              }).then(async (msg) => {
                msg.pin();
                MusicChannelsData[guild.id] = {
                  channel: MusicChannel.id,
                  message: msg.id,
                };
                await db.set("MusicChannels", MusicChannelsData);
                channel.send({
                  content: `> **:notes: | غرفة الموسيقى: <#${MusicChannel.id}> | :notes:**`,
                });
              });
            });
        }
        break;
      case "end":
        const channelID = MusicChannelsData[guild.id]
          ? MusicChannelsData[guild.id].channel
          : null;
        const voiceChannel = guild.channels.cache.get(channelID);
        if (voiceChannel && voiceChannel.deletable)
          voiceChannel.delete("صاحب الأمر: " + user.tag);
        delete MusicChannelsData[guild.id];
        await db.set("MusicChannels", MusicChannelsData);
        if (voiceChannel && channel.id === voiceChannel.id) return;
        channel.send({ content: "> **✅ تم حذف الغرفة الموسيقية**" });
        break;
      case "info":
        const guildMusicData = MusicChannelsData[guild.id];
        if (guildMusicData) {
          return {
            custom: true,
            content: `> **الغرفة: <#${guildMusicData.channel}>**`,
          };
        } else {
          return { custom: true, content: `> **الغرفة: غير موجود**` };
        }
        break;
      default:
        return { custom: true, embeds: [wrongCmdEmbed] };
        break;
    }
  },
};
