import { PlayerData, LeaderboardEntry, GlobalStats } from '../types';
import { DB_INFO } from '../constants';

export const fetchPlayerData = async (username: string, baseUrl: string): Promise<PlayerData | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${baseUrl}/api/player/${username}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return { ...data, balance: parseFloat(data.balance || 0) };
    }
  } catch (e) {}
  return null;
};

export const fetchLeaderboard = async (baseUrl: string): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/leaderboard`);
    if (response.ok) return await response.json();
  } catch (e) {}
  return [];
};

export const fetchGlobalStats = async (baseUrl: string): Promise<GlobalStats | null> => {
  try {
    const response = await fetch(`${baseUrl}/api/stats`);
    if (response.ok) return await response.json();
  } catch (e) {}
  return null;
};

export const PACKAGE_JSON_CODE = `{
  "name": "voidnest-economy-bridge",
  "version": "2.2.1",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.1",
    "cors": "^2.8.5"
  },
  "scripts": { "start": "node server.js" }
}`;

export const BRIDGE_CODE = `
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
app.use(cors());

const dbConfig = {
  host: "${DB_INFO.host}",
  user: "${DB_INFO.user}",
  password: "${DB_INFO.password}",
  database: "${DB_INFO.database}",
  port: ${DB_INFO.port}
};

const nameCols = ['username', 'player_name', 'name', 'player_uuid', 'uuid', 'player'];
const balCols = ['balance', 'money', 'coins', 'amount', 'val', 'balance_value'];

async function findEconomyTable(connection) {
    const [tableRows] = await connection.execute("SHOW TABLES");
    const dbName = dbConfig.database;
    const allTables = tableRows.map(row => Object.values(row)[0]);
    const targetTables = allTables.filter(t => ['account','coin','eco','money','user','player','balance','data'].some(k => t.toLowerCase().includes(k)));

    for (const table of targetTables) {
      try {
        const [cols] = await connection.execute("DESCRIBE " + table);
        const colNames = cols.map(c => c.Field.toLowerCase());
        const activeNameCol = nameCols.find(n => colNames.includes(n));
        const activeBalCol = balCols.find(b => colNames.includes(b));
        if (activeNameCol && activeBalCol) return { table, nameCol: activeNameCol, balCol: activeBalCol };
      } catch (e) {}
    }
    return null;
}

app.get('/api/stats', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const info = await findEconomyTable(connection);
    if (!info) return res.status(404).send('No table');
    const [row] = await connection.execute("SELECT SUM(CAST(" + info.balCol + " AS DECIMAL(65,2))) as total, COUNT(*) as count FROM " + info.table);
    res.json({ totalBalance: parseFloat(row[0].total || 0), accountCount: parseInt(row[0].count || 0) });
  } catch (err) { res.status(500).json({ error: err.message }); }
  finally { if (connection) await connection.end().catch(()=>{}); }
});

app.get('/api/leaderboard', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const info = await findEconomyTable(connection);
    const [rows] = await connection.execute("SELECT " + info.nameCol + " AS username, " + info.balCol + " AS balance FROM " + info.table + " ORDER BY CAST(" + info.balCol + " AS DECIMAL(65,2)) DESC LIMIT 5");
    res.json(rows.map((r, i) => ({ username: r.username, balance: parseFloat(r.balance), rank: i + 1 })));
  } catch (err) { res.status(500).json({ error: err.message }); }
  finally { if (connection) await connection.end().catch(()=>{}); }
});

app.get('/api/player/:name', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const info = await findEconomyTable(connection);
    const [rows] = await connection.execute("SELECT * FROM " + info.table + " WHERE LOWER(" + info.nameCol + ") = LOWER(?) LIMIT 1", [req.params.name]);
    if (rows.length) {
      const u = rows[0];
      res.json({ username: u[Object.keys(u).find(k=>k.toLowerCase()===info.nameCol)], balance: parseFloat(u[Object.keys(u).find(k=>k.toLowerCase()===info.balCol)]) });
    } else res.status(404).send('Not found');
  } catch (err) { res.status(500).json({ error: err.message }); }
  finally { if (connection) await connection.end().catch(()=>{}); }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
`;