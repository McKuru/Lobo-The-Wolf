export type Suit = 'rose' | 'peach' | 'yellow' | 'green' | 'blue';

export interface Card {
  id: string;
  suit: Suit;
  value: number; // 1 to 10
}

export type GameMode = 'classic' | 'lucky_5x' | 'extra_cards';

export type MoveType = 'match' | 'sum' | 'split' | 'higher';

export interface MoveValidation {
  isValid: boolean;
  type?: MoveType;
  title?: string;
  description?: string;
  cardsDrawnCount?: number;
  drawnBy?: 'player' | 'wolf';
  errorReason?: string;
}

export interface MoveLogItem {
  id: string;
  timestamp: number;
  type: MoveType;
  description: string;
  playerCards: Card[];
  wolfCards: Card[];
  cardsDrawn: number;
  drawer: 'player' | 'wolf';
}

export interface RoundResult {
  winner: 'player' | 'wolf';
  playerRoundScore: number;
  wolfRoundScore: number;
  playerCardsRemaining: Card[];
  wolfCardsRemaining: Card[];
  reason: 'wolf_empty' | 'player_surrender' | 'no_valid_moves' | 'deck_empty_no_moves';
  cardsTotalScore: number;
}

export interface GameStats {
  roundsPlayed: number;
  playerRoundsWon: number;
  wolfRoundsWon: number;
  totalMatchesMade: number;
  totalSumMoves: number;
  totalSplitMoves: number;
  totalHigherMoves: number;
  highestRoundScore: number;
}

export interface GameState {
  playerHand: Card[];
  wolfHand: Card[];
  deck: Card[]; // top card is deck[0]
  selectedPlayerCardIds: string[];
  selectedWolfCardIds: string[];
  playerTotalScore: number;
  wolfTotalScore: number;
  currentRound: number;
  targetScore: number; // 100 points
  gameMode: GameMode;
  isRoundOver: boolean;
  roundResult: RoundResult | null;
  isGameOver: boolean;
  gameWinner: 'player' | 'wolf' | null;
  moveHistory: MoveLogItem[];
  stats: GameStats;
}
