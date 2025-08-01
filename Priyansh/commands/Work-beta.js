module.exports.config = {
    name: "عمل",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
    description: "",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "لقد أنهيت العمل مؤخرًا، عد لاحقًا بعد: %1 دقيقة و %2 ثانية."
    }
};

module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};

    // المبالغ العشوائية المكتسبة
    var coinscn = Math.floor(Math.random() * 401) + 200;
    var coinsdv = Math.floor(Math.random() * 801) + 200;
    var coinsmd = Math.floor(Math.random() * 401) + 200;
    var coinsq = Math.floor(Math.random() * 601) + 200;
    var coinsdd = Math.floor(Math.random() * 201) + 200;
    var coinsdd1 = Math.floor(Math.random() * 801) + 200;

    // الوظائف العشوائية
    var rdcn = ['توظيف موظفين', 'مدير فندق', 'في محطة توليد الكهرباء', 'طاهٍ في مطعم', 'عامل مصنع'];
    var work1 = rdcn[Math.floor(Math.random() * rdcn.length)];   

    var rddv = ['سبّاك', 'تصليح مكيف الجيران', 'تسويق متعدد المستويات', 'توزيع منشورات', 'عامل توصيل', 'فني حاسوب', 'دليل سياحي', 'مربية أطفال'];
    var work2 = rddv[Math.floor(Math.random() * rddv.length)]; 

    var rdmd = ['ربحت 13 برميل نفط', 'ربحت 8 براميل نفط', 'ربحت 9 براميل نفط', 'سرقت بعض النفط', 'خلطت الماء بالنفط وبعته'];
    var work3 = rdmd[Math.floor(Math.random() * rdmd.length)]; 

    var rdq = ['خام الحديد', 'خام الذهب', 'خام الفحم', 'خام الرصاص', 'خام النحاس', 'خام النفط'];
    var work4 = rdq[Math.floor(Math.random() * rdq.length)]; 

    var rddd = ['ألماس', 'ذهب', 'فحم', 'زمرد', 'حديد', 'صخر عادي', 'كسل', 'حجر أزرق'];
    var work5 = rddd[Math.floor(Math.random() * rddd.length)]; 

    var rddd1 = ['زائر مميز', 'براءة اختراع', 'شخص غريب', 'غبي عمره 23 عامًا', 'راعي غني عمره 92 عامًا', 'طفل عمره 12 عامًا'];
    var work6 = rddd1[Math.floor(Math.random() * rddd1.length)];

    var msg = "";

    switch(handleReply.type) {
        case "choosee": {
            switch(event.body) {
                case "1": msg = `⚡️لقد عملت كـ ${work1} في المنطقة الصناعية وربحت ${coinscn}$`; Currencies.increaseMoney(senderID, coinscn); break;
                case "2": msg = `⚡️لقد عملت كـ ${work2} في منطقة الخدمات وربحت ${coinsdv}$`; Currencies.increaseMoney(senderID, coinsdv); break;
                case "3": msg = `⚡️${work3} في حقل النفط وربحت ${coinsmd}$`; Currencies.increaseMoney(senderID, coinsmd); break;
                case "4": msg = `⚡️استخرجت ${work4} وربحت ${coinsq}$`; Currencies.increaseMoney(senderID, coinsq); break;
                case "5": msg = `⚡️قمت بالحفر ووجدت ${work5} وربحت ${coinsdd}$`; Currencies.increaseMoney(senderID, coinsdd); break;
                case "6": msg = `⚡️التقيت بـ ${work6} وقدّم لك ${coinsdd1}$ مقابل خدمة مشبوهة... ووافقت مباشرةً 😂`; Currencies.increaseMoney(senderID, coinsdd1); break;
                case "7": msg = "⚡️سيتم التحديث قريبًا..."; break;
                default: break;
            };

            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("⚡️يرجى إدخال رقم صحيح.", threadID, messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("⚡️الخيار غير موجود في القائمة.", threadID, messageID);

            api.unsendMessage(handleReply.messageID);

            if (msg === "⚡️Chưa update...") {
                msg = "⚡️سيتم التحديث قريبًا...";
            }

            return api.sendMessage(`${msg}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        }
    }
};

module.exports.run = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        var time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0); 
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    } else {
        return api.sendMessage(
          "💼 مركز الوظائف - اكسب المال من خلال العمل:\n\n" +
          "1. العمل في المنطقة الصناعية 🏭\n" +
          "2. العمل في منطقة الخدمات 🧰\n" +
          "3. العمل في حقل نفط 🛢️\n" +
          "4. استخراج المعادن الخام ⛏️\n" +
          "5. الحفر في الصخور 💎\n" +
          "6. تجربة غريبة 😅\n" +
          "7. قريبًا...\n\n" +
          "↪️ رد على هذه الرسالة برقم الوظيفة التي ترغب بها.",
          threadID,
          (error, info) => {
              data.work2Time = Date.now();
              global.client.handleReply.push({
                  type: "choosee",
                  name: this.config.name,
                  author: senderID,
                  messageID: info.messageID
              });  
          }
        );
    }
};