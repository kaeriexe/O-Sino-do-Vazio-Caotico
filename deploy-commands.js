require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [

  new SlashCommandBuilder()
    .setName('exposicao_nex')
    .setDescription('Define qual cargo possui NEX e que pode conjurar rituais.')
    .addRoleOption(option =>
      option.setName('cargo')
        .setDescription('Cargo autorizado a conjurar rituais')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('conjurar')
    .setDescription('Conjura um ritual de silêncio')
    .addUserOption(option => option.setName('imune1').setDescription('Usuário q ta imune').setRequired(false))
    .addUserOption(option => option.setName('imune2').setDescription('Usuário q ta imune').setRequired(false))
    .addUserOption(option => option.setName('imune3').setDescription('Usuário q ta imune').setRequired(false))
    .addUserOption(option => option.setName('imune4').setDescription('Usuário q ta imune').setRequired(false))
    .addUserOption(option => option.setName('imune5').setDescription('Usuário q ta imune').setRequired(false)),

  new SlashCommandBuilder()
    .setName('liberar')
    .setDescription('Libera as vozes seladas'),

  new SlashCommandBuilder()
    .setName('transcender')
    .setDescription('Cria um canal temporário com um alvo')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Usuário que irá transcender com você')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('finalizar_transcender')
    .setDescription('Finaliza o ritual e remove o canal temporário'),

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Comandos registrados.');
  } catch (error) {
    console.error(error);
  }
})();