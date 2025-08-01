module.exports.config = { name: 'allbox', version: '1.0.0', credits: '𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭', hasPermssion: 2, description: '[حظر/إلغاء الحظر/حذف] قائمة [بيانات] المجموعات التي انضم إليها البوت.', commandCategory: 'الإدارة', usages: '[رقم الصفحة/الكل]', cooldowns: 5 };

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) { const { threadID, messageID } = event; if (parseInt(event.senderID) !== parseInt(handleReply.author)) return; const moment = require("moment-timezone"); const time = moment.tz("Asia/Kolkata").format("HH:mm:ss L"); var arg = event.body.split(" "); var idgr = handleReply.groupid[arg[1] - 1]; var groupName = handleReply.groupName[arg[1] - 1]; switch (handleReply.type) { case "reply": { if (['ban', 'Ban'].includes(arg[0])) { const data = (await Threads.getData(idgr)).data || {}; data.banned = 1; data.dateAdded = time; await Threads.setData(idgr, { data }); global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded }); return api.sendMessage(📛 تم حظر المجموعة من استخدام البوت., idgr, () => api.sendMessage(✅ تم حظر المجموعة: 📌 الاسم: ${groupName} 🆔 TID: ${idgr}, threadID, () => api.unsendMessage(handleReply.messageID))); }

if (['unban', 'Unban', 'ub', 'Ub'].includes(arg[0])) {
    const data = (await Threads.getData(idgr)).data || {};
    data.banned = 0;
    data.dateAdded = null;
    await Threads.setData(idgr, { data });
    global.data.threadBanned.delete(idgr);
    return api.sendMessage(`✅ تم رفع الحظر عن المجموعة:

📌 الاسم: ${groupName} 🆔 TID: ${idgr}`, threadID, () => api.unsendMessage(handleReply.messageID)); }

if (['del', 'Del'].includes(arg[0])) {
    await Threads.delData(idgr);
    return api.sendMessage(`🗑️ تم حذف بيانات المجموعة:

📌 الاسم: ${groupName} 🆔 TID: ${idgr}`, threadID, messageID); }

if (['out', 'Out'].includes(arg[0])) {
    api.sendMessage(`🚪 تم مغادرة البوت للمجموعة.`, idgr, () =>
      api.sendMessage(`📌 الاسم: ${groupName}

🆔 TID: ${idgr}`, threadID, () => api.unsendMessage(handleReply.messageID, () => api.removeUserFromGroup(api.getCurrentUserID(), idgr)))); } break; } } };

module.exports.run = async function ({ api, event, args }) { const { threadID, messageID } = event; if (args[0] === "all") { let threadList = []; let data; try { data = await api.getThreadList(100, null, ["INBOX"]); } catch (e) { console.error(e); }

for (const thread of data) {
  if (thread.isGroup)
    threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
}

threadList.sort((a, b) => b.messageCount - a.messageCount);

const page = parseInt(args[1]) || 1;
const limit = 100;
const numPage = Math.ceil(threadList.length / limit);
const start = limit * (page - 1);
const end = start + limit;

const groupid = [];
const groupName = [];
let msg = `📋 قائمة المجموعات - الصفحة ${page}/${numPage} 📋\n\n`;

for (let i = start; i < end && i < threadList.length; i++) {
  const group = threadList[i];
  msg += `${i + 1}. ${group.threadName}\n🆔 TID: ${group.threadID}\n💬 الرسائل: ${group.messageCount}\n`;
  groupid.push(group.threadID);
  groupName.push(group.threadName);
}

msg += `\n🔁 للرد على أحد الأوامر: [Out | Ban | Unban | Del] + رقم المجموعة`

return api.sendMessage(msg, threadID, (e, data) =>
  global.client.handleReply.push({
    name: this.config.name,
    author: event.senderID,
    messageID: data.messageID,
    groupid,
    groupName,
    type: 'reply'
  })
);

} else { let threadList = []; const data = global.data.allThreadID || []; let i = 1;

for (const thread of data) {
  const nameThread = global.data.threadInfo.get(thread)?.threadName || "(بدون اسم)";
  threadList.push(`${i++}. ${nameThread} \n🆔 TID: ${thread}`);
}

return api.sendMessage(
  threadList.length ? `📦 عدد المجموعات: ${threadList.length}\n\n${threadList.join("\n")}` : "⚠️ لا توجد مجموعات حالياً.",
  threadID,
  messageID
);

} };

