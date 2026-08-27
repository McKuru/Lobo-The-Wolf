export type Language = 'tr' | 'en';

export interface Translations {
  // Header & Menu
  appTitle: string;
  targetScore: string;
  round: string;
  hint: string;
  history: string;
  rules: string;
  settings: string;
  gameModes: string;
  mainMenu: string;
  sound: string;
  mute: string;
  unmute: string;
  reset: string;
  language: string;
  wolfLabel: string;
  youLabel: string;
  backToGame: string;
  returnToMenu: string;
  points: string;

  // Main Menu Specific
  menuSubtitle: string;
  playBtn: string;
  gameModeBtn: string;
  settingsBtn: string;
  rulesBtn: string;
  historyBtn: string;

  // Game Modes
  modeClassicTitle: string;
  modeClassicDesc: string;
  modeLuckyTitle: string;
  modeLuckyDesc: string;
  modeExtraTitle: string;
  modeExtraDesc: string;
  selectGameMode: string;
  currentModeBadge: string;

  // Audio / Settings Modal
  settingsTitle: string;
  soundSettings: string;
  bgmVolumeLabel: string;
  sfxVolumeLabel: string;
  muteToggleLabel: string;
  languageSelectLabel: string;

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
  releaseToFold: string;

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
  descNoMovesFold: (wPoints: number) => string;
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
  roundNoMovesTitle: string;
  roundWonSubtitle: string;
  roundLostSubtitle: string;
  roundNoMovesSubtitle: string;
  roundScoreTitle: string;
  scoringCards: string;
  playerHandScoreLabel: string;
  wolfHandScoreLabel: string;
  totalScoreLabel: string;
  nextRoundBtn: string;

  // Modals - Game Over & Stats
  gameOverWinTitle: string;
  gameOverLossTitle: string;
  gameOverWinDesc: string;
  gameOverLossDesc: string;
  finalScoreLabel: string;
  targetReached: string;
  statRoundsPlayed: string;
  statRoundsWon: string;
  statMatchesMade: string;
  statSumSplitMoves: string;
  statHighestScore: string;
  playAgainBtn: string;

  // Modals - Reset Confirm
  resetTitle: string;
  resetDesc: string;
  resetNote: string;
  confirmBtn: string;
  cancelBtn: string;

  // Move History Drawer
  moveLogTitle: string;
  noMovesYet: string;
  foldActionTitle: string;
  noMovesActionTitle: string;
  deckExhaustedTitle: string;
  deckExhaustedDesc: string;

  // Hints & Toasts
  noValidMoveHint: string;
  noMovesToast: string;
  hintPrefix: string;
  deckShuffledToast: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    appTitle: 'Lobo The Wolf',
    targetScore: 'HEDEF',
    round: 'TUR',
    hint: 'İpucu',
    history: 'Geçmiş',
    rules: 'Kurallar',
    settings: 'Ayarlar',
    gameModes: 'Oyun Modu',
    mainMenu: 'Ana Menü',
    sound: 'Ses',
    mute: 'Sesi Kapat',
    unmute: 'Sesi Aç',
    reset: 'Sıfırla',
    language: 'Dil',
    wolfLabel: 'KURT',
    youLabel: 'SEN',
    backToGame: 'Oyuna Dön',
    returnToMenu: 'Menüye Dön',
    points: 'Puan',

    menuSubtitle: 'Strateji, Şans ve Kurt ile Mücadele',
    playBtn: 'Oyna',
    gameModeBtn: 'Oyun Modu',
    settingsBtn: 'Ayarlar',
    rulesBtn: 'Kurallar',
    historyBtn: 'Geçmiş',

    modeClassicTitle: 'Klasik Mod',
    modeClassicDesc: 'Standart Lobo kuralları. Oyuncu ve Kurt 4\'er kartla başlar.',
    modeLuckyTitle: '5x Şans Modu',
    modeLuckyDesc: 'Yeni başlayanlar için! Oyuncuya daha yüksek ve eşleşen şanslı kartlar gelir.',
    modeExtraTitle: 'Ekstra Kart Modu',
    modeExtraDesc: 'İnsan 6 kartla, Kurt ise 5 kartla oyuna başlar.',
    selectGameMode: 'Oyun Modunu Seç',
    currentModeBadge: 'Aktif Mod',

    settingsTitle: 'Ses ve Oyun Ayarları',
    soundSettings: 'Ses Düzeyleri',
    bgmVolumeLabel: 'Müzik Sesi (Lo-Fi Beat)',
    sfxVolumeLabel: 'Ses Efektleri',
    muteToggleLabel: 'Tüm Sesleri Kapat',
    languageSelectLabel: 'Arayüz Dili',

