/**
 *
 * March 29, 2022
 * N3rdP1um23
 * The following file is used to handle any commands related to Countries interaction
 *
 */

// Import required packages
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Pagination } from "@discordx/pagination";
import { Country, Store, supported_countries, supported_stores } from "../constants.ts";

// Define the Stores class that stores all store related commands
@Discord()
@SlashGroup({name: 'stores', description: 'Display information related to stores.'})
@SlashGroup('stores')
export abstract class Stores {
	// Define the command that's used to grab a stores information based on the passed id
	@Slash()
	async store(@SlashOption("store_id") store_id: string, interaction: CommandInteraction): Promise<void> {
		// Grab the respective store
		const store = supported_stores.find((store: Store) => store.buCode == store_id);

		// Check to see if the store wasn't found
		if(store == undefined) {
			// Reply with an error message
			interaction.reply('Oops... That store wasn\'t found. Try `/store country country_code:` (where `country_code` is the countries respective "code" which can be found using the `/countries` command) to view a list of all stores for a given country.');

			// Return to stop further processing
			return;
		}

		// Grab the respective store country
		const store_country = supported_countries.find((country: Country) => country.code == store.countryCode);

		// Send the stores information
		await interaction.channel?.send({embeds: [
			new MessageEmbed()
			.setTitle(`**Ikea ${store.name}**`)
			.addFields(
				{ name: 'Name', value: store.name, inline: true },
				{ name: 'Id', value: store.buCode, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Country', value: `:flag_${store_country?.code}: ${store_country?.name}`, inline: true },
				{ name: 'Latitude', value: store.coordinates[1].toString(), inline: true },
				{ name: 'Longitude', value: store.coordinates[0].toString(), inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Google Maps', value: `https://www.google.com/maps/search/?api=1&query=Ikea+${store.name}`, inline: true },
			)
			.setURL(`https://www.google.com/maps/search/?api=1&query=Ikea+${store.name}`)
		]});
	}

	// Define the command that's used to grab all stores for a given country
	@Slash()
	async country(@SlashOption("country_code") country_code: string, interaction: CommandInteraction): Promise<void> {
		// Grab the respective country
		const country = supported_countries.find((country: Country) => country.code == country_code);

		// Check to see if the country wasn't found
		if(country == undefined) {
			// Reply with an error message
			interaction.reply('Oops... That country wasn\'t found. Try `/countries` to view a list of supported countried and thier respective country codes.');

			// Return to stop further processing
			return;
		}

		// Define the embed array
		var pages: MessageEmbed[] = [];

		// Iterate over the countries and handle accordinglt
		for (var i = 0 ; i < country.stores.length; i += 2) {
			// Create an array that will support holding the embedded fields
			var fields = [];

			// Push the first store data to the fields array
			fields.push(
				{ name: 'Name', value: country.stores[i].name, inline: true },
				{ name: 'Id', value: country.stores[i].buCode, inline: true }
			);

			// Check to see if there is a second store to handle
			if(country.stores[i + 1] !== undefined) {
				// Push the second store data to the fields array
				fields.push(
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Name', value: country.stores[i + 1].name, inline: true },
					{ name: 'Id', value: country.stores[i + 1].buCode, inline: true }
				);
			}

			// Push the formatted embed to the pages array
			pages.push(
				new MessageEmbed()
				.setFooter({ text: `Page ${Math.ceil((i / 2)) + 1} of ${Math.ceil(country.stores.length / 2)}` })
				.setTitle(`**Ikea Stores in :flag_${country.code}: ${country.name}**`)
				.addFields(fields)
			);
		}

		// Define and return the paginated menu of stores for a given country
		const pagination = new Pagination(interaction, pages);
		await pagination.send();
	}
}
