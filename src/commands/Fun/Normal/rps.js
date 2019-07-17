const { Command } = require('elaracmdo'),
    Discord = require('discord.js');
module.exports = class NCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rps",
            memberName: "rps",
            aliases: [],
            examples: [`${client.commandPrefix}rps rock`],
            description: "Play Rock Paper Scissors",
            group: "fun",
            throttling: {
                usages: 1,
                duration: 2
            },
            args: [
                {
                    key: 'content',
                    prompt: 'What would you like to choose?',
                    type: 'string'
                }
            ]
        })
    }
    async run(message, { content }) {
        if(await this.client.b(this.client, message) === true) return;
        if(await this.client.m(this.client) === true && !this.client.isOwner(message.author.id)) return this.client.f.msg(message)
        if(await this.client.f.channel(this.client, message) === true) return this.client.f.cmdschannel(message);
        
        try{
        var choice = content
        if (choice == "paper" || choice == "p") {
            var numb = Math.floor(Math.random() * 100);
            if (numb <= 50) {
                var choice2 = "paper";
            } else if (numb > 50) {
                var choice2 = "rock";
            } else {
                var choice2 = "scissors";
            }
            if (choice2 == "scissors") {
                var response = "I'm choosing **Scissors**! :v: I win!"
            } else if (choice2 == "paper") {
                var response = "I'm choosing **Paper**! :hand_splayed: It's a tie!"
            } else {
                var response = "I'm choosing **Rock**! :punch: You win!"
            }
            message.channel.send(response);
        } else if (choice == "rock" || choice == "r") {
            var numb = Math.floor(Math.random() * 100);
            if (numb <= 50) {
                var choice2 = "paper";
            } else if (numb > 50) {
                var choice2 = "rock";
            } else {
                var choice2 = "scissors";
            }
            if (choice2 == "paper") {
                var response = "I'm choosing **Paper**! :hand_splayed: I win!"
            } else if (choice2 == "rock") {
                var response = "I'm choosing **Rock**! :punch: It's a tie!"
            } else {
                var response = "I'm choosing **Scissors**! :v: You win!"
            }
            message.channel.send(response);
        } else if (choice == "scissors" || choice == "s") {
            var numb = Math.floor(Math.random() * 100);
            if (numb <= 50) {
                var choice2 = "paper";
            } else if (numb > 50) {
                var choice2 = "rock";
            } else {
                var choice2 = "scissors";
            }
            if (choice2 == "rock") {
                var response = "I'm choosing **Paper**! :hand_splayed: You win!"
            } else if (choice2 == "scissors") {
                var response = "I'm choosing **Scissors**! :v: It's a tie!"
            } else {
                var response = "I'm choosing **Rock**! :punch: I win!"
            }
            message.channel.send(response);
        } else {
            message.channel.send(`You need to use \`${this.client.commandPrefix}rps\` <rock|paper|scissors>`);
        }
        } catch (e) {
            this.client.error(this.client, message, e);
            this.client.f.logger(this.client, message, e.stack)
        }
    }
}