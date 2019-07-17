const { Command, RichDisplay, eutil: {list1, list2, list3, list4, list5, list6, list7, list8, list9} } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "nitroservers",
            memberName: "nitroservers",
            aliases: [`nitro`],
            examples: [`${client.commandPrefix}nitroservers`],
            description: "Gives you a list of Nitro emoji servers",
            throttling: {
                usages: 1,
                duration: 2
            },
            group: "fun"
        })
    }
    async run(message) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let e = new Discord.MessageEmbed()
        .setColor(message.member.displayColor)
        .setTitle(`Nitro Servers`)
        .setThumbnail('https://vgy.me/qRrBpV.png')
        let l1 = list1.join('\n') + "\n" + list2.join('\n');
        let l2 = list3.join('\n') + "\n" + list4.join('\n');
        let l3 = list5.join('\n') + "\n" + list6.join('\n');
        let l4 = list7.join('\n') + "\n" + list8.join('\n');
        let l5 = list9.join('\n');
        let def = `
        **__Main Menu__** 
        Server invites start on page 2.

        **__Notes__**
        **1.** If a invite is expired join the [support server](${this.client.options.invite}) and ask ${this.client.owners[0].tag} to update the invite
        **2.** I(SUPERCHIEFYT) ain't responsible for anything that happens while you are in one of these servers.
        **3.** If you don't have discord nitro you won't be able to use the emojis in these servers.
        **4.** If you want to have a nitro emoji server added to this list, join the support server and ask [${this.client.owners[0].tag}](${this.client.options.invite}) to add it to this list.
        `
        let data = [def, l1, l2, l3, l4, l5]
        const display = new RichDisplay(e)
       for(let i = 0; i <data.length;i++){
           display.addPage(a => a.setDescription(data[i]))
       }
        display.run(await message.channel.send(`Loading...`));
            await message.delete(1000).catch()
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}