    wolfHandTitle: 'KURT ELİ',
    playerHandTitle: 'SENİN ELİN',
    cardCount: 'Kart',
    selectedCardsCount: 'Seçili',
    deckRemaining: 'Kalan Deste',

    play: 'OYNA',
    invalid: 'GEÇERSİZ',
    fold: 'Çekil',
    holdToFold: 'Çekil',
    releaseToCancel: 'İptal için bırakın',
    releaseToFold: 'Bırakın',

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
    descNoMovesFold: (pts) => `Oynanabilir hamle kalmadı, otomatik çekilindi. Kurt elindeki ${pts} puanı aldı.`,
    descClear: (pts) => `Kurt'un tüm kartları temizlendi! Kalan elinizdeki ${pts} puanı aldınız.`,

    rulesTitle: 'Lobo Oyun Kuralları',
    rulesGoalHeader: 'Oyunun Amacı',
    rulesGoalText: 'Lobo oyununda Oyuncu ve Kurt açık kartlarla başlar. Amacınız elinizdeki kartları kullanarak Kurt\'un elindeki tüm kartları yok etmektir. 100 puana ilk ulaşan oyunu kazanır!',
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
    closeBtn: 'Kapat',

    roundWonTitle: 'Kurt\'u Yendiniz!',
    roundLostTitle: 'Tur Kaybedildi!',
    roundNoMovesTitle: 'Hamle Kalmadı!',
    roundWonSubtitle: 'Kurt\'un elindeki tüm kartları başarıyla yok ettiniz.',
    roundLostSubtitle: 'Turdan çekildiniz ve Kurt kalan puanları topladı.',
    roundNoMovesSubtitle: 'Elinizde oynanabilecek geçerli hiçbir hamle kalmadığı için otomatik çekilindi.',
    roundScoreTitle: 'Kazanılan Tur Puanı',
    scoringCards: 'Puan Veren Kartlar',
    playerHandScoreLabel: 'Elinizde Kalan Kart Puanı',
    wolfHandScoreLabel: 'Kurt\'un Kalan Kart Puanı',
    totalScoreLabel: 'Toplam Skor Tablosu',
    nextRoundBtn: 'Sonraki Tura Geç',

    gameOverWinTitle: 'Zafer! Şampiyon Oldunuz!',
    gameOverLossTitle: 'Kurt Maçı Kazandı!',
    gameOverWinDesc: '100 puana ulaşarak Lobo\'yu zekanız ve stratejinizle mağlup ettiniz!',
    gameOverLossDesc: 'Kurt 100 puana sizden önce ulaştı. Tekrar deneyip intikamını al!',
    finalScoreLabel: 'Final Skoru',
    targetReached: 'Hedefe Ulaşıldı (100+)',
    statRoundsPlayed: 'Oynanan Tur Sayısı',
    statRoundsWon: 'Kazanılan Tur Sayısı',
    statMatchesMade: 'Yapılan Eşleşmeler',
    statSumSplitMoves: 'Toplama ve Bölme Hamleleri',
    statHighestScore: 'En Yüksek Tur Skoru',
    playAgainBtn: 'Yeniden Oyna',

    resetTitle: 'Oyunu Sıfırla',
    resetDesc: 'Tüm skorlar ve mevcut ilerleme sıfırlanacak. Baştan başlamak istediğinize emin misiniz?',
    resetNote: 'Bu işlem geri alınamaz. Sıfırlandıktan sonra 1. turdan başlarsınız.',
    confirmBtn: 'Evet, Sıfırla',
    cancelBtn: 'Vazgeç',

    moveLogTitle: 'Hamle Geçmişi',
    noMovesYet: 'Henüz bir hamle yapılmadı.',
    foldActionTitle: 'Turdan Çekilme',
    noMovesActionTitle: 'Hamle Kalmadı (Otomatik Çekilme)',
    deckExhaustedTitle: 'Deste Bitti',
    deckExhaustedDesc: 'Destedeki tüm kartlar tükendi.',

