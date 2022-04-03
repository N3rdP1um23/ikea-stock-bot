/**
 *
 * March 30, 2022
 * N3rdP1um23
 * The following file is used to handle any commands related to stock interaction
 *
 */

// Import required packages
import { ButtonInteraction, Channel, CommandInteraction, EmbedFieldData, MessageActionRow, MessageButton, MessageComponent, MessageEmbed } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Pagination } from "@discordx/pagination";
import { stock_status_colours, stock_status_icon, getCountry, StockReminder } from "../constants.ts";
import * as ikea_checker from "ikea-availability-checker";
import * as ikea_stores from "../../node_modules/ikea-availability-checker/source/lib/stores.js";
import Db from "../db.ts";
import { client } from "../main.ts";

// Define the Stock class that stores all stock related commands
@Discord()
@SlashGroup({name: 'stock', description: 'Display stock information.'})
@SlashGroup('stock')
export abstract class Stock {
	// Define the command that's used to grab stock information for a given store and article
	@Slash()
	async store(@SlashOption("store_id", { description: "Store id to query against a single store", type: 'STRING', required: true }) store_id: string, @SlashOption("article_number", { description: "article number (123.456.78/12345678 or s12345678)", type: 'STRING', required: true }) article_number: string, interaction: CommandInteraction): Promise<any> {
		// GRab the respective store and format the article number accordingly
		const store = ikea_stores.default.findOneById(store_id);
		const country = getCountry(store.countryCode);
		let article = article_number.replaceAll('.', '').trim();

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

		// Reply with a general message that the results will be shared once available and that it can take a little bit
		await interaction.reply('Just processing the stock results now and will share them with you shortly!');

		// Query for stock availability
		let item_stock = await Stock.checkAvailability(store.buCode, article);

		// Check to see if the item has a slightly different article number
		if(typeof item_stock == 'object' && item_stock.stock !== undefined && item_stock.article !== undefined) {
			// Update the respective references
			article = item_stock.article;
			item_stock = item_stock.stock;
		}

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

		// Query to see if the user has already set a reminder for this store and article item
		const has_setup_reminder = Db.userHasReminder(interaction.user, store.buCode, article);

		// Send the stock information
		await interaction.channel?.send({
			components: [
				new MessageActionRow().addComponents([
					new MessageButton({
						customId: (!has_setup_reminder) ? 'set-stock-reminder' : 'unset-stock-reminder',
						label: (!has_setup_reminder) ? 'Set Stock Reminder' : 'Unset Stock Reminder',
						emoji: !(has_setup_reminder) ? '🔔' : '🔕',
						style: (!has_setup_reminder) ? 'PRIMARY' : 'PRIMARY',
						disabled: (!has_setup_reminder) ? false : false ,
					}),
				]),
			],
			embeds: [
				new MessageEmbed()
				.setURL(`https://www.ikea.com/${country.code}/${country.language}/p/-${article}`)
				.setColor(stock_status_colours[item_stock.probability])
				.setTitle(`**Ikea :flag_${country.code}: ${country.name} - ${store.name} - ${article} Stock**`)
				.setFooter({ text: `As of ${item_stock.createdAt.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' })} @ ${item_stock.createdAt.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}` })
				.addFields(
					{ name: 'Name', value: store.name, inline: true },
					{ name: 'Id', value: store.buCode, inline: true },
					{ name: 'Article', value: article, inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Current Stock', value: item_stock.stock.toString() || '0', inline: true },
					{ name: 'Probability of Availability', value: `${stock_status_icon[item_stock.probability]} ${item_stock.probability}`, inline: true },
					{ name: 'Estimated Restock Date', value: ((item_stock.restockDate) ? item_stock.restockDate.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'), inline: true },
					...forecast_data
				)
			]
		});
	}

	// Define the command that's used to grab stock information for a given country code and article
	@Slash()
	async country(@SlashOption("country_code", { description: "Country code to check stock of article for all stores in this country", type: 'STRING', required: true }) country_code: string, @SlashOption("article_number", { description: "article number (123.456.78/12345678 or s12345678)", type: 'STRING', required: true }) article_number: string, interaction: CommandInteraction): Promise<void> {
		// Grab the respective country and format the article number accordingly
		const country = getCountry(country_code);
		let article = article_number.replaceAll('.', '').trim();

		// Check to see if the requred country exists
		if (!country) {
			// Reply with an error message
			await interaction.reply('Oops... That country wasn\'t found. Try `/countries` to view a list of all countries and their respective country code.');

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

		// Reply with a general message that the results will be shared once available and that it can take a little bit
		await interaction.reply('Just processing the stock results now and will share them with you shortly!');

		// Create an object that will store the stores for the given country and their respcetive inventory
		var country_store_stock: {[key: string]: any} = {};

		// Iterate over each of the items in the countries array
		for (const store of country.stores) {
			// Query for the articles stock
			let item_stock = await Stock.checkAvailability(store.buCode, article);

			// Check to see if the item has a slightly different article number
			if(typeof item_stock == 'object' && item_stock.stock !== undefined && item_stock.article !== undefined) {
				// Update the respective references
				article = item_stock.article;
				item_stock = item_stock.stock;
			}

			// Check to see if the item_stock is valid and didn't return an error
			if(!(typeof item_stock === 'string' || item_stock instanceof String)) {
				// Add the respective stock information to the obejct
				country_store_stock[store.buCode] = item_stock;
			}
		}

		// Check to see if there's no stock information to list
		if (Object.keys(country_store_stock).length <= 0) {
			// Reply with an error message
			await interaction.reply('Oops... Unfortunately we\'re unable to display stock information for this article under this country as there\'s no stock information currently. Please try again later.');

			// Return to stop further processing
			return;
		}

		// Define the embed array
		var pages: any[] = [];

		// Iterate over the countries and handle accordingly
		for (const store_buCode in country_store_stock) {
			// Create a few required variables
			const store = ikea_stores.default.findOneById(store_buCode);
			const current_page = Object.keys(country_store_stock).indexOf(store_buCode);
			const total_pages = Object.keys(country_store_stock).length;
			const store_stock = country_store_stock[store_buCode];// Query to see if the user has already set a reminder for this store and article item
			const has_setup_reminder = Db.userHasReminder(interaction.user, store.buCode, article);

			// Push the formatted embed to the pages array
			pages.push({
				components: [
					new MessageActionRow().addComponents([
						new MessageButton({
							customId: (!has_setup_reminder) ? 'set-stock-reminder' : 'unset-stock-reminder',
							label: (!has_setup_reminder) ? 'Set Stock Reminder' : 'Unset Stock Reminder',
							emoji: !(has_setup_reminder) ? '🔔' : '🔕',
							style: (!has_setup_reminder) ? 'PRIMARY' : 'PRIMARY',
							disabled: (!has_setup_reminder) ? false : false ,
						}),
					]),
				],
				embeds: [
					new MessageEmbed()
					.setURL(`https://www.ikea.com/${country.code}/${country.language}/p/-${article}`)
					.setTitle(`**Ikea :flag_${country.code}: ${country.name} - ${store.name} - ${article} Stock**`)
					.setFooter({ text: `Page ${Math.ceil(current_page + 1)} of ${Math.ceil(total_pages)}` })
					.addFields(
						{ name: 'Name', value: store.name, inline: true },
						{ name: 'Id', value: store.buCode, inline: true },
						{ name: 'Article', value: article, inline: true },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Current Stock', value: store_stock.stock.toString() || '0', inline: true },
						{ name: 'Probability of Availability', value: `${stock_status_icon[store_stock.probability]} ${store_stock.probability}`, inline: true },
						{ name: 'Estimated Restock Date', value: ((store_stock.restockDate) ? store_stock.restockDate.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'), inline: true },
					)
				],
			});
		}

		// Notify the user that the stock results are ready
		await interaction.channel?.send(`<@${interaction.member?.user.id}> Your stock results are ready!`);

		// Define and return the paginated menu of supported Countries
		const pagination = new Pagination(interaction, pages);
		await pagination.send();
	}

	// Define the command that's used to grab stock information for a givel list of store ids and article number
	@Slash()
	async stores(@SlashOption("store_ids", { description: "Comma separated list of store ids to check the article stock", type: 'STRING', required: true }) store_ids: string, @SlashOption("article_number", { description: "article number (123.456.78/12345678 or s12345678)", type: 'STRING', required: true }) article_number: string, interaction: CommandInteraction): Promise<void> {
		// Format the article number accordingly
		let article = article_number.replaceAll('.', '').trim();
		var stores = [];

		// Iterate over each of the passed stores and format accordingly
		for (const store_id of store_ids.split(',')) {
			// Grab the store instance
			const store = ikea_stores.default.findOneById(store_id.trim());

			// Validate the store id
			if(!/^\d+$/.test(store_id.trim()) || store == undefined) {
				// Reply with an error message
				await interaction.reply(`Oops... Unfortunately, the following store id is invalid or cannot be found (**${store_id}**). Try \`/store country country_code:\` (where \`country_code\` is the countries respective "code" which can be found using the \`/countries\` command) to view a list of all stores for a given country.`);

				// Return to stop further processing
				return;
			}

			// Check to see if the store was found
			if(store) {
				// Push the store index to the stores array
				stores.push(store);
			}
		}

		// Check to see if the article number is invalid
		if((article.toLowerCase().startsWith('s') && article.length != 9) || (/^\d+$/.test(article) && article.length != 8)) {
			// Reply with an error message
			await interaction.reply('Oops... That article number is invalid. Please try again. (looks something like s12345678 or 123.456.78 found either on the page or in the URL)');

			// Return to stop further processing
			return;
		}

		// Reply with a general message that the results will be shared once available and that it can take a little bit
		await interaction.reply('Just processing the stock results now and will share them with you shortly!');

		// Create an object that will store the stores for the given country and their respcetive inventory
		var stores_stock: {[key: string]: any} = {};

		// Iterate over each of the items in the stores array
		for (const store of stores) {
			// Query for the articles stock
			let item_stock = await Stock.checkAvailability(store.buCode, article);

			// Check to see if the stock was found
			if(item_stock !== undefined) {
				// Check to see if the item has a slightly different article number
				if(typeof item_stock == 'object' && item_stock.stock !== undefined && item_stock.article !== undefined) {
					// Update the respective references
					article = item_stock.article;
					item_stock = item_stock.stock;
				}

				// Check to see if the item_stock is valid and didn't return an error
				if(!(typeof item_stock === 'string' || item_stock instanceof String)) {
					// Add the respective stock information to the obejct
					stores_stock[store.buCode] = item_stock;
				}
			}
		}

		// Check to see if there's no stock information to list
		if (Object.keys(stores_stock).length <= 0) {
			// Reply with an error message
			await interaction.reply('Oops... Unfortunately we\'re unable to display stock information for this article under these stores as there\'s no stock information currently. Please try again later.');

			// Return to stop further processing
			return;
		}

		// Define the embed array
		var pages: any[] = [];

		// Iterate over the countries and handle accordingly
		for (const store_buCode in stores_stock) {
			// Create a few required variables
			const store = ikea_stores.default.findOneById(store_buCode);
			const country = getCountry(store.countryCode);
			const current_page = Object.keys(stores_stock).indexOf(store_buCode);
			const total_pages = Object.keys(stores_stock).length;
			const store_stock = stores_stock[store_buCode];

			// Query to see if the user has already set a reminder for this store and article item
			const has_setup_reminder = Db.userHasReminder(interaction.user, store.buCode, article);

			// Push the formatted embed to the pages array
			pages.push({
				components: [
					new MessageActionRow().addComponents([
						new MessageButton({
							customId: (!has_setup_reminder) ? 'set-stock-reminder' : 'unset-stock-reminder',
							label: (!has_setup_reminder) ? 'Set Stock Reminder' : 'Unset Stock Reminder',
							emoji: !(has_setup_reminder) ? '🔔' : '🔕',
							style: (!has_setup_reminder) ? 'PRIMARY' : 'PRIMARY',
							disabled: (!has_setup_reminder) ? false : false ,
						}),
					]),
				],
				embeds: [
					new MessageEmbed()
					.setURL(`https://www.ikea.com/${country.code}/${country.language}/p/-${article}`)
					.setTitle(`**Ikea :flag_${country.code}: ${country.name} - ${store.name} - ${article} Stock**`)
					.setFooter({ text: `Page ${Math.ceil(current_page + 1)} of ${Math.ceil(total_pages)}` })
					.addFields(
						{ name: 'Name', value: store.name, inline: true },
						{ name: 'Id', value: store.buCode, inline: true },
						{ name: 'Article', value: article, inline: true },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Current Stock', value: store_stock.stock.toString() || '0', inline: true },
						{ name: 'Probability of Availability', value: `${stock_status_icon[store_stock.probability]} ${store_stock.probability}`, inline: true },
						{ name: 'Estimated Restock Date', value: ((store_stock.restockDate) ? store_stock.restockDate.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'), inline: true },
					)
				],
			});
		}

		// Notify the user that the stock results are ready
		await interaction.channel?.send(`<@${interaction.member?.user.id}> Your stock results are ready!`);

		// Define and return the paginated menu of supported Countries
		const pagination = new Pagination(interaction, pages);
		await pagination.send();
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
					return {
						stock: await Stock.checkAvailability(buCode, `s${article}`),
						article: `s${article}`
					};
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

	// Register the set stock reminder action
	@ButtonComponent("set-stock-reminder")
	setStockReminder(interaction: ButtonInteraction) {
		// Grab the respective store and article number
		const store_id = interaction.message.embeds[0].fields?.find(field => field.name == 'Id')?.value;
		const article = interaction.message.embeds[0].fields?.find(field => field.name == 'Article')?.value;

		// Handle adding the reminder
		const has_set_reminder = Db.userSetReminder(interaction.user, store_id, article, interaction.channel, interaction.guild);

		// Check and store the pagination button if they exist
		const pagination_buttons: any = (interaction.message.components && interaction.message.components.length > 1) ? interaction.message.components[1] : [];

		// Check to see if the reminder has been set
		if(has_set_reminder) {
			// Update the interaction to visually disable the button
			interaction.update({
				components: [
					new MessageActionRow().addComponents([
						new MessageButton({
							customId: 'set-stock-reminder',
							label: 'Reminder Set!',
							emoji: '👌',
							style: 'SUCCESS',
							disabled: true
						}),
						new MessageButton({
							customId: 'unset-stock-reminder',
							label: 'Unset Stock Reminder',
							emoji: '🔕',
							style: 'PRIMARY',
							disabled: false
						}),
					]),
					pagination_buttons
				]
			});
		}
	}

	// Register the unset stock reminder action
	@ButtonComponent("unset-stock-reminder")
	unsetStockReminder(interaction: ButtonInteraction) {
		// Grab the respective store and article number
		const store_id = interaction.message.embeds[0].fields?.find(field => field.name == 'Id')?.value;
		const article = interaction.message.embeds[0].fields?.find(field => field.name == 'Article')?.value;

		// Handle removing the reminder
		const has_unset_reminder = Db.userRemoveReminder(interaction.user, store_id, article, interaction.channel, interaction.guild);

		// Check and store the pagination button if they exist
		const pagination_buttons: any = (interaction.message.components && interaction.message.components.length > 1) ? interaction.message.components[1] : [];

		// Check to see if the reminder has been set
		if(has_unset_reminder) {
			// Update the interaction to visually disable the button
			interaction.update({
				components: [
					new MessageActionRow().addComponents([
						new MessageButton({
							customId: 'unset-stock-reminder',
							label: 'Reminder Remove!',
							emoji: '👌',
							style: 'SUCCESS',
							disabled: true
						}),
						new MessageButton({
							customId: 'set-stock-reminder',
							label: 'Set Stock Reminder',
							emoji: '🔔',
							style: 'PRIMARY',
							disabled: false
						}),
					]),
					pagination_buttons
				]
			});
		}
	}

	// The following function is used to handle handling reminders
	static async handleReminders() {
		// Grab all of the current offers from the database
		const reminders: StockReminder[] = Db.getReminders();

		// Iterate over each of the reminders and handling accordingly
		for (const reminder of reminders) {
			// Query for the articles stock
			const store = ikea_stores.default.findOneById(reminder.ikea_store_id);
			const country = getCountry(store.countryCode);

			// Query for the articles stock
			let item_stock = await Stock.checkAvailability(store.buCode, reminder.ikea_article);

			// Check to see if the item_stock is valid and didn't return an error
			if(!(typeof item_stock === 'string' || item_stock instanceof String)) {
				// Check to see if the item actually has stock
				if (item_stock.stock > 0) {
					client.channels.cache.get('772259249966809121').send({
						content: `Hey! <@${reminder.user}>! Looks like an item you had previously looked up is now in stock!`,
						embeds: [
							new MessageEmbed()
							.setURL(`https://www.ikea.com/${country.code}/${country.language}/p/-${reminder.ikea_article}`)
							.setTitle(`**Ikea :flag_${country.code}: ${country.name} - ${store.name} - ${reminder.ikea_article} Stock**`)
							.addFields(
								{ name: 'Name', value: store.name, inline: true },
								{ name: 'Id', value: store.buCode, inline: true },
								{ name: 'Article', value: reminder.ikea_article, inline: true },
								{ name: '\u200B', value: '\u200B' },
								{ name: 'Current Stock', value: item_stock.stock.toString() || '0', inline: true },
								{ name: 'Probability of Availability', value: `${stock_status_icon[item_stock.probability]} ${item_stock.probability}`, inline: true },
								{ name: 'Estimated Restock Date', value: ((item_stock.restockDate) ? item_stock.restockDate.toLocaleDateString(undefined,  { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'), inline: true },
							)
						],
						components: [
							new MessageActionRow().addComponents([
								new MessageButton({
									customId: 'unset-stock-reminder',
									label: 'Unset Stock Reminder',
									emoji: '🔕',
									style: 'PRIMARY',
									disabled: false ,
								}),
							]),
						],
					})
				}
			}
		}
	}
}