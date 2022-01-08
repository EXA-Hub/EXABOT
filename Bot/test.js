const builder = require("@discordjs/builders");
const data = new builder.SlashCommandBuilder()
  .setName("ds")
  .setDescription("fd")
  .addSubcommand((sub) =>
    sub
      .setName("s")
      .setDescription("ds")
      .addChannelOption((c) =>
        c.setRequired(true).setDescription("d").setName("ds")
      )
  );
console.log(JSON.stringify(data, 2, 2));
data = {
  type: 1,
  name: "الغرفة",
  description: "تحديد_غرفة_الموسيقى",
  options: [
    {
      type: 7,
      name: "إختار الغرفة",
      description: "سيتم تحديد الغرفة تلقائيا",
      required: true,
    },
  ],
};
