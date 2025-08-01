module.exports.config = {
  name: "بايو",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Change bot's bio",
  commandCategory: "admin",
  usages: "bio [text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const newBio = args.join(" ");
  api.changeBio(newBio, (error) => {
    if (error) {
      return api.sendMessage("An error occurred: " + error, event.threadID, event.messageID);
    }
    api.sendMessage(`تم تغيير البايو إلى:\n${newBio}`, event.threadID, event.messageID);
  });
};