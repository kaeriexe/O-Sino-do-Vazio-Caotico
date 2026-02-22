require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
let config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // COMANDO DEFINIR CARGO
  if (interaction.commandName === 'transceder') {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ 
        content: "❌ Apenas Administradores podem definir o cargo.", 
        ephemeral: true 
      });
    }

    const cargo = interaction.options.getRole('cargo');

    config.cargoPermitido = cargo.id;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    return interaction.reply(`Em diante do outro lado, ele molda tudo que vê, que sente. ${cargo.name}, você transcendeu, upando 5 de NEX, além de poder conjurar rituais sem usos de componentes ritualísticos.`);
  }

  const channel = interaction.member.voice.channel;

  if (!channel) {
    return interaction.reply({ 
      content: "Você precisa estar em um canal de voz!!", 
      ephemeral: true 
    });
  }

  const ehAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
  const temCargo = config.cargoPermitido 
    ? interaction.member.roles.cache.has(config.cargoPermitido)
    : false;

  if (!ehAdmin && !temCargo) {
    return interaction.reply({
      content: "Apenas forças maiores podem conjurar este ritual.",
      ephemeral: true
    });
  }

  if (interaction.commandName === 'conjurar') {

    await interaction.reply("O ritual é iniciado...\nO silêncio consome as vozes.");

    channel.members.forEach(member => {
      if (
        member.id !== interaction.user.id && // não muta quem usou
        !member.user.bot                    // NÃO muta bots
      ) {
        member.voice.setMute(true).catch(console.error);
      }
    });
  }

  if (interaction.commandName === 'liberar') {

    await interaction.reply("O selo se rompe.\nAs vozes retornam.");

    channel.members.forEach(member => {
      if (!member.user.bot) { // também ignora bots aqui
        member.voice.setMute(false).catch(console.error);
      }
    });
  }
});

client.login(process.env.TOKEN);