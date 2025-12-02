import { Harmonix, HarmonixPlugin } from '@harmonixjs/core';
import { Database } from './Database';

/** 
 * Configuration options for the DatabasePlugin.
 * @property filePath - Optional path to the SQLite database file. Defaults to 'database.sqlite'.
 */
export interface DatabasePluginConfig {
    filePath?: string;
}

/** 
 * DatabasePlugin class implementing HarmonixPlugin.
 * Provides access to multiple Database instances and manages initialization checks.
 */
export class DatabasePlugin implements HarmonixPlugin {
    /** Name of the plugin */
    name = 'database';

    /** Path to the database file */
    private filePath: string;

    /** Map of table names to Database instances */
    private tables: Map<string, Database<any>> = new Map();

    /** 
     * Initializes the DatabasePlugin with optional configuration.
     * @param config - Optional plugin configuration.
     */
    constructor(config: DatabasePluginConfig = {}) {
        this.filePath = config.filePath ?? 'database.sqlite';
    }

    /** 
     * Initializes the plugin and checks for required dependencies.
     * @param bot - The Harmonix bot instance.
     * @throws Error if required packages 'quick.db' or 'better-sqlite3' are not installed.
     */
    init(bot: Harmonix): Promise<void> | void {
        try {
            require.resolve('quick.db');
        } catch {
            throw new Error(
                '❌ quick.db is required\n' +
                'Install it with: npm install quick.db'
            );
        }

        try {
            require.resolve('better-sqlite3');
        } catch {
            throw new Error(
                '❌ better-sqlite3 is required by quick.db\n' +
                'Install it with: npm install better-sqlite3'
            );
        }

        console.log('✅ DatabasePlugin initialized');
    }

    /** 
     * Returns a Database instance for the specified table.
     * If the table has already been accessed, returns the existing instance.
     * @template T - Type of the values stored in this table.
     * @param tableName - Name of the table.
     * @returns A Database instance for the given table with type T.
     */
    table<T = any>(tableName: string): Database<T> {
        if (this.tables.has(tableName)) {
            return this.tables.get(tableName)! as Database<T>;
        }

        const db = new Database({
            filePath: this.filePath,
            table: tableName
        });

        this.tables.set(tableName, db);
        return db;
    }

    /** 
     * Returns a list of all table names currently registered in the plugin.
     * @returns Array of table names.
     */
    getTables(): string[] {
        return Array.from(this.tables.keys());
    }

    /** 
     * Closes the plugin and clears all stored Database instances.
     */
    async close(): Promise<void> {
        this.tables.clear();
    }
}