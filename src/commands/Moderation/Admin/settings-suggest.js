const {Command} = require("elaracmdo");
const Discord = require("discord.js");
module.exports = class SetCommand extends Command{
    constructor(client) {
        super(client, {
            name: "setsuggest",
            memberName: "setsuggest",
            aliases: [`ss`],
            examples: [`${client.commandPrefix}setsuggest`],
            description: "Sets the suggestion channel, reactions etc.",
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "channel",
                    prompt: "What do you want to set as your suggestions channel?",
                    type: "channel"
                },
                {
                    key: "reaction1",
                    prompt: "What do you want me to set as your first reaction?",
                    type: "string",
                    default: "none"
                },
                {
                    key: "reaction2",
                    prompt: "What do you want me to set as your second reaction?",
                    type: "string",
                    default: "none"
                }
            ]
        });
    
    }
    async run(message, {channel, reaction1, reaction2}){
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if(!db){
                return message.channel.send(`There is no database for this server, please contact one the bot developers`);
            }else{
            if(channel){
             db.suggestions.channel = channel.id;
            }
            if(reaction1 !== "none"){
             let emojimention = reaction1.replace("<", "").replace('>', '').replace(':', '').replace(':', '').replace(/\d+/, "");
             if (emojimention.startsWith("a")) emojimention = emojimention.replace('a', '')
             let emoji1 = this.client.emojis.find(e => e.name === reaction1 || e.name === emojimention) || this.client.emojis.find(e => e.id === reaction1)
             if(!emoji1) return message.say(`I can't use that emoji!`)
             db.suggestions.reaction1 = emoji1.id;
            }



            if(reaction2 !== "none"){
            let emojimention2 = reaction2.replace("<", "").replace('>', '').replace(':', '').replace(':', '').replace(/\d+/, "");
            if (emojimention2.startsWith("a")) emojimention2 = emojimention2.replace('a', '')
            let emoji2 = this.client.emojis.find(e => e.name === reaction2 || e.name === emojimention2) || this.client.emojis.find(e => e.id === reaction2)
            if(!emoji2) return message.say(`I can't use that emoji!`)
            db.suggestions.reaction2 = emoji2.id;
            }


            db.save().catch(err => console.log(err.stack));
            return message.channel.send(`Alright, I set the suggestions channel for ${channel}${db.suggestions.reaction1 ? ` and the reactions to ${this.client.emojis.get(db.suggestions.reaction1)} and ` : ""}${db.suggestions.reaction2 ? this.client.emojis.get(db.suggestions.reaction2) : ""}`)
            }
        })
    }
}