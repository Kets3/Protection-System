const Discord = require('discord.js')
const ketse = new Discord.Client()
const ketsee = require('./ketse.json')
const moment = require('moment')

ketse.on('ready', () =>{
    console.log(ketse.user.tag + "is online")
})

ketse.on("message", async message =>{
    if(message.member.hasPermission("ADMINISTRATOR")) return;
    if(message.member.user.bot) return;
    if(ketsee.enable.links === "false") return;
    if(ketsee.enable.links === "true"){
        if(message.content.includes("discord.gg/") || message.content.includes("discord.io/") || message.content.includes("youtube.com/") || message.content.includes("twitch.tv/") || message.content.includes("discord.com/")){
              message.delete()
              const blacklist = message.guild.roles.cache.get(ketsee.blacklist.role)
              if(!blacklist) return console.log(`Δεν υπάρχει αυτός ο ρόλος`);
              if(blacklist){
                await message.member.roles.remove(message.member.roles.cache)
                message.member.roles.add(blacklist)
                  const logs = message.guild.channels.cache.get(ketsee.logs)
                  if(!logs) return console.log(`Δεν υπαρχει κανάλι για logs`)
                  if(logs){
                      const embed = new Discord.MessageEmbed()
                      .setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
                      .setTitle("**Anti Links System**")
                      .addFields(
                          {name: "**User ID**", value: "```" + message.member.user.id + "```", inline:true},
                          {name: "**User Name**", value: "```" + message.member.user.username + "```", inline:true},
                          {name: "**User Tag**", value: "<@!" + message.member.user.id + ">", inline:true},
                          {name: "**Link**", value: "" + message.content + "", inline:true}
                      )
                      .setColor("BLACK")
                      logs.send(embed)
                  }
              }
          }
    }

})
ketse.on('guildMemberAdd', async (member, message) => {
    if(member.bot) return;

    if(ketsee.enable['new-accounts'] === "true"){
        if (Date.now() - member.user.createdAt < 1000*60*60*24*1) {
            const logChan = ketsee.logs
            let channel = ketse.channels.cache.get(logChan);
            if(!channel) return console.log("Δεν υπάρχει το κανάλι αυτο")
    
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setAuthor('\u200b', ketse.user.displayAvatarURL())
                .setDescription(`⚠ **Πιθανός λογαριασμός Alt**
                Χρήστης: ${member.user}
                Δημιουργήθηκε: ${moment(member.user.createdAt).format("MMM Do YYYY").toLocaleString()} @ **${moment(member.user.createdAt).format('hh:mm a')}**
                *Ελέγξτε για να δείτε αν μοιάζουν με λογαριασμό alt ενός πρόσφατου αποκλεισμένου μέλους (Θα μπορούσε να είναι μια εικόνα προφίλ, ένα όνομα κ.λπ.)*`)
                .setFooter(`Αναγνωριστικό χρήστη: ${member.id}`)
                .setTimestamp();
            
                channel.send(embed)
                msg = await channel.send('Θελεις να το κάνω kick;;')
                msg.react('👍').then(() => msg.react('👎'))
            // Checking for reactionss
                msg.awaitReactions((reaction, user) => (reaction.emoji.name == '👍' || reaction.emoji.name == '👎') && (user.id !== ketse.user.id) , { max: 1, time: 600000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '👍') {
                            member.kick()
                            return msg.edit('**Τον έκανα kick**')
                        } else if (reaction.emoji.name === '👎') {
                           return msg.edit('**Δεν τον έκανα kick**')
                        }
                    })
                    .catch(collected => {
                        channel.send('**Έχεις 10 λεπτα αλλιως θα πρέπει να τον κάνει μετά εσύ χειροκίνητα!!**')
                    })
                    .catch(error => {
                        console.log(error.message)
                    });
        }
    }



})
ketse.login(ketsee.token).catch(e =>{
    console.log(e.message)
})
