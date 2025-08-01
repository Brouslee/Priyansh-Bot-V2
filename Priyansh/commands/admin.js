const request = require("request");
const {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  copySync,
  createWriteStream,
  createReadStream
} = require("fs-extra");

module.exports.config = {
  name: "ادمن",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", // يمكن تغييره لاسمك
  description: "أوامر للإدارة والتحكم بالبوت",
  commandCategory: "الإدارة",
  usages: "[نسخة احتياطية | استعادة | حذف | رفع | تحميل]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args[0]) {
    return api.sendMessage(
      "🛠️ الأوامر المتاحة:\n\n" +
      "» نسخ احتياطي: `ادمن نسخة`\n" +
      "» استعادة نسخة: `ادمن استعادة`\n" +
      "» رفع ملف: `ادمن رفع [رابط]`\n" +
      "» تحميل: `ادمن تحميل`\n" +
      "» حذف: `ادمن حذف [اسم الملف]`\n",
      threadID,
      messageID
    );
  }

  const command = args[0].toLowerCase();

  if (command === "نسخة") {
    const backupDir = __dirname + "/../backup/";
    if (!existsSync(backupDir)) {
      require("fs").mkdirSync(backupDir);
    }
    const timestamp = Date.now();
    const filename = `${backupDir}backup_${timestamp}.json`;

    const threads = global.data.allThreadID || [];
    const backupData = threads.map(tid => ({
      threadID: tid,
      data: global.data.threadData.get(tid) || {}
    }));

    writeFileSync(filename, JSON.stringify(backupData, null, 2));
    return api.sendMessage(`✅ تم إنشاء النسخة الاحتياطية: backup_${timestamp}.json`, threadID, messageID);
  }

  if (command === "استعادة") {
    const files = readdirSync(__dirname + "/../backup/").filter(f => f.endsWith(".json"));
    if (!files.length) return api.sendMessage("❌ لا توجد أي ملفات احتياطية.", threadID, messageID);

    const latestFile = files.sort().reverse()[0];
    const data = JSON.parse(readFileSync(__dirname + `/../backup/${latestFile}`));
    for (const item of data) {
      global.data.threadData.set(item.threadID, item.data);
    }

    return api.sendMessage(`✅ تم استعادة البيانات من النسخة: ${latestFile}`, threadID, messageID);
  }

  if (command === "حذف") {
    if (!args[1]) return api.sendMessage("❌ يرجى تحديد اسم الملف للحذف.", threadID, messageID);
    const filepath = __dirname + `/../backup/${args[1]}`;
    if (!existsSync(filepath)) return api.sendMessage("❌ الملف غير موجود.", threadID, messageID);

    require("fs").unlinkSync(filepath);
    return api.sendMessage(`🗑️ تم حذف الملف: ${args[1]}`, threadID, messageID);
  }

  if (command === "رفع") {
    if (!args[1]) return api.sendMessage("❌ يرجى إضافة رابط الملف.", threadID, messageID);
    const url = args[1];
    const fileName = `downloaded_${Date.now()}.txt`;
    const filePath = __dirname + `/../downloads/${fileName}`;

    request(url)
      .pipe(createWriteStream(filePath))
      .on("close", () => {
        return api.sendMessage(`📥 تم تحميل الملف من الرابط وحفظه باسم: ${fileName}`, threadID, messageID);
      })
      .on("error", (err) => {
        return api.sendMessage("❌ حدث خطأ أثناء التحميل.", threadID, messageID);
      });
  }

  if (command === "تحميل") {
    const backupDir = __dirname + "/../backup/";
    const files = readdirSync(backupDir).filter(f => f.endsWith(".json"));
    if (!files.length) return api.sendMessage("❌ لا توجد أي نسخ احتياطية.", threadID, messageID);

    const latestFile = files.sort().reverse()[0];
    return api.sendMessage({
      body: `📦 أحدث نسخة احتياطية: ${latestFile}`,
      attachment: createReadStream(`${backupDir}${latestFile}`)
    }, threadID, messageID);
  }
};