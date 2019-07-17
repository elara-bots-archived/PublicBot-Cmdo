const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class EmojiCreateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "restrictemoji",
            memberName: "restrictemoji",
            description: "Creates and restricts the Emoji to a certain role for the server",
            group: "admin",
            userPermissions: ["MANAGE_EMOJIS"],
            examples: [`${client.commandPrefix}restrictemoji <Link Here> <Name Here> <Role here>`],
            guildOnly: true,
            aliases: ['re'],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'emoji',
                    prompt: `Please provide a URL to a image to make into a emoji.`,
                    type: 'string'
                },
                {
                    key: "name",
                    prompt: "Please provide a name for the emoji.",
                    type: "string",
                    min: 2,
                    max: 32
                },
                {
                    key: "role",
                    prompt: "Please provide a role to restrict the emoji to.",
                    type: "role"
                }
            ]
        })
    }
    async run(message, { emoji, name, role }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        message.guild.emojis.create(emoji, name, [role], [`Created By: ${message.author.tag}`]).then(async emoji => {return message.channel.send(`**Emoji Created: **${emoji}`);}).catch(async error => {return this.client.error(this.client, message, error)});
        }catch(e){
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}