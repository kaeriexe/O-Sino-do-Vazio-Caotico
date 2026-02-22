require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('conjurar')
    .setDescription('Conjura um ritual de silêncio')
    .addUserOption(option =>
      option.setName('imune')
        .setDescription('Usuário que não será afetado pelo ritual')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('liberar')
    .setDescription('Libera as vozes seladas'),

  new SlashCommandBuilder()
    .setName('transceder')
    .setDescription('Define qual cargo pode usar os rituais')
    .addRoleOption(option =>
      option.setName('cargo')
        .setDescription('Cargo que poderá usar os rituais')
        .setRequired(true)
    )
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