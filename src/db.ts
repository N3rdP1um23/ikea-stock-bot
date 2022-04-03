/**
 *
 * April 02, 2022
 * N3rdP1um23
 * The following file is used to interface with the database file
 *
 */

// Import requirements
import Database from 'better-sqlite3';
import { Channel, Guild, User } from 'discord.js';
import * as fs from 'fs';
import { database_path, StockReminder } from './constants.ts';

// Create the reference to the database file
let db: any;

// Define an enum that holds the various errors from the DB
enum db_errors {
	MIGRATIONS_TABLE_MISSING,
	MIGRATION_PERFORMED,
	MIGRATION_NOT_PERFORMED,
}

// Used to store a list of migrations to perform on the database
const migrations = [
	`CREATE TABLE IF NOT EXISTS migrations (
		id INTEGER PRIMARY KEY,
		migration_id INTEGER UNIQUE,
		performed_on TEXT
	)`,
	`CREATE TABLE IF NOT EXISTS reminders (
		id INTEGER PRIMARY KEY,
		user TEXT,
		channel TEXT,
		guild TEXT,
		ikea_store_id TEXT,
		ikea_article TEXT,
		created_at TEXT
	)`,
];

// Export the reuqired functions
export default class Db {
	// The following method is used to handle initializing the physical database
	static initializeDatabase() {
		// Check to see if the data directory doesn't exist
		if (!fs.existsSync('data')) {
			// Create the data folder
			fs.mkdirSync('data');
		}

		// Check to see if the database file exists
		if (!fs.existsSync(database_path)) {
			// Create the database file
			fs.writeFile(database_path, '', { flag: 'wx' }, (err) => {
				// Check to see if there was an error
				if (err) {
					// Throw the error
					throw err;
				}
			});
		}

		// Create the database instance
		db  = new Database(database_path);

		// Call the function to perform any migrations
		this.migrate();
	}

	// The following method is used to handle checking if a respective migration has been performed
	static hasPerformedMigration(migration_id: Number): db_errors {
		// Try and handle any errors while checking to see if the migrations table exists
		try {
			// Check to see if the migrations table doesn't exist
			db.exec('SELECT * FROM migrations');
		}catch (error) {
			// Return false as the migrations table doesn't exist
			return db_errors.MIGRATIONS_TABLE_MISSING;
		}

		// Check to see if the request migration_id has already been performed
		if(db.prepare('SELECT * FROM migrations WHERE migration_id = ?').get(migration_id) != undefined) {
			// Return true as the migration has already been performed
			return db_errors.MIGRATION_PERFORMED;
		}

		// Return false as the respective migration hasn't been performed yet
		return db_errors.MIGRATION_NOT_PERFORMED;
	}

	// The following function is used to handle checking and performing a respective migration
	static migrate() {
		// Iterate over each of the migrations
		for (const migration of migrations) {
			// Grab the migration index and status of if the migration has been performed
			const migration_index = migrations.indexOf(migration);
			const migration_status = this.hasPerformedMigration(migration_index);

			// Check to see if the following migration hasn't been performed
			if (migration_status == db_errors.MIGRATIONS_TABLE_MISSING || migration_status == db_errors.MIGRATION_NOT_PERFORMED) {
				// Execute the migration
				db.exec(migration);

				// Insert a new entry to list that the migration has bee performed
				db.prepare('INSERT INTO migrations (migration_id, performed_on) VALUES (?, ?)').run(migration_index, Date.now().toString());
			}
		}
	}

	// The following function is used to handle checking if a user already has a stock alert
	static userHasReminder(user: User, ikea_store_id: string, ikea_article: string, channel?: Channel, guild?: Guild): boolean {
		// Check to see if the reminder already exists
		return (db.prepare('SELECT * FROM reminders WHERE user = ? AND ikea_store_id = ? AND ikea_article = ?').get(user.id, ikea_store_id, ikea_article) != undefined);
	}

	// The following function is used to handle setting a users reminder
	static userSetReminder(user: User, ikea_store_id: string, ikea_article: string, channel?: Channel, guild?: Guild): boolean {
		// Check to see if the reminder already exists
		if(!this.userHasReminder(user, ikea_store_id, ikea_article)) {
			// Perform the reminder addition
			db.prepare('INSERT INTO reminders (user, channel, guild, ikea_store_id, ikea_article, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(user.id.toString(), channel?.id.toString(), guild?.id.toString(), ikea_store_id, ikea_article, Date.now().toString());

			// Return true as the reminder has been set
			return true;
		}

		// Return that the reminder has already been set
		return false;
	}

	// The following function is used to handle setting a users reminder
	static userRemoveReminder(user: User, ikea_store_id: string, ikea_article: string, channel?: Channel, guild?: Guild): boolean {
		// Check to see if the reminder already exists
		if(this.userHasReminder(user, ikea_store_id, ikea_article)) {
			// Perform the reminder addition
			db.prepare('DELETE FROM reminders WHERE user = ? AND ikea_store_id = ? AND ikea_article = ?').run(user.id.toString(), ikea_store_id, ikea_article);

			// Return true as the reminder has been set
			return true;
		}

		// Return that the reminder has already been set
		return false;
	}

	// The following function is used to handle returning an array of all reminders
	static getReminders(): StockReminder[] {
		// Get and return all of the entries from the database
		return db.prepare('SELECT * FROM reminders').all() || [];
	}
}