module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "إشعار بدخول البوت أو الأشخاص إلى المجموعات مع صورة/فيديو/صورة متحركة عشوائية",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinvideo");
    if (existsSync(path)) mkdirSync(path, { recursive: true }); 

    const path2 = join(__dirname, "cache", "joinvideo", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const fs = require("fs");
        return api.sendMessage("", event.threadID, () => api.sendMessage({
            body: `🤖✨ تم ربط البوت بنجاح!

مرحبًا بالجميع، اسمي ✦𝘽𝙤𝙩✦ ويسعدني التواجد معكم 💞🎉

📌 البادئة الخاصة بي هي: ${global.config.PREFIX}

⌨️ لعرض قائمة الأوامر، اكتب:
${global.config.PREFIX}مساعدة

📸 مثال:
${global.config.PREFIX}شعر 💜 (نص)
${global.config.PREFIX}صورة 🌬️🌳🌊

📚 للمزيد من الأوامر:
${global.config.PREFIX}مساعدة2

ℹ️ لمعلومات الأدمن:
${global.config.PREFIX}معلومات

👑 المالك: محمد العكاري - حمود
📎 فيسبوك: www.facebook.com/ukidn
📨 تليجرام: @it0c_4

✨ لا تتردد في التواصل لأي مساعدة 💙

✮☸✮
🎀━ مرحبًا بالجميع ــ🎀
✮☸✮
            `,
            attachment: fs.createReadStream(__dirname + "/cache/botjoin.mp4")
        }, threadID));
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);

            var mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            (typeof threadData.customJoin == "undefined") ?
            msg = "مرحبًا {name}!\n─────────────────\nأنت العضو رقم {soThanhVien} في مجموعة {threadName}\n─────────────────\nنتمنى لك إقامة ممتعة وصداقة دائمة! 😊\n─────────────────\n👑 المالك: Priyansh Rajput — نحن نثق بك 💖" :
            msg = threadData.customJoin;

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'أصدقاء' : 'صديق')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

            if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathvideo), mentions }
            else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
            } else {
                formPush = { body: msg, mentions }
            }

            return api.sendMessage(formPush, threadID);
        } catch (e) { return console.log(e); }
    }
}