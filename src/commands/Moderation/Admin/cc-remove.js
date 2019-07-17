const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: `cc-`,
            memberName: `cc-`,
            aliases: [`removecommand`],
            userPermissions: ["MANAGE_GUILD"],
            examples: [`${client.commandPrefix}cc- <Command>`],
            description: 'Removes a new custom command for the server.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 10
            },
            group: 'admin',
            args: [
                {
                    key: "trigger",
                    prompt: "What is the command name that you want to remove?",
                    type: "string"
                }
            ]
        })
    }
    async run(message, {trigger}) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        ;
        try{
            let e = new Discord.MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL()).setColor(this.client.util.colors.red).setTitle(`ERROR`).setTimestamp()
            let msg = await message.channel.send(`Loading....`);
            this.client.custom.findOne({guildID: message.guild.id}, async (err, db) => {
                if(db){
                    let data = [];
                    let old = [];
                    await db.commands.forEach(async w => {
                        if(w.cmd.toLowerCase() === trigger.toLowerCase()){
                            old.push({cmd: w.cmd, response: w.response});
                        }
                        if(w.cmd.toLowerCase() !== trigger.toLowerCase()){
                            data.push({cmd: w.cmd, response: w.response});
                        }
                    });
                    if(old.length === 0){
                        e.setDescription(`${trigger} isn't a custom command!`)
                        return msg.edit(e)
                    }else{
                        db.commands = data;
                        db.save().catch(err => console.log(err));
                        e.setTitle(`Custom Command: Removed`)
                        .addField(`Command`, old[0].cmd, true)
                        return msg.edit(e)
                    }
                }else{
                    return msg.edit(`No custom commands for this server!`);
                }
            })
        } catch (e) {
            this.client.error(this.client, message, e)
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}