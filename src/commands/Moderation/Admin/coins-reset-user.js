const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reset-user',
            memberName: 'reset-user',
            aliases: [`reset`],
            examples: [`${client.commandPrefix}reset-user @user`],
            description: `Deletes their coins database for the server. [Action isn't reversable.]`,
            group: "admin",
            userPermissions: ["MANAGE_GUILD"],
            throttling: {
                usages: 1,
                duration: 30
            },
            guildOnly: true,
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to clear their \"coins\" database?",
                    type: "user"
                },
                {
                    key: "choose",
                    prompt: "Are you sure you want to reset their \"coins\" database [y/n]? **THIS ACTION ISN'T REVERSIBLE**",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {user, choose}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        switch(choose){
            case "y" || "yes":
            this.client.dbcoins.findOneAndDelete({ guildID: message.guild.id, userID: user.id }).catch((err) => console.log(err));
            message.channel.send(`Alright, I've cleared ${user.tag}'s ${message.guild.currency} database.`);
            break;
            case "n" || "no":
            message.channel.send(`Canceled.`);
            break;
            default:
            message.channel.send(`You didn't choose \`y\` or \`n\` so the command is canceled.`);
            break;
        }
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}