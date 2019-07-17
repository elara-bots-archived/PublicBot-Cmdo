const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cc+',
            memberName: 'cc+',
            aliases: [`addcommand`],
            examples: [`${client.commandPrefix}cc+`],
            description: 'Creates a new custom command for the server.',
            group: 'admin',
            throttling: {
                usages: 1,
                duration: 10
            },
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            args: [
                {
                    key: "trigger",
                    prompt: "What will be the name for the custom command?",
                    type: "string"
                },
                {
                    key: "response",
                    prompt: "What will be the response for the custom command?",
                    type: "string",
                    min: 1,
                    max: 2000
                }
            ]
        })
    }
    async run(message, {trigger, response}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
            let e = new Discord.MessageEmbed().setTitle(`ERROR`).setColor(this.client.util.colors.red).setAuthor(message.guild.name, message.guild.iconURL())
            let msg = await message.channel.send(`Loading....`)
            if(trigger.toLowerCase().startsWith(this.client.commandPrefix) || trigger.toLowerCase().startsWith(message.guild._commandPrefix)){
                e.setDescription(`The name for the custom command can't start with: \`${message.guild._commandPrefix ? message.guild._commandPrefix : this.client.commandPrefix}\``)
                return msg.edit(e)
            }
            this.client.custom.findOne({guildID: message.guild.id},async(err,db)=>{
                if(db){
                    db.commands.push({cmd: trigger.toLowerCase(), response: response});
                    db.save().catch(err => console.log(err));
                    e.setTitle(`Response`)
                    .setDescription(response)
                    .setColor(this.client.util.colors.green)
                    .addField(`Custom Command: Added`, trigger, true)
                    return msg.edit(e)
                }else{
                    let newdb = new this.client.custom({
                        guildID: message.guild.id, 
                        guildName: message.guild.name, 
                        warnings: [],
                        commands: {cmd: trigger.toLowerCase(), response: response}
                    });
                    newdb.save().catch(err => console.log(err));
                    e.setTitle(`Response`)
                    .setDescription(response)
                    .setColor(this.client.util.colors.green)
                    .addField(`Custom Command: Added`, trigger, true)
                    return msg.edit(e)
                }
            })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}