const { Command, RichDisplay } = require('elaracmdo'),
    Discord = require('discord.js');
const spc = require("spacetime");

module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "time",
            memberName: "time",
            aliases: ["times"],
            examples: [`${client.commandPrefix}time <location here>`],
            description: "Gives you the time.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: `What Place do you want the time of?..\nIf you ain't sure on what timezones there are do \`${client.commandPrefix}time list\``,
                    type: 'string',
                    default: "def"
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let tzdb = await this.client.f.API('times');
        if(!tzdb) return message.channel.send(`There was an error while running this command!`);
        let e = new Discord.MessageEmbed()
        .setColor(message.guild ? message.member.displayColor : message.guild.color).setTimestamp();
        if(content.toLowerCase() === "g"){e.setTitle(`Current time for Deeter (${spc.now(tzdb.find(x => x.name.toLowerCase() === "los angeles").value).format('nice-day').toString()})`);return await message.channel.send(e)}else if(content.toLowerCase() === "v" || content.toLowerCase() === "val"){e.setTitle(`Current Time For VAL (${spc.now(tzdb.find(x => x.name === "London").value).format('nice-day').toString()})`);return await message.channel.send(e)}else
            if (content.length > 1) {
                if (content.toLowerCase() === "def"){
                    let display = new RichDisplay(e)
                    provideList(tzdb).forEach(c => {display.addPage(db => db.setDescription(c).setTitle(`Current Times`))})
                    display.run(await message.channel.send(`Loading....`))
                    return;
                }
                if (!tzdb.some(x => x.name.toLowerCase() === content.toLowerCase())) return await message.say("I couldn't find any place like this. Are you sure you weren't lost?");
                e.setTitle(`Current Time (${content})`)
                .setDescription(spc.now(tzdb.find(x => x.name.toLowerCase() === content.toLowerCase()).value).format('nice-day').toString())
                .setFooter(`Want to see another time? Do ${this.client.commandPrefix}time <location>`)
                return await message.channel.send(e)
            }

        function provideList(arr) {const buf = arr.map(x => `**${x.name}:** ${spc.now(x.value).format('nice-day').toString()}`);let strr = []; for (let i = 0; i < 14; i++) {strr[strr.length] = `${buf.splice(0, 35).join("\n")}`;}; return strr;}
        } catch (e) {
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
        }
    }
}
