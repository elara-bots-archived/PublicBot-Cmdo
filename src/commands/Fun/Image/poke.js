const { Command } = require('elaracmdo'),
    Discord = require('discord.js'),
    superagent = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "poke",
            memberName: "poke",
            aliases: [],
            examples: [`${client.commandPrefix}poke @user/userid`],
            description: "Pokes the user you mention or their user id",
            group: "image",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: "user",
                    prompt: "What user do you want to poke?",
                    type: "user"
                }
            ]
        })
    }
    async run(message, { user }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const { body } = await superagent
            .get(`https://nekos.life/api/v2/img/poke`);
        let hugUser = user;
        if (hugUser.id === message.author.id) return message.say(`You can't poke yourself silly :wink:`)
        let hugEmbed = new Discord.MessageEmbed()
            .setDescription(`Poke \n\n**${message.author}** Poked **${hugUser}**!`)
            .setImage(body.url)
            .setColor(message.guild.color)
        message.channel.send(hugEmbed)
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}