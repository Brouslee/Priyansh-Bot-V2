module.exports.config = {
  name: "افتا",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "الحصول على صورة الملف الشخصي باستخدام المعرف",
  commandCategory: "الأدوات",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
  const request = require("request");
  const fs = require("fs");
  const axios = require("axios");
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  const mn = this.config.name;

  if (!args[0]) return api.sendMessage(
    `[⚜️]=== صُور فيسبوك الشخصيّة ===[⚜️]
    
[⚜️]→ ${prefix}${mn} box : للحصول على صورة المجموعة.

[⚜️]→ ${prefix}${mn} id [المعرف] : للحصول على صورة الملف الشخصي من خلال الـ UID.

[⚜️]→ ${prefix}${mn} link [الرابط] : للحصول على صورة الملف من خلال رابط الحساب.

[⚜️]→ ${prefix}${mn} user : للحصول على صورتك الشخصية.

[⚜️]→ ${prefix}${mn} user [@منشن] : للحصول على صورة الملف الشخصي للشخص المُشار إليه.`,
    event.threadID, event.messageID
  );

  // 📦 صورة المجموعة
  if (args[0] == "box") {
    let threadInfo = args[1]
      ? await api.getThreadInfo(args[1])
      : await api.getThreadInfo(event.threadID);

    let imgSrc = threadInfo.imageSrc;
    if (!imgSrc) {
      return api.sendMessage(`[⚜️]→ لا توجد صورة لهذا الصندوق: ${threadInfo.threadName}`, event.threadID, event.messageID);
    }

    const callback = () => api.sendMessage({
      body: `[⚜️]→ صورة صندوق الدردشة: ${threadInfo.threadName}`,
      attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

    return request(encodeURI(imgSrc))
      .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
      .on('close', () => callback());
  }

  // 🆔 صورة عن طريق UID
  else if (args[0] == "id") {
    try {
      var id = args[1];
      if (!id) return api.sendMessage(`[⚜️]→ يرجى إدخال UID للحصول على الصورة.`, event.threadID, event.messageID);

      const callback = () => api.sendMessage({
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

      return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
    } catch (e) {
      api.sendMessage(`[⚜️]→ تعذر الحصول على صورة المستخدم.`, event.threadID, event.messageID);
    }
  }

  // 🔗 صورة عن طريق رابط
  else if (args[0] == "link") {
    var link = args[1];
    if (!link) return api.sendMessage(`[⚜️]→ الرجاء إدخال رابط الحساب.`, event.threadID, event.messageID);
    var tool = require("fb-tools");
    try {
      var id = await tool.findUid(args[1] || event.messageReply.body);
      var callback = () => api.sendMessage({
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

      return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
    } catch (e) {
      api.sendMessage("[⚜️]→ المستخدم غير موجود.", event.threadID, event.messageID);
    }
  }

  // 👤 صورة المستخدم الحالي أو الممنشن
  else if (args[0] == "user") {
    if (!args[1]) {
      var id = event.senderID;
      var callback = () => api.sendMessage({
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

      return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
    }

    else if (args.join().includes('@')) {
      var mentions = Object.keys(event.mentions)[0];
      var callback = () => api.sendMessage({
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

      return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
    }

    else {
      api.sendMessage(`[⚜️]→ أمر غير مفهوم. استخدم ${prefix}${mn} لعرض الأوامر المتاحة.`, event.threadID, event.messageID);
    }
  }

  else {
    api.sendMessage(`[⚜️]→ أمر غير معروف. استخدم ${prefix}${mn} لعرض التعليمات.`, event.threadID, event.messageID);
  }
}