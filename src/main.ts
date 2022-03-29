/**
 *
 * March 28, 2022
 * N3rdP1um23
 * The folloeing file is used as the main entry point into the bot
 *
 */

// Import required packages
import "reflect-metadata";
import * as dotenv from 'dotenv';
import { Intents, Interaction, Message } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";

// Load environment file
dotenv.config();

// Export the bot client instanace
export const client = new Client({
  simpleCommand: {
    prefix: "!",
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
});

// Add an event handler to handle once the client is ready
client.once("ready", async () => {
    // Fetch and ensure guilds are in cache
    await client.guilds.fetch();

    // Initialize the bots commands
    await client.initApplicationCommands({
        guild: { log: true },
        global: { log: true },
    });

    // Initialize Permissions - true to enable logging
    await client.initApplicationPermissions(true);

    // Display in the console that the bot has started
    console.log("Bot started");
});


// Add an event handler to handle once the client interaction is created
client.on("interactionCreate", (interaction: Interaction) => {
	// Execute the interation
	client.executeInteraction(interaction);
});


// Add an event handler to handle once the client has a newly created message
client.on("messageCreate", (message: Message) => {
	// Execute the command
	client.executeCommand(message);
});

// Define a ffunction that handles importing commands and signing the bot in
async function run() {
	// Import commands
	await importx(
		dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}"
	);

	// Check to see if the bot token wasn't found
	if (!process.env.BOT_TOKEN) {
		// Display an error message to the console
		throw Error("Could not find BOT_TOKEN in your environment");
	}

	// Log the bot in
	await client.login(process.env.BOT_TOKEN);
}

// Call the function to handle starting the bot
run();