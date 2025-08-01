module.exports.config = {
    name: "انفو",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "📦 معلومات حول المستخدم أو المجموعة",
    commandCategory: "🎬 الوسائط",
    usages: "",
    cooldowns: 4,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (args.length == 0)
        return api.sendMessage(`🧾 يمكنك استخدام الأوامر التالية:\n\n${prefix}${this.config.name} user => معلوماتك الشخصية 🧍\n${prefix}${this.config.name} user @[وسم] => معلومات شخص تم وسمه 👥\n${prefix}${this.config.name} box => معلومات المجموعة الحالية 💬\n${prefix}${this.config.name} user box [uid || tid] => معلومات مستخدم أو مجموعة عن طريق المعرف 🧾\n${prefix}${this.config.name} admin => معلومات مسؤول البوت 👑`, event.threadID, event.messageID);

    if (args[0] == "box") {
        let threadInfo = args[1] ? await api.getThreadInfo(args[1]) : await api.getThreadInfo(event.threadID);
        let img = threadInfo.imageSrc;
        let genderMale = [], genderFemale = [];

        for (let user of threadInfo.userInfo) {
            if (user.gender == "MALE") genderMale.push(user.gender);
            else genderFemale.push(user.gender);
        }

        let males = genderMale.length;
        let females = genderFemale.length;
        let approval = threadInfo.approvalMode ? "✅ مفعّل" : "❌ غير مفعّل";

        const infoMessage = `📘 اسم المجموعة: ${threadInfo.threadName}
🆔 المعرف (TID): ${args[1] || event.threadID}
🔒 الموافقة على الأعضاء: ${approval}
😊 الإيموجي: ${threadInfo.emoji}
👥 عدد الأعضاء: ${threadInfo.participantIDs.length} عضوًا
🛡️ عدد المشرفين: ${threadInfo.adminIDs.length}
🧑‍🤝‍🧑 الذكور: ${males} | 👩 الإناث: ${females}
💬 عدد الرسائل: ${threadInfo.messageCount}`;

        if (!img) {
            return api.sendMessage(infoMessage, event.threadID, event.messageID);
        } else {
            let callback = () => api.sendMessage({ body: infoMessage, attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
            return request(encodeURI(img)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        }
    }

    if (args[0] == "admin") {
        let callback = () => api.sendMessage({
            body: `👑 معلومات مسؤول البوت:\n\n📛 الاسم: 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭\n🌐 فيسبوك: https://m.facebook.com/priyanshu.rajput.official\n🙏 شكرًا لاستخدامك بوت ${global.config.BOTNAME}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));

        return request(`https://graph.facebook.com/100012191281263/picture?height=720&width=720&access_token=YOUR_ACCESS_TOKEN`)
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }

    if (args[0] == "user") {
        let id;

        if (!args[1]) {
            id = event.type == "message_reply" ? event.messageReply.senderID : event.senderID;
        } else if (args.join().includes('@')) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1];
        }

        let data = await api.getUserInfo(id);
        let url = data[id].profileUrl;
        let b = data[id].isFriend ? "✅ نعم" : "❌ لا";
        let sn = data[id].vanity;
        let name = data[id].name;
        let gender = data[id].gender == 2 ? "ذكر" : data[id].gender == 1 ? "أنثى" : "غير محدد";

        let callback = () => api.sendMessage({
            body: `📛 الاسم: ${name}
🔗 الرابط: ${url}
💬 اسم المستخدم: ${sn}
🆔 المعرف (UID): ${id}
👤 النوع: ${gender}
🤝 صديق للبوت: ${b}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

        return request(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=YOUR_ACCESS_TOKEN`)
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }
};