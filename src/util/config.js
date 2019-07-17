class Config{
  constructor(){
    this.owners = [];
    this.invite = "";
    this.apis = {
      IMDB: "",
      api: "",
      fortnite: "",
      giphy: "",
      twitch: "",
      youtube: ""
  }
  this.webhooks = {
    log: "",
    error: "",
    servers: "",
    action: "",
    shard: "",
    cmds: "",
    dms: ""
}
this.links = {
  dblpro: "", // DBL Profile link for the bot
  github: "", // Github link for the bot
  invite: ""  // Invite for the bot
}
this.presence = {
    random: {
      enabled: true
},
    default: {
      enabled: true,
      def: client => {
        client.user.setPresence({status: "dnd", activity: {
          name: "Starting up..",
          type: "WATCHING"
        }})
        setTimeout(async () => {
          client.user.setPresence({status: "online", activity: {
            name: `${prefix}help`,
            type: "LISTENING"
          }})
        }, 35000)
      }
}}
  this.totaldisable = false;
  this.prefix = "";
  this.rexexp = err => err
  this.commandfolders = ["Developer", 'Fun', 'Info', 'Moderation', "User"];
  this.eventfolders = ['Server', 'Joins', "Mod", "User", "Messages"];
  this.mongo = "";
  this.token = "";
  };
}




// Configure to make sure everything is right.
const {log} = console;
const config = new Config();
if(config.token === ""){
  log(`[Setup] - No token provided!`);
  return process.exit(1)
}
if(config.owners.length === 0){
  log(`[Setup] - No owners provided`);
  return process.exit(1)
}
if(config.mongo === ""){
  log(`[Setup] - No mongodb link provided`);
  return process.exit(1)
}
async function webcheck(hook){
    if(!hook) return false
    if(!hook.includes('https://discordapp.com/api/webhooks/')) return false
    else return true
}
(async () => {
if(await webcheck(config.webhooks.action) === false){
  log(`[Setup] - Webhook for 'action' doesn't include "https://discordapp.com/api/webhooks/"`)
  return process.exit(1)
}
if(await webcheck(config.webhooks.log) === false){
  log(`[Setup] - Webhook for 'log' doesn't include "https://discordapp.com/api/webhooks/"`)
  return process.exit(1)
}
if(await webcheck(config.webhooks.servers) === false){
  log(`[Setup] - Webhook for 'servers' doesn't include "https://discordapp.com/api/webhooks/"`)
  return process.exit(1)
}
if(await webcheck(config.webhooks.shard) === false){
  log(`[Setup] - Webhook for 'shard' doesn't include "https://discordapp.com/api/webhooks/"`)
  return process.exit(1)
}
if(await webcheck(config.webhooks.error) === false){
  log(`[Setup] - Webhook for 'error' doesn't include "https://discordapp.com/api/webhooks/"`)
  return process.exit(1)
}
})()
module.exports = config