const {Event} = require('elaracmdo'), {MessageEmbed} = require('discord.js'), config = require('../../util/config');
module.exports = class Ready extends Event{
    constructor(client){
        super(client, {
            name: "ready",
            enabled: true
        })
    }
    async run(client){
        let db = await client.dev.findOne({clientID: client.user.id}, async (err, db) => {db});
        if(!db) return client.f.starting(client)
            if(await client.m(client) === true){
            client.user.setPresence({status: "dnd", activity: {name: "-- Maintenance --", type: "WATCHING"}})
            console.log(`-- Maintenance Mode Enabled --`)
            let embed = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setColor(client.util.colors.red)
            .setTitle(`-- Maintenance Mode Enabled --`)
            .setTimestamp()
            if(db.logging.status !== ""){
                try{client.channels.get(db.logging.status).send(embed)}catch(e){}
            }
            client.channels.get(client.config.log).send(embed)
        }else{
        if(db.logging.status !== ""){
            let embed = new MessageEmbed()
            .setAuthor(client.user.tag, client.user.displayAvatarURL())
            .setColor(client.util.colors.green)
            .setTitle(`Connected`)
            .setTimestamp()
            try{client.channels.get(db.logging.status).send(embed)}catch(e){}
        }
        client.f.starting(client);
        }
    }
}