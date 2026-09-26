export interface Player {
  id: string;
  name: string;
  nickname: string;
  phone?: string;
  primaryPositionId: string;
  secondaryPositionId?: string;
  active: boolean;
  available: boolean;
  monthlyFee?: number;
  perGameFee?: number;
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  order: number;
  active: boolean;
}

export interface Formation {
  id: string;
  name: string;
  slots: FormationSlot[];
}

export interface FormationSlot {
  id: string;
  positionId: string;
  x: number;
  y: number;
  label: string;
}

export interface Match {
  id: string;
  date: string;
  location?: string;
  observation?: string;
  status: 'scheduled' | 'finished' | 'cancelled';
  teams: Team[];
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  formationId?: string;
  playerIds: string[];
}

export interface Payment {
  id: string;
  playerId: string;
  type: 'monthly' | 'game' | 'extra' | 'other';
  reference: string;
  amount: number;
  status: 'pending' | 'paid' | 'exempt' | 'overdue';
  method?: 'pix' | 'cash' | 'card' | 'other';
  dueDate: string;
  paidDate?: string;
  observation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  matchId: string;
  playerId: string;
  quantity: number;
  minute?: number;
  observation?: string;
  createdAt: string;
}

export interface Assist {
  id: string;
  matchId: string;
  playerId: string;
  observation?: string;
  createdAt: string;
}

export interface AppSettings {
  teamName: string;
  teamNickname: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'light' | 'dark';
  defaultFormationId: string;
  defaultPaymentAmount: number;
  seasonName: string;
  headerText: string;
  footerText: string;
  modulesEnabled: {
    players: boolean;
    payments: boolean;
    goals: boolean;
    assists: boolean;
    matches: boolean;
    draw: boolean;
    virtualField: boolean;
  };
}

export interface DrawConfig {
  date: string;
  availablePlayerIds: string[];
  numberOfTeams: number;
  teamNames: string[];
  teamColors: string[];
  formationId: string;
  balanceByPosition: boolean;
  distributeGoalkeepers: boolean;
}

export interface DrawResult {
  teams: Team[];
  config: DrawConfig;
  createdAt: string;
}
