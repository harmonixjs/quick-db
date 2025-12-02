# @harmonixjs/quick-db

Simple and flexible Quick.db plugin for Harmonix Discord framework.

## Installation

```bash
npm install @harmonixjs/quick-db quick.db better-sqlite3
```

## Quick Start

```typescript
import { Harmonix } from "@harmonixjs/core";
import { DatabasePlugin } from '@harmonixjs/quick-db';

const bot = new Bot({
  bot: {
    id: "YOUR_BOT_CLIENT_ID",
    token: "YOUR_BOT_TOKEN"
  },
  publicApp: true,
  folders: {
    commands: "./src/commands",
    events: "./src/events",
    components: "./src/components"
  },
  intents: [3249151],
  plugins: [
    new DatabasePlugin({
        filePath: './data/database.sqlite'
    })
  ]
});

// OR
bot.use(new DatabasePlugin({...}))

bot.start();
```

## Usage

### Define your own types

```typescript
// types/User.ts
export interface User {
  discordId: string;
  username: string;
  coins: number;
  level: number;
}

// types/Guild.ts
export interface Guild {
  guildId: string;
  prefix: string;
  language: string;
  premium: boolean;
}
```

### Create typed tables

```typescript
import { User } from './types';

// Create tables with your types
const users = bot.database.table('users');

// Everything is typed!
await users.set('user_123', {
  discordId: '123',
  username: 'John',
  coins: 100,
  level: 5,
});

const user = await users.get('user_123');
// user is typed as User | null
```

### Basic Operations

```typescript
// Set
await users.set('user_123', { ... });

// Get
const user = await users.get('user_123');

// Get typed (returns null instead of undefined)
const user = await users.getTyped('user_123');

// Update partial
await users.update('user_123', { coins: 200 });

// Delete
await users.delete('user_123');

// Check existence
const exists = await users.exists('user_123');

// Count
const count = await users.count();

// Get all
const allUsers = await users.getAllTyped();

// Clear table
await users.clear();
```

### Advanced Queries

```typescript
// Find one
const richUser = await users.findOne(user => user.coins > 1000);

// Find many
const premiumGuilds = await guilds.findMany(guild => guild.premium === true);

// Filter and sort
const topUsers = (await users.getAllTyped())
  .sort((a, b) => b.value.coins - a.value.coins)
  .slice(0, 10);
```

## API Reference

### DatabasePlugin

#### Constructor
```typescript
new DatabasePlugin(config?: DatabasePluginConfig)
```

**Config:**
- `filePath?: string` - Database file path (default: `./data/database.sqlite`)

#### Methods

**`table<T>(name: string): Database<T>`**  
Create or get a typed table.

**`getTables(): string[]`**  
List all created tables.

**`close(): Promise<void>`**  
Close all connections.

### Database\<T\>

#### Properties
- `table: string` - Table name

#### Methods

**`get(key: string): Promise<T>`**  
Get value from Quick.db.

**`set(key: string, value: T): Promise<T>`**  
Set value.

**`delete(key: string): Promise<number>`**  
Delete key.

**`update(key: string, updates: Partial<T>): Promise<T | null>`**  
Update partial value.

**`exists(key: string): Promise<boolean>`**  
Check if key exists.

**`all(): Promise<Array<{ id: string; value: T }>>`**  
Get all entries.

**`findOne(predicate): Promise<T | null>`**  
Find one entry matching condition.

**`findMany(predicate): Promise<Array<T>>`**  
Find all entries matching condition.

**`count(): Promise<number>`**  
Count entries.

**`clear(): Promise<void>`**  
Clear entire table.

## Philosophy

**@harmonixjs/quick-db** is intentionally minimal. It provides:
- ✅ Type-safe database access
- ✅ Simple API wrapping Quick.db
- ✅ Full flexibility

It does NOT provide:
- ❌ Pre-defined schemas (User, Guild, etc.)
- ❌ Complex ORM features
- ❌ Migrations or validators

**You define your own types and logic.** The plugin just makes Quick.db easier and type-safe.

## License

MIT © HarmonixJS