export type Language = 'tr' | 'en';

export interface Translations {
  // Header
  appTitle: string;
  targetScore: string;
  round: string;
  hint: string;
  history: string;
  rules: string;
  sound: string;
  mute: string;
  reset: string;
  language: string;
  wolfLabel: string;
  youLabel: string;

  // Zones
  wolfHandTitle: string;
  playerHandTitle: string;
  cardCount: string;
  selectedCardsCount: string;
  deckRemaining: string;

  // Center Button
  play: string;
  invalid: string;
  fold: string;
  holdToFold: string;
  releaseToCancel: string;

  // Move Types
  matchMoveTitle: string;
  higherMoveTitle: string;
  sumMoveTitle: string;
  splitMoveTitle: string;
  
  // Errors
  errSelectCards: string;
  errSelectPlayerCard: string;
  errSelectWolfCard: string;
  errCardSmaller: string;
  errSumMismatch: string;
  errSplitMismatch: string;
  errInvalidSelection: string;

  // Move Log Descriptions
  descMatch: (pVal: number, wVal: number) => string;
  descHigher: (pVal: number, wVal: number, diff: number) => string;
  descSum: (formula: string, pSum: number, wVal: number) => string;
  descSplit: (pVal: number, formula: string, wSum: number) => string;
  descFold: (wPoints: number) => string;
  descClear: (pPoints: number) => string;

  // Modals - Rules
  rulesTitle: string;
  rulesGoalHeader: string;
  rulesGoalText: string;
  rulesMovesHeader: string;
  rulesPerfectTitle: string;
  rulesPerfectDesc: string;
  rulesSumTitle: string;
  rulesSumDesc: string;
  rulesSplitTitle: string;
  rulesSplitDesc: string;
  rulesOverTitle: string;
  rulesOverDesc: string;
  rulesFoldTitle: string;
  rulesFoldDesc: string;
  rulesScoringHeader: string;
  rulesScoringClear: string;
  rulesScoringFold: string;
  rulesScoringWin: string;
  closeBtn: string;

  // Modals - Aftermath (Round End)
  roundWonTitle: string;
  roundLostTitle: string;
  roundWonSubtitle: string;
  roundLostSubtitle: string;
  playerHandScoreLabel: string;
  wolfHandScoreLabel: string;
  totalScoreLabel: string;
  nextRoundBtn: string;

  // Modals - Game Over
  gameOverWinTitle: string;
  gameOverLossTitle: string;
  gameOverWinDesc: string;
  gameOverLossDesc: string;
  finalScoreLabel: string;
  playAgainBtn: string;

  // Modals - Reset Confirm
  resetTitle: string;
  resetDesc: string;
  confirmBtn: string;
  cancelBtn: string;

  // Move History Drawer
  moveLogTitle: string;
  noMovesYet: string;
  foldActionTitle: string;
  deckExhaustedTitle: string;
  deckExhaustedDesc: string;

  // Hints
  noValidMoveHint: string;
  hintPrefix: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    appTitle: 'Lobo The Wolf',
    targetScore: 'HEDEF',
    round: 'TUR',
    hint: 'İpucu',
    history: 'Geçmiş',
    rules: 'Kurallar',
    sound: 'Ses',
    mute: 'Sesi Kapat',
    reset: 'Sıfırla',
    language: 'Dil',
    wolfLabel: 'KURT',
    youLabel: 'SEN',

    wolfHandTitle: 'KURT ELİ',
    playerHandTitle: 'SENİN ELİN',
    cardCount: 'Kart',
    selectedCardsCount: 'Seçili',
    deckRemaining: 'Kalan Deste',

    play: 'OYNA',
    invalid: 'GEÇERSİZ',
    fold: 'ÇEKİL',
    holdToFold: 'Çekilmek için basılı tutun',
    releaseToCancel: 'İptal etmek için bırakın',

    matchMoveTitle: 'Eşleme',
    higherMoveTitle: 'Üst',
    sumMoveTitle: 'Toplama',
    splitMoveTitle: 'Bölme',

    errSelectCards: 'Kart seçin',
    errSelectPlayerCard: 'Kartınızı seçin',
    errSelectWolfCard: 'Kurt kartı seçin',
    errCardSmaller: 'Kart küçük',
    errSumMismatch: 'Toplam uyuşmuyor',
    errSplitMismatch: 'Bölme uyuşmuyor',
    errInvalidSelection: 'Geçersiz seçim',

    descMatch: (p, w) => `${p} = ${w} eşitlendi! 1 yeni kart çekersiniz.`,
    descHigher: (p, w, d) => `${p} > ${w} (Fark: ${d}). Kurt ${d} kart çeker.`,
    descSum: (f, s, w) => `(${f} = ${s}) Kurt'un ${w} kartını aldı! 1 kart çekersiniz.`,
    descSplit: (p, f, s) => `Oyuncu ${p}, Kurt'un (${f} = ${s}) kartlarını böldü! Kurt 1 kart çeker.`,
    descFold: (pts) => `Oyuncu turdan çekildi. Kurt kalan elindeki ${pts} puanı aldı.`,
    descClear: (pts) => `Kurt'un tüm kartları temizlendi! Kalan elinizdeki ${pts} puanı aldınız.`,