    noValidMoveHint: 'Mevcut seçimle geçerli bir hamle bulunamadı.',
    noMovesToast: 'Geçerli hamle kalmadı! Otomatik çekilindi.',
    hintPrefix: 'İpucu',
    deckShuffledToast: 'Deste karıştırıldı!',
  },
  en: {
    appTitle: 'Lobo The Wolf',
    targetScore: 'TARGET',
    round: 'ROUND',
    hint: 'Hint',
    history: 'History',
    rules: 'Rules',
    settings: 'Settings',
    gameModes: 'Game Mode',
    mainMenu: 'Main Menu',
    sound: 'Sound',
    mute: 'Mute',
    unmute: 'Unmute',
    reset: 'Reset',
    language: 'Language',
    wolfLabel: 'WOLF',
    youLabel: 'YOU',
    backToGame: 'Back to Game',
    returnToMenu: 'Back to Menu',
    points: 'Points',

    menuSubtitle: 'Strategy, Luck & Battle Against The Wolf',
    playBtn: 'Play',
    gameModeBtn: 'Game Mode',
    settingsBtn: 'Settings',
    rulesBtn: 'Rules',
    historyBtn: 'History',

    modeClassicTitle: 'Classic Mode',
    modeClassicDesc: 'Standard Lobo rules. Player and Wolf start with 4 cards each.',
    modeLuckyTitle: '5x Luck Mode',
    modeLuckyDesc: 'Ideal for beginners! Player receives lucky high cards and easy matches.',
    modeExtraTitle: 'Extra Cards Mode',
    modeExtraDesc: 'Human starts with 6 cards, while Wolf starts with 5 cards.',
    selectGameMode: 'Select Game Mode',
    currentModeBadge: 'Active Mode',

    settingsTitle: 'Audio & Preferences',
    soundSettings: 'Audio Levels',
    bgmVolumeLabel: 'Music Volume (Lo-Fi Beat)',
    sfxVolumeLabel: 'Sound Effects Volume',
    muteToggleLabel: 'Mute All Sounds',
    languageSelectLabel: 'Display Language',

    wolfHandTitle: 'WOLF HAND',
    playerHandTitle: 'YOUR HAND',
    cardCount: 'Cards',
    selectedCardsCount: 'Selected',
    deckRemaining: 'Deck Remaining',

    play: 'PLAY',
    invalid: 'INVALID',
    fold: 'Fold',
    holdToFold: 'Fold',
    releaseToCancel: 'Release to cancel',
    releaseToFold: 'Release',

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
    descNoMovesFold: (pts) => `No valid moves remaining, automatically folded. Wolf scores ${pts} points.`,
    descClear: (pts) => `Wolf's hand cleared! You score ${pts} points remaining in your hand.`,

    rulesTitle: 'Lobo Game Rules',
    rulesGoalHeader: 'Objective',
    rulesGoalText: 'In Lobo, both Player and Wolf start with face-up hands. Your goal is to eliminate all cards from the Wolf\'s hand using your own cards. First to reach 100 points wins the game!',
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
    closeBtn: 'Close',

    roundWonTitle: 'You Defeated the Wolf!',
    roundLostTitle: 'Round Folded / Lost',
    roundNoMovesTitle: 'No Moves Left!',
    roundWonSubtitle: 'You completely cleared the Wolf\'s hand.',
    roundLostSubtitle: 'You folded the round and Wolf scored their remaining hand.',
    roundNoMovesSubtitle: 'No valid moves could be played with your hand. The round was automatically folded.',
    roundScoreTitle: 'Round Points Earned',
    scoringCards: 'Scoring Cards',
    playerHandScoreLabel: 'Your Hand Points Scored',
    wolfHandScoreLabel: 'Wolf Hand Points Scored',
    totalScoreLabel: 'Total Scoreboard',
    nextRoundBtn: 'Next Round',

    gameOverWinTitle: 'Victory! You Won the Match!',
    gameOverLossTitle: 'Wolf Won the Match!',
    gameOverWinDesc: 'You reached 100 points and outsmarted the Wolf!',
    gameOverLossDesc: 'The Wolf reached 100 points first. Play again to take revenge!',
    finalScoreLabel: 'Final Score',
    targetReached: 'Target Reached (100+)',
    statRoundsPlayed: 'Rounds Played',
    statRoundsWon: 'Rounds Won',
    statMatchesMade: 'Matches Made',
    statSumSplitMoves: 'Sum & Split Moves',
    statHighestScore: 'Highest Round Score',
    playAgainBtn: 'Play Again',

    resetTitle: 'Reset Game',
    resetDesc: 'All scores and current progress will be reset. Are you sure you want to start over?',
    resetNote: 'This action cannot be undone. You will restart from Round 1.',
    confirmBtn: 'Yes, Reset',
    cancelBtn: 'Cancel',

    moveLogTitle: 'Move History',
    noMovesYet: 'No moves played yet.',
    foldActionTitle: 'Round Folded',
    noMovesActionTitle: 'No Moves Left (Auto-Folded)',
    deckExhaustedTitle: 'Deck Exhausted',
    deckExhaustedDesc: 'All cards in the draw deck have been depleted.',

    noValidMoveHint: 'No valid move found with the current selection.',
    noMovesToast: 'No valid moves left! Automatically folded.',
    hintPrefix: 'Hint',
    deckShuffledToast: 'Deck shuffled!',
  },
};
