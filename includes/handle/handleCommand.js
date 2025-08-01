module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const axios = require('axios');
  const moment = require("moment-timezone");

  return async function ({ event }) {
    const الوقت_الآن = Date.now();
    const التوقيت = moment.tz("Africa/Libya").format("HH:mm:ss DD/MM/YYYY");

    const {
      allowInbox,
      PREFIX,
      ADMINBOT,
      NDH,
      DeveloperMode,
      adminOnly,
      keyAdminOnly,
      ndhOnly,
      adminPaOnly
    } = global.config;

    const {
      userBanned,
      threadBanned,
      threadInfo,
      threadData,
      commandBanned
    } = global.data;

    const { commands, cooldowns } = global.client;

    var { body, senderID, threadID, messageID } = event;
    senderID = String(senderID);
    threadID = String(threadID);

    const threadSetting = threadData.get(threadID) || {};
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex(threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : PREFIX)})\\s*`);
    if (!prefixRegex.test(body)) return;

    const adminbot = require('./../../config.json');

    // التحقق من وضع "الإدارة الخاصة"
    if (!global.data.allThreadID.includes(threadID) && !ADMINBOT.includes(senderID) && adminbot.adminPaOnly === true)
      return api.sendMessage("الوضع » يمكن للمسؤولين فقط استخدام البوت في المحادثة الخاصة بهم", threadID, messageID);

    // التحقق من وضع "الإدارة العامة"
    if (!ADMINBOT.includes(senderID) && adminbot.adminOnly === true)
      return api.sendMessage('الوضع » يمكن للمسؤولين فقط استخدام البوت', threadID, messageID);

    // التحقق من وضع الدعم الفني
    if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.ndhOnly === true)
      return api.sendMessage('الوضع » يمكن لفريق الدعم فقط استخدام البوت', threadID, messageID);

    const dataAdbox = require('../../Priyansh/commands/cache/data.json');
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const findd = threadInf.adminIDs.find(el => el.id == senderID);

    if (dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] === true && !ADMINBOT.includes(senderID) && !findd && event.isGroup === true)
      return api.sendMessage('الوضع » يمكن للمسؤولين فقط استخدام البوت في هذه المجموعة', threadID, messageID);

    if (userBanned.has(senderID) || threadBanned.has(threadID) || (allowInbox === false && senderID === threadID)) {
      if (!ADMINBOT.includes(senderID)) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID);
          return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        } else if (threadBanned.has(threadID)) {
          const { reason, dateAdded } = threadBanned.get(threadID);
          return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        }
      }
    }

    const [matchedPrefix] = body.match(prefixRegex);
    const args = body.slice(matchedPrefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    var command = commands.get(commandName);

    // تصحيح الاسم في حال كان هناك خطأ بسيط
    if (!command) {
      const allCommandName = Array.from(commands.keys());
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 0.5) {
        command = client.commands.get(checker.bestMatch.target);
      } else {
        return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID);
      }
    }

    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [];
        const banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        if (banUsers.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return api.unsendMessage(info.messageID);
          }, messageID);
      }
    }

    // التحقق من صلاحية NSFW
    if (command.config.commandCategory.toLowerCase() === 'nsfw' &&
      !global.data.threadAllowNSFW.includes(threadID) &&
      !ADMINBOT.includes(senderID)) {
      return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return api.unsendMessage(info.messageID);
      }, messageID);
    }

    // التحقق من الصلاحيات
    var permssion = 0;
    const threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const isAdmin = threadInfo2.adminIDs.find(el => el.id == senderID);

    if (NDH.includes(senderID)) permssion = 2;
    else if (ADMINBOT.includes(senderID)) permssion = 3;
    else if (isAdmin) permssion = 1;

    if (command.config.hasPermssion > permssion)
      return api.sendMessage(global.getText("handleCommand", "permssionNotEnough", command.config.name), threadID, messageID);

    // التحقق من التبريد (Cooldown)
    if (!client.cooldowns.has(command.config.name))
      client.cooldowns.set(command.config.name, new Map());

    const timestamps = client.cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;

    if (timestamps.has(senderID) && الوقت_الآن < timestamps.get(senderID) + expirationTime) {
      const remaining = ((timestamps.get(senderID) + expirationTime - الوقت_الآن) / 1000).toFixed(1);
      return api.sendMessage(`🕑 من فضلك انتظر ${remaining} ثانية قبل استخدام الأمر مرة أخرى.`, threadID, messageID);
    }

    let getText2 = () => {};
    if (command.languages && typeof command.languages === 'object' && command.languages.hasOwnProperty(global.config.language)) {
      getText2 = (...values) => {
        let lang = command.languages[global.config.language][values[0]] || '';
        for (let i = values.length - 1; i >= 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    }

    try {
      const Obj = {
        api,
        event,
        args,
        models,
        Users,
        Threads,
        Currencies,
        permssion,
        getText: getText2
      };

      command.run(Obj);
      timestamps.set(senderID, الوقت_الآن);

      if (DeveloperMode === true) {
        logger(global.getText("handleCommand", "executeCommand", التوقيت, commandName, senderID, threadID, args.join(" "), Date.now() - الوقت_الآن), "[ وضع المطور ]");
      }
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
    }
  };
};