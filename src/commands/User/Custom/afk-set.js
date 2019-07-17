const {Command} = require('elaracmdo');
module.exports = class AFKCommand extends Command{
    constructor(client){
        super(client, {
            name: 'afk',
            memberName: 'afk',
            aliases: [],
            examples: [`${client.commandPrefix}afk [message]`],
            description: 'Sets your afk status. [to remove it just type again]',
            group: 'user',
            args: [
                {
                    key: "msg",
                    prompt: "What do you want your afk message to be?",
                    type: 'string',
                    default: ''
                }
            ]
        })
    }
    async run(message, {msg}){
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        this.client.u.findOne({userID: message.author.id}, async(err,db) => {
            if(db){
                db.afk.en = true;
                if(msg !== ''){
                    db.afk.message = msg.replace('@here', "here").replace("@everyone", 'everyone');
                }
                db.save().catch(err => console.log(err));
                return message.channel.send(`Alright, I set your status to afk, to remove your afk status just type again..`);
            }else{
            await this.client.f.userdb(this.client, message.author)
            return message.channel.send(`Your user database has just been created, try again.`);
            }
        })
    }
}