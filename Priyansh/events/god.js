module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
	version: "1.0.0",
	credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
	description: "تسجيل إشعارات أنشطة البوت!",
	envConfig: {
		enable: true
	}
};

module.exports.run = async function({ api, event, Threads }) {
	const logger = require("../../utils/log");
	if (!global.configModule[this.config.name].enable) return;

	let formReport =  "=== إشعار بوت ===" +
					  "\n\n» معرف المجموعة: " + event.threadID +
					  "\n» الحدث: {task}" +
					  "\n» تم بواسطة معرف المستخدم: " + event.author +
					  "\n» التوقيت: " + Date.now() + " «",
		task = "";

	switch (event.logMessageType) {
		case "log:thread-name": {
			const oldName = (await Threads.getData(event.threadID)).name || "لا يوجد اسم سابق",
				  newName = event.logMessageData.name || "لا يوجد اسم جديد";
			task = "قام المستخدم بتغيير اسم المجموعة من: '" + oldName + "' إلى '" + newName + "'";
			await Threads.setData(event.threadID, { name: newName });
			break;
		}
		case "log:subscribe": {
			if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID()))
				task = "قام المستخدم بإضافة البوت إلى مجموعة جديدة!";
			break;
		}
		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
				task = "قام المستخدم بطرد البوت من المجموعة!";
			break;
		}
		default:
			break;
	}

	if (task.length == 0) return;

	formReport = formReport.replace(/\{task}/g, task);
	const god = "100037743553265";

	return api.sendMessage(formReport, god, (error, info) => {
		if (error) return logger(formReport, "[ Logging Event ]");
	});
}