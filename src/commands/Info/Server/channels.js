const { Command, RichDisplay } = require('elaracmdo'),
    {MessageEmbed} = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "channels",
            memberName: "channels",
            aliases: [],
            examples: [`${client.commandPrefix}channels`],
            description: "Gives you all of the channels in the server.",
            group: "server",
            throttling: {
                usages: 1,
                duration: 2
            },
            guildOnly: true
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let textchannels = message.guild.channels.filter(c => c.type == "text").sort((a,b) => a.position - b.position).map(c => `<#${c.id}>`).join("\n");
        let voicechannels = message.guild.channels.filter(c => c.type == "voice").sort((a,b) => a.position - b.position).map(c => `${c.name}`).join("\n");
        let categorys = message.guild.channels.filter(c => c.type == "category").sort((a,b) => a.position - b.position).map(c => `${c.name}`).join("\n")
        let data = [`${textchannels}`, `${voicechannels}`, `${categorys}`];
        let types = ["Text Channels", "Voice Channels", "Categorys"]
        let embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`Loading..`).setColor(message.guild.color);
        let display = new RichDisplay(embed);
        let num = -1;
        await data.forEach(c => {num++; display.addPage(db => db.setDescription(c).setTitle(types[num]))})
        display.run(await message.channel.send(`Loading...`));
        }catch(e){
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}