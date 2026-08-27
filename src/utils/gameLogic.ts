import { Card, GameMode, MoveType, MoveValidation, Suit } from '../types';
import { Language, translations } from './i18n';

export const SUITS: { suit: Suit; label: string; colorHex: string; bgClass: string; textClass: string; icon: string }[] = [
  { suit: 'rose', label: 'Gül', colorHex: '#f38ba8', bgClass: 'bg-[#f38ba8]/15 border-[#f38ba8]/40 text-[#f38ba8]', textClass: 'text-[#f38ba8]', icon: '🌸' },
  { suit: 'peach', label: 'Şeftali', colorHex: '#fab387', bgClass: 'bg-[#fab387]/15 border-[#fab387]/40 text-[#fab387]', textClass: 'text-[#fab387]', icon: '🍑' },
  { suit: 'yellow', label: 'Güneş', colorHex: '#f9e2af', bgClass: 'bg-[#f9e2af]/15 border-[#f9e2af]/40 text-[#f9e2af]', textClass: 'text-[#f9e2af]', icon: '☀️' },
  { suit: 'green', label: 'Zümrüt', colorHex: '#a6e3a1', bgClass: 'bg-[#a6e3a1]/15 border-[#a6e3a1]/40 text-[#a6e3a1]', textClass: 'text-[#a6e3a1]', icon: '🌿' },
  { suit: 'blue', label: 'Safir', colorHex: '#89b4fa', bgClass: 'bg-[#89b4fa]/15 border-[#89b4fa]/40 text-[#89b4fa]', textClass: 'text-[#89b4fa]', icon: '💧' },
];

export function getSuitInfo(suit: Suit) {
  return SUITS.find((s) => s.suit === suit) || SUITS[0];
}

/**
 * Generate a fresh 50-card deck (5 suits x 10 cards)
 */
export function createNewDeck(): Card[] {
  const suits: Suit[] = ['rose', 'peach', 'yellow', 'green', 'blue'];
  const deck: Card[] = [];
  let idCounter = 1;

  for (const suit of suits) {
    for (let value = 1; value <= 10; value++) {
      deck.push({
        id: `card-${suit}-${value}-${idCounter++}-${Math.random().toString(36).substring(2, 6)}`,
        suit,
        value,
      });
    }
  }

  return shuffleDeck(deck);
}

/**
 * Fisher-Yates Shuffle
 */
