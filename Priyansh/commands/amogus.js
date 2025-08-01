const fs = require("fs");
module.exports.config = {
	name: "سوس",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "sus",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("امونغس")==0 || event.body.indexOf("امونغ اس")==0 || event.body.indexOf("سوس")==0 || event.body.indexOf("امونغ")==0) {
		var msg = {
				body: "ඞ",
				attachment: fs.createReadStream(__dirname + `/noprefix/sus.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😱", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }