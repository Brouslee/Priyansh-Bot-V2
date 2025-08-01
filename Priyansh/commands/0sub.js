const fs = require("fs");
module.exports.config = {
    name: "sub",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
    description: "هاي هاي هاي",
    commandCategory: "بدون بادئة",
    usages: "sub",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
    var { threadID, messageID } = event;
    if (
        event.body.indexOf("Priyansh rajput") == 0 ||
        event.body.indexOf("sub") == 0 ||
        event.body.indexOf("subscribe") == 0 ||
        event.body.indexOf("Priyansh") == 0
    ) {
        var msg = {
            body: "👋 لأي نوع من المساعدة، تواصل معنا على تيليغرام:\nاسم المستخدم 👉 @it0c_4 😇",
            attachment: fs.createReadStream(__dirname + `/noprefix/sub.mp3`)
        };
        api.sendMessage(msg, threadID, messageID);
        api.setMessageReaction("🔔", event.messageID, (err) => {}, true);
    }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {};