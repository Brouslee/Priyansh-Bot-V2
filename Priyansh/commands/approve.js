module.exports.config = {
    name: "approve",
    version: "1.0.2",
    hasPermssion: 2,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "اعتماد المجموعة باستخدام البوت",
    commandCategory: "Admin",
    cooldowns: 5
};

const dataPath = __dirname + "/Priyanshu/approvedThreads.json";
const dataPending = __dirname + "/Priyanshu/pendingdThreads.json";
const fs = require("fs");

module.exports.onLoad = () => {
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
    if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
}

module.exports.handleReply = async function ({ event, api, Currencies, handleReply, Users, args }) {
    if (handleReply.author != event.senderID) return;
    const { body, threadID, messageID, senderID } = event;
    const { type } = handleReply;
    let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let idBox = (args[0]) ? args[0] : threadID;

    switch (type) {
        case "pending": {
            switch (body) {
                case `A`: {
                    data.push(idBox);
                    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                    api.sendMessage(`» تم اعتماد المجموعة بنجاح:\n${idBox}`, threadID, () => {
                        dataP.splice(dataP.indexOf(idBox), 1);
                        fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
                    }, messageID);
                }
            }
        }
    }
}

module.exports.run = async ({ event, api, args, Threads, handleReply, Users }) => {
    const { threadID, messageID, senderID } = event;
    let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let msg = "";
    var lydo = args.splice(2).join(" ");
    let idBox = (args[0]) ? args[0] : threadID;

    if (args[0] == "list" || args[0] == "l") {
        msg = `=====「 عدد المجموعات المعتمدة: ${data.length} 」====`;
        let count = 0;
        for (e of data) {
            let threadInfo = await api.getThreadInfo(e);
            let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
            msg += `\n〘${count += 1}〙» ${threadName}\n${e}`;
        }
        api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "a",
            });
        }, messageID);
    } else if (args[0] == "pending" || args[0] == "p") {
        msg = `=====「 عدد المجموعات المعلقة للموافقة: ${dataP.length} 」====`;
        let count = 0;
        for (e of dataP) {
            let threadInfo = await api.getThreadInfo(e);
            let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
            msg += `\n〘${count += 1}〙» ${threadName}\n${e}`;
        }
        api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "pending",
            });
        }, messageID);
    } else if (args[0] == "help" || args[0] == "h") {
        const tst = (await Threads.getData(String(event.threadID))).data || {};
        const pb = (tst.hasOwnProperty("PREFIX")) ? tst.PREFIX : global.config.PREFIX;
        const nmdl = this.config.name;
        const cre = this.config.credits;
        return api.sendMessage(`=====「 الموافقة 」=====\n\n${pb}${nmdl} l/list => عرض قائمة المجموعات المعتمدة\n\n${pb}${nmdl} p/pending => عرض قائمة المجموعات المعلقة\n\n${pb}${nmdl} d/del => حذف مجموعة بواسطة المعرف من قائمة المجموعات المعتمدة\n\n${pb}${nmdl} => ارفق معرف لمراجعة المجموعة\n\n⇒ ${cre} ⇐`, threadID, messageID);
    } else if (args[0] == "del" || args[0] == "d") {
        idBox = (args[1]) ? args[1] : event.threadID;
        if (isNaN(parseInt(idBox))) return api.sendMessage("[ خطأ ] الرقم المدخل غير صالح", threadID, messageID);
        if (!data.includes(idBox)) return api.sendMessage("[ خطأ ] هذه المجموعة غير معتمدة مسبقًا!", threadID, messageID);
        api.sendMessage(`[ تم ] تم حذف مجموعتك من قائمة المجموعات المسموح بها من قبل المدير للسبب: ${lydo}`, idBox);
        api.sendMessage("[ تم ] تم حذف المجموعة من قائمة المجموعات المسموح بها للبوت", threadID, () => {
            data.splice(data.indexOf(idBox), 1);
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        }, messageID);
    } else if (isNaN(parseInt(idBox))) {
        api.sendMessage("[ خطأ ] المعرف الذي أدخلته غير صالح", threadID, messageID);
    } else if (data.includes(idBox)) {
        api.sendMessage(`[ - ] المعرف ${idBox} معتمد مسبقًا!`, threadID, messageID);
    } else {
        api.sendMessage(`[ تم ] ✨تمت الموافقة على مجموعتك 🙌.\n 🖤 استمتع بوقتك هنا 🖤\n\n💝🥀 المالك: ☞HMOD☜ 💫\n🖤 يمكنك مناداتي بـ 〠ميكو🖤\n😳 حسابه على فيسبوك 🤓: ☞ www.facebook.com/profile.php?id=ukidn\n👋 لأي مساعدة، تواصل على تلغرام: @it0c_4 😇`, idBox, (error, info) => {
            api.changeNickname(` 〖 ${global.config.PREFIX} 〗 ➺ ${(!global.config.BOTNAME) ? "" : global.config.BOTNAME}`, idBox, global.data.botID);
            const axios = require('axios');
            const request = require('request');
            const fs = require("fs");
            let admID = "100087632392287";

            api.getUserInfo(parseInt(admID), (err, data) => {
                if (err) { return console.log(err) }
                var obj = Object.keys(data);
                var firstname = data[obj].name.replace("@", "");

                axios.get('https://anime.apibypriyansh.repl.co/img/anime').then(res => {
                    let ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
                    let callback = function () {
                        api.sendMessage({
                            body: `❒❒ تم تشغيل البوت بنجاح ❒❒\n=====================\n┏━━━━ 🖤 ━━━━┓\n  ✦❥⋆⃝𝓅𝓇𝒾𝓎𝒶𝓃𝓈𝒽 ✦ \n┗━━━    🖤 ━━━━┛\n=====================\n➪ اسم البوت: ${global.config.BOTNAME}\n➪ بادئة الأوامر: ${global.config.PREFIX}\n➪ عدد المستخدمين: ${global.data.allUserID.length}\n➪ عدد المجموعات: ${global.data.allThreadID.length}\n=====================\n[]---------------------------------------[]\nاستخدم الأمر '${global.config.PREFIX}Help' لعرض قائمة الأوامر المتاحة! (ღ˘⌣˘ღ)\n[]---------------------------------------[]\n⌨ من صنع: ${firstname}\n`,
                            mentions: [{
                                tag: firstname,
                                id: admID,
                                fromIndex: 0,
                            }],
                            attachment: fs.createReadStream(__dirname + `/cache/duyet.${ext}`)
                        }, idBox, () => fs.unlinkSync(__dirname + `/cache/duyet.${ext}`));
                    };
                    request(res.data.url).pipe(fs.createWriteStream(__dirname + `/cache/duyet.${ext}`)).on("close", callback);
                });
            });
            if (error) return api.sendMessage("[ خطأ ] حدث خطأ ما، تأكد من أن المعرف صحيح وأن البوت داخل المجموعة!", threadID, messageID);
            else {
                data.push(idBox);
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                api.sendMessage(` [ تم ] تم اعتماد المجموعة بنجاح (◕‿◕):\n${idBox}`, threadID, () => {
                    dataP.splice(dataP.indexOf(idBox), 1);
                    fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
                }, messageID);
            }
        });
    }
}