require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField, 
  ChannelType 
} = require('discord.js');
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

  // EXPOGIÇÃO NEX
  if (interaction.commandName === 'exposicao_nex') {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "Apenas Administradores podem definir a exposição.",
        ephemeral: true
      });
    }

    const cargo = interaction.options.getRole('cargo');

    config.cargoPermitido = cargo.id;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    return interaction.reply(
      `A exposição foi registrada. ${cargo.name} agora possui contato com o Outro Lado.`
    );
  }

  // TRANS(sição)ENDER
  if (interaction.commandName === 'transcender') {

    const alvo = interaction.options.getUser('alvo');

    const memberExecutor = await interaction.guild.members.fetch(interaction.user.id);
    const memberAlvo = await interaction.guild.members.fetch(alvo.id).catch(() => null);

    if (!memberAlvo) {
      return interaction.reply({
        content: "Não foi possível encontrar o usuário.",
        ephemeral: true
      });
    }

    if (!memberExecutor.voice.channel || !memberAlvo.voice.channel) {
      return interaction.reply({
        content: "Ambos precisam estar em um canal de voz.",
        ephemeral: true
      });
    }

    const canal = await interaction.guild.channels.create({
      name: `transcendencia-${interaction.user.username}`,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.Connect]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.ViewChannel
          ]
        },
        {
          id: alvo.id,
          allow: [
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.ViewChannel
          ]
        }
      ]
    });

    await memberExecutor.voice.setChannel(canal);
    await memberAlvo.voice.setChannel(canal);

    return interaction.reply("O véu se abre. Apenas vocês dois atravessam.");
  }

  // FINALIZAR TRANS(sição)ENDER
  if (interaction.commandName === 'finalizar_transcender') {

    const canal = interaction.member.voice.channel;

    if (!canal || !canal.name.startsWith('transcendencia-')) {
      return interaction.reply({
        content: "Você não está em um canal de transcendência.",
        ephemeral: true
      });
    }

    await canal.delete();

    return interaction.reply("O véu se fecha.");
  }

  // A PARTIR DAQUI EXIGE CANAL DE VOZ!!

  const channel = interaction.member.voice.channel;

  if (!channel) {
    return interaction.reply({
      content: "Você precisa estar em um canal de voz.",
      ephemeral: true
    });
  }

  const ehAdmin = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
  const temCargo = config.cargoPermitido
    ? interaction.member.roles.cache.has(config.cargoPermitido)
    : false;

  if (!ehAdmin && !temCargo) {
    return interaction.reply({
      content: "Sua mente ainda não suporta a exposição necessária.",
      ephemeral: true
    });
  }

  // CON URAR
  if (interaction.commandName === 'conjurar') {

    const imunes = [
      interaction.options.getUser('imune1'),
      interaction.options.getUser('imune2'),
      interaction.options.getUser('imune3'),
      interaction.options.getUser('imune4'),
      interaction.options.getUser('imune5')
    ]
      .filter(u => u)
      .map(u => u.id);

    await interaction.reply("O ritual é iniciado...\nO silêncio consome as vozes.");

    channel.members.forEach(member => {
      if (
        member.id !== interaction.user.id &&
        !member.user.bot &&
        !imunes.includes(member.id)
      ) {
        member.voice.setMute(true).catch(console.error);
      }
    });
  }

  // 🔊 LIBERAR
  if (interaction.commandName === 'liberar') {

    await interaction.reply("O selo se rompe.\nAs vozes retornam.");

    channel.members.forEach(member => {
      if (!member.user.bot) {
        member.voice.setMute(false).catch(console.error);
      }
    });
  }

});

client.login(process.env.TOKEN);