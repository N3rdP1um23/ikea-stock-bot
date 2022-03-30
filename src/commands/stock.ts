/**
 *
 * March 30, 2022
 * N3rdP1um23
 * The following file is used to handle any commands related to stock interaction
 *
 */

// Import required packages
import { CommandInteraction, EmbedFieldData, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Pagination } from "@discordx/pagination";
import { stock_status_colourss, stock_status_icon } from "../constants.ts";
import * as ikea_checker from "ikea-availability-checker";
import * as ikea_stores from "../../node_modules/ikea-availability-checker/source/lib/stores.js";

// Define the Stock class that stores all stock related commands
@Discord()
@SlashGroup({name: 'stock', description: 'Display stock information.'})
@SlashGroup('stock')
export abstract class Stock {
	// Define the command that's used to grab stock information for a given store and article
	@Slash()
	async store(@SlashOption("store_id") store_id: string, @SlashOption("article_number") article_number: string, interaction: CommandInteraction): Promise<void> {
		// GRab the respective store and format the article number accordingly
		const store = ikea_stores.default.findOneById(store_id);
		const article = article_number.replaceAll('.', '').trim();

		// Check to see if the requred store exists
		if (!store) {
			// Reply with an error message
			await interaction.reply('Oops... That store wasn\'t found. Try `/store country country_code:` (where `country_code` is the countries respective "code" which can be found using the `/countries` command) to view a list of all stores for a given country.');

			// Return to stop further processing
			return;
		}

		// Check to see if the article number is invalid
		if((article.toLowerCase().startsWith('s') && article.length != 9) || (/^\d+$/.test(article) && article.length != 8)) {
			// Reply with an error message
			await interaction.reply('Oops... That article number is invalid. Please try again. (looks something like s12345678 or 123.456.78 found either on the page or in the URL)');

			// Return to stop further processing
			return;
		}

		// Query for stock availability
		const item_stock = await Stock.checkAvailability(store.buCode, article);

		// Check to see if the item_stock is a string
		if(typeof item_stock === 'string' || item_stock instanceof String) {
			// Reply with the returned string
			await interaction.reply(item_stock.toString());

			// Return to stop further processing
			return;
		}

		// Variable to hold stock information
		var forecast_data: EmbedFieldData[] = [];

		// Push a spacer to the forecast data
		forecast_data.push({ name: '\u200B', value: '\u200B' });

		// Check to see if there is any forecast information
		if(item_stock.forecast.length > 0) {
			// Push the forecast header
			forecast_data.push({ name: 'Forecast', value: '--------' });

			// Iterate over the forecast information and provide
			item_stock.forecast.forEach((forecast: any) => {
				// Push the Spacer
				forecast_data.push({ name: '\u200B', value: '\u200B' });

				// Push the estimated stock
				forecast_data.push({ name: 'Estimated Stock', value: forecast.stock.toString() || '0', inline: true });

				// Push the estimated restock date
				forecast_data.push({ name: 'Estimated Restock', value: forecast.date.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' }), inline: true });

				// Push the estimated stock probability
				forecast_data.push({ name: 'Estimated Restock Probability', value: `${stock_status_icon[forecast.probability]} ${forecast.probability}`, inline: true });
			});
		}else{
			// Push the forecast header
			forecast_data.push({ name: 'Forecast', value: 'No forecast data available currently.' });
		}

		// Send the stock information
		await interaction.channel?.send({embeds: [
			new MessageEmbed()
			.setTitle(`**Ikea ${store.name} - ${article_number}**`)
			.setColor(stock_status_colourss[item_stock.probability])
			.addFields(
				{ name: 'Name', value: store.name, inline: true },
				{ name: 'Article', value: article_number, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Current Stock', value: item_stock.stock.toString() || '0', inline: true },
				{ name: 'Probability of Availability', value: `${stock_status_icon[item_stock.probability]} ${item_stock.probability}`, inline: true },
				{ name: 'Estimated Restock Date', value: ((item_stock.restockDate) ? item_stock.restockDate.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'), inline: true },
				...forecast_data
			)
			.setURL(`https://www.ikea.com/${store.countryCode}/en/search/products/?q=${item_stock.productId}`)
			.setFooter(`As of ${item_stock.createdAt.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' })} @ ${item_stock.createdAt.toLocaleTimeString([], {  hour12: false, hour: '2-digit', minute: '2-digit' })}`)
		]});
	}

	// The following function is used to handle querying for stock availability for an item based on the store
	static async checkAvailability(buCode: string, article: string): Promise<any> {
		// Try and query for stock availability
		try {
			// Check availability and return if successful
			return await ikea_checker.availability(buCode, article);
		} catch (error: any) {
			// Check to see if the item is deprecated
			if (error.res.headers.deprecation) {
				// Check to see if the item didn't start with an 's'
				if(!article.toLocaleLowerCase().startsWith('s')) {
					// Attempt querying again with an added s
					return Stock.checkAvailability(buCode, `s${article}`);
				}

				// Return with an error message
				return 'Oops... An item with that article number wasn\'t found. Please try again.';
			}

			// Check to see if the item wasn' found
			if (error.request.res.statusCode === 404) {
				// Return with an error message
				return 'Oops... An item with that article number wasn\'t found. Please try again.';
			}
		}
	}
}
