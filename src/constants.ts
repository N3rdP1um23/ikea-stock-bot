/**
 *
 * March 28, 2022
 * N3rdP1um23
 * The following file is used to store various constants used throughout the bot
 *
 */

// Import the required files
import * as ikea_stores from "../node_modules/ikea-availability-checker/source/lib/stores.js";

// Define the database file path
export const database_path: string = "data/database.db";

// Define a Country type
export type Country = {
  code: string;
  name: string;
  stores: any[];
  language: string;
};

// Define a Store type
export type Store = {
  buCode: string;
  name: string;
  coordinates: Number[];
  countryCode: string;
};

// Define the StockReminder type
export type StockReminder = {
  id: number;
  user: string;
  channel: string;
  guild: string;
  ikea_store_id: string;
  ikea_article: string;
  created_at: string;
};

// Define the array of supported stores
export const supported_stores: Store[] = ikea_stores.default.data;

// Define the array of supported countries
export const supported_countries: Country[] = [
  {
    code: "au",
    name: "Australia",
    stores: ikea_stores.default
      .findByCountryCode("au")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("au"),
  },
  {
    code: "at",
    name: "Austria",
    stores: ikea_stores.default
      .findByCountryCode("at")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("at"),
  },
  {
    code: "be",
    name: "Belgium",
    stores: ikea_stores.default
      .findByCountryCode("be")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("be"),
  },
  {
    code: "ca",
    name: "Canada",
    stores: ikea_stores.default
      .findByCountryCode("ca")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("ca"),
  },
  {
    code: "cn",
    name: "China",
    stores: ikea_stores.default
      .findByCountryCode("cn")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("cn"),
  },
  {
    code: "hr",
    name: "Croatia",
    stores: ikea_stores.default
      .findByCountryCode("hr")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("hr"),
  },
  {
    code: "cz",
    name: "Czech Republic",
    stores: ikea_stores.default
      .findByCountryCode("cz")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("cz"),
  },
  {
    code: "dk",
    name: "Denmark",
    stores: ikea_stores.default
      .findByCountryCode("dk")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("dk"),
  },
  {
    code: "fi",
    name: "Finland",
    stores: ikea_stores.default
      .findByCountryCode("fi")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("fi"),
  },
  {
    code: "fr",
    name: "France",
    stores: ikea_stores.default
      .findByCountryCode("fr")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("fr"),
  },
  {
    code: "de",
    name: "Germany",
    stores: ikea_stores.default
      .findByCountryCode("de")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("de"),
  },
  {
    code: "hk",
    name: "Hong Kong",
    stores: ikea_stores.default
      .findByCountryCode("hk")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("hk"),
  },
  {
    code: "hu",
    name: "Hungary",
    stores: ikea_stores.default
      .findByCountryCode("hu")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("hu"),
  },
  {
    code: "ie",
    name: "Ireland",
    stores: ikea_stores.default
      .findByCountryCode("ie")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("ie"),
  },
  {
    code: "it",
    name: "Italy",
    stores: ikea_stores.default
      .findByCountryCode("it")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("it"),
  },
  {
    code: "jp",
    name: "Japan",
    stores: ikea_stores.default
      .findByCountryCode("jp")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("jp"),
  },
  {
    code: "jo",
    name: "Jordan",
    stores: ikea_stores.default
      .findByCountryCode("jo")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("jo"),
  },
  {
    code: "kw",
    name: "Kuwait",
    stores: ikea_stores.default
      .findByCountryCode("kw")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("kw"),
  },
  {
    code: "lt",
    name: "Lithuania",
    stores: ikea_stores.default
      .findByCountryCode("lt")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("lt"),
  },
  {
    code: "my",
    name: "Malaysia",
    stores: ikea_stores.default
      .findByCountryCode("my")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("my"),
  },
  {
    code: "nl",
    name: "Netherlands",
    stores: ikea_stores.default
      .findByCountryCode("nl")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("nl"),
  },
  {
    code: "no",
    name: "Norway",
    stores: ikea_stores.default
      .findByCountryCode("no")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("no"),
  },
  {
    code: "pl",
    name: "Poland",
    stores: ikea_stores.default
      .findByCountryCode("pl")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("pl"),
  },
  {
    code: "pt",
    name: "Portugal",
    stores: ikea_stores.default
      .findByCountryCode("pt")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("pt"),
  },
  {
    code: "qa",
    name: "Qatar",
    stores: ikea_stores.default
      .findByCountryCode("qa")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("qa"),
  },
  {
    code: "ro",
    name: "Romania",
    stores: ikea_stores.default
      .findByCountryCode("ro")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("ro"),
  },
  {
    code: "ru",
    name: "Russia",
    stores: ikea_stores.default
      .findByCountryCode("ru")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("ru"),
  },
  {
    code: "sa",
    name: "Saudi Arabia",
    stores: ikea_stores.default
      .findByCountryCode("sa")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("sa"),
  },
  {
    code: "sg",
    name: "Singapore",
    stores: ikea_stores.default
      .findByCountryCode("sg")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("sg"),
  },
  {
    code: "sk",
    name: "Slovakia",
    stores: ikea_stores.default
      .findByCountryCode("sk")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("sk"),
  },
  {
    code: "kr",
    name: "South Korea",
    stores: ikea_stores.default
      .findByCountryCode("kr")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("kr"),
  },
  {
    code: "es",
    name: "Spain",
    stores: ikea_stores.default
      .findByCountryCode("es")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("es"),
  },
  {
    code: "se",
    name: "Sweden",
    stores: ikea_stores.default
      .findByCountryCode("se")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("se"),
  },
  {
    code: "ch",
    name: "Switzerland",
    stores: ikea_stores.default
      .findByCountryCode("ch")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("ch"),
  },
  {
    code: "tw",
    name: "Taiwan",
    stores: ikea_stores.default
      .findByCountryCode("tw")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("tw"),
  },
  {
    code: "th",
    name: "Thailand",
    stores: ikea_stores.default
      .findByCountryCode("th")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("th"),
  },
  {
    code: "gb",
    name: "United Kingdom",
    stores: ikea_stores.default
      .findByCountryCode("gb")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("gb"),
  },
  {
    code: "us",
    name: "United States",
    stores: ikea_stores.default
      .findByCountryCode("us")
      .sort((store_a: Store, store_b: Store) =>
        store_a.name.localeCompare(store_b.name)
      ),
    language: ikea_stores.default.getLanguageCode("us"),
  },
];

// Define a function to handle getting a country by country_code
export function getCountry(country_code: string) {
  // Retun the respective country code
  return supported_countries.find(
    (country: Country) => country.code == country_code.toLowerCase().trim()
  );
}

// Export the different stock option colors
export enum stock_status_colours {
  HIGH_IN_STOCK = "#0CC079",
  MEDIUM = "#FCFC99",
  LOW = "#FB6962",
  OUT_OF_STOCK = "#FB6962",
}

// Export the different stock option icons
export enum stock_status_icon {
  HIGH_IN_STOCK = ":green_circle:",
  MEDIUM = ":yellow_circle:",
  LOW = ":red_circle:",
  OUT_OF_STOCK = ":red_circle:",
}
