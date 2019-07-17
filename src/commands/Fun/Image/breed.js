const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const superagent = require('superagent');

module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "breed",
            memberName: "breed",
            aliases: [],
            examples: [`${client.commandPrefix}breed <pug/dog breed here>`],
            description: `Gives you a photo of the dog breed you choose, do \`${client.commandPrefix}breed list\` to see the full list`,
            group: "image",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: `What Breed do you want the photo of?..\nIf you ain't sure on what breeds there are do \`${client.commandPrefix}breed list\``,
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let breed = await this.client.f.API("breed");
        if(!breed) return message.channel.send(`Error while running this command, please try again.`)
        const argstotal = content;
        if (content.length > 1) {
            if (argstotal === "list")
                return await message.say(`Sent the Information in your dms.`).then(message.direct({
                    embed: {
                        title: "Here is a list of dog breeds that are available.",
                        description: `To use them, simply do \`\`${this.client.commandPrefix}breed <breed name here>.\`\``,
                        fields: provideList(breed),
                        timestamp: new Date(),
                        color: 0x02FFDD
                    }
                }));
           try{ 
            const { body } = await superagent.get(`https://dog.ceo/api/breed/${argstotal.toLowerCase()}/images/random`)
            let embed = new Discord.MessageEmbed()
            .setColor(message.guild ? message.member.displayColor : message.guild.color)
            .setImage(body.message) 
            .setTitle(`Here is your ${argstotal.toUpperCase()} Photo`)
            message.say(embed)
            }catch(e) {
                console.log(e.stack)
                message.say(`Nothing for that.`)
            }
        }

        function provideList(arr) {
            const buf = arr.map(x => x.value);
            let strr = [];
            for (let i = 0; i < 2; i++) {
                strr[strr.length] = {
                    name: "Continued",
                    value: `\`\`\`${buf.splice(0, 70).join("\n")}\`\`\``
                };
            }
            return strr;
        }
} catch (e) {
this.client.error(this.client, message, e);
this.client.f.logger(this.client, message, e.stack)
}
    }
}