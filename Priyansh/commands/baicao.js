module.exports.config = {
    name: "لعبة_الثلاث_أوراق",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "لعبة المراهنة على أوراق اللعب مخصصة للمجموعات التي تراهن",
    commandCategory: "ألعاب-متعددة-لاعبين",
    usages: "[ابدأ/انضم/معلومات/انسحب]",
    cooldowns: 1
};

module.exports.handleEvent = async ({ event, api, Users }) => {
    const { senderID, threadID, body, messageID } = event;

    if (typeof body == "undefined") return;
    if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
    if (!global.moduleData.baicao.has(threadID)) return;
    var values = global.moduleData.baicao.get(threadID);
    if (values.start != 1) return;

    if (body.indexOf("توزيع الأوراق") == 0) {
        if (values.chiabai == 1) return;
        for (const key in values.player) {
            const card1 = Math.floor(Math.random() * 9) + 1;
            const card2 = Math.floor(Math.random() * 9) + 1;
            const card3 = Math.floor(Math.random() * 9) + 1;
            var total = (card1 + card2 + card3);
            if (total >= 20) total -= 20;
            if (total >= 10) total -= 10;
            values.player[key].card1 = card1;
            values.player[key].card2 = card2;
            values.player[key].card3 = card3;
            values.player[key].tong = total;
            api.sendMessage(`أوراقك: ${card1} | ${card2} | ${card3} \n\nالمجموع الكلي: ${total}`, values.player[key].id, (error) => {
                if (error) api.sendMessage(`تعذر إرسال الرسالة إلى المستخدم: ${values.player[key].id}`, threadID);
            });
        }
        values.chiabai = 1;
        global.moduleData.baicao.set(threadID, values);
        return api.sendMessage("تم توزيع الأوراق بنجاح! الرجاء التحقق من رسائلكم.", threadID);
    }

    if (body.indexOf("تبديل الورقة") == 0) {
        if (values.chiabai != 1) return;
        var player = values.player.find(item => item.id == senderID);
        if (player.doibai == 0) return api.sendMessage("لقد استخدمت كامل فرص تبديل الأوراق.", threadID, messageID);
        if (player.ready == true) return api.sendMessage("أنت جاهز، لا يمكنك تبديل الأوراق الآن!", threadID, messageID);
        const cards = ["card1", "card2", "card3"];
        player[cards[Math.floor(Math.random() * cards.length)]] = Math.floor(Math.random() * 9) + 1;
        player.tong = player.card1 + player.card2 + player.card3;
        if (player.tong >= 20) player.tong -= 20;
        if (player.tong >= 10) player.tong -= 10;
        player.doibai -= 1;
        global.moduleData.baicao.set(threadID, values);
        return api.sendMessage(`تم تبديل أوراقك: ${player.card1} | ${player.card2} | ${player.card3} \n\nالمجموع الكلي: ${player.tong}`, player.id, (error) => {
            if (error) api.sendMessage(`تعذر تبديل الأوراق للمستخدم: ${player.id}`, threadID);
        });
    }

    if (body.indexOf("جاهز") == 0) {
        if (values.chiabai != 1) return;
        var player = values.player.find(item => item.id == senderID);
        if (player.ready == true) return;
        const name = await Users.getNameUser(player.id);
        values.ready += 1;
        player.ready = true;
        if (values.player.length == values.ready) {
            const playerList = values.player;
            playerList.sort(function (a, b) { return b.tong - a.tong });

            var ranking = [], num = 1;

            for (const info of playerList) {
                const name = await Users.getNameUser(info.id);
                ranking.push(`${num++} • ${name} مع الأوراق ${info.card1} | ${info.card2} | ${info.card3} => مجموع ${info.tong} نقاط\n`);
            }

            global.moduleData.baicao.delete(threadID);
            return api.sendMessage(`النتيجة النهائية:\n\n${ranking.join("\n")}`, threadID);
        }
        else return api.sendMessage(`اللاعب: ${name} جاهز، لا زال ينتظر ${values.player.length - values.ready} لاعبين آخرين`, threadID);
    }

    if (body.indexOf("غير جاهز") == 0) {
        const notReady = values.player.filter(item => item.ready == false);
        var msg = [];

        for (const info of notReady) {
            const name = global.data.userName.get(info.id) || await Users.getNameUser(info.id);
            msg.push(name);
        }
        if (msg.length != 0) return api.sendMessage("اللاعبون غير الجاهزين: " + msg.join(", "), threadID);
        else return;
    }
};

