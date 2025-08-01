const fs = require("fs");

module.exports.config = {
  name: "eventsup",
  eventType: [
    "log:thread-admins",
    "log:thread-name",
    "log:user-nickname",
    "log:thread-icon",
    "log:thread-color"
  ],
  version: "1.0.2",
  credits: "Deku",
  description: "تحديث البيانات في حال وجود تغيير في المجموعة تلقائياً",
  envConfig: {
    sendNoti: true,
    autoUnsend: false,
    timeToUnsend: 10
  }
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, logMessageType, logMessageData, author } = event;
  const thread = await api.getThreadInfo(threadID);
  const dataThread = await Threads.getData(threadID).then(e => e || {});
  const settings = dataThread?.settings || {};
  const prefix = settings?.PREFIX || global.config.PREFIX;

  // إضافة مشرف أو إزالته
  if (logMessageType === "log:thread-admins") {
    if (!dataThread.adminIDs) dataThread.adminIDs = thread.adminIDs;
    else {
      const isAdd = logMessageData?.ADMIN_EVENT === "add";
      const userID = logMessageData?.targetID;
      if (isAdd) {
        dataThread.adminIDs.push({ id: userID });
      } else {
        dataThread.adminIDs = dataThread.adminIDs.filter(e => e.id !== userID);
      }
    }
    await Threads.setData(threadID, { adminIDs: dataThread.adminIDs });

    const name = thread.userInfo.find(e => e.id == logMessageData.targetID)?.name || "شخص مجهول";
    const type = logMessageData.ADMIN_EVENT === "add" ? "تمت إضافته كمشرف" : "تمت إزالته من المشرفين";

    if (this.config.envConfig.sendNoti) {
      api.sendMessage(`» [ إشعار المجموعة ]\n» ${name} ${type}.`, threadID, (err, info) => {
        if (this.config.envConfig.autoUnsend) {
          setTimeout(() => api.unsendMessage(info.messageID), this.config.envConfig.timeToUnsend * 1000);
        }
      });
    }
  }

  // تغيير أيقونة المجموعة
  if (logMessageType === "log:thread-icon") {
    if (!global.data.threadIcon) global.data.threadIcon = {};
    const oldIcon = global.data.threadIcon[threadID] || "❓";
    global.data.threadIcon[threadID] = thread.icon;

    if (this.config.envConfig.sendNoti) {
      api.sendMessage(`» [ إشعار المجموعة ]\n» تم تغيير أيقونة المجموعة.\n» الأيقونة السابقة: ${oldIcon}`, threadID, (err, info) => {
        if (this.config.envConfig.autoUnsend) {
          setTimeout(() => api.unsendMessage(info.messageID), this.config.envConfig.timeToUnsend * 1000);
        }
      });
    }
  }

  // تغيير لون المجموعة
  if (logMessageType === "log:thread-color") {
    dataThread.threadColor = thread.color;
    await Threads.setData(threadID, dataThread);

    if (this.config.envConfig.sendNoti) {
      api.sendMessage(`» [ إشعار المجموعة ]\n» تم تغيير لون المجموعة.`, threadID, (err, info) => {
        if (this.config.envConfig.autoUnsend) {
          setTimeout(() => api.unsendMessage(info.messageID), this.config.envConfig.timeToUnsend * 1000);
        }
      });
    }
  }

  // تغيير الألقاب (nicknames)
  if (logMessageType === "log:user-nickname") {
    if (!dataThread.nicknames) dataThread.nicknames = {};
    dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
    await Threads.setData(threadID, dataThread);

    const targetName = thread.userInfo.find(e => e.id == logMessageData.participant_id)?.name || "عضو";
    const changerName = thread.userInfo.find(e => e.id == author)?.name || "شخص";

    if (this.config.envConfig.sendNoti) {
      api.sendMessage(`» [ إشعار المجموعة ]\n» ${changerName} غيّر لقب ${targetName} إلى: ${logMessageData.nickname || "بدون لقب"}.`, threadID, (err, info) => {
        if (this.config.envConfig.autoUnsend) {
          setTimeout(() => api.unsendMessage(info.messageID), this.config.envConfig.timeToUnsend * 1000);
        }
      });
    }
  }

  // تغيير اسم المجموعة
  if (logMessageType === "log:thread-name") {
    dataThread.threadName = thread.name;
    await Threads.setData(threadID, dataThread);

    const changer = thread.userInfo.find(e => e.id == author)?.name || "شخص ما";
    const newName = logMessageData?.name || "بدون اسم";

    if (this.config.envConfig.sendNoti) {
      api.sendMessage(`» [ إشعار المجموعة ]\n» ${changer} غيّر اسم المجموعة إلى: ${newName}.`, threadID, (err, info) => {
        if (this.config.envConfig.autoUnsend) {
          setTimeout(() => api.unsendMessage(info.messageID), this.config.envConfig.timeToUnsend * 1000);
        }
      });
    }
  }
};