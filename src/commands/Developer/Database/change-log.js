const { Command } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
const moment = require('moment');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cl',
            memberName: 'cl',
            hidden: true,
            aliases: [],
            examples: [`${client.commandPrefix}cl Change log`],
            description: 'Adds the [blah] to the `update` command',
            group: 'owner',
            ownerOnly: true,
            args: [
                {
                    key: "change",
                    prompt: "What do you want to put in the change log?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {change}) {
        
        try{
        this.client.dev.findOne({clientID: this.client.user.id}, async (err,db) => {
            if(db){
                db.change.time = moment(new Date()).format("dddd, MMMM Do YYYY h:mm:ssa")
                db.change.args = change
                db.save().catch(err => console.log(err));
                let ae =  new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor(message.guild.color)
                .setTitle(`[Action] - Change Log Updated`)
                .setDescription(change)
                .setThumbnail('https://cdn.discordapp.com/emojis/413950627757031424.gif?v=1')
                .setFooter(`Updated By: @${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                this.client.f.hooks('action', ae)
                return message.react(this.client.util.emojis.sreact)
            }
        })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}
