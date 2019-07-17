const {Schema, model} = require("mongoose");
class Schemas{
    constructor(){
    this.settings = model("Settings", new Schema({
            guildName: String,
            guildID: String,
            prefix: String,
            misc: {
                throws: Array,
                jobs: Array,
                currency: String,
                color: String
            },
            channels: {
                log: {
                    all: String,
                    user: String,
                    server: String,
                    mod: String,
                    joins: String,
                    messages: String
                },
                reports: String,
                vclogs: String,
                action: String,
                commands: String,
                ignore: Array
            },
            toggles: {
                user: Boolean,
                mod: Boolean,
                messages: Boolean, 
                server: Boolean,
                joins: Boolean,
                ignore: Boolean,
                logbots: Boolean
            },
            suggestions: {
                channel: String,
                reaction1: String,
                reaction2: String
            },
            welcome: {
                channel: String,
                role: String,
                embed: Boolean,
                msg: String
            },
            leaves: {
                channel: String,
                embed: Boolean,
                msg: String
            }
    }));
    this.coins = model('Coins', new Schema({
            userTag: String,
            userID: String,
            guildID: String,
            coins: Number,
            bank: Number,
            daily: {
                date: String,
                bonus: Number
            },
            bonus: {
                cmdboost: Boolean,
                msgboost: Boolean,
                robboost: Boolean,
                immunity: Boolean
            }
    }));
    this.dev = model('Developer', new Schema({
            clientTag: String,
            clientID: String,
            logging: {
                status: String,
                server: String
            },
            stats: {
                cmdrun: Number,
                guildsjoin: Number,
                guildsleft: Number,
                restarts: Number,
                shutdowns: Number,
                starts: Number
            },
            misc: {
                maintenance: Boolean,
                servers: Array,
                users: Array
            },
            dms: {
                enabled: Boolean,
                hook: String
            },
            cmdlog: {
                enabled: Boolean,
                hook: String
            },
            change: {
                time: String,
                args: String
            },
            logs: {
                connect: String,
                reconnect: String,
                disconnect: String
            }
            
    }));
    this.users = model('Users', new Schema({
            userTag: String,
            userID: String,
            // User databases
            reps: Number,
            hearts: Number,
            todos: Array,
            custom: {
                image: String,
                desc: String
            },
            afk: {
                en: Boolean,
                message: String
            }
    }));
    this.config = model('Server-Config', new Schema({
            guildID: String, 
            guildName: String, 
            warnings: Array,
            commands: Array
    }))
    }
}
module.exports = new Schemas()