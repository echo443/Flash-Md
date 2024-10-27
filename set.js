const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQU95UUd6UUlhbVZnVm13VzJvY0wzdE4xNU5XVE5sb0N3RHBEaDdod08zcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQkFmZHlyR1VIR1RNTmJMMDBhU0ptN3RuY0kwR2lBS2VYVWZUL3BRYUJpOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwSDUrRGpSeGFpSk90UDBtVzBLNnBYcWlybTgreDZpNm5xbEt3SUQ3M2tJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJsUzUxU25scDAyTkcxUUdwRGlyaUU4WHkwNGxlV3RyUGpyMmpiZDhSY3pvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdQdHlIZVQ3NjJieDI0czhWRVFMZ1NpY1k1dFR0b2RwL3ZOSlMzMGtmbkE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImYrVUhiK2k3YkRqUDF3NnFQUGd4K1JNUEhYNmliNSt3UDExT1RWSVQ1eHM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU0VXb2xzUUFEYnU0SFNWclMvTTd1cVZoYzRNYU9tVlBFWW8wSXVzZVFrbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSjAwQ3J6dFV3eHNEY2tSZjVscVVyd3FCYWtXMU1scWZ2UjdBUjQyUzdXcz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlB1RkRGS2psZXRRUkFJekNER1B0cDdHQ2QvdkRsNmx1bWR6MzRYekxkaU5WZmx4TDI4aUV3OVQ4bTcweEx4Yi9FdnptaGp4UG1xa3VXRU90VGpRdER3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6ODUsImFkdlNlY3JldEtleSI6IlVwVmZ2VWxFTVhJK1ZLM0hBWThFbGdKMVFWc05ZMmZmOUpnNEptUGhDWTQ9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Ii1qaEpDQWI1U3NPOXppekVaMnJ6c3ciLCJwaG9uZUlkIjoiYmE4ZWIzN2ItMTc0MC00NTk0LWE4ODQtZjVkZmQzZTNhN2M4IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlZvaEpXRzJUUGs3a053UTZLeUlFU2tkQjB3bz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3WFNSSWZ3VE9qVU9ZODg0dEVxR082aEVNeEU9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiRTRTTERXN0giLCJtZSI6eyJpZCI6IjI1NDc5NDA2NDU1NzozNUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTmlrZ3QwREVNSzM5N2dHR0EwZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMzZKcUVTdUZveFVwVThpZzlBVU1BTU83aFFjU25KYmFuQTRtWXF4YjVuZz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiUzNxQTVDbksrUUl2TExTWDJuSXc5djFYbGI3disyVlArNzhsK0d5eW5CREdSQ05UQURIVVovNDlzajhYelNMZXFoL2dBU0krVHVwZnRhVTdYREpQQUE9PSIsImRldmljZVNpZ25hdHVyZSI6InBOVjB0T2w3N1RtclVZaDRMTFJkd2xmSlQ4NzZwTkd5dEs5RmdVeUVHeDFkZTZYUmdjNGZmL2RvR0w3c2pCV0FnVUhkZldTb2IxMnJiMG5XSmRHdkJBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0Nzk0MDY0NTU3OjM1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmQraWFoRXJoYU1WS1ZQSW9QUUZEQUREdTRVSEVweVcycHdPSm1Lc1crWjQifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzAwMTAwNjQsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBRUFZIn0=',
    PREFIXES: (process.env.PREFIX || ',').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "flower md",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254794064557",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
