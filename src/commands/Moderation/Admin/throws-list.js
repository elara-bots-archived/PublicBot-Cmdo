const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "throw=",
            memberName: "throw=",
            aliases: [`throwlist`],
            examples: [`${client.commandPrefix}throw=`],
            description: "Shows all of the throws currently.",
            group: "admin",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            throttling: {
                usages: 1,
                duration: 2
            },
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        this.client.db.findOne({guildID: message.guild.id}, async (err, db) => {
            if (db) {
                let throws;
                if(db.misc.throws.length === 0){
                throws = await this.client.f.bin(`Default Throws`, this.client.util.throws.join('\n'))
                }else{
                throws = await this.client.f.bin(`Throws`, db.misc.throws.join('\n'))
                }
                let embed = new Discord.MessageEmbed()
                .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                .setTimestamp()
                .setTitle(`Throw List`)
                .setDescription(throws)
                return message.channel.send(embed)
            }else{
            return message.channel.send(`No Database yet.`)
            }
        });
        } catch (e) {
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}