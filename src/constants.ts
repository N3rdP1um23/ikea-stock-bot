/**
 *
 * March 28, 2022
 * N3rdP1um23
 * The following file is used to store various constants used throughout the bot
 *
 */

// Import the required files
import * as store_data from "./data/stores.json" assert { type: 'json' };

// Define a Country type
export type Country = {
	code: string;
	name: string;
	stores: any[]
};

// Define a Store type
export type Store = {
	buCode: string;
	name: string;
	coordinates: Number[];
	countryCode: string;
};

// Define the array of supported stores
export const supported_stores: Store[] = store_data.default;

// Define the array of supported countries
export const supported_countries: Country[] = [
	{
		code: 'au',
		name: 'Australia',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'au').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'at',
		name: 'Austria',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'at').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'be',
		name: 'Belgium',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'be').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'ca',
		name: 'Canada',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'ca').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'cn',
		name: 'China',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'cn').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'hr',
		name: 'Croatia',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'hr').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'cz',
		name: 'Czech Republic',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'cz').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'dk',
		name: 'Denmark',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'dk').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'fi',
		name: 'Finland',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'fi').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'fr',
		name: 'France',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'fr').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'de',
		name: 'Germany',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'de').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'hk',
		name: 'Hong Kong',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'hk').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'hu',
		name: 'Hungary',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'hu').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'ie',
		name: 'Ireland',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'ie').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'it',
		name: 'Italy',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'it').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'jp',
		name: 'Japan',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'jp').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'jo',
		name: 'Jordan',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'jo').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'kw',
		name: 'Kuwait',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'kw').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'lt',
		name: 'Lithuania',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'lt').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'my',
		name: 'Malaysia',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'my').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'nl',
		name: 'Netherlands',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'nl').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'no',
		name: 'Norway',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'no').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'pl',
		name: 'Poland',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'pl').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'pt',
		name: 'Portugal',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'pt').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'qa',
		name: 'Qatar',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'qa').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'ro',
		name: 'Romania',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'ro').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'ru',
		name: 'Russia',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'ru').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'sa',
		name: 'Saudi Arabia',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'sa').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'sg',
		name: 'Singapore',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'sg').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'sk',
		name: 'Slovakia',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'sk').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'kr',
		name: 'South Korea',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'kr').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'es',
		name: 'Spain',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'es').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'se',
		name: 'Sweden',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'se').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'ch',
		name: 'Switzerland',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'ch').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'tw',
		name: 'Taiwan',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'tw').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'th',
		name: 'Thailand',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'th').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'gb',
		name: 'United Kingdom',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'gb').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
	{
		code: 'us',
		name: 'United States',
		stores: supported_stores.filter((store: Store) => store.countryCode == 'us').sort((store_a: Store, store_b: Store) => store_a.name.localeCompare(store_b.name))
	},
];