module.exports.config = {  
  name: "antibd",  
  eventType: ["log:user-nickname"],  
  version: "0.0.1",  
  credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",  
  description: "ضد تغيير لقب البوت"  
};  
  
module.exports.run = async function({ api, event, Users, Threads }) {  
    var { logMessageData, threadID, author } = event;  
    var botID = api.getCurrentUserID();  
    var { BOTNAME, ADMINBOT } = global.config;  
    var { nickname } = await Threads.getData(threadID, botID);  
    var nickname = nickname ? nickname : BOTNAME;  
    if (logMessageData.participant_id == botID && author != botID && !ADMINBOT.includes(author) && logMessageData.nickname != nickname) {  
        api.changeNickname(nickname, threadID, botID)  
        var info = await Users.getData(author);  
        return api.sendMessage({ body: `${info.name} - لا يمكنك تغيير لقب البوت 😹🖐` }, threadID);  
    }    
}