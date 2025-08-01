module.exports.config = {
    name: "غوغل",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "كتابة تعليق على اللوحة ( ͡° ͜ʖ ͡°)",
    commandCategory: "تعديل-صورة",
    usages: "google [نص التعليق]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
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
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
            else {
                lines.push(line.trim());
                line = '';
            }
            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
}

module.exports.run = async function({ api, event, args }) {
    let { threadID, messageID } = event;
    const { loadImage, createCanvas } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    let pathImg = __dirname + '/cache/google.png';
    var text = args.join(" ");
    if (!text) return api.sendMessage("من فضلك أدخل نص التعليق على اللوحة.", threadID, messageID);

    try {
        let imageData = (await axios.get(`https://i.imgur.com/GXPQYtT.png`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(pathImg, Buffer.from(imageData));

        let baseImage = await loadImage(pathImg);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // ضبط الخط
        let fontSize = 50;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        ctx.font = `400 ${fontSize}px Arial`;

        // تقليل حجم الخط إذا كان النص طويلاً
        while (ctx.measureText(text).width > 1200 && fontSize > 10) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial`;
        }

        // تقسيم النص إلى أسطر مناسبة
        const lines = await this.wrapText(ctx, text, 470);

        // رسم كل سطر على حدة مع مسافة بين الأسطر
        let startX = 580;
        let startY = 646;
        let lineHeight = fontSize + 5;

        lines.forEach((line, index) => {
            ctx.fillText(line, startX, startY + (index * lineHeight));
        });

        // حفظ الصورة النهائية
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // إرسال الصورة ثم حذفها
        return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);

    } catch (error) {
        return api.sendMessage("حدث خطأ أثناء معالجة الصورة: " + error.message, threadID, messageID);
    }
}