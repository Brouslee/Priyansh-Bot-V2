module.exports = function ({ api, models, Users, Threads, Currencies }) { const stringSimilarity = require('string-similarity'), escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\]/g, "\$&"), logger = require("../../utils/log.js"); const axios = require('axios') const moment = require("moment-timezone"); return async function ({ event }) { const dateNow = Date.now() const time = moment.tz("Africa/Libya").format("HH:MM:ss DD/MM/YYYY"); const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly, keyAdminOnly, ndhOnly,adminPaOnly } = global.config; const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data; const { commands, cooldowns } = global.client; var { body, senderID, threadID, messageID } = event; var senderID = String(senderID), threadID = String(threadID); const threadSetting = threadData.get(threadID) || {} const prefixRegex = new RegExp(^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)})\\s*); if (!prefixRegex.test(body)) return; const adminbot = require('./../../config.json'); if(!global.data.allThreadID.includes(threadID) && !ADMINBOT.includes(senderID) && adminbot.adminPaOnly == true) return api.sendMessage("الوضع » يمكن للمسؤولين فقط استخدام البوت في المحادثة الخاصة بهم", threadID, messageID);

if (!ADMINBOT.includes(senderID) && adminbot.adminOnly == true)
  return api.sendMessage('الوضع » يمكن للمسؤولين فقط استخدام البوت', threadID, messageID);

if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.ndhOnly == true)
  return api.sendMessage('الوضع » يمكن للدعم الفني للبوت فقط استخدامه', threadID, messageID);

const dataAdbox = require('../../Priyansh/commands/cache/data.json');
var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
const findd = threadInf.adminIDs.find(el => el.id == senderID);
if (dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] == true && !ADMINBOT.includes(senderID) && !findd && event.isGroup == true)
  return api.sendMessage('الوضع » يمكن للمسؤولين فقط استخدام البوت', event.threadID, event.messageID);

if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox === false && senderID == threadID) {
  if (!ADMINBOT.includes(senderID.toString())) {
    if (userBanned.has(senderID)) {
      const { reason, dateAdded } = userBanned.get(senderID) || {};
      return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
    } else if (threadBanned.has(threadID)) {
      const { reason, dateAdded } = threadBanned.get(threadID) || {};
      return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
    }
  }
}

const [matchedPrefix] = body.match(prefixRegex);
const args = body.slice(matchedPrefix.length).trim().split(/ +/);
const commandName = args.shift().toLowerCase();
var command = commands.get(commandName);

if (!command) {
  const allCommandName = Array.from(commands.keys());
  const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
  if (checker.bestMatch.rating >= 0.5)
    command = client.commands.get(checker.bestMatch.target);
  else
    return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID);
}

if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
  if (!ADMINBOT.includes(senderID)) {
    const banThreads = commandBanned.get(threadID) || [],
          banUsers = commandBanned.get(senderID) || [];
    if (banThreads.includes(command.config.name))
      return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
    if (banUsers.includes(command.config.name))
      return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
  }
}

if (command.config.commandCategory.toLowerCase() == 'nsfw' && !global.data.threadAllowNSFW.includes(threadID) && !ADMINBOT.includes(senderID))
  return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    return api.unsendMessage(info.messageID);
  }, messageID);

let threadInfo2;
if (event.isGroup === true)
  try {
    threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    if (Object.keys(threadInfo2).length == 0) throw new Error();
  } catch (err) {
    logger(global.getText("handleCommand", "cantGetInfoThread", "خطأ"));
  }

var permssion = 0;
const threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
const find = threadInfoo.adminIDs.find(el => el.id == senderID);
if (NDH.includes(senderID.toString())) permssion = 2;
if (ADMINBOT.includes(senderID.toString())) permssion = 3;
else if (!ADMINBOT.includes(senderID) && !NDH.includes(senderID) && find) permssion = 1;

if (command.config.hasPermssion > permssion)
  return api.sendMessage(global.getText("handleCommand", "permssionNotEnough", command.config.name), event.threadID, event.messageID);

if (!client.cooldowns.has(command.config.name))
  client.cooldowns.set(command.config.name, new Map());
const timestamps = client.cooldowns.get(command.config.name);
const expirationTime = (command.config.cooldowns || 1) * 1000;
if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime)
  return api.sendMessage(`لقد استخدمت هذا الأمر مؤخرًا، يرجى الانتظار ${(timestamps.get(senderID) + expirationTime - dateNow)/1000} ثانية قبل إعادة المحاولة.`, threadID, messageID);

var getText2;
if (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language))
  getText2 = (...values) => {
    var lang = command.languages[global.config.language][values[0]] || '';
    for (var i = values.length - 1; i >= 0; i--) {
      const expReg = RegExp('%' + i, 'g');
      lang = lang.replace(expReg, values[i]);
    }
    return lang;
  };
else getText2 = () => { };

try {
  const Obj = {
    api, event, args, models, Users, Threads, Currencies,
    permssion, getText: getText2
  };
  command.run(Obj);
  timestamps.set(senderID, dateNow);
  if (DeveloperMode === true)
    logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ وضع المطور ]");
  return;
} catch (e) {
  return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
}

}; };

