const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rolecolor",
            memberName: "rolecolor",
            aliases: [`rolecolour`],
            examples: [`${client.commandPrefix}rolecolor <role name/mention or id here> <new color here>`],
            description: "Changes the role color of the role you choose.",
            group: "admin",
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"],
            throttling: {
                usages: 1,
                duration: 2
            },
            guildOnly: true,
            args: [
                {
                    key: "role",
                    prompt: "What role do you want to change the role color of?",
                    type: "role"
                },
                {
                    key: 'color',
                    prompt: 'What role do you want the role to be?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { role, color }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor(message.guild.color)
        .setDescription(`Loading..`);
        let msg = await message.channel.send(e)
        if(role.id === message.guild.id){
            e.setTitle(`INFO`).setDescription(`You can't set the @everyone role color!\n*#BlameDiscord*`)
            return msg.edit(e)
        }
        e.setDescription(`${role} role color is now ${color}`).setColor(color)
        msg.edit(e)
        await role.setColor(color).catch(error => {
        e.setTitle(`ERROR`)
        .setDescription(error)
        return msg.edit(e)
        });
        } catch (e) {
        this.client.error(this.client, message, e)
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}