module.exports.run = async ({ api, event, args }) => {
    var { senderID, threadID, messageID } = event;

    threadID = String(threadID);
    senderID = String(senderID);

    if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
    var values = global.moduleData.baicao.get(threadID) || {};

    switch (args[0]) {
        case "ابدأ":
        case "-ا": {
            if (global.moduleData.baicao.has(threadID)) return api.sendMessage("يوجد طاولة نشطة حالياً في هذه المجموعة.", threadID, messageID);
            global.moduleData.baicao.set(threadID, {
                "author": senderID,
                "start": 0,
                "chiabai": 0,
                "ready": 0,
                player: [{
                    "id": senderID,
                    "card1": 0,
                    "card2": 0,
                    "card3": 0,
                    "doibai": 2,
                    "ready": false
                }]
            });
            return api.sendMessage("تم إنشاء طاولة اللعب بنجاح! للانضمام، استخدم أمر الانضمام.", threadID, messageID);
        }

        case "انضم":
        case "-ن": {
            if (!values) return api.sendMessage("لا توجد طاولة لعبة حالياً، يمكنك إنشاؤها باستخدام الأمر 'ابدأ'.", threadID, messageID);
            if (values.start == 1) return api.sendMessage("تم بدء الطاولة بالفعل.", threadID, messageID);
            if (values.player.find(item => item.id == senderID)) return api.sendMessage("لقد انضممت بالفعل إلى هذه الطاولة!", threadID, messageID);
            values.player.push({
                "id": senderID,
                "card1": 0,
                "card2": 0,
                "card3": 0,
                "tong": 0,
                "doibai": 2,
                "ready": false
            });
            global.moduleData.baicao.set(threadID, values);
            return api.sendMessage("تم الانضمام إلى الطاولة بنجاح!", threadID, messageID);
        }

        case "انسحب":
        case "-خ": {
            if (typeof values.player == "undefined") return api.sendMessage("لا توجد طاولة لعبة حالياً، يمكنك إنشاؤها باستخدام الأمر 'ابدأ'.", threadID, messageID);
            if (!values.player.some(item => item.id == senderID)) return api.sendMessage("لم تنضم بعد إلى الطاولة!", threadID, messageID);
            if (values.start == 1) return api.sendMessage("الطاولة بدأت بالفعل، لا يمكنك الانسحاب الآن.", threadID, messageID);
            if (values.author == senderID) {
                global.moduleData.baicao.delete(threadID);
                api.sendMessage("مالك الطاولة انسحب، تم إغلاق الطاولة!", threadID, messageID);
            } else {
                values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
                api.sendMessage("تم الانسحاب من الطاولة بنجاح!", threadID, messageID);
                global.moduleData.baicao.set(threadID, values);
            }
            return;
        }

        case "معلومات":
        case "-م": {
            if (typeof values.player == "undefined") return api.sendMessage("لا توجد طاولة لعبة حالياً، يمكنك إنشاؤها باستخدام الأمر 'ابدأ'.", threadID, messageID);
            return api.sendMessage(
                "=== لعبة الثلاث أوراق ===" +
                "\n- مالك الطاولة: " + values.author +
                "\n- عدد اللاعبين: " + values.player.length + " لاعبين"
                , threadID, messageID);
        }

        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}