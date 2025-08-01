const fs = require("fs");
module.exports.config = {
  name: "شاي",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "شاي",
  commandCategory: "بدون بادئة",
  usages: "tea",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (
    event.body.indexOf("اشرب") == 0 ||
    event.body.indexOf("شاي") == 0 ||
    event.body.indexOf("قهوة") == 0 ||
  ) {
    var msg = {
      body: "تفضل حبيبي ☕",
      attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`),
    };
    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🫖", event.messageID, (err) => {}, true);
  }
};

module.exports.run = function ({ api, event, client, __GLOBAL }) {};