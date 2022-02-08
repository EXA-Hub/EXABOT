const backend =
  process.env.REACT_APP_VERCEL_GIT_REPO_OWNER === "EXA-Hub"
    ? "https://api.exabot.ml"
    : "http://localhost:2323";
module.exports = {
  backend,
  login: `${backend}/api/auth/discord`,
  logout: `${backend}/api/auth/logout`,
  add: `${backend}/api/auth/add`,
  user: `${backend}/api/auth`,
  guild: `${backend}/api/guilds`,
  buttons: [
    {
      title: "إرسال رسالة",
      text: "يقوم بإرسال رسالة للغرفة",
      button: "أرسل",
      image: "https://th.bing.com/th/id/OIP.1HOjiBzIYbSQfPZzhT1PcwHaCl",
      function: (params) => {
        if (!params) return;
      },
    },
  ],
  servers: [
    {
      title: "EXA-4-EVER",
      text: "الخادم الخاص بقنواتنا على منصات التواصل الإجتماعي",
      button: "إنضم الآن",
      image:
        "https://cdn.discordapp.com/attachments/794744822610788352/925491922586435584/8a24a0fa33c54d18.png?size=1024",
      invite: "https://discord.gg/ZPpwb3GRyG",
    },
    {
      title: "EXA-Support",
      text: "الخادم الخاص بالدعم السريع",
      button: "إنضم الآن",
      image:
        "https://cdn.discordapp.com/attachments/794744822610788352/925429847147298836/20191115_213644.png?size=1024",
      invite: "https://discord.gg/n9AQZ6qjNc",
    },
    {
      title: "EXA-TUBE",
      text: "الخادم الخاص بمنصات التواصل الإجتماعي",
      button: "إنضم الآن",
      image:
        "https://cdn.discordapp.com/attachments/794744822610788352/925429847726104607/15172ac809befacf.png?size=1024",
      invite: "https://discord.gg/e4ewVXcKCs",
    },
    {
      title: "EXA-Studio™",
      text: "الخادم الخاص بالبرمجيات المختلفة",
      button: "إنضم الآن",
      image:
        "https://cdn.discordapp.com/attachments/794744822610788352/925429847487045672/studio.png?size=1024",
      invite: "https://discord.gg/aEkKZQfZuk",
    },
  ],
};
