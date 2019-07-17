const { Command } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cr-',
            memberName: 'cr-',
            hidden: true,
            aliases: [],
            examples: [`${client.commandPrefix}cr- <server ID> @user`],
            description: 'Deletes the users coins db from the database',
            group: 'owner',
            ownerOnly: true,
            args: [
                {
                    key: "server",
                    prompt: "What server do you want to remove their databse from?",
                    type: "string"
                },
                {
                    key: "user",
                    prompt: "What user do you want to delete their database?",
                    type: "user"
                }
            ]
        })
    }
    async run(message, {server,user}) {
        
        try{
        this.client.dbcoins.findOneAndDelete({userID: user.id, guildID: server}, async (err, db) => {
            let guild = this.client.guilds.get(server);
            let ae =  new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
            .setTitle(`[Action] - Coins DB Deleted`)
            .addField(`User`, `${user} \`@${user.tag}\` (${user.id})`)
            .addField(`Server`, `${guild.name} (${guild.id})`)
            .setThumbnail('https://cdn.discordapp.com/emojis/525673029393711105.gif?v=1')
            .setFooter(`Deleted By: @${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
            this.client.f.hooks('action', ae)
            return message.react(this.client.util.emojis.sreact)

        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}