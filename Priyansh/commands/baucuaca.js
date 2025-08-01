module.exports.config = {
    name: "رهان_الثلاثة",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "لعبة الرهان على ثلاثة رموز",
    commandCategory: "ألعاب",
    usages: "رهان_الثلاثة 500",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
    let { threadID, messageID, senderID } = event;
    const slotItems = ["تصويت", "سلطعون", "سمكة"];
    let userMoney = (await Currencies.getData(senderID)).money;
    let bet = args[0];

    if (!bet) 
        return api.sendMessage(`لم تدخل مبلغ الرهان!`, threadID, messageID);

    if (isNaN(bet) || bet.includes("-")) 
        return api.sendMessage(`مبلغ الرهان غير صالح. الرجاء استخدام الأمر بشكل صحيح.`, threadID, messageID);

    bet = parseInt(bet);

    if (bet > userMoney) 
        return api.sendMessage(`رصيدك لا يكفي للرهان بهذا المبلغ.`, threadID, messageID);

    if (bet < 50) 
        return api.sendMessage(`الحد الأدنى للرهان هو 50 دولار.`, threadID, messageID);

    let results = [];
    for (let i = 0; i < 3; i++) {
        results[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
    }

    let win = false;
    if (results[0] === results[1] && results[1] === results[2]) {
        bet *= 9;
        win = true;
    } else if (results[0] === results[1] || results[0] === results[2] || results[1] === results[2]) {
        bet *= 2;
        win = true;
    }

    if (win) {
        api.sendMessage(
            `${results.join(" | ")}\n🎉 لقد ربحت!\nالمبلغ الذي ربحته: ${bet} دولار.`,
            threadID,
            () => Currencies.increaseMoney(senderID, bet),
            messageID
        );
    } else {
        api.sendMessage(
            `${results.join(" | ")}\n😞 خسرت!\nالمبلغ الذي رهانته ذهب لصالح المنزل.`,
            threadID,
            () => Currencies.decreaseMoney(senderID, bet),
            messageID
        );
    }
};