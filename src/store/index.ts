import { v4 as uuidv4 } from 'uuid';
import type { Player, Position, Formation, Match, Payment, Goal, Assist, AppSettings, DrawResult } from '../types';

const STORAGE_KEYS = {
  players: 'ufc_players',
  positions: 'ufc_positions',
  formations: 'ufc_formations',
  matches: 'ufc_matches',
  payments: 'ufc_payments',
  goals: 'ufc_goals',
  assists: 'ufc_assists',
  settings: 'ufc_settings',
  draws: 'ufc_draws',
  auth: 'ufc_auth',
  initialized: 'ufc_initialized',
};

function get<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Default positions
const defaultPositions: Position[] = [
  { id: 'pos-gk', name: 'Goleiro', abbreviation: 'GOL', color: '#f59e0b', order: 1, active: true },
  { id: 'pos-cb', name: 'Zagueiro', abbreviation: 'ZAG', color: '#3b82f6', order: 2, active: true },
  { id: 'pos-fb', name: 'Lateral', abbreviation: 'LAT', color: '#8b5cf6', order: 3, active: true },
  { id: 'pos-dm', name: 'Volante', abbreviation: 'VOL', color: '#10b981', order: 4, active: true },
  { id: 'pos-mf', name: 'Meia', abbreviation: 'MEI', color: '#06b6d4', order: 5, active: true },
  { id: 'pos-fw', name: 'Atacante', abbreviation: 'ATA', color: '#ef4444', order: 6, active: true },
];

// Default formations
const defaultFormations: Formation[] = [
  {
    id: 'form-433',
    name: '4-3-3',
    slots: [
      { id: 's1', positionId: 'pos-gk', x: 50, y: 90, label: 'GOL' },
      { id: 's2', positionId: 'pos-fb', x: 15, y: 70, label: 'LD' },
      { id: 's3', positionId: 'pos-cb', x: 37, y: 72, label: 'ZAG' },
      { id: 's4', positionId: 'pos-cb', x: 63, y: 72, label: 'ZAG' },
      { id: 's5', positionId: 'pos-fb', x: 85, y: 70, label: 'LE' },
      { id: 's6', positionId: 'pos-mf', x: 30, y: 45, label: 'MC' },
      { id: 's7', positionId: 'pos-dm', x: 50, y: 50, label: 'VOL' },
      { id: 's8', positionId: 'pos-mf', x: 70, y: 45, label: 'MC' },
      { id: 's9', positionId: 'pos-fw', x: 20, y: 15, label: 'PE' },
      { id: 's10', positionId: 'pos-fw', x: 50, y: 10, label: 'CA' },
      { id: 's11', positionId: 'pos-fw', x: 80, y: 15, label: 'PD' },
    ],
  },
  {
    id: 'form-442',
    name: '4-4-2',
    slots: [
      { id: 's1', positionId: 'pos-gk', x: 50, y: 90, label: 'GOL' },
      { id: 's2', positionId: 'pos-fb', x: 15, y: 70, label: 'LD' },
      { id: 's3', positionId: 'pos-cb', x: 37, y: 72, label: 'ZAG' },
      { id: 's4', positionId: 'pos-cb', x: 63, y: 72, label: 'ZAG' },
      { id: 's5', positionId: 'pos-fb', x: 85, y: 70, label: 'LE' },
      { id: 's6', positionId: 'pos-mf', x: 15, y: 45, label: 'MD' },
      { id: 's7', positionId: 'pos-mf', x: 38, y: 48, label: 'MC' },
      { id: 's8', positionId: 'pos-mf', x: 62, y: 48, label: 'MC' },
      { id: 's9', positionId: 'pos-mf', x: 85, y: 45, label: 'ME' },
      { id: 's10', positionId: 'pos-fw', x: 35, y: 15, label: 'ATA' },
      { id: 's11', positionId: 'pos-fw', x: 65, y: 15, label: 'ATA' },
    ],
  },
  {
    id: 'form-352',
    name: '3-5-2',
    slots: [
      { id: 's1', positionId: 'pos-gk', x: 50, y: 90, label: 'GOL' },
      { id: 's2', positionId: 'pos-cb', x: 25, y: 72, label: 'ZAG' },
      { id: 's3', positionId: 'pos-cb', x: 50, y: 74, label: 'ZAG' },
      { id: 's4', positionId: 'pos-cb', x: 75, y: 72, label: 'ZAG' },
      { id: 's5', positionId: 'pos-fb', x: 10, y: 50, label: 'ALA' },
      { id: 's6', positionId: 'pos-mf', x: 32, y: 48, label: 'MC' },
      { id: 's7', positionId: 'pos-dm', x: 50, y: 52, label: 'VOL' },
      { id: 's8', positionId: 'pos-mf', x: 68, y: 48, label: 'MC' },
      { id: 's9', positionId: 'pos-fb', x: 90, y: 50, label: 'ALA' },
      { id: 's10', positionId: 'pos-fw', x: 35, y: 15, label: 'ATA' },
      { id: 's11', positionId: 'pos-fw', x: 65, y: 15, label: 'ATA' },
    ],
  },
  {
    id: 'form-4231',
    name: '4-2-3-1',
    slots: [
      { id: 's1', positionId: 'pos-gk', x: 50, y: 90, label: 'GOL' },
      { id: 's2', positionId: 'pos-fb', x: 15, y: 70, label: 'LD' },
      { id: 's3', positionId: 'pos-cb', x: 37, y: 72, label: 'ZAG' },
      { id: 's4', positionId: 'pos-cb', x: 63, y: 72, label: 'ZAG' },
      { id: 's5', positionId: 'pos-fb', x: 85, y: 70, label: 'LE' },
      { id: 's6', positionId: 'pos-dm', x: 35, y: 52, label: 'VOL' },
      { id: 's7', positionId: 'pos-dm', x: 65, y: 52, label: 'VOL' },
      { id: 's8', positionId: 'pos-mf', x: 20, y: 30, label: 'PE' },
      { id: 's9', positionId: 'pos-mf', x: 50, y: 32, label: 'MEI' },
      { id: 's10', positionId: 'pos-mf', x: 80, y: 30, label: 'PD' },
      { id: 's11', positionId: 'pos-fw', x: 50, y: 10, label: 'CA' },
    ],
  },
];

