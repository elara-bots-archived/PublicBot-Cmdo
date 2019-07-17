const { Command } = require('elaracmdo');
const Discord = require('discord.js');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            group: 'mod',
            memberName: 'announce',
            userPermissions: ["MANAGE_MESSAGES"],
            description: 'Sends a message to the channel',
            aliases: ["embed"],
            examples: [`${client.commandPrefix}announce #channel Hi there!`],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "channel",
                    prompt: "What channel do you want me to post the announcement to?",
                    type: "channel"
                },
                {
                    key: 'content',
                    prompt: 'What would you like the content of the message to be?',
                    type: 'string'
                }
            ]
        });
    }

    async  run(message, { channel, content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let embed = new Discord.MessageEmbed()
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            .setDescription(content)
        channel.send(embed)
        message.delete().catch()
        }catch(e){
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
};