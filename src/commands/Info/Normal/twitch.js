const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "twitch",
            memberName: "twitch",
            aliases: [],
            examples: [`${client.commandPrefix}twitch Ninja`],
            description: "Gets the information on the users twitch channel.",
            group: "info",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What twitch user do you want the link to?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(this.client.apis.twitch === "") return message.channel.send(`Command Disabled, Twitch API key not provided!`)
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        const query = new URLSearchParams([['client_id', this.client.apis.twitch]]);
        const url = new URL(`https://api.twitch.tv/kraken/channels/${encodeURIComponent(content)}`);
        url.search = query;

        const body = await fetch(url)
            .then(response => response.json())
            .catch(() => { message.say('Unable to find account. Did you spell it correctly?') });
        if (!body.url) return message.say(`Unable to find account. Did you spell it correctly?`)
        if (!body.display_name) return message.say(`Unable to find that account, Did you spell it correctly?`)
        const star = "**"
        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.color)
            .setImage(body.profile_banner)
            .setFooter(`Requested By ${message.author.tag}`, message.author.displayAvatarURL())
            .setThumbnail(body.logo)
            .setAuthor(body.display_name, `${body.logo ? body.logo : "https://cdn.discordapp.com/attachments/444028025932349441/467664998081232896/logo_twitch_iosversion_by_akiruuu-d9djk9s.png"}`)
            .setDescription(`
            ${star}Name: ${star}${body.display_name} (${body._id})
            ${star}Link: ${star}[URL](${body.url})
            ${star}Followers: ${star}${body.followers}
            ${star}Views: ${star}${body.views}
            ${star}Mature: ${star}${body.mature ? "Yes": "No"}
            ${star}Partner: ${star}${body.partner ? "Yes" :"No"}
            ${star}Created At: ${star}${moment(body.created_at).format(`dddd, MMMM Do YYYY, h:mm:ssa`)}
            ${star}Updated At: ${star}${moment(body.updated_at).format(`dddd, MMMM Do YYYY, h:mm:ssa`)}
            `)
            if(body.game !== null){
            embed.addField(`Current Game`, `${body.game ? body.game : "N/A"}`, true)
            }
            if(body.status !== null){
            embed.addField(`Current Status`, `${body.status ? body.status : "N/A"}`, true)
            }

        message.embed(embed);
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}