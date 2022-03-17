const { client } = require("../index");
const config = require("../data/config");
const { MessageEmbed } = require("discord.js");
const { barges } = require("../functions/barges");
const { ICallbackObject } = require("wokcommands");
const definitions = [
  {
    name: "غرفة",
    type: String,
    aliases: ["غ", "غرفة"],
    description: "معرف الغرفة",
  },
  {
    name: "رسالة",
    type: String,
    aliases: ["س", "رسالة"],
    description: "معرف الرسالة",
  },
  {
    name: "نوعية",
    type: String,
    aliases: ["ن", "نوعية"],
    description:
      "نوعية التفاعلية: " +
      `
     [once,مرة]: المستخدم يستطيع أن  يحصل على الرتبة مرة واحدة فقط (لا تحذف بعدها).
     [any,عادي]: المستخدم يستطيع أن يحصل على الرتب ويحذفها كما يريد.
     [unique,فريد] (الإفتراضية): يستطيع المستخدم أن يحصل على مجموعة واحدة من الرتب.`,
  },
  {
    name: "حذف",
    type: Boolean,
    aliases: ["ح", "حذف"],
    description: "<نعم/لا> حذف التفاعل بعد تحويل الرتب ⚠ أضفها أو لا تضيفها ⚠",
  },
  {
    name: "رتبة",
    type: String,
    aliases: ["ر", "رتبة"],
    description: "الرتب اللتي تريدها (يمكنك إضافة أكثر من رتبة)",
  },
  {
    name: "تفاعل",
    type: String,
    aliases: ["ت", "تفاعل"],
    description: "رمز التفاعل اللذي تريده 😉",
  },
];
module.exports = {
  name: "رتب-التفاعل",
  aliases: ["رتب-التفاعلة", "تفاعلية"],
  category: "الإداريـة",
  description: "رتب تفاعل جديدة",
  expectedArgs: `${`<رسالة/رتبة/معلومات> --[${definitions.map(
    (define) =>
      `[${define.aliases.map((aliases) => `${aliases},`.slice(0, -1))}]`
  )}`.slice(0, -1)}]]`,
  minArgs: 1,
  maxArgs: 13,
  syntaxError: "× خطأ ×",
  permissions: ["ADMINISTRATOR"],
  cooldown: "10s",
  // globalCooldown: "",
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "معلومات",
      description: "رؤية معلومات الرتب التفاعل",
      type: 1,
    },
    {
      name: "رسالة",
      description: "صنع رسالة رتب تفاعل جديدة",
      type: 1,
      options: [
        {
          name: "رسالة",
          description: "معرف الرسالة المرادة",
          required: true,
          type: 3,
        },
        {
          name: "غرفة",
          description: "معرف الغرفة المرادة",
          required: true,
          type: 7,
        },
        {
          name: "نوعية",
          description: "نوعية التفاعلية",
          required: true,
          type: 3,
          choices: [
            {
              name: "مرة",
              value: "once",
            },
            {
              name: "عادي",
              value: "any",
            },
            {
              name: "فريد",
              value: "unique",
            },
          ],
        },
        {
          name: "حذف",
          description: "حذف التفاعل أم لا",
          required: true,
          type: 5,
        },
      ],
    },
    {
      name: "رتبة",
      description: "صنع رتب تفاعل جديدة",
      type: 1,
      options: [
        {
          name: "رسالة",
          description: "معرف الرسالة المرادة",
          required: true,
          type: 3,
        },
        {
          name: "غرفة",
          description: "معرف الغرفة المرادة",
          required: true,
          type: 7,
        },
        {
          name: "رتبة",
          description: "الرتبة المراد تحصيلها",
          required: true,
          type: 8,
        },
        {
          name: "تفاعل",
          description: "معرف التفاعل المراد",
          required: true,
          type: 3,
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
    const errEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor("DARK_RED")
      .setTitle("× إستخدام خاطئ للأمر ×")
      .setDescription(
        `يمكنك التواصل مع فريق الدعم لمعرفة طريقة تشغيل الأوامر\n${config.support.server.invite.link}`
      )
      .addField("معلومات", `${message ? prefix : "/"}تفاعلية معلومات`, false)
      .addField(
        "إنشاء رسالة جديدة",
        `${message ? prefix : "/"}تفاعلية رسالة` +
          `${` --[${definitions.map(
            (define) =>
              `[${define.aliases.map((aliases) => `${aliases},`.slice(0, -1))}]`
          )}`.slice(0, -1)}]]`,
        false
      )
      .addField(
        "إنشاء رتبة تفاعلية جديدة",
        `${message ? prefix : "/"}تفاعلية رتبة` +
          `${` --[${definitions.map(
            (define) =>
              `[${define.aliases.map((aliases) => `${aliases},`.slice(0, -1))}]`
          )}`.slice(0, -1)}]]`,
        false
      )
      .addField(
        "مثال:",
        `\`${
          message ? prefix : "/"
        }تفاعلية رتبة --غرفة #اثـبـات --رسالة 952764436937072670 --رتبة @FOUNDER --تفاعل ⚖️ --نوع تخصص\``,
        false
      )
      .addFields(
        definitions.map(({ name, description }) => {
          return { name, value: description, inline: true };
        })
      );
    const subCommand = interaction
      ? interaction.options.getSubcommand()
      : args[0];
    const inputData = message
      ? barges(definitions, args)
      : interaction.options.data;
    const inputDataKeys = Object.keys(inputData);
    const wanteData = Object.fromEntries(
      // [["1":"one"],["2":"two"]] => {1:"one",2:"two"}
      inputDataKeys.map((inputDataKey) => {
        let value;
        switch (inputDataKey) {
          case "غرفة":
            value = inputData[inputDataKey];
            // console.log("غرفة");
            return ["غرفة", value];

          case "رسالة":
            value = inputData[inputDataKey];
            // console.log("رسالة");
            return ["رسالة", value];

          case "نوعية":
            value = inputData[inputDataKey];
            // console.log("نوعية");
            return ["نوعية", value];

          case "حذف":
            value = inputData[inputDataKey];
            // console.log("حذف");
            return ["حذف", value];

          case "رتبة":
            value = inputData[inputDataKey];
            // console.log("رتبة");
            return ["رتبة", value];

          case "تفاعل":
            value = inputData[inputDataKey];
            // console.log("تفاعل");
            return ["تفاعل", value];

          default:
            // console.log(null);
            return [null, null];
        }
      })
    );
    console.log(inputDataKeys);
    if (subCommand === "معلومات") {
      return `${inputData.toString()}`;
    } else if (subCommand === "رسالة") {
      if (
        ["غرفة", "رسالة", "نوع"].every((dataType) =>
          inputDataKeys.includes(dataType)
        )
      )
        return `**يرجى إدخال: \`--["غرفة", "رسالة", "نوع"]\`**\n||\`تأكد من إستخدام -- ليس - واحدة فقط 😉\`||`;
      return `${inputData.toString()}`;
    } else if (subCommand === "رتبة") {
      if (
        ["رتبة", "تفاعل", "رسالة", "نوع"].every((dataType) =>
          inputDataKeys.includes(dataType)
        )
      )
        return `**يرجى إدخال: \`--["رتبة", "تفاعل", "رسالة", "نوع"]\`**\n||\`تأكد من إستخدام -- ليس - واحدة فقط 😉\`||`;
      return `${inputData.toString()}`;
    } else return { custom: true, embeds: [errEmbed] };
  },
};