    rulesTitle: 'Lobo Oyun Kuralları',
    rulesGoalHeader: 'Oyunun Amacı',
    rulesGoalText: 'Lobo oyununda Oyuncu ve Kurt 4\'er açık kartla başlar. Amacınız elinizdeki kartları kullanarak Kurt\'un elindeki tüm kartları yok etmektir. 100 puana ilk ulaşan oyunu kazanır!',
    rulesMovesHeader: 'Olası Hamleler (Kurt sıra beklemez, tüm hamleleri siz yaparsınız)',
    rulesPerfectTitle: 'Eşleme (Perfect Match)',
    rulesPerfectDesc: 'Elinizden 1 kart oynayarak Kurt\'un elindeki aynı değere sahip 1 kartı alırsınız. Ardından desteden 1 yeni kart çekersiniz.',
    rulesSumTitle: 'Toplama (Sum)',
    rulesSumDesc: 'Elinizden toplamı Kurt\'un 1 kartına eşit olan birden fazla kart oynarsınız. Kartlar elenir, siz 1 yeni kart çekersiniz.',
    rulesSplitTitle: 'Bölme (Split)',
    rulesSplitDesc: 'Elinizden 1 büyük kart oynayarak, toplamı bu karta eşit olan Kurt\'un birden fazla kartını bölersiniz. Kurt desteden 1 yeni kart çeker.',
    rulesOverTitle: 'Üst Hamlesi (Over / Higher)',
    rulesOverDesc: 'Elinizden Kurt\'un 1 kartından daha büyük 1 kart oynarsınız. Kartlar silinir; aradaki fark kadar kart Kurt\'un eline desteden eklenir.',
    rulesFoldTitle: 'Çekilme (Fold)',
    rulesFoldDesc: 'Güvenli bir hamle yapamayacağınızı düşünüyorsanız butona basılı tutarak turdan çekilebilirsiniz.',
    rulesScoringHeader: 'Puanlama',
    rulesScoringClear: 'Kurt\'un elini sıfırlarsanız: Elinizde kalan kartların değerleri toplamını puan olarak kazanırsınız.',
    rulesScoringFold: 'Turdan çekilirseniz: Kurt, kendi elinde kalan kartların puan toplamını kazanır.',
    rulesScoringWin: '100 puana ilk ulaşan maçı kazanır.',
    closeBtn: 'Anladım',

    roundWonTitle: 'Kurt\'u Yendiniz!',
    roundLostTitle: 'Tur Kaybedildi!',
    roundWonSubtitle: 'Kurt\'un elindeki tüm kartları başarıyla yok ettiniz.',
    roundLostSubtitle: 'Turdan çekildiniz ve Kurt kalan puanları topladı.',
    playerHandScoreLabel: 'Elinizde Kalan Kart Puanı',
    wolfHandScoreLabel: 'Kurt\'un Kalan Kart Puanı',
    totalScoreLabel: 'Toplam Skor Tablosu',
    nextRoundBtn: 'Sonraki Tura Geç',

    gameOverWinTitle: 'Zafer! Şampiyon Oldunuz!',
    gameOverLossTitle: 'Kurt Maçı Kazandı!',
    gameOverWinDesc: '100 puana ulaşarak Lobo\'yu zekanız ve stratejinizle mağlup ettiniz!',
    gameOverLossDesc: 'Kurt 100 puana sizden önce ulaştı. Tekrar deneyip intikamını al!',
    finalScoreLabel: 'Final Skoru',
    playAgainBtn: 'Yeniden Oyna',

    resetTitle: 'Oyunu Sıfırla',
    resetDesc: 'Tüm skorlar ve oyun durumu sıfırlanacak. Baştan başlamak istediğinize emin misiniz?',
    confirmBtn: 'Evet, Sıfırla',
    cancelBtn: 'Vazgeç',

    moveLogTitle: 'Hamle Geçmişi',
    noMovesYet: 'Henüz bir hamle yapılmadı.',
    foldActionTitle: 'Turdan Çekilme',
    deckExhaustedTitle: 'Deste Bitti',
    deckExhaustedDesc: 'Destedeki tüm kartlar tükendi.',

