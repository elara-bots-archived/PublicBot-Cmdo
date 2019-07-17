const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class EmojiCreateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "createemoji",
            userPermissions: ["MANAGE_EMOJIS"],
            memberName: "createemoji",
            description: "Creates a Emoji for the server",
            group: "admin",
            examples: [`${client.commandPrefix}createemoji <Link Here> <Name Here>`],
            guildOnly: true,
            aliases: ['ce'],
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'link',
                    prompt: `Please provide a URL to a image to make into a emoji.`,
                    type: 'string'
                },
                {
                    key: "name",
                    prompt: "Please provide a name for the emoji.",
                    type: "string",
                    min: 2,
                    max: 32
                }
            ]
        })
    }
    async run(message, {link, name }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if(message.guild.emojis.filter(c => c.name.toLowerCase() === name.toLowerCase()).size > 0){
        return message.channel.send(`An emoji with that name already exists.`)
        }
        message.guild.emojis.create(link, name).then(e => {message.channel.send(`**Created Emoji: **${e}`)}).catch(error => {
            let e = new Discord.MessageEmbed()
            .setColor(this.client.util.colors.red)
            .setTitle(`There was an error while running this command.`)
            .setDescription(`
            **Issues**
            1. Make sure that the file size is 256KB or below.
            2. Make sure that is a valid URL you are providing.
            3. Make sure that the server isn't full on that type of emoji type! 
            `)
            .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
            return message.channel.send(e)
        });
        }catch(e){
        this.client.error(this.client, message, e)
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}