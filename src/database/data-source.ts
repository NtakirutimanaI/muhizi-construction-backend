import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// 2. Default definition for when no string is available (Local fallback)
const LOCAL_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '123Rw@nd@',
    database: process.env.DB_DATABASE || 'profile_db',
};

export const AppDataSource = new DataSource({
    type: 'postgres',
    // Use connection string if available, otherwise fall back to individual credentials
    ...(CONNECTION_STRING
        ? { url: CONNECTION_STRING }
        : LOCAL_CONFIG
    ),
    ssl: CONNECTION_STRING ? { rejectUnauthorized: false } : false, // Enable SSL for cloud DBs
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false, // Disable synchronize for manual control (migrations recommended in prod)
    logging: true,
});

// To initialize this datasource in your code:
// AppDataSource.initialize().then(() => console.log("Connected!")).catch(console.error);
