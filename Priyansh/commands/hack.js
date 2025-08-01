module.exports.config = {
  name: "اختراق", // اسم الأمر
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 - تعريب: محمد",
  description: "مقلب اختراق وهمي لشخص ما 😈",
  commandCategory: "الترفيه",
  usages: "@منشن",
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  cooldowns: 0
};

// دالة لتقسيم النص الطويل إلى عدة أسطر
module.exports.wrapText = (ctx, name, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText('و').width > maxWidth) return resolve(null);
    const words = name.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/background.png";
  let pathAvt1 = __dirname + "/cache/avt_tmp.png";

  // الحصول على المعرف: المُشار إليه أو مرسل الرسالة
  var id = Object.keys(event.mentions)[0] || event.senderID;
  var name = await Users.getNameUser(id);

  // خلفية وهمية لعملية الاختراق
  var background = [
    "https://i.imgur.com/VQXViKI.png"
  ];
  var rd = background[Math.floor(Math.random() * background.length)];

  // تحميل صورة الحساب
  let getAvtmot = (
    await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

  // تحميل الخلفية
  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

  // تجهيز الرسم
  let baseImage = await loadImage(pathImg);
  let baseAvt1 = await loadImage(pathAvt1);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");

  // رسم الخلفية والصورة الشخصية
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvt1, 83, 437, 100, 101); // موضع الصورة الشخصية

  // إعداد الخط
  ctx.font = "400 23px Arial";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";

  // كتابة الاسم على الصورة
  const lines = await this.wrapText(ctx, name, 1160);
  ctx.fillText(lines.join('\n'), 200, 497); // موضع الاسم

  // حفظ الصورة النهائية
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);

  // إرسال الصورة مع رسالة وهمية
  return api.sendMessage(
    {
      body: `🔓 جاري اختراق ${name}...\n💀 تم الوصول إلى البيانات السرية!`,
      attachment: fs.createReadStream(pathImg)
    },
    event.threadID,
    () => fs.unlinkSync(pathImg),
    event.messageID
  );
};