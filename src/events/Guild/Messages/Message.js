const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), cooldown = new Set();
module.exports = class Events extends Event{
    constructor(client){
        super(client, {
            name: "message",
            enabled: true
        })
    }
    async run(client, msg){
        if(msg.author.bot || await client.m(client) === true) return;
        try{
        const {pings, back, commands, main, dms} = client.f;
        pings(client, msg);
        back(client, msg);
        main(client, msg);
        if(cooldown.has(msg.author.id)) return;
        if(!client.isOwner(msg.author.id)){
        cooldown.add(msg.author.id);
        }
        setTimeout(() => {
        cooldown.delete(msg.author.id);
        }, 5000)
        commands(client, msg);
        dms(client, msg)
        }catch(e){client.f.event(client, "Message", e.stack, msg.guild || null)}
    }
}