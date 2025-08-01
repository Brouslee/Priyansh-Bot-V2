module.exports.config = {
    name: "fixspam-ch",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "uibot",
    description: "منع الشتائم للبوت تلقائيًا من خلال النظام",
    commandCategory: "noprefix",
    usages: "",
    cooldowns: 0,
    denpendencies: {}
};

module.exports.handleEvent = async ({ event, api, Users }) => {
    var { threadID, messageID, body, senderID } = event;

    const currentTime = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss L");

    if (senderID == api.getCurrentUserID()) return;

    let userName = await Users.getNameUser(senderID);

    const warningMessage = {
        body: `» إشعار من المطور 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 «\n\n${userName}، أنت غبي لأنك شتمت البوت، لذا تم حظرك تلقائيًا من النظام.`
    };

    const offensiveWords = [
        "بوت فاشل", "بوت ضعيف", "chutiya bot", "بوت سيء", "bot teri maa ki chut", "jhatu bot", "rhaine bobo",
        "stupid bots", "chicken bot", "bot lund", "priyansh mc", "mc priyansh", "bsdk priyansh",
        "fuck bots", "priyansh chutiya", "priyansh gandu", "bobo ginoong choru bot", "priyansh bc",
        "crazy bots", "bc priyansh", "nikal bsdk bot", "bot khùng", "đĩ bot", "bot paylac rồi",
        "con bot lòn", "cmm bot", "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó", "cc bot",
        "bot tiki", "lozz bottt", "lol bot", "loz bot", "lồn bot", "bot lồn", "bot lon", "bot cac",
        "bot nhu lon", "bot như cc", "bot như bìu", "bot sida", "bot fake", "bảo ngu", "bot shoppee",
        "bad bots", "bot cau"
    ];

    offensiveWords.forEach(async word => {
        let capitalized = word[0].toUpperCase() + word.slice(1);
        if (body === word || body === word.toUpperCase() || body === capitalized) {
            console.log(`${userName} شتم البوت بالكلمة: ${word}`);
            const userData = (await Users.getData(senderID)).data || {};
            userData.banned = 1;
            userData.reason = word;
            userData.dateAdded = currentTime;

            await Users.setData(senderID, { data: userData });
            global.data.userBanned.set(senderID, {
                reason: word,
                dateAdded: currentTime
            });

            api.sendMessage(warningMessage, threadID, () => {
                const adminList = global.config.ADMINBOT;
                for (const adminID of adminList) {
                    api.sendMessage(
                        `=== إشعار البوت ===\n\n🚫 المستخدم المخالف: ${userName}\n🔰 UID: ${senderID}\n😡 قام بكتابة: "${word}"\n\n🚷 تم حظره من النظام.`,
                        adminID
                    );
                }
            });
        }
    });
};

module.exports.run = async ({ event, api }) => {
    api.sendMessage(
        "( \\_/)                                                                            ( •_•)                                                                            // >🧠                                                            أعطني عقلك وضعه في رأسك.\nهل تعلم أن هذا أمر بدون بادئة؟",
        event.threadID
    );
};