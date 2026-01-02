export interface PlayerData {
  uuid: string;
  username: string;
  balance: number;
  rank: number;
  lastSeen: string;
  transactionHistory: Transaction[];
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
}

export interface LeaderboardEntry {
  username: string;
  balance: number;
  rank: number;
}

export interface GlobalStats {
  totalBalance: number;
  accountCount: number;
  serverWealth: string;
}