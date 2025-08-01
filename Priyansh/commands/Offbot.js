module.exports.config = {
	name: "ارقد",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
        };
module.exports.run = ({event, api}) =>{
    const permission = ["100087632392287", "100087632392287"];
  	if (!permission.includes(event.senderID)) return api.sendMessage("[ خطأ ] حمود بس اللي يحق له تنويمي يفاشل 😆", event.threadID, event.messageID);
  api.sendMessage(`[ تم ] ${global.config.BOTNAME} تم الانطفاء بنجاح وباي يا فشله`,event.threadID, () =>process.exit(0))
}