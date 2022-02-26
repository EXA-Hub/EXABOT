const { Client, MessageActionRow, MessageButton } = require("discord.js");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "shop",
  aliases: ["s"],
  category: "أوامـر عـامـة",
  description: "متجر البوت المعتمد",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  cooldown: "5s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: false,
  slash: "both",
  options: [
    {
      name: "شخص",
      description: "لرؤية البضاعة الخاصة بشخص ما",
      required: false,
      type: 6,
    },
    {
      name: "متجر_مين",
      description: "تحديد صاحب المتجر",
      required: false,
      type: 3,
      choices: [
        {
          name: "متجرك_أنت",
          value: "me",
        },
        {
          name: "متجر_السيرفر",
          value: "server",
        },
      ],
    },
    {
      name: "إضافة_وإزالة_البضائع",
      description: "العمليات_على_البضائع",
      required: false,
      type: 3,
      choices: [
        {
          name: "إضافة_بضاعة_جديدة",
          value: "add",
        },
        {
          name: "إزالة_بضاعة_قديمة",
          value: "remove",
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
    if (interaction) interaction.reply({ content: "**🔰 | جار التشغيل**" });
    const filter = (msg) => msg.author == user;
    const btnFilter = ({ user }) => user === user;
    const config = require("../data/config.js");
    const db = require("../functions/database");
    let botSellerShop = (await db.get("shop/bot")) || {};
    const { MessageEmbed } = require("discord.js");
    const wrongembed = new MessageEmbed()
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .setDescription("الأوامر المتاحة كالتالي:")
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}shop`)
      .addField(
        `\`${message ? prefix : "/"}shop\``,
        "لرؤية البضاعة الرسمية",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop me\``,
        "لرؤية البضاعة الخاصة بك",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop me add\``,
        "لإضافة بضاعة جديدة",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop me remove\``,
        "لحذف بضاعة حالية",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop server\``,
        "لرؤية البضاعة الخاصة بالسيرفر",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop server add\``,
        "لإضافة بضاعة جديدة للسيرفر",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop server remove\``,
        "لحذف بضاعة حالية في السيرفر",
        true
      )
      .addField(
        `\`${message ? prefix : "/"}shop <user>\``,
        "لرؤية البضاعة الخاصة بشخص ما",
        true
      );
    const shopItemsEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor(config.bot.color.hex)
      .setFooter({ text: `requested by: ${user.tag}` })
      .setTitle("البضاعة المتاحة:")
      .setDescription(
        `لا يمكن إسترداد البضاعة بعد الشراء\nقم بالتبليغ إذا تمت عملية نصب أو إحتيال\nإذا كانت البضاعة ممنوعة أو مخالفة قم بالتبليغ فورا\nأمر التبليغ: \`${
          message ? prefix : "/"
        }report\` [سيرفر التبليغ](${
          config.support.server.invite.link
        } 'قم بالضغط لدخول سيرفر التبليغ')`
      )
      .setURL(config.support.server.invite.link);
    if (args[0]) {
      /**
       *
       * جميع الأوامر هنا محمية
       *
       * لا تحاول إكتشاف أخطاء أو الإحتيال على النظام
       *
       */
      const targetUserSeller = message
        ? client.users.cache.get(args[0]) ||
          client.users.cache.find(
            (user) => user.tag.toString() === args.join(" ")
          ) ||
          message.mentions.users.first()
        : interaction.options.getUser("شخص");
      if (targetUserSeller) {
        const targetUserSellerShop =
          (await db.get(`shop/${targetUserSeller.id}`)) || {};
        if (
          targetUserSellerShop &&
          Array.isArray(targetUserSellerShop.items) &&
          targetUserSellerShop.items.length > 0
        ) {
          targetUserSellerShop.items.forEach((item, index) => {
            shopItemsEmbed.addField(
              item.goodName,
              item.description + `\nالسعر: \`${item.price}\`🪙`,
              true
            );
          });
        } else shopItemsEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
        shopItemsEmbed.setThumbnail(
          targetUserSeller.avatarURL({ dynamic: true, size: 1024 })
        );
        channel.send({ embeds: [shopItemsEmbed] });
      } else if (args[0] === "me") {
        /**
         *
         * جميع الأوامر هنا محمية
         *
         * لا تحاول إكتشاف أخطاء أو الإحتيال على النظام
         *
         */
        let targetUserSellerShop = (await db.get(`shop/${user.id}`)) || {};
        if (args[1] === "add") {
          channel
            .send({ content: "**الرجاء إرسال أسم البضاعة**" })
            .then((setNameMessage) => {
              channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 60 * 1000,
                  errors: ["الزمن"],
                })
                .then((setNameMsg) => {
                  setNameMessage.delete();
                  setNameMsg = setNameMsg.first();
                  const goodName = setNameMsg.content;
                  if (goodName) {
                    setNameMsg.delete();
                    channel
                      .send({ content: "**الرجاء تحديد وصف للبضاعة**" })
                      .then((setDescriptionMeessage) => {
                        channel
                          .awaitMessages({
                            filter,
                            max: 1,
                            time: 60 * 1000,
                            errors: ["الزمن"],
                          })
                          .then((setDescriptionMsg) => {
                            setDescriptionMeessage.delete();
                            setDescriptionMsg = setDescriptionMsg.first();
                            const description = setDescriptionMsg.content;
                            if (description) {
                              channel
                                .send({ content: "**الرجاء إرسال السعر**" })
                                .then((setPriceMessage) => {
                                  channel
                                    .awaitMessages({
                                      filter,
                                      max: 1,
                                      time: 60 * 1000,
                                      errors: ["الزمن"],
                                    })
                                    .then((setPriceMsg) => {
                                      setPriceMessage.delete();
                                      setPriceMsg = setPriceMsg.first();
                                      const price = Number.parseInt(
                                        setPriceMsg.content
                                      );
                                      if (!price || isNaN(price) || price < 0) {
                                        channel.send({
                                          content:
                                            "**❌ | يرجى إدخال سعر صحيح**",
                                        });
                                        return;
                                      }
                                      const newGood = {
                                        goodName: goodName,
                                        description: description,
                                        price: price,
                                      };
                                      targetUserSellerShop.items =
                                        targetUserSellerShop &&
                                        Array.isArray(
                                          targetUserSellerShop.items
                                        ) &&
                                        targetUserSellerShop.items.length > 0
                                          ? (targetUserSellerShop.items = [
                                              ...targetUserSellerShop.items,
                                              newGood,
                                            ])
                                          : [newGood];
                                      db.set(
                                        `shop/${user.id}`,
                                        targetUserSellerShop
                                      );
                                      const newGoodEmbed = new MessageEmbed()
                                        .setTitle(goodName)
                                        .setColor(config.bot.color.hex)
                                        .setDescription(
                                          description + `\nالسعر: \`${price}\`🪙`
                                        )
                                        .setThumbnail(
                                          client.user.avatarURL({
                                            dynamic: true,
                                            size: 1024,
                                          })
                                        );
                                      channel.send({
                                        embeds: [newGoodEmbed],
                                      });
                                    });
                                });
                            } else
                              channel.send({
                                content: "**❌ | الرجاء إرسال وصف صحيح**",
                              });
                          });
                      });
                  } else
                    channel.send({
                      content: "**❌ | الرجاء إرسال إسم صحيح**",
                    });
                });
            });
        } else if (args[1] === "remove" || args[1] === "delete") {
          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setLabel("حذف جميع البضائع")
              .setCustomId("deleteAll")
              .setStyle("DANGER")
              .setEmoji("❌")
          );
          const shopEmbed = new MessageEmbed()
            .setColor(config.bot.color.hex)
            .setTimestamp()
            .setTitle(`🏧 متجر ${user.tag} المعتمد للعملة الرسمية :coin:`)
            .setThumbnail(user.avatarURL({ dynamic: true, size: 1024 }))
            .setFooter({
              text: `THX to: ${client.users.cache.get(config.owner).tag}`,
            });
          if (
            targetUserSellerShop &&
            Array.isArray(targetUserSellerShop.items) &&
            targetUserSellerShop.items.length > 0
          ) {
            targetUserSellerShop.items.forEach((item, index) => {
              row.addComponents(
                new MessageButton()
                  .setCustomId(`deleteItem ${item.goodName} ${index}`)
                  .setLabel(item.goodName)
                  .setStyle("DANGER")
                  .setEmoji("❌")
              );
              shopEmbed.addField(
                item.goodName,
                item.description + `\nالسعر: \`${item.price}\`🪙`,
                true
              );
            });
          } else shopEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
          channel
            .send({ embeds: [shopEmbed], components: [row] })
            .then((msg) => {
              msg.channel
                .awaitMessageComponent({
                  filter: btnFilter,
                  componentType: "BUTTON",
                  time: 60 * 1000,
                })
                .then((btnInteraction) => {
                  if (
                    btnInteraction.customId === "deleteAll" &&
                    btnInteraction.message &&
                    btnInteraction.message.deletable
                  ) {
                    db.set(`shop/${user.id}`, { items: [] });
                    btnInteraction
                      .reply({
                        content: "**✅ | تم حذف جميع المنتجات بنجاح**",
                      })
                      .then(() => btnInteraction.message.delete());
                  } else {
                    const goodName = btnInteraction.customId.split(" ")[1];
                    if (!goodName) return btnInteraction.message.delete();
                    targetUserSellerShop.items =
                      targetUserSellerShop.items.filter(
                        (item) => item.goodName !== goodName
                      );
                    db.set(`shop/${user.id}`, targetUserSellerShop);
                    btnInteraction
                      .reply({
                        content: "**✅ | تم حذف المنتج بنجاح**",
                      })
                      .then(() => btnInteraction.message.delete());
                  }
                })
                .catch(console.error);
            });
        } else if (!args[1]) {
          if (
            targetUserSellerShop &&
            Array.isArray(targetUserSellerShop.items) &&
            targetUserSellerShop.items.length > 0
          ) {
            targetUserSellerShop.items.forEach((item, index) => {
              shopItemsEmbed.addField(
                item.goodName,
                item.description + `\nالسعر: \`${item.price}\`🪙`,
                true
              );
            });
          } else shopItemsEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
          shopItemsEmbed.setThumbnail(
            user.avatarURL({ dynamic: true, size: 1024 })
          );
          channel.send({ embeds: [shopItemsEmbed] });
        } else channel.send({ embeds: [wrongembed] });
      } else if (args[0] === "server") {
        /**
         *
         * جميع الأوامر هنا محمية
         *
         * لا تحاول إكتشاف أخطاء أو الإحتيال على النظام
         *
         */
        if (!guild)
          channel.send({
            content: "**💢 | هذا الأمر يستخدم في المجتمعات فقط!**",
          });
        let serverSellerShop = (await db.get(`shop/${guild.id}`)) || {};
        if (args[1] === "add") {
          if (!guild.ownerId === user.id) {
            channel.send({
              content: "**💢 | لابد أن تكون مالك المجتمع**",
            });
            return;
          }
          channel
            .send({ content: "**الرجاء إرسال أسم البضاعة**" })
            .then((setNameMessage) => {
              channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 60 * 1000,
                  errors: ["الزمن"],
                })
                .then((setNameMsg) => {
                  setNameMessage.delete();
                  setNameMsg = setNameMsg.first();
                  const goodName = setNameMsg.content;
                  if (goodName) {
                    setNameMsg.delete();
                    channel
                      .send({ content: "**الرجاء تحديد وصف للبضاعة**" })
                      .then((setDescriptionMeessage) => {
                        channel
                          .awaitMessages({
                            filter,
                            max: 1,
                            time: 60 * 1000,
                            errors: ["الزمن"],
                          })
                          .then((setDescriptionMsg) => {
                            setDescriptionMeessage.delete();
                            setDescriptionMsg = setDescriptionMsg.first();
                            const description = setDescriptionMsg.content;
                            if (description) {
                              channel
                                .send({ content: "**الرجاء إرسال السعر**" })
                                .then((setPriceMessage) => {
                                  channel
                                    .awaitMessages({
                                      filter,
                                      max: 1,
                                      time: 60 * 1000,
                                      errors: ["الزمن"],
                                    })
                                    .then((setPriceMsg) => {
                                      setPriceMessage.delete();
                                      setPriceMsg = setPriceMsg.first();
                                      const price = Number.parseInt(
                                        setPriceMsg.content
                                      );
                                      if (!price || isNaN(price) || price < 0) {
                                        channel.send({
                                          content:
                                            "**❌ | يرجى إدخال سعر صحيح**",
                                        });
                                        return;
                                      }
                                      const newGood = {
                                        goodName: goodName,
                                        description: description,
                                        price: price,
                                      };
                                      serverSellerShop.items =
                                        serverSellerShop &&
                                        Array.isArray(serverSellerShop.items) &&
                                        serverSellerShop.items.length > 0
                                          ? (serverSellerShop.items = [
                                              ...serverSellerShop.items,
                                              newGood,
                                            ])
                                          : [newGood];
                                      db.set(
                                        `shop/${guild.id}`,
                                        serverSellerShop
                                      );
                                      const newGoodEmbed = new MessageEmbed()
                                        .setTitle(goodName)
                                        .setColor(config.bot.color.hex)
                                        .setDescription(
                                          description + `\nالسعر: \`${price}\`🪙`
                                        )
                                        .setThumbnail(
                                          client.user.avatarURL({
                                            dynamic: true,
                                            size: 1024,
                                          })
                                        );
                                      channel.send({
                                        embeds: [newGoodEmbed],
                                      });
                                    });
                                });
                            } else
                              channel.send({
                                content: "**❌ | الرجاء إرسال وصف صحيح**",
                              });
                          });
                      });
                  } else
                    channel.send({
                      content: "**❌ | الرجاء إرسال إسم صحيح**",
                    });
                });
            });
        } else if (args[1] === "remove" || args[1] === "delete") {
          if (!guild.ownerId === user.id) {
            channel.send({
              content: "**💢 | لابد أن تكون مالك المجتمع**",
            });
            return;
          }
          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setLabel("حذف جميع البضائع")
              .setCustomId("deleteAll")
              .setStyle("DANGER")
              .setEmoji("❌")
          );
          const shopEmbed = new MessageEmbed()
            .setColor(config.bot.color.hex)
            .setTimestamp()
            .setTitle("🏧 متجر المجتمع المعتمد للعملة الرسمية :coin:")
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 1024 }))
            .setFooter({
              text: `THX to: ${client.users.cache.get(config.owner).tag}`,
            });
          if (
            serverSellerShop &&
            Array.isArray(serverSellerShop.items) &&
            serverSellerShop.items.length > 0
          ) {
            serverSellerShop.items.forEach((item, index) => {
              row.addComponents(
                new MessageButton()
                  .setCustomId(`deleteItem ${item.goodName} ${index}`)
                  .setLabel(item.goodName)
                  .setStyle("DANGER")
                  .setEmoji("❌")
              );
              shopEmbed.addField(
                item.goodName,
                item.description + `\nالسعر: \`${item.price}\`🪙`,
                true
              );
            });
          } else shopEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
          channel
            .send({ embeds: [shopEmbed], components: [row] })
            .then((msg) => {
              msg.channel
                .awaitMessageComponent({
                  filter: btnFilter,
                  componentType: "BUTTON",
                  time: 60 * 1000,
                })
                .then((btnInteraction) => {
                  if (
                    btnInteraction.customId === "deleteAll" &&
                    btnInteraction.message &&
                    btnInteraction.message.deletable
                  ) {
                    db.set(`shop/${guild.id}`, { items: [] });
                    btnInteraction
                      .reply({
                        content: "**✅ | تم حذف جميع المنتجات بنجاح**",
                      })
                      .then(() => btnInteraction.message.delete());
                  } else {
                    const goodName = btnInteraction.customId.split(" ")[1];
                    if (!goodName) return btnInteraction.message.delete();
                    serverSellerShop.items = serverSellerShop.items.filter(
                      (item) => item.goodName !== goodName
                    );
                    db.set(`shop/${guild.id}`, serverSellerShop);
                    btnInteraction
                      .reply({
                        content: "**✅ | تم حذف المنتج بنجاح**",
                      })
                      .then(() => btnInteraction.message.delete());
                  }
                })
                .catch(console.error);
            });
        } else if (!args[1]) {
          if (
            serverSellerShop &&
            Array.isArray(serverSellerShop.items) &&
            serverSellerShop.items.length > 0
          ) {
            serverSellerShop.items.forEach((item, index) => {
              shopItemsEmbed.addField(
                item.goodName,
                item.description + `\nالسعر: \`${item.price}\`🪙`,
                true
              );
            });
          } else shopItemsEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
          shopItemsEmbed.setThumbnail(
            guild.iconURL({ dynamic: true, size: 1024 })
          );
          channel.send({ embeds: [shopItemsEmbed] });
        } else channel.send({ embeds: [wrongembed] });
      } else if (args[0] === "bot") {
        /**
         *
         * جميع الأوامر هنا محمية
         *
         * لا تحاول إكتشاف أخطاء أو الإحتيال على النظام
         *
         */
        if (!config.devs.includes(user.id)) {
          channel.send({ content: "**❌ | الأمر لمطويرن البوت فقط**" });
        } else if (args[1] === "add") {
          channel
            .send({ content: "**الرجاء إرسال أسم البضاعة**" })
            .then((setNameMessage) => {
              channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 60 * 1000,
                  errors: ["الزمن"],
                })
                .then((setNameMsg) => {
                  setNameMessage.delete();
                  setNameMsg = setNameMsg.first();
                  const goodName = setNameMsg.content;
                  if (goodName) {
                    setNameMsg.delete();
                    channel
                      .send({ content: "**الرجاء تحديد وصف للبضاعة**" })
                      .then((setDescriptionMeessage) => {
                        channel
                          .awaitMessages({
                            filter,
                            max: 1,
                            time: 60 * 1000,
                            errors: ["الزمن"],
                          })
                          .then((setDescriptionMsg) => {
                            setDescriptionMeessage.delete();
                            setDescriptionMsg = setDescriptionMsg.first();
                            const description = setDescriptionMsg.content;
                            if (description) {
                              channel
                                .send({ content: "**الرجاء إرسال السعر**" })
                                .then((setPriceMessage) => {
                                  channel
                                    .awaitMessages({
                                      filter,
                                      max: 1,
                                      time: 60 * 1000,
                                      errors: ["الزمن"],
                                    })
                                    .then((setPriceMsg) => {
                                      setPriceMessage.delete();
                                      setPriceMsg = setPriceMsg.first();
                                      const price = Number.parseInt(
                                        setPriceMsg.content
                                      );
                                      if (!price || isNaN(price) || price < 0) {
                                        channel.send({
                                          content:
                                            "**❌ | يرجى إدخال سعر صحيح**",
                                        });
                                        return;
                                      }
                                      const newGood = {
                                        goodName: goodName,
                                        description: description,
                                        price: price,
                                      };
                                      botSellerShop.items =
                                        botSellerShop &&
                                        Array.isArray(botSellerShop.items) &&
                                        botSellerShop.items.length > 0
                                          ? (botSellerShop.items = [
                                              ...botSellerShop.items,
                                              newGood,
                                            ])
                                          : [newGood];
                                      db.set("shop/bot", botSellerShop);
                                      const newGoodEmbed = new MessageEmbed()
                                        .setTitle(goodName)
                                        .setColor(config.bot.color.hex)
                                        .setDescription(
                                          description + `\nالسعر: \`${price}\`🪙`
                                        )
                                        .setThumbnail(
                                          client.user.avatarURL({
                                            dynamic: true,
                                            size: 1024,
                                          })
                                        );

                                      channel.send({
                                        embeds: [newGoodEmbed],
                                      });
                                    });
                                });
                            } else
                              channel.send({
                                content: "**❌ | الرجاء إرسال وصف صحيح**",
                              });
                          });
                      });
                  } else
                    channel.send({
                      content: "**❌ | الرجاء إرسال إسم صحيح**",
                    });
                });
            });
        } else if (args[1] === "remove" || args[1] === "delete") {
          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setLabel("حذف جميع البضائع")
              .setCustomId("deleteAll")
              .setStyle("DANGER")
              .setEmoji("❌")
          );
          const shopEmbed = new MessageEmbed()
            .setColor(config.bot.color.hex)
            .setTimestamp()
            .setTitle("🏧 متجر البوت المعتمد للعملة الرسمية :coin:")
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 1024 }))
            .setFooter({
              text: `THX to: ${client.users.cache.get(config.owner).tag}`,
            });
          if (
            botSellerShop &&
            Array.isArray(botSellerShop.items) &&
            botSellerShop.items.length > 0
          ) {
            botSellerShop.items.forEach((item, index) => {
              row.addComponents(
                new MessageButton()
                  .setCustomId(`deleteItem ${item.goodName} ${index}`)
                  .setLabel(`${item.goodName}`)
                  .setStyle("DANGER")
                  .setEmoji("❌")
              );
              shopEmbed.addField(
                item.goodName,
                item.description + `\nالسعر: \`${item.price}\`🪙`,
                true
              );
            });
          } else shopEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
          channel
            .send({ embeds: [shopEmbed], components: [row] })
            .then((msg) => {
              msg.channel
                .awaitMessageComponent({
                  filter: btnFilter,
                  componentType: "BUTTON",
                  time: 60 * 1000,
                })
                .then((btnInteraction) => {
                  if (
                    btnInteraction.customId === "deleteAll" &&
                    btnInteraction.message &&
                    btnInteraction.message.deletable
                  ) {
                    db.set("shop/bot", { items: [] });
                    btnInteraction
                      .reply({
                        content: "**✅ | تم حذف جميع المنتجات بنجاح**",
                      })
                      .then(() => btnInteraction.message.delete());
                  } else {
                    const goodName = btnInteraction.customId.split(" ")[1];
                    if (!goodName) return btnInteraction.message.delete();
                    botSellerShop.items = botSellerShop.items.filter(
                      (item) => item.goodName !== goodName
                    );
                    db.set("shop/bot", botSellerShop);
                    btnInteraction
                      .reply({
                        content: "**✅ | تم حذف المنتج بنجاح**",
                      })
                      .then(() => btnInteraction.message.delete());
                  }
                })
                .catch(console.error);
            });
        } else channel.send({ embeds: [wrongembed] });
      } else channel.send({ embeds: [wrongembed] });
    } else {
      /**
       *
       * جميع الأوامر هنا محمية
       *
       * لا تحاول إكتشاف أخطاء أو الإحتيال على النظام
       *
       */
      const shopEmbed = new MessageEmbed()
        .setColor(config.bot.color.hex)
        .setTimestamp()
        .setTitle("🏧 متجر البوت المعتمد للعملة الرسمية :coin:")
        .setDescription(
          "**البضاعة المتاحة حاليا لا يمكن إستردادها\nEXA-Studio™: https://discord.gg/aEkKZQfZuk\nEXA-4-EVER: https://discord.gg/ZPpwb3GRyG\nEXA-TUBE™: https://discord.gg/e4ewVXcKCs\nEXA-Support: https://discord.gg/n9AQZ6qjNc**"
        )
        .setThumbnail(client.user.avatarURL({ dynamic: true, size: 1024 }))
        .setFooter({
          text: `THX to: ${client.users.cache.get(config.owner).tag}`,
        });
      if (
        botSellerShop &&
        Array.isArray(botSellerShop.items) &&
        botSellerShop.items.length > 0
      ) {
        botSellerShop.items.forEach((item, index) => {
          shopEmbed.addField(
            item.goodName,
            item.description + `\nالسعر: \`${item.price}\`🪙`,
            true
          );
        });
      } else shopEmbed.addField("البضاعة:", "لا توجد بضاعة", true);
      channel.send({ embeds: [shopEmbed] });
    }
  },
};
