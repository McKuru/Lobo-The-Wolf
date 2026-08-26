import { Card, MoveType, MoveValidation, Suit } from '../types';

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
 * Initial deal for a round:
 * 4 cards for Wolf, 4 cards for Player, rest for deck.
 */
export function dealNewRound(): {
  wolfHand: Card[];
  playerHand: Card[];
  deck: Card[];
} {
  const deck = createNewDeck();
  const wolfHand = deck.splice(0, 4);
  const playerHand = deck.splice(0, 4);

  return {
    wolfHand,
    playerHand,
    deck,
  };
}

/**
 * Validates selected player and wolf cards against the 4 Lobo move rules:
 * 1. Eşleştirme (Match): 1 Player card === 1 Wolf card. (Player draws 1)
 * 2. Toplama (Sum): 2+ Player cards sum === 1 Wolf card. (Player draws 1)
 * 3. Bölme (Split): 1 Player card === 2+ Wolf cards sum. (Wolf draws 1)
 * 4. Üst (Higher): 1 Player card > 1 Wolf card. (Wolf draws Player - Wolf diff)
 */
export function validateMove(playerCards: Card[], wolfCards: Card[], deckLength: number): MoveValidation {
  if (playerCards.length === 0 && wolfCards.length === 0) {
    return {
      isValid: false,
      errorReason: 'Kart seçin',
    };
  }

  if (playerCards.length === 0) {
    return {
      isValid: false,
      errorReason: 'Kartınızı seçin',
    };
  }

  if (wolfCards.length === 0) {
    return {
      isValid: false,
      errorReason: 'Kurt kartı seçin',
    };
  }

  const playerSum = playerCards.reduce((sum, c) => sum + c.value, 0);
  const wolfSum = wolfCards.reduce((sum, c) => sum + c.value, 0);

  // 1. Eşleştirme (Match): 1 Player, 1 Wolf, playerCard.value === wolfCard.value
  if (playerCards.length === 1 && wolfCards.length === 1) {
    const pCard = playerCards[0];
    const wCard = wolfCards[0];

    if (pCard.value === wCard.value) {
      const drawn = Math.min(1, deckLength);
      return {
        isValid: true,
        type: 'match',
        title: 'Eşleme',
        description: `${pCard.value} = ${wCard.value} eşitlendi! 1 yeni kart çekersiniz.`,
        cardsDrawnCount: drawn,
        drawnBy: 'player',
      };
    }

    // 4. Üst (Higher): 1 Player, 1 Wolf, playerCard.value > wolfCard.value
    if (pCard.value > wCard.value) {
      const diff = pCard.value - wCard.value;
      const actualDrawn = Math.min(diff, deckLength);
      return {
        isValid: true,
        type: 'higher',
        title: `Üst (+${diff})`,
        description: `${pCard.value} > ${wCard.value} (Fark: ${diff}). Kurt ${actualDrawn} kart çeker.`,
        cardsDrawnCount: actualDrawn,
        drawnBy: 'wolf',
      };
    }

    // Player card is smaller than Wolf card but both are 1 card
    return {
      isValid: false,
      errorReason: 'Kart küçük',
    };
  }

  // 2. Toplama (Sum): 2+ Player cards, 1 Wolf card, Sum(Player) === Wolf
  if (playerCards.length > 1 && wolfCards.length === 1) {
    const wCard = wolfCards[0];
    if (playerSum === wCard.value) {
      const drawn = Math.min(1, deckLength);
      const formula = playerCards.map((c) => c.value).join(' + ');
      return {
        isValid: true,
        type: 'sum',
        title: 'Toplama',
        description: `(${formula} = ${playerSum}) Kurt'un ${wCard.value} kartını aldı! 1 kart çekersiniz.`,
        cardsDrawnCount: drawn,
        drawnBy: 'player',
      };
    }

    return {
      isValid: false,
      errorReason: 'Toplam uyuşmuyor',
    };
  }

  // 3. Bölme (Split): 1 Player card, 2+ Wolf cards, Player === Sum(Wolf)
  if (playerCards.length === 1 && wolfCards.length > 1) {
    const pCard = playerCards[0];
    if (pCard.value === wolfSum) {
      const drawn = Math.min(1, deckLength);
      const formula = wolfCards.map((c) => c.value).join(' + ');
      return {
        isValid: true,
        type: 'split',
        title: 'Bölme',
        description: `Oyuncu ${pCard.value}, Kurt'un (${formula} = ${wolfSum}) kartlarını böldü! Kurt 1 kart çeker.`,
        cardsDrawnCount: drawn,
        drawnBy: 'wolf',
      };
    }

    return {
      isValid: false,
      errorReason: 'Bölme uyuşmuyor',
    };
  }

  // Multi to Multi is not a valid Lobo move
  return {
    isValid: false,
    errorReason: 'Geçersiz seçim',
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

export function findPossibleMoves(playerHand: Card[], wolfHand: Card[], deckLength: number): HintMove[] {
  const hints: HintMove[] = [];

  // 1. Matches (1 to 1 equality)
  for (const p of playerHand) {
    for (const w of wolfHand) {
      if (p.value === w.value) {
        hints.push({
          type: 'match',
          playerCardIds: [p.id],
          wolfCardIds: [w.id],
          explanation: `Eşleştirme: Oyuncu ${p.value} = Kurt ${w.value} (1 kart çekersiniz)`,
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
          explanation: `Toplama: (${pSubset.map((c) => c.value).join('+')} = ${sum}) ile Kurt'un ${w.value} kartını al (1 kart çekersiniz)`,
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
          explanation: `Bölme: Oyuncu ${p.value} ile Kurt'un (${wSubset.map((c) => c.value).join('+')} = ${sum}) kartlarını al (Kurt 1 kart çeker)`,
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
          explanation: `Üst: Oyuncu ${p.value} > Kurt ${w.value} (Kurt +${diff} kart çeker)`,
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
