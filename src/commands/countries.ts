/**
 *
 * March 28, 2022
 * N3rdP1um23
 * The following file is used to represent the command to list supported countries
 *
 */

// Import required packages
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";
import { Pagination } from "@discordx/pagination";
import { supported_countries } from "../constants.ts";

// Define the Countries class that stores all country related commands
@Discord()
export abstract class Countries {
	// Define a command to handle listing all supported Ikea Countries in a paginated menu
	@Slash("countries", { description: "Pagination for supported Ikea countries to query" })
	async countries(interaction: CommandInteraction): Promise<void> {
		// Define the embed array
		var pages: MessageEmbed[] = [];

		// Iterate over the countries and handle accordingly
		for (var i = 0 ; i < supported_countries.length; i += 2) {
			// Create an array that will support holding the embedded fields
			var fields = [];

			// Push the first country data to the fields array
			fields.push(
				{ name: 'Name', value: `:flag_${supported_countries[i].code}: ${supported_countries[i].name}`, inline: true },
				{ name: 'Code', value: supported_countries[i].code, inline: true },
				{ name: 'Stores', value: supported_countries[i].stores.length.toString() || '0', inline: true },
			);

			// Check to see if there is a second country to handle
			if(supported_countries[i + 1] !== undefined) {
				// Push the second store data to the fields array
				fields.push(
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Name', value: `:flag_${supported_countries[i + 1].code}: ${supported_countries[i + 1].name}`, inline: true },
					{ name: 'Code', value: supported_countries[i + 1].code, inline: true },
					{ name: 'Stores', value: supported_countries[i + 1].stores.length.toString() || '0', inline: true },
				);
			}
			
			// Push the formatted embed to the pages array
			pages.push(
				new MessageEmbed()
				.setFooter({ text: `Page ${Math.ceil((i / 2)) + 1} of ${Math.ceil(supported_countries.length / 2)}` })
				.setTitle(`**Supported Ikea Countries**`)
				.addFields(fields)
			);
		}

		// Define and return the paginated menu of supported Countries
		const pagination = new Pagination(interaction, pages);
		await pagination.send();
	}
}
