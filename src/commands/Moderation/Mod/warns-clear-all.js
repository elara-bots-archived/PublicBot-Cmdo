const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clearallwarns",
            memberName: "clearallwarns",
            aliases: [],
            userPermissions: ["ADMINISTRATOR"],
            examples: [`${client.commandPrefix}clearallwarns`],
            description: "Removes all warnings for the server, [Action isn't reversible]",
            group: "admin",
            guildOnly: true,
            args: [
                {
                    key: "sure",
                    prompt: "Are you sure you want to clear all warnings for the server?\n**Respond with `yes` if you want to reset the warnings**\n**Remember This action isn't reversible**",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {sure}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
        if(sure.toLowerCase() === 'yes' || sure.toLowerCase() === "y"){
        let e = new Discord.MessageEmbed()
        .setColor(message.guild.color)
        .setAuthor(message.guild.name, message.guild.iconURL())
        this.client.warns.findOne({guildID: message.guild.id}, async (err, db) => {
        if(db){
            if(db.warnings.length === 0){
                e.setTitle(`There is no warnings for the server..`)
                return message.channel.send(e)
            }else{
            db.warnings = [];
            db.save().catch(err => console.log(err));
            e.setTitle(`All warnings have been cleared.`).setFooter(`Action By: ${message.author.tag}`)
            return message.channel.send(e)
            }
        }
        });
    }else{
        return message.channel.send(`Canceled.`)
    }
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}