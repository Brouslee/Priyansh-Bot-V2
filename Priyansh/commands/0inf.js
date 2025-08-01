module.exports.config = {
    name: "معلومات",
    version: "1.0.1", 
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "معلومات عن الأدمن والبوت.",
    commandCategory: "...",
    cooldowns: 1,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs-extra"];
    const time = process.uptime(),
          hours = Math.floor(time / (60 * 60)),
          minutes = Math.floor((time % (60 * 60)) / 60),
          seconds = Math.floor(time % 60);
    const moment = require("moment-timezone");
    var juswa = moment.tz("Africa/Libya").format("『D/MM/YYYY』 【HH:mm:ss】");
    var link = ["https://i.imgur.com/eDbdlvd.jpg"];

    var callback = () => api.sendMessage({
        body: ` ╾━╤デ╦︻(▀̿Ĺ̯▀̿ ̿)🇱🇾 مـعـلـومـات عـن الأدمن والبـوت 🇱🇾
(⌐▀͡ ̯ʖ▀)︻̷┻̿═━一-

☄️اسـم الـبـوت☄️  ${global.config.BOTNAME}

🔥أدمـن الـبـوت🔥 ☞︎︎︎☜︎︎︎✰ HAMOD

🙈رابط حساب فيسبوك الأدمن🙈➪ www.facebook.com/ukidn 

👋لأي مساعدة تواصل على تيليجرام: 👉 @it0c_4

✧══════•❁❀❁•══════✧

🌸بادئة أوامر البوت🌸☞︎︎︎☜︎︎︎✰ ${global.config.PREFIX}

مـالـك الـبـوت ☞︎︎︎☜︎︎︎✰ محمد العكاري - حمود 

🥳الـوقـت مـنـذ تـشـغـيـل الـبـوت🥳

🌪️الـيـوم هـو🌪️ ☞︎︎︎☜︎︎︎✰ ${juswa} 

⚡الـبـوت يعمل منـذ⚡ ${hours}:${minutes}:${seconds}.

✅شكرًا لاستخدامك ${global.config.BOTNAME} 🖤


  •••هٰــنـا مـالـك الـبـوت•••
┏━🕊️━━°❀•°:🤍😸🤍:°•❀°━━🤍━┓
🌸✦✧✧✧✧✰  HAMOD  ✰✧✧✧✧✦🌸
┗━🕊️━━°❀•°:🤍😸🤍:°•❀°━━🤍━┛
`,
        attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 

    return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
        .pipe(fs.createWriteStream(__dirname + "/cache/juswa.jpg"))
        .on("close", () => callback());
};