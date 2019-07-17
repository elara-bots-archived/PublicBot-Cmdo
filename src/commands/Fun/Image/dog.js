const { Command } = require('elaracmdo'),
    Discord = require('discord.js'),
    superagent = require('superagent');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "dog",
            memberName: "dog",
            aliases: ["doggo", "puppy"],
            examples: [`${client.commandPrefix}dog`],
            description: "Posts a random Dog Photo",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "image"
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let { body } = await superagent.get(`https://dog.ceo/api/breeds/image/random`);
        if (body.status === "success") {
            let color = message.guild.color
            let embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription("<a:Dots:426956230582599690> Loading the Photo..")

            message.channel.send(embed).then(async message => {
                embed.setColor(color)
                embed.setDescription("Here's a Photo of a Dog 😊")
                embed.setImage(body.message)
                message.edit(embed)
            })
        } 
    }catch(e){
            this.client.f.logger(this.client, message, e.stack)
            message.say(new Discord.MessageEmbed().setAuthor(this.client.user.tag, this.client.user.displayAvatarURL()).setTitle(`API ERROR`).setDescription(`Please Try again.`))
    }
    }
}