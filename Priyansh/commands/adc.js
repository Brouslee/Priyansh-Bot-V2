module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "تطبيق كود من buildtooldev و pastebin",
    commandCategory: "الإدارة",
    usages: "[رد أو نص]",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;

    let name = args[0];
    let text = (type === "message_reply") ? messageReply.body : null;

    if (!text && !name) {
        return api.sendMessage('📌 الرجاء الرد على الرابط لتطبيق الكود، أو كتابة اسم الملف لرفعه على Pastebin!', threadID, messageID);
    }

    if (!text && name) {
        return fs.readFile(
            `${__dirname}/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
                if (err) return api.sendMessage(`❌ الأمر "${args[0]}" غير موجود.`, threadID, messageID);
                const { PasteClient } = require('pastebin-api');
                const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");

                async function pastepin(name) {
                    const url = await client.createPaste({
                        code: data,
                        expireDate: 'N',
                        format: "javascript",
                        name: name,
                        publicity: 1
                    });
                    const id = url.split('/')[3];
                    return 'https://pastebin.com/raw/' + id;
                }

                const link = await pastepin(args[1] || 'noname');
                return api.sendMessage(link, threadID, messageID);
            }
        );
    }

    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const url = text.match(urlRegex);

    if (!url) return api.sendMessage("🔗 لم يتم العثور على رابط صالح.", threadID, messageID);

    if (url[0].includes('pastebin')) {
        axios.get(url[0]).then(res => {
            const data = res.data;
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                (err) => {
                    if (err) return api.sendMessage(`❗ حدث خطأ أثناء تطبيق الكود "${args[0]}.js"`, threadID, messageID);
                    api.sendMessage(`✅ تم تطبيق الكود بنجاح على "${args[0]}.js"\nاستخدم أمر التحميل لتفعيله.`, threadID, messageID);
                }
            );
        });
    }

    else if (url[0].includes('buildtool') || url[0].includes('tinyurl.com')) {
        const options = { method: 'GET', url: messageReply.body };
        request(options, (error, response, body) => {
            if (error) return api.sendMessage('⚠️ يُرجى الرد على رابط فقط بدون نص إضافي.', threadID, messageID);
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                const code = el.children[0].data;
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8", (err) => {
                    if (err) return api.sendMessage(`❗ تعذّر تطبيق الكود الجديد على "${args[0]}.js"`, threadID, messageID);
                    return api.sendMessage(`✅ تم إضافة الكود إلى "${args[0]}.js"\nاستخدم أمر التحميل لتفعيله.`, threadID, messageID);
                });
            });
        });
        return;
    }

    else if (url[0].includes('drive.google')) {
        const id = url[0].match(/[-\w]{25,}/);
        const path = resolve(__dirname, `${args[0]}.js`);
        try {
            await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
            return api.sendMessage(`✅ تم تحميل الكود إلى "${args[0]}.js".\n📎 ملاحظة: إذا واجهت خطأ، حوّل الملف في درايف إلى .txt`, threadID, messageID);
        } catch (e) {
            return api.sendMessage(`❌ تعذّر تطبيق الكود الجديد على "${args[0]}.js".`, threadID, messageID);
        }
    }
};