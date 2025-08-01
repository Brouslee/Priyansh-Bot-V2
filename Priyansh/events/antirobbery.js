module.exports.config = {
    name: "guard",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "منع تغييرات المسؤولين",
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const { logMessageType, logMessageData, senderID } = event;
    let data = (await Threads.getData(event.threadID)).data;
    if (data.guard == false) return;

    if (data.guard == true) {
        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    if (event.author == api.getCurrentUserID()) return;
                    if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;
                    else {
                        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false);
                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("هه! غبي 😝", event.threadID, event.messageID);
                            return api.sendMessage(`» تم تفعيل وضع الحماية من السرقة 🖤`, event.threadID, event.messageID);
                        }
                    }
                }
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    if (event.author == api.getCurrentUserID()) return;
                    if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;
                    else {
                        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true);
                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("هه! غبي 😝", event.threadID, event.messageID);
                            return api.sendMessage(`» تم تفعيل وضع الحماية من السرقة 🖤`, event.threadID, event.messageID);
                        }
                    }
                }
            }
        }
    }
}