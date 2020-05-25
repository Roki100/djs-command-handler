const { Collection } = require("discord.js")
const fs = require('fs')
module.exports = class {
    constructor(client,cmdir,ownerID,{helpCommand=false}) {
        if (!client) throw new ReferenceError("No client provided")
        if (!cmdir) throw new ReferenceError("No command direcory provided")
        if (!ownerID) throw new ReferenceError("No Owner ID provided")
        this.client=client
        this.ownerID=ownerID
        client.commands=new Collection()
        client.aliases=new Map()
        var commandFiles = fs
        .readdirSync(`${cmdir}`)
        .filter(file => file.endsWith('.js'));
      for (var file of commandFiles) {
        var command = require(`../../../${cmdir}/${file}`);
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
      }
    if (helpCommand) {
        function getCMD(msg,args,client) {
            if (!client.commands.get(args.toLowerCase())){ 
                if (!client.aliases.get(args.toLowerCase())) return msg.channel.send(`No information found for command **${args}**`)
            } 
            const cmd = client.commands.get(input.toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
            let info = ""
            if (cmd.name) info = `**Command name**: ${cmd.name}`
            if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`
            if (cmd.description) info += `\n**Descrption**: ${cmd.description}`
            if (cmd.usage) info += `\n**Usage**: ${cmd.usage}`
            return msg.channel.send({embed: {
                title: `Help for **${cmd.name}** command`,
                description: info,
                footer: {
                    text: "Syntax: <> = needed, [] = optional"
                }
            }});
            }
        function getAll(msg,client) {
            msg.channel.send({embed: {
                title: "Help",
                description: `${client.commands.map(c => `\`\`${c.name}\`\``).join(', ')}`
            }})
        }
        client.commands.set('help',{
            name: 'help',
            aliases: ['h'],
            description: "Gives help",
            usage: "help [command name]",
            run: async (msg,args,client) => {
            if (args[0]) {
                return getCMD(msg,args[0],client);
            } else {
                return getAll(msg);
            }
        }})
        client.aliases.set('h','help')
    }
}
    message(msg,prefix="!",{respondsToBots=false,mentionAsPrefix=true,mentionToKnowPrefix=true}) {
        if (!msg) throw new ReferenceError("No message provided")
        if (!respondsToBots) {
            if (msg.author.bot) return;
        }
        let p=prefix
        if (mentionToKnowPrefix) {
            if (msg.content === `<@!${this.client.user.id}>`) return msg.channel.send(`Hi! My prefix in this server is ${p}!!`)
        }
        if (mentionAsPrefix) {
            if (msg.content.startsWith(`<@!${this.client.user.id}>`)) p=`<@!${this.client.user.id}>`
       }
       if (msg.webhookID || msg.channel.type === "dm" || !msg.content || !msg.channel.guild) return;
        if (!msg.content.startsWith(p)) return;
        const commandName = msg.content.slice(p.length).trim().split(' ')[0]
        const args = msg.content.slice(p.length).trim().split(' ').slice(1)
        const command = this.client.commands.get(commandName)
          || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        if (!command) return;
        if (command.ownerOnly) {
          if (!this.ownerID.includes(msg.author.id)) return message.reply("You can't execute this command")
        }
        try {
            command.run(msg,args,this.client)
        } catch (e) {
            console.log(e)
            msg.channel.send(`Something went wrong while trying to execute the **${commandName}** command! Check my logs to see what!`)
        }
    }
}