export function shuffleDeck(cards: Card[]): Card[] {
  const array = [...cards];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Initial deal for a round based on GameMode:
 * - classic: 4 cards for Wolf, 4 cards for Player
 * - lucky_5x: 4 cards for Wolf, 4 highly favorable lucky cards for Player (5x luck)
 * - extra_cards: 5 cards for Wolf, 6 cards for Player (Human starts with 6, Wolf starts with 5)
 */
export function dealNewRound(gameMode: GameMode = 'classic'): {
  wolfHand: Card[];
  playerHand: Card[];
  deck: Card[];
} {
  let deck = createNewDeck();
  const wolfCount = gameMode === 'extra_cards' ? 5 : 4;
  const playerCount = gameMode === 'extra_cards' ? 6 : 4;

  const wolfHand = deck.splice(0, wolfCount);

  let playerHand: Card[] = [];

  if (gameMode === 'lucky_5x') {
    // 5x Luck Mode: Find cards in the deck that match wolf cards or have high values (7-10)
    const wolfValues = wolfHand.map((c) => c.value);
    
    // Pick matches first
    for (let i = 0; i < playerCount; i++) {
      let targetIndex = -1;
      if (i < 2 && wolfValues[i] !== undefined) {
        // Find matching card value for wolf card
        targetIndex = deck.findIndex((c) => c.value === wolfValues[i]);
      }
      if (targetIndex === -1) {
        // Find high value card (>= 7)
        targetIndex = deck.findIndex((c) => c.value >= 7);
      }
      if (targetIndex === -1) {
        targetIndex = 0;
      }
      if (targetIndex !== -1 && deck.length > 0) {
        playerHand.push(deck.splice(targetIndex, 1)[0]);
      }
    }

    // Also place a favorable card at deck[0] so the initial face-up card is visible and lucky
    if (deck.length > 1) {
      const luckyIndex = deck.findIndex((c) => wolfValues.includes(c.value) || c.value >= 7);
      if (luckyIndex > 0) {
        const [luckyCard] = deck.splice(luckyIndex, 1);
        deck.unshift(luckyCard);
      }
    }
  } else {
    playerHand = deck.splice(0, playerCount);
  }

  return {
    wolfHand,
    playerHand,
    deck,
  };
}

/**
 * Draw cards from deck.
 * CRITICAL RULE: Always draws sequentially from deck[0] (currentDeck.shift()).
 * Whatever card the player sees on top of the deck (Açık Kart / Face Up) MUST be the exact card drawn!
 * In 5x Luck mode, favorable cards are positioned at deck[0] for subsequent turns in advance so the player sees them before drawing.
 */
export function drawCards(
  deck: Card[],
  count: number,
  drawnBy: 'player' | 'wolf',
  wolfHand: Card[],
  gameMode: GameMode = 'classic'
): { drawnCards: Card[]; remainingDeck: Card[] } {
  const currentDeck = [...deck];
  const drawnCards: Card[] = [];

  for (let i = 0; i < count && currentDeck.length > 0; i++) {
    // ALWAYS draw from the very top of the deck (index 0)
    // This ensures 100% visual consistency: what you see is what you get!
    drawnCards.push(currentDeck.shift()!);
  }

  // If in lucky_5x mode, prepare the next top card of the deck (deck[0]) to be favorable
  // for the player's upcoming move, so they see it beforehand.
  if (gameMode === 'lucky_5x' && currentDeck.length > 1 && Math.random() < 0.75) {
    const wolfValues = wolfHand.map((c) => c.value);
    const luckyIndex = currentDeck.findIndex((c) => wolfValues.includes(c.value) || c.value >= 7);
    if (luckyIndex > 0) {
      const [luckyCard] = currentDeck.splice(luckyIndex, 1);
      currentDeck.unshift(luckyCard);
    }
  }

  return { drawnCards, remainingDeck: currentDeck };
}

/**
 * Validates selected player and wolf cards against the 4 Lobo move rules:
 * 1. Eşleştirme (Match / Perfect): 1 Player card === 1 Wolf card. (Player draws 1)
 * 2. Toplama (Sum): 2+ Player cards sum === 1 Wolf card. (Player draws 1)
 * 3. Bölme (Split): 1 Player card === 2+ Wolf cards sum. (Wolf draws 1)
 * 4. Üst (Higher / Over): 1 Player card > 1 Wolf card. (Wolf draws Player - Wolf diff)
 */
export function validateMove(
  playerCards: Card[],
  wolfCards: Card[],
  deckLength: number,
  lang: Language = 'tr'
): MoveValidation {
  const t = translations[lang];

  if (playerCards.length === 0 && wolfCards.length === 0) {
    return {
      isValid: false,
      errorReason: t.errSelectCards,
    };
  }

  if (playerCards.length === 0) {
    return {
      isValid: false,
      errorReason: t.errSelectPlayerCard,
    };
  }

  if (wolfCards.length === 0) {
    return {
      isValid: false,
      errorReason: t.errSelectWolfCard,
    };
  }

  const playerSum = playerCards.reduce((sum, c) => sum + c.value, 0);
  const wolfSum = wolfCards.reduce((sum, c) => sum + c.value, 0);

  // 1. Eşleştirme / Perfect: 1 Player, 1 Wolf, playerCard.value === wolfCard.value
  if (playerCards.length === 1 && wolfCards.length === 1) {
    const pCard = playerCards[0];
    const wCard = wolfCards[0];

    if (pCard.value === wCard.value) {
      const drawn = Math.min(1, deckLength);
      return {
        isValid: true,
        type: 'match',
        title: t.matchMoveTitle,
        description: t.descMatch(pCard.value, wCard.value),
        cardsDrawnCount: drawn,
        drawnBy: 'player',
      };
    }

    // 4. Üst / Over: 1 Player, 1 Wolf, playerCard.value > wolfCard.value
    if (pCard.value > wCard.value) {
      const diff = pCard.value - wCard.value;
      const actualDrawn = Math.min(diff, deckLength);
      return {
        isValid: true,
        type: 'higher',
        title: `${t.higherMoveTitle} (+${diff})`,
        description: t.descHigher(pCard.value, wCard.value, diff),
        cardsDrawnCount: actualDrawn,
        drawnBy: 'wolf',
      };
    }

    // Player card is smaller than Wolf card but both are 1 card
    return {
      isValid: false,
      errorReason: t.errCardSmaller,
    };
  }

  // 2. Toplama / Sum: 2+ Player cards, 1 Wolf card, Sum(Player) === Wolf
  if (playerCards.length > 1 && wolfCards.length === 1) {
    const wCard = wolfCards[0];
    if (playerSum === wCard.value) {
      const drawn = Math.min(1, deckLength);
      const formula = playerCards.map((c) => c.value).join(' + ');
      return {
        isValid: true,
        type: 'sum',
        title: t.sumMoveTitle,
        description: t.descSum(formula, playerSum, wCard.value),
        cardsDrawnCount: drawn,
        drawnBy: 'player',
      };
    }

    return {
      isValid: false,
      errorReason: t.errSumMismatch,
    };
  }

  // 3. Bölme / Split: 1 Player card, 2+ Wolf cards, Player === Sum(Wolf)
  if (playerCards.length === 1 && wolfCards.length > 1) {
    const pCard = playerCards[0];
    if (pCard.value === wolfSum) {
      const drawn = Math.min(1, deckLength);
      const formula = wolfCards.map((c) => c.value).join(' + ');
      return {
        isValid: true,
        type: 'split',
        title: t.splitMoveTitle,
        description: t.descSplit(pCard.value, formula, wolfSum),
        cardsDrawnCount: drawn,
        drawnBy: 'wolf',
      };
    }

    return {
      isValid: false,
      errorReason: t.errSplitMismatch,
    };
  }

  // Multi to Multi is not a valid Lobo move
  return {
    isValid: false,
    errorReason: t.errInvalidSelection,
  };
}

/**
 * Hint finder: searches playerHand and wolfHand for any valid move
 */
export interface HintMove {
  type: MoveType;
  playerCardIds: string[];
  wolfCardIds: string[];
  explanation: string;
  isFavorable: boolean;
}

export function findPossibleMoves(
  playerHand: Card[],
  wolfHand: Card[],
  deckLength: number,
  lang: Language = 'tr'
): HintMove[] {
  const hints: HintMove[] = [];

  // 1. Matches (1 to 1 equality)
  for (const p of playerHand) {
    for (const w of wolfHand) {
      if (p.value === w.value) {
        hints.push({
          type: 'match',
          playerCardIds: [p.id],
          wolfCardIds: [w.id],
          explanation:
            lang === 'tr'
              ? `Eşleştirme: Oyuncu ${p.value} = Kurt ${w.value} (1 kart çekersiniz)`
              : `Match: Player ${p.value} = Wolf ${w.value} (You draw 1 card)`,
          isFavorable: true,
        });
      }
    }
  }

  // 2. Sums (2+ Player cards = 1 Wolf card)
  // Helper for power set combinations
  function getSubsets<T>(array: T[], minLen = 2): T[][] {
    const result: T[][] = [];
    const n = array.length;
    for (let i = 1; i < (1 << n); i++) {
      const subset: T[] = [];
      for (let j = 0; j < n; j++) {
        if (i & (1 << j)) {
          subset.push(array[j]);
        }
      }
      if (subset.length >= minLen) {
        result.push(subset);
      }
    }
    return result;
  }

  const playerSubsets = getSubsets(playerHand, 2);
  for (const pSubset of playerSubsets) {
    const sum = pSubset.reduce((acc, c) => acc + c.value, 0);
    for (const w of wolfHand) {
      if (sum === w.value) {
        hints.push({
          type: 'sum',
          playerCardIds: pSubset.map((c) => c.id),
          wolfCardIds: [w.id],
          explanation:
            lang === 'tr'
              ? `Toplama: (${pSubset.map((c) => c.value).join('+')} = ${sum}) ile Kurt'un ${w.value} kartını al (1 kart çekersiniz)`
              : `Sum: (${pSubset.map((c) => c.value).join('+')} = ${sum}) captures Wolf's ${w.value} (You draw 1 card)`,
          isFavorable: true,
        });
      }
    }
  }

  // 3. Splits (1 Player card = 2+ Wolf cards)
  const wolfSubsets = getSubsets(wolfHand, 2);
  for (const p of playerHand) {
    for (const wSubset of wolfSubsets) {
      const sum = wSubset.reduce((acc, c) => acc + c.value, 0);
      if (p.value === sum) {
        hints.push({
          type: 'split',
          playerCardIds: [p.id],
          wolfCardIds: wSubset.map((c) => c.id),
          explanation:
            lang === 'tr'
              ? `Bölme: Oyuncu ${p.value} ile Kurt'un (${wSubset.map((c) => c.value).join('+')} = ${sum}) kartlarını al (Kurt 1 kart çeker)`
              : `Split: Player ${p.value} splits Wolf's (${wSubset.map((c) => c.value).join('+')} = ${sum}) (Wolf draws 1 card)`,
          isFavorable: true,
        });
      }
    }
  }

  // 4. Higher (1 Player > 1 Wolf)
  for (const p of playerHand) {
    for (const w of wolfHand) {
      if (p.value > w.value) {
        const diff = p.value - w.value;
        hints.push({
          type: 'higher',
          playerCardIds: [p.id],
          wolfCardIds: [w.id],
          explanation:
            lang === 'tr'
              ? `Üst: Oyuncu ${p.value} > Kurt ${w.value} (Kurt +${diff} kart çeker)`
              : `Over: Player ${p.value} > Wolf ${w.value} (Wolf draws +${diff} cards)`,
          // If wolf has only 1 card, this might be winning move! Or if diff is small (1 or 2)
          isFavorable: wolfHand.length === 1 || diff <= 2,
        });
      }
    }
  }

  // Sort hints: Favorable moves first, then matches/sums/splits, then smaller difference higher moves
  return hints.sort((a, b) => {
    if (a.isFavorable && !b.isFavorable) return -1;
    if (!a.isFavorable && b.isFavorable) return 1;
    return 0;
  });
}

/**
 * Calculate total points of a set of cards
 */
export function calculateCardsValue(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.value, 0);
}

