const { Command } = require('elaracmdo'),
    Discord = require('discord.js');

module.exports = class AddRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: "addrole",
            group: "mod",
            aliases: ["role+"],
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"],
            memberName: "addrole",
            description: "Adds a role to a user",
            examples: [`${client.commandPrefix}addrole @user <Role Name>`],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want me to give the role to?',
                    type: 'member'
                },
                {
                    key: "role",
                    prompt: "What role do you want me to give to the member?",
                    type: "role"
                }
            ]
        })
    }

    async run(message, { member, role }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        if (member.roles.has(role.id)) return message.say("They already have that role.");
        member.roles.add(role.id, `Was given By: ${message.author.tag} (${message.author.id}`).catch(e => {
            let eb = new Discord.MessageEmbed()
                .setColor(`#FF0000`)
                .setTitle(`ERROR`)
                .setDescription(`${e}`)
                .addField(`Why am I getting this error?.`, `To fix this error.\n1. Make sure that the bot has \`Manage Roles\` permission in server settings.\n2. Make sure that the Bot's highest role is above the role you are trying to give to someone.\n3. If none of those worked Join the Support Server and Ask one of the Support Team members about this issue. [Click Here](${this.client.options.invite})`)
           return message.channel.send(eb)
        })
        await message.react(this.client.util.emojis.sreact)   
    }catch(e){
        this.client.error(this.client, message, e);
        this.client.f.logger(this.client, message, e.stack)
    }
    }
};