    noValidMoveHint: 'Mevcut seçimle geçerli bir hamle bulunamadı.',
    hintPrefix: 'İpucu',
  },
  en: {
    appTitle: 'Lobo The Wolf',
    targetScore: 'TARGET',
    round: 'ROUND',
    hint: 'Hint',
    history: 'History',
    rules: 'Rules',
    sound: 'Sound',
    mute: 'Mute',
    reset: 'Reset',
    language: 'Language',
    wolfLabel: 'WOLF',
    youLabel: 'YOU',

    wolfHandTitle: 'WOLF HAND',
    playerHandTitle: 'YOUR HAND',
    cardCount: 'Cards',
    selectedCardsCount: 'Selected',
    deckRemaining: 'Deck Remaining',

    play: 'PLAY',
    invalid: 'INVALID',
    fold: 'FOLD',
    holdToFold: 'Hold button to fold round',
    releaseToCancel: 'Release to cancel',

    matchMoveTitle: 'Perfect',
    higherMoveTitle: 'Over',
    sumMoveTitle: 'Sum',
    splitMoveTitle: 'Split',

    errSelectCards: 'Select cards',
    errSelectPlayerCard: 'Select your card',
    errSelectWolfCard: 'Select wolf card',
    errCardSmaller: 'Card is smaller',
    errSumMismatch: 'Sum mismatch',
    errSplitMismatch: 'Split mismatch',
    errInvalidSelection: 'Invalid selection',

    descMatch: (p, w) => `${p} = ${w} matched! You draw 1 new card.`,
    descHigher: (p, w, d) => `${p} > ${w} (Diff: +${d}). Wolf draws ${d} card(s).`,
    descSum: (f, s, w) => `(${f} = ${s}) captures Wolf's ${w}! You draw 1 card.`,
    descSplit: (p, f, s) => `Player ${p} splits Wolf's (${f} = ${s})! Wolf draws 1 card.`,
    descFold: (pts) => `Player folded. Wolf scores ${pts} points remaining in hand.`,
    descClear: (pts) => `Wolf's hand cleared! You score ${pts} points remaining in your hand.`,

    rulesTitle: 'Lobo Game Rules',
    rulesGoalHeader: 'Objective',
    rulesGoalText: 'In Lobo, both Player and Wolf start with a face-up hand of 4 cards. Your goal is to eliminate all cards from the Wolf\'s hand using your own cards. First to reach 100 points wins the game!',
    rulesMovesHeader: 'Available Actions (Wolf does not take turns, you make all actions)',
    rulesPerfectTitle: 'Perfect Match',
    rulesPerfectDesc: 'Play 1 card from your hand to capture 1 card of the same rank from the Wolf\'s hand, then draw 1 card.',
    rulesSumTitle: 'Sum',
    rulesSumDesc: 'Play more than 1 card from your hand adding up exactly to 1 card in the Wolf\'s hand, then draw 1 card.',
    rulesSplitTitle: 'Split',
    rulesSplitDesc: 'Play 1 card to capture multiple cards from the Wolf adding up exactly to your card\'s value. Wolf draws 1 card.',
    rulesOverTitle: 'Over / Higher',
    rulesOverDesc: 'Play 1 higher card to capture 1 smaller card from the Wolf. Wolf draws 1 card for every point of difference.',
    rulesFoldTitle: 'Fold',
    rulesFoldDesc: 'If you cannot safely make any more plays, hold the button to fold the round.',
    rulesScoringHeader: 'Scoring',
    rulesScoringClear: 'If Wolf\'s hand is emptied: You score the sum of points remaining in your hand.',
    rulesScoringFold: 'If you Fold: Wolf scores the points remaining in their hand.',
    rulesScoringWin: 'First to reach 100 points wins the match.',
    closeBtn: 'Got it',

    roundWonTitle: 'You Defeated the Wolf!',
    roundLostTitle: 'Round Folded / Lost',
    roundWonSubtitle: 'You completely cleared the Wolf\'s hand.',
    roundLostSubtitle: 'You folded the round and Wolf scored their remaining hand.',
    playerHandScoreLabel: 'Your Hand Points Scored',
    wolfHandScoreLabel: 'Wolf Hand Points Scored',
    totalScoreLabel: 'Total Scoreboard',
    nextRoundBtn: 'Next Round',

    gameOverWinTitle: 'Victory! You Won the Match!',
    gameOverLossTitle: 'Wolf Won the Match!',
    gameOverWinDesc: 'You reached 100 points and outsmarted the Wolf!',
    gameOverLossDesc: 'The Wolf reached 100 points first. Play again to take revenge!',
    finalScoreLabel: 'Final Score',
    playAgainBtn: 'Play Again',

    resetTitle: 'Reset Game',
    resetDesc: 'All scores and current progress will be reset. Are you sure you want to start over?',
    confirmBtn: 'Yes, Reset',
    cancelBtn: 'Cancel',

    moveLogTitle: 'Move History',
    noMovesYet: 'No moves played yet.',
    foldActionTitle: 'Round Folded',
    deckExhaustedTitle: 'Deck Exhausted',
    deckExhaustedDesc: 'All cards in the draw deck have been depleted.',

    noValidMoveHint: 'No valid move found with the current selection.',
    hintPrefix: 'Hint',
  },
};
