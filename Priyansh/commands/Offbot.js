module.exports.config = {
	name: "offbot",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "إيقاف تشغيل البوت",
	commandCategory: "النظام",
	cooldowns: 0
};

module.exports.run = ({ event, api }) => {
	const صلاحيات = ["100037743553265", "100037743553265"];
	if (!صلاحيات.includes(event.senderID))
		return api.sendMessage(
			"[ خطأ ] ليس لديك صلاحية لاستخدام هذا الأمر، هذا الأمر فقط لـ Priyansh",
			event.threadID,
			event.messageID
		);
	api.sendMessage(
		`[ تم ] تم إيقاف تشغيل بوت ${global.config.BOTNAME} الآن.`,
		event.threadID,
		() => process.exit(0)
	);
};