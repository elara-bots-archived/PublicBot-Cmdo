const { Command, RichDisplay} = require('elaracmdo');
const Discord = require('discord.js');
const fn = require('../../../util/config.js').apis.fortnite;
const Client = require('fortnite');
const fortnite = new Client(fn)
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "fortnite",
            memberName: "fortnite",
            aliases: ["fn"],
            examples: [`${client.commandPrefix}fortnite Ninja solo pc`],
            description: "Gives you the life time stats of the user you search.",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'player',
                    prompt: 'What user do you want me to get the stats for?',
                    type: 'string'
                },
                {
                    key: 'play',
                    prompt: 'What platform do you wnat me to check for that user?\n [pc or xbl or psn]',
                    type: 'string',
                    default: 'pc'
                }
            ]
        })
    }
    async run(message, { player, play }) {
        if(this.client.config.apis.fortnite === "") return message.channel.send(`Command Disabled, Fortnite API key not provided`)
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        let username = player;
        let platform = play.toLowerCase();
        let db = [];
        await fortnite.user(username, platform).then(async data => {
                if(data.code === 404) return this.client.error(this.client, message, `User not found!`)
                let stats = data.stats;
                db.push(`
                **Fortnite Stats for [${data.username}](${data.url})**
                **1: **Main Menu
                **2: **Solo
                **3: **Duo
                **4: **Squad
                **5: **Lifetime
                `)
                db.push(`
                **__Solo Stats__**

                **Wins: **${stats.solo.wins}
                **Kills: **${stats.solo.kills}
                **Score: **${stats.solo.score}
                **Matches Played: **${stats.solo.matches}
                **Kill/Death Ratio: **${stats.solo.kd}
                **Top 3: **${stats.solo.top_3}
                **Top 6: **${stats.solo.top_6}
                **Top 12: **${stats.solo.top_12}
                **Top 25: **${stats.solo.top_25}
                `)
                db.push(`
                **__Duo Stats__**

                **Wins: **${stats.duo.wins}
                **Kills: **${stats.duo.kills}
                **Score: **${stats.duo.score}
                **Matches Played: **${stats.duo.matches}
                **Kill/Death Ratio: **${stats.duo.kd}
                **Top 3: **${stats.duo.top_3}
                **Top 6: **${stats.duo.top_6}
                **Top 12: **${stats.duo.top_12}
                **Top 25: **${stats.duo.top_25}
                `)
                db.push(`
                **__Squad Stats__**

                **Wins: **${stats.squad.wins}
                **Kills: **${stats.squad.kills}
                **Score: **${stats.squad.score}
                **Matches Played: **${stats.squad.matches}
                **Kill/Death Ratio: **${stats.squad.kd}
                **Top 3: **${stats.squad.top_3}
                **Top 6: **${stats.squad.top_6}
                **Top 12: **${stats.squad.top_12}
                **Top 25: **${stats.squad.top_25}
                `)
                db.push(`
                **__LifeTime Stats__**
                
                **Wins: **${stats.lifetime.wins}
                **Kills: **${stats.lifetime.kills}
                **Score: **${stats.lifetime.score}
                **Matches Played: **${stats.lifetime.matches}
                **Kill/Death Ratio: **${stats.lifetime.kd}
                **Top 3: **${stats.lifetime.top_3}
                **Top 6: **${stats.lifetime.top_6}
                **Top 12: **${stats.lifetime.top_12}
                **Top 25: **${stats.lifetime.top_25}
                `)
            let e = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setThumbnail('https://pbs.twimg.com/profile_images/1017458813199372289/QtGv1tyn_400x400.jpg')
            let display = new RichDisplay(e)
            for(let i =0; i<db.length; i++){
                display.addPage(d => d.setDescription(db[i]))
            }
            display.run(await message.channel.send(`Loading...`))
    });

        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}