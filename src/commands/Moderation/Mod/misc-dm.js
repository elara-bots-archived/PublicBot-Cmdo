const { Command } = require('elaracmdo');
module.exports = class DmCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dm',
            group: 'mod',
            memberName: 'dm',
            description: 'Sends a message to the user you mention.',
            aliases: ["pm"],
            examples: [`${client.commandPrefix}dm @User/userid/username Hi there!`],
            guildOnly: true,
            userPermissions: ["MANAGE_MESSAGES"],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'user',
                    prompt: 'Which user do you want to send the DM to?',
                    type: 'user'
                },
                {
                    key: 'content',
                    prompt: 'What would you like the content of the message to be?',
                    type: 'string'
                }
            ]
        });
    }

    async  run(message, { user, content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if(user === this.client.user) return message.say(`${this.client.util.emojis.nemoji} I can't dm myself :face_palm:`)
        if(user.bot) return message.reply(`${this.client.util.emojis.nemoji}I can't dm other bots!`)
        if (this.client.isOwner(user.id)) return message.say(`I ain't dming one of my bot owners! Are you crazy?`)
        let embed = new Discord.MessageEmbed()
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            .setDescription(content)
            .setFooter(`Message from ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
        user.send(embed).then(m => {
            message.react(this.client.util.emojis.sreact)
            message.say(`${this.client.util.emojis.semoji} ${message.author} Sent the message to ${user.tag}`).then(m => { m.delete(10000).catch() })
        }).catch(error => {
            message.react(this.client.util.emojis.nreact)
            message.say(`${this.client.util.emojis.nemoji} I can't send ${user.tag} a dm, The person has blocked me or doesn't allow dms from others.`)
        })
    }catch(e){
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
    }
    }
};