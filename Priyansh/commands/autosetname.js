module.exports.config = {
    name: "autosetname",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "تعيين اسم تلقائي للأعضاء الجدد",
    commandCategory: "محادثات المجموعة",
    usages: "[add <name> /remove] ",
    cooldowns: 5
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async function  ({ event, api, args, permssionm, Users })  {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "autosetname.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

    switch (args[0]) {
        case "add": {
            if (content.length == 0)
                return api.sendMessage("يجب ألا يكون اسم العضو الجديد فارغًا!", threadID, messageID);

            if (thisThread.nameUser.length > 0)
                return api.sendMessage("يرجى إزالة التكوين السابق للاسم قبل تعيين اسم جديد!", threadID, messageID); 

            thisThread.nameUser.push(content);
            const name = (await Users.getData(event.senderID)).name;
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(`تم تعيين اسم تلقائي للأعضاء الجدد بنجاح\nالمعاينة: ${content} ${name}`, threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "delete": {
            if (thisThread.nameUser.length == 0)
                return api.sendMessage("لم يتم تعيين اسم تلقائي للأعضاء الجدد في هذه المجموعة!", threadID, messageID);

            thisThread.nameUser = [];
            api.sendMessage(`تم حذف تكوين الاسم التلقائي للأعضاء الجدد بنجاح`, threadID, messageID);
            break;
        }
        default: {
            api.sendMessage(`الاستخدام:\nautosetname add <الاسم> - لتعيين اسم تلقائي للعضو الجديد\nautosetname remove - لإزالة التكوين`, threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}