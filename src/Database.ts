import { QuickDB } from "quick.db";

/** 
 * Database configuration.
 * @property filePath - Path to the database file.
 * @property table - Name of the table to use.
 */
export interface DatabaseConfig {
    filePath: string;
    table: string;
}

/** 
 * Database class extending QuickDB to provide utility methods.
 * @template T - Type of the stored values.
 */
export class Database<T = any> extends QuickDB<T> {

    /** 
     * Initializes the database with the specified file and table.
     * @param config - Database configuration.
     */
    constructor(config: DatabaseConfig) {
        super({
            filePath: config.filePath,
            table: config.table
        });
    }

    /** 
     * Finds the first item that matches the given predicate.
     * @param predicate - Filter function receiving (value, id) and returning a boolean.
     * @returns The first matching value or null if no item is found.
     */
    async findOne(predicate: (value: T, id: string) => boolean): Promise<T | null> {
        const all = await this.all();
        return all.find(item => predicate(item.value, item.id))?.value ?? null;
    }

    /** 
     * Finds all items that match the given predicate.
     * @param predicate - Filter function receiving (value, id) and returning a boolean.
     * @returns An array of matching values.
     */
    async findMany(predicate: (value: T, id: string) => boolean): Promise<Array<T>> {
        const all = await this.all();
        return all
            .filter(item => predicate(item.value, item.id))
            .map(item => item.value);
    }

    /** 
     * Counts the total number of items in the table.
     * @returns The total number of items.
     */
    async count(): Promise<number> {
        const all = await this.all();
        return all.length;
    }

    /** 
     * Checks if a key exists in the database.
     * @param key - The key to check.
     * @returns True if the key exists, false otherwise.
     */
    async exists(key: string): Promise<boolean> {
        return await super.has(key);
    }

    /** 
     * Clears all items from the table.
     */
    async clear(): Promise<void> {
        await super.deleteAll();
    }

    /** 
     * Updates an existing item with the provided values.
     * @param key - The key of the item to update.
     * @param updates - Partial values to merge with the existing item.
     * @returns The updated item or null if the key does not exist.
     */
    async update(key: string, updates: Partial<T>): Promise<T | null> {
        const value = await this.get(key);
        if (!value) return null;

        const updated = { ...value, ...updates };
        return await this.set(key, updated);
    }
}