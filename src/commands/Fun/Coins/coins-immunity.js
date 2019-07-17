const { Command } = require('elaracmdo'), {MessageEmbed} = require('discord.js')
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'immunity',
            memberName: 'immunity',
            hidden: true,
            aliases: [`it`],
            examples: [`${client.commandPrefix}immunity @member/id`],
            description: `Give's the user immunity from being robbed`,
            group: 'admin',
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 600
            },
            args: [
                {
                    key: "member",
                    prompt: "What member do you want to give immunity to?",
                    type: "member"
                }
            ]
        })
    }
    async run(message, {member}) {
        try{
            if(message.author.id === member.user.id && !this.client.isOwner(message.author.id)) return this.client.error(this.client, message, `No no no.. you can't give yourself immunity! muahahaha`)
            if(this.client.isOwner(member.user.id) && !this.client.isOwner(message.author.id)) return this.client.error(this.client, message, `Nope.. nice try though.. :p`)
        this.client.dbcoins.findOne({ userID: member.user.id, guildID: message.guild.id },async (err, db) => {
        if(db){
        db.bonus.immunity = db.bonus.immunity === true ? false : true;
        db.save().catch(err => console.log(err));
        let hexColor = await this.client.util.colors.default
        let embed = new MessageEmbed()
       .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(`Immunity`)
        .setDescription(`${db.bonus.immunity ? `Given Immunity to ${member}` : `Removed Immunity from ${member}`}`)
        .setColor(hexColor)
       return message.channel.send(embed)
        }else{
            return this.client.error(this.client, message, `I couldn't give ${member.user.tag} Immunity, They don't have a coins database.`)
        }
        });

        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}