const defaultSettings: AppSettings = {
  teamName: 'UFC Baixada',
  teamNickname: 'UFC',
  logoUrl: '',
  primaryColor: '#16a34a',
  secondaryColor: '#1e40af',
  accentColor: '#f59e0b',
  theme: 'dark',
  defaultFormationId: 'form-433',
  defaultPaymentAmount: 50,
  seasonName: 'Temporada 2025',
  headerText: '⚽ UFC Baixada - Futebol de Fim de Semana',
  footerText: '© 2025 UFC Baixada - Todos os direitos reservados',
  modulesEnabled: {
    players: true,
    payments: true,
    goals: true,
    assists: true,
    matches: true,
    draw: true,
    virtualField: true,
  },
};

// Seed data
const seedPlayers: Player[] = [
  { id: 'p1', name: 'Carlos Silva', nickname: 'Carlão', phone: '11999990001', primaryPositionId: 'pos-gk', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p2', name: 'Roberto Santos', nickname: 'Beto', phone: '11999990002', primaryPositionId: 'pos-cb', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p3', name: 'André Oliveira', nickname: 'Andrezão', phone: '11999990003', primaryPositionId: 'pos-cb', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p4', name: 'Marcos Lima', nickname: 'Marquinhos', phone: '11999990004', primaryPositionId: 'pos-fb', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p5', name: 'Felipe Costa', nickname: 'Lipe', phone: '11999990005', primaryPositionId: 'pos-fb', secondaryPositionId: 'pos-mf', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p6', name: 'Thiago Mendes', nickname: 'Thiaguinho', phone: '11999990006', primaryPositionId: 'pos-dm', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p7', name: 'Lucas Ferreira', nickname: 'Luquinha', phone: '11999990007', primaryPositionId: 'pos-mf', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p8', name: 'Pedro Almeida', nickname: 'Pedrão', phone: '11999990008', primaryPositionId: 'pos-mf', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p9', name: 'Gabriel Souza', nickname: 'Gabigol', phone: '11999990009', primaryPositionId: 'pos-fw', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p10', name: 'Rafael Nunes', nickname: 'Rafa', phone: '11999990010', primaryPositionId: 'pos-fw', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p11', name: 'Diego Martins', nickname: 'Diegão', phone: '11999990011', primaryPositionId: 'pos-gk', secondaryPositionId: 'pos-cb', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'p12', name: 'Bruno Pereira', nickname: 'Bruninho', phone: '11999990012', primaryPositionId: 'pos-dm', secondaryPositionId: 'pos-cb', active: true, available: true, monthlyFee: 50, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

const seedPayments: Payment[] = [
  { id: 'pay1', playerId: 'p1', type: 'monthly', reference: '2025-01', amount: 50, status: 'paid', method: 'pix', dueDate: '2025-01-05', paidDate: '2025-01-03', createdAt: '2025-01-01', updatedAt: '2025-01-03' },
  { id: 'pay2', playerId: 'p2', type: 'monthly', reference: '2025-01', amount: 50, status: 'paid', method: 'cash', dueDate: '2025-01-05', paidDate: '2025-01-05', createdAt: '2025-01-01', updatedAt: '2025-01-05' },
  { id: 'pay3', playerId: 'p3', type: 'monthly', reference: '2025-01', amount: 50, status: 'pending', dueDate: '2025-01-05', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
  { id: 'pay4', playerId: 'p4', type: 'monthly', reference: '2025-01', amount: 50, status: 'overdue', dueDate: '2025-01-05', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
];

const seedMatches: Match[] = [
  {
    id: 'm1', date: '2025-01-15', location: 'Campo do Parque', status: 'finished',
    teams: [
      { id: 't1', name: 'Verdes', color: '#16a34a', playerIds: ['p1', 'p2', 'p4', 'p6', 'p7', 'p9'] },
      { id: 't2', name: 'Azuis', color: '#2563eb', playerIds: ['p11', 'p3', 'p5', 'p8', 'p10', 'p12'] },
    ],
    createdAt: '2025-01-15',
  },
];

const seedGoals: Goal[] = [
  { id: 'g1', matchId: 'm1', playerId: 'p9', quantity: 2, createdAt: '2025-01-15' },
  { id: 'g2', matchId: 'm1', playerId: 'p7', quantity: 1, createdAt: '2025-01-15' },
  { id: 'g3', matchId: 'm1', playerId: 'p10', quantity: 1, createdAt: '2025-01-15' },
];

const seedAssists: Assist[] = [
  { id: 'a1', matchId: 'm1', playerId: 'p6', createdAt: '2025-01-15' },
  { id: 'a2', matchId: 'm1', playerId: 'p7', createdAt: '2025-01-15' },
  { id: 'a3', matchId: 'm1', playerId: 'p5', createdAt: '2025-01-15' },
];

export function initializeStore(): void {
  if (get(STORAGE_KEYS.initialized, false)) return;
  
  set(STORAGE_KEYS.positions, defaultPositions);
  set(STORAGE_KEYS.formations, defaultFormations);
  set(STORAGE_KEYS.settings, defaultSettings);
  set(STORAGE_KEYS.players, seedPlayers);
  set(STORAGE_KEYS.payments, seedPayments);
  set(STORAGE_KEYS.matches, seedMatches);
  set(STORAGE_KEYS.goals, seedGoals);
  set(STORAGE_KEYS.assists, seedAssists);
  set(STORAGE_KEYS.draws, []);
  set(STORAGE_KEYS.auth, { username: 'admin', password: 'admin123' });
  set(STORAGE_KEYS.initialized, true);
}

// Auth
export function getAuth() { return get<{ username: string; password: string }>(STORAGE_KEYS.auth, { username: 'admin', password: 'admin123' }); }

// Players
export function getPlayers(): Player[] { return get<Player[]>(STORAGE_KEYS.players, []); }
export function savePlayers(players: Player[]) { set(STORAGE_KEYS.players, players); }
export function addPlayer(player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Player {
  const players = getPlayers();
  const newPlayer: Player = { ...player, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  players.push(newPlayer);
  savePlayers(players);
  return newPlayer;
}
export function updatePlayer(id: string, data: Partial<Player>): Player | null {
  const players = getPlayers();
  const idx = players.findIndex(p => p.id === id);
  if (idx === -1) return null;
  players[idx] = { ...players[idx], ...data, updatedAt: new Date().toISOString() };
  savePlayers(players);
  return players[idx];
}
export function deletePlayer(id: string): boolean {
  const players = getPlayers();
  const filtered = players.filter(p => p.id !== id);
  if (filtered.length === players.length) return false;
  savePlayers(filtered);
  return true;
}

// Positions
export function getPositions(): Position[] { return get<Position[]>(STORAGE_KEYS.positions, defaultPositions); }
export function savePositions(positions: Position[]) { set(STORAGE_KEYS.positions, positions); }
export function addPosition(pos: Omit<Position, 'id'>): Position {
  const positions = getPositions();
  const newPos: Position = { ...pos, id: uuidv4() };
  positions.push(newPos);
  savePositions(positions);
  return newPos;
}
export function updatePosition(id: string, data: Partial<Position>): void {
  const positions = getPositions();
  const idx = positions.findIndex(p => p.id === id);
  if (idx !== -1) { positions[idx] = { ...positions[idx], ...data }; savePositions(positions); }
}
export function deletePosition(id: string): void {
  const positions = getPositions().filter(p => p.id !== id);
  savePositions(positions);
}

// Formations
export function getFormations(): Formation[] { return get<Formation[]>(STORAGE_KEYS.formations, defaultFormations); }
export function saveFormations(formations: Formation[]) { set(STORAGE_KEYS.formations, formations); }
export function addFormation(f: Omit<Formation, 'id'>): Formation {
  const formations = getFormations();
  const newF: Formation = { ...f, id: uuidv4() };
  formations.push(newF);
  saveFormations(formations);
  return newF;
}
export function updateFormation(id: string, data: Partial<Formation>): void {
  const formations = getFormations();
  const idx = formations.findIndex(f => f.id === id);
  if (idx !== -1) { formations[idx] = { ...formations[idx], ...data }; saveFormations(formations); }
}
export function deleteFormation(id: string): void {
  saveFormations(getFormations().filter(f => f.id !== id));
}

// Matches
export function getMatches(): Match[] { return get<Match[]>(STORAGE_KEYS.matches, []); }
export function saveMatches(matches: Match[]) { set(STORAGE_KEYS.matches, matches); }
export function addMatch(match: Omit<Match, 'id' | 'createdAt'>): Match {
  const matches = getMatches();
  const newMatch: Match = { ...match, id: uuidv4(), createdAt: new Date().toISOString() };
  matches.push(newMatch);
  saveMatches(matches);
  return newMatch;
}
export function updateMatch(id: string, data: Partial<Match>): void {
  const matches = getMatches();
  const idx = matches.findIndex(m => m.id === id);
  if (idx !== -1) { matches[idx] = { ...matches[idx], ...data }; saveMatches(matches); }
}
export function deleteMatch(id: string): void {
  saveMatches(getMatches().filter(m => m.id !== id));
}

// Payments
export function getPayments(): Payment[] { return get<Payment[]>(STORAGE_KEYS.payments, []); }
export function savePayments(payments: Payment[]) { set(STORAGE_KEYS.payments, payments); }
export function addPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
  const payments = getPayments();
  const newPayment: Payment = { ...payment, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  payments.push(newPayment);
  savePayments(payments);
  return newPayment;
}
export function updatePayment(id: string, data: Partial<Payment>): void {
  const payments = getPayments();
  const idx = payments.findIndex(p => p.id === id);
  if (idx !== -1) { payments[idx] = { ...payments[idx], ...data, updatedAt: new Date().toISOString() }; savePayments(payments); }
}
export function deletePayment(id: string): void {
  savePayments(getPayments().filter(p => p.id !== id));
}

// Goals
export function getGoals(): Goal[] { return get<Goal[]>(STORAGE_KEYS.goals, []); }
export function saveGoals(goals: Goal[]) { set(STORAGE_KEYS.goals, goals); }
export function addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
  const goals = getGoals();
  const newGoal: Goal = { ...goal, id: uuidv4(), createdAt: new Date().toISOString() };
  goals.push(newGoal);
  saveGoals(goals);
  return newGoal;
}
export function updateGoal(id: string, data: Partial<Goal>): void {
  const goals = getGoals();
  const idx = goals.findIndex(g => g.id === id);
  if (idx !== -1) { goals[idx] = { ...goals[idx], ...data }; saveGoals(goals); }
}
export function deleteGoal(id: string): void {
  saveGoals(getGoals().filter(g => g.id !== id));
}

// Assists
export function getAssists(): Assist[] { return get<Assist[]>(STORAGE_KEYS.assists, []); }
export function saveAssists(assists: Assist[]) { set(STORAGE_KEYS.assists, assists); }
export function addAssist(assist: Omit<Assist, 'id' | 'createdAt'>): Assist {
  const assists = getAssists();
  const newAssist: Assist = { ...assist, id: uuidv4(), createdAt: new Date().toISOString() };
  assists.push(newAssist);
  saveAssists(assists);
  return newAssist;
}
export function updateAssist(id: string, data: Partial<Assist>): void {
  const assists = getAssists();
  const idx = assists.findIndex(a => a.id === id);
  if (idx !== -1) { assists[idx] = { ...assists[idx], ...data }; saveAssists(assists); }
}
export function deleteAssist(id: string): void {
  saveAssists(getAssists().filter(a => a.id !== id));
}

// Settings
export function getSettings(): AppSettings { return get<AppSettings>(STORAGE_KEYS.settings, defaultSettings); }
export function saveSettings(settings: AppSettings) { set(STORAGE_KEYS.settings, settings); }

// Draws
export function getDraws(): DrawResult[] { return get<DrawResult[]>(STORAGE_KEYS.draws, []); }
export function saveDraw(draw: DrawResult): void {
  const draws = getDraws();
  draws.unshift(draw);
  set(STORAGE_KEYS.draws, draws);
}

// Helpers
export function getPlayerById(id: string): Player | undefined {
  return getPlayers().find(p => p.id === id);
}

export function getPositionById(id: string): Position | undefined {
  return getPositions().find(p => p.id === id);
}

export function getFormationById(id: string): Formation | undefined {
  return getFormations().find(f => f.id === id);
}

export function resetStore(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  initializeStore();
}
