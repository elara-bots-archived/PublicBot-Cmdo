const { Command, RichDisplay} = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "gwservers",
            memberName: "gwservers",
            aliases: ["gw"],
            examples: [`${client.commandPrefix}gwservers`],
            description: "Lists all of the Global Emoji Servers..",
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
        let list1 = [
            "Lulurd's Server [Click Here](https://discord.gg/raNyTfZ)",
            "!Republic of Pepestan and its citizens (ROPC) [Click Here](https://discord.gg/TVw8NKv)",
            "Legacys Nation [Click Here](https://discord.gg/legacysnation)",
            "Slippy's Dream World [Click Here](https://discord.gg/g6rhnRD)",
            "Mums House [Click Here](https://discord.gg/NUrkxcT)",
            "Shreks Swamp [Click Here](https://discord.gg/sjjh3YX)",
            "Twitch Hub [Click Here](https://discord.gg/cYzFU9S)",
            "Quantum Labs [Click Here](https://discord.gg/qlabs)",
            "Foxie Home [Click Here](https://discord.gg/7mJBxjK)",
            "apocalypse inc. [Click Here](https://discord.gg/EeBKmMz)",
            "Infinium [Click Here](https://discord.gg/inf)",
            "Eggmotes [Click Here](https://discord.gg/cYjhHuQ)",
            "The Seven Seas [Click Here](https://discord.gg/nDutq2S)",
            "Zigrin's Discord [Click Here](https://discord.gg/K6Raw6m)",
            "China Town [Click Here](https://discord.gg/PqVkeKX)",
        ]
        let list2 = [
            "The Garden [Click Here](https://discord.gg/52q9nxX)",
            "Nami's Town ^-^ [Click Here](https://discord.gg/JMus5cT)",
            "Alison's Gaming Server [Click Here](https://discord.gg/SfrEYGk)",
            "red panda tea club [Click Here](https://discord.gg/KT49WeZ)",
            "idk what to name this server [Click Here](https://discord.gg/NCCBMWz)",
            "SPC🌸 [Click Here](https://discord.gg/YZEvxRV)",
            "CommunityLegends [Click Here](https://discord.gg/3NeVJjc)",
            "Frog's dream world 1-2 [Click Here](https://discord.gg/T7MMtAy) [Click Here](https://discord.gg/wkymhQT)",
            "Shinobu Alter [Click Here](https://discord.gg/KbxbQeK)",
            "Weeb Empire [Click Here](https://discord.gg/R5Zxa23)",
            "skarz' dream world [Click Here](https://discord.gg/9j7TSuf)",
            "The Candy Kingdom [Click Here](https://discord.gg/934STDx)",
            "RoCorp [Click Here](https://discord.gg/BYzjwFw)",
            "Sound [Click Here](https://discord.gg/K7mAQBn)",
            "ChillZone [Click Here](https://discord.gg/Qurr9Gv)",
        ]
        let list3 = [
            "ERG Fanclub [Click Here](https://discord.gg/fRWBzgS)",
            "Summer Musashi Where [Click Here](https://discord.gg/NZgZUpC)",
            "The Lounge [Click Here](https://discord.gg/W2ZZHkY)",
            "The Candy Shop [Click Here](https://discord.gg/ym689GK)",
            "Bender's Lair [Click Here](https://discord.gg/99xaeGn)",
            "Jay's Server [Click Here](https://discord.gg/Ug7fAAX)",
            "Lazy Developers [Click Here](https://discord.gg/TXVWf9a)",
            "LWAkko [Click Here](https://discord.gg/BcUyDes)",
            "I Love Chiaki [Click Here](https://discord.gg/PH9nr5C)",
            "Anime Squad [Click Here](https://discord.gg/pFamEpp)",
            "🌺Kawaii Server🌺 [Click Here](https://discord.gg/vMzpPSs)",
            "Miyano's Listless Club [Click Here](https://discord.gg/M4D2W8R)",
            "Dank Inc. [Click Here](https://discord.gg/kPTsXUJ)",
            "I Love Tohru [Click Here](https://discord.gg/96AakE9)",
            "Nyan Nyan Hell [Click Here](https://discord.gg/FW8bv8q)",
            "Sorae's Shack [Click Here](https://discord.gg/4whBhuM)"
        ]
        let def = `**1**. If a invite is expired join the [support server](${this.client.options.invite}) and ask ${this.client.owners[0].tag} to update it.
        **2**. Once you join the server restart your discord to be able to access the emojis.
        **3**. If you have a global emoji server you want to add to this list contact ${this.client.owners[0].tag} in the [support server](${this.client.options.invite}).`
        let pages = [`Global Emoji Discord Invites start on the next page\n\n**Notes**\n\n${def}`, list1.join('\n'), list2.join('\n'), list3.join('\n')]; 
        let images = [`https://cdn.discordapp.com/emojis/533270491352268810.gif`, "https://cdn.discordapp.com/emojis/371317556734197761.png", "https://cdn.discordapp.com/emojis/367722252567052298.png", "https://cdn.discordapp.com/emojis/388310072264228865.png"]
        let e = new Discord.MessageEmbed().setColor(message.guild.color)
        let display = new RichDisplay(e)
        for(let i=0;i < pages.length;i++){
            display.addPage(a => a.setDescription(pages[i]).setThumbnail(images[i]).setTitle(pages[i] === pages[0] ? "Main Menu" : "Global Emoji Servers"))
        }
        display.run(await message.channel.send(`Loading...`))
        await message.delete(1000).catch()
    } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}