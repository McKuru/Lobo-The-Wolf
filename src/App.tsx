import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Card,
  GameMode,
  GameState,
  MoveLogItem,
  RoundResult,
} from './types';
import {
  dealNewRound,
  validateMove,
  drawCards,
  calculateCardsValue,
  findPossibleMoves,
  shuffleDeck,
} from './utils/gameLogic';
import { soundManager } from './utils/audio';
import { Language, translations } from './utils/i18n';

// Components
import { MainMenu } from './components/MainMenu';
import { HeaderBar } from './components/HeaderBar';
import { WolfZone } from './components/WolfZone';
import { PlayerZone } from './components/PlayerZone';
import { CenterActionButton } from './components/CenterActionButton';
import { AftermathModal } from './components/AftermathModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { MoveLogDrawer } from './components/MoveLogDrawer';
import { GameModeModal } from './components/GameModeModal';
import { SettingsModal } from './components/SettingsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { Shuffle, Info, AlertTriangle } from 'lucide-react';

export function App() {
  // Navigation / View State: Start in Main Menu
  const [isInGame, setIsInGame] = useState(false);

  // Active Language State (defaults to 'tr')
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('lobo_lang');
    return savedLang === 'en' || savedLang === 'tr' ? savedLang : 'tr';
  });

  const t = translations[lang];

  // Active Game Mode
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const saved = localStorage.getItem('lobo_gamemode');
    return saved === 'lucky_5x' || saved === 'extra_cards' || saved === 'classic'
      ? saved
      : 'classic';
  });

  // Game State
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialDeal = dealNewRound(gameMode);
    return {
      playerHand: initialDeal.playerHand,
      wolfHand: initialDeal.wolfHand,
      deck: initialDeal.deck,
      selectedPlayerCardIds: [],
      selectedWolfCardIds: [],
      playerTotalScore: 0,
      wolfTotalScore: 0,
      currentRound: 1,
      targetScore: 100,
      gameMode: gameMode,
      isRoundOver: false,
      roundResult: null,
      isGameOver: false,
      gameWinner: null,
      moveHistory: [],
      stats: {
        roundsPlayed: 0,
        playerRoundsWon: 0,
        wolfRoundsWon: 0,
        totalMatchesMade: 0,
        totalSumMoves: 0,
        totalSplitMoves: 0,
        totalHigherMoves: 0,
        highestRoundScore: 0,
      },
    };
  });

  // UI Modals State
  const [isMuted, setIsMuted] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [shuffleNotification, setShuffleNotification] = useState<string | null>(null);
  const [noMovesNotification, setNoMovesNotification] = useState<string | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [hintedCardIds, setHintedCardIds] = useState<string[]>([]);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Auto-start background music on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      soundManager.startMusic();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Handle Game Mode Change
  const handleSelectGameMode = (newMode: GameMode) => {
    setGameMode(newMode);
    localStorage.setItem('lobo_gamemode', newMode);

    // Deal fresh round with new game mode rules
    const freshDeal = dealNewRound(newMode);
    setMoveCount(0);
    setGameState((prev) => ({
      ...prev,
      gameMode: newMode,
      playerHand: freshDeal.playerHand,
      wolfHand: freshDeal.wolfHand,
      deck: freshDeal.deck,
      selectedPlayerCardIds: [],
      selectedWolfCardIds: [],
      isRoundOver: false,
      roundResult: null,
    }));
    setHintedCardIds([]);
    setHintMessage(null);
  };

  // Derive selected card objects
  const selectedPlayerCards = useMemo(() => {
    return gameState.playerHand.filter((c) =>
      gameState.selectedPlayerCardIds.includes(c.id)
    );
  }, [gameState.playerHand, gameState.selectedPlayerCardIds]);

  const selectedWolfCards = useMemo(() => {
    return gameState.wolfHand.filter((c) =>
      gameState.selectedWolfCardIds.includes(c.id)
    );
  }, [gameState.wolfHand, gameState.selectedWolfCardIds]);

  const hasSelection =
    gameState.selectedPlayerCardIds.length > 0 ||
    gameState.selectedWolfCardIds.length > 0;

  // Move validation with current language
  const validation = useMemo(() => {
    return validateMove(
      selectedPlayerCards,
      selectedWolfCards,
      gameState.deck.length,
      lang
    );
  }, [selectedPlayerCards, selectedWolfCards, gameState.deck.length, lang]);

  // Card Selection Handlers
  const handleTogglePlayerCard = (cardId: string) => {
    setHintedCardIds([]);
    setHintMessage(null);
    setGameState((prev) => {
      const isAlready = prev.selectedPlayerCardIds.includes(cardId);
      if (isAlready) {
        soundManager.playCardDeselect();
        return {
          ...prev,
          selectedPlayerCardIds: prev.selectedPlayerCardIds.filter(
            (id) => id !== cardId
          ),
        };
      } else {
        soundManager.playCardSelect();
        return {
          ...prev,
          selectedPlayerCardIds: [...prev.selectedPlayerCardIds, cardId],
        };
      }
    });
  };

  const handleToggleWolfCard = (cardId: string) => {
    setHintedCardIds([]);
    setHintMessage(null);
    setGameState((prev) => {
      const isAlready = prev.selectedWolfCardIds.includes(cardId);
      if (isAlready) {
        soundManager.playCardDeselect();
        return {
          ...prev,
          selectedWolfCardIds: prev.selectedWolfCardIds.filter(
            (id) => id !== cardId
          ),
        };
      } else {
        soundManager.playCardSelect();
        return {
          ...prev,
          selectedWolfCardIds: [...prev.selectedWolfCardIds, cardId],
        };
      }
    });
  };

  // Play Move Execution
  const handlePlayMove = () => {
    if (!validation.isValid || !validation.type) return;

    const moveType = validation.type;
    const moveTitle = validation.title || (lang === 'tr' ? 'Hamle' : 'Move');
    const drawnCount = validation.cardsDrawnCount || 0;
    const drawnBy = validation.drawnBy || 'player';

    soundManager.playMoveSuccess(moveType);

    setGameState((prev) => {
      // 1. Remove selected cards from hands
      const remainingPlayerHand = prev.playerHand.filter(
        (c) => !prev.selectedPlayerCardIds.includes(c.id)
      );
      const remainingWolfHand = prev.wolfHand.filter(
        (c) => !prev.selectedWolfCardIds.includes(c.id)
      );

      // 2. Draw cards from deck using game mode logic
      const drawResult = drawCards(
        prev.deck,
        drawnCount,
        drawnBy,
        remainingWolfHand,
        prev.gameMode
      );
      let newDeck = drawResult.remainingDeck;
      const drawnCards: Card[] = drawResult.drawnCards;

      // Check if this 3rd hand triggers a deck shuffle
      const nextMoveCount = moveCount + 1;
      setMoveCount(nextMoveCount);

      if (nextMoveCount % 3 === 0 && newDeck.length > 1) {
        newDeck = shuffleDeck(newDeck);
        soundManager.playShuffle();
        setShuffleNotification(t.deckShuffledToast);
        setTimeout(() => setShuffleNotification(null), 2500);
      }

      if (drawnCards.length > 0) {
        if (drawnBy === 'player') {
          soundManager.playCardDraw();
        } else {
          soundManager.playWolfDraw();
        }
      }

      const nextPlayerHand =
        drawnBy === 'player'
          ? [...remainingPlayerHand, ...drawnCards]
          : remainingPlayerHand;
      const nextWolfHand =
        drawnBy === 'wolf'
          ? [...remainingWolfHand, ...drawnCards]
          : remainingWolfHand;

      // 3. Create log item
      const logItem: MoveLogItem = {
        id: `move-${Date.now()}`,
        timestamp: Date.now(),
        type: moveType,
        description:
          validation.description ||
          (lang === 'tr'
            ? `${moveTitle} tamamlandı.`
            : `${moveTitle} completed.`),
        playerCards: selectedPlayerCards,
        wolfCards: selectedWolfCards,
        cardsDrawn: drawnCards.length,
        drawer: drawnBy,
      };

      // 4. Update stats
      const nextStats = { ...prev.stats };
      if (moveType === 'match') nextStats.totalMatchesMade += 1;
      if (moveType === 'sum') nextStats.totalSumMoves += 1;
      if (moveType === 'split') nextStats.totalSplitMoves += 1;
      if (moveType === 'higher') nextStats.totalHigherMoves += 1;

      // 5. Check if Wolf's hand is completely emptied (Round Win by Player!)
      if (nextWolfHand.length === 0) {
        const roundScore = calculateCardsValue(nextPlayerHand);
        const nextPlayerScore = prev.playerTotalScore + roundScore;
        nextStats.roundsPlayed += 1;
        nextStats.playerRoundsWon += 1;
        nextStats.highestRoundScore = Math.max(
          nextStats.highestRoundScore,
          roundScore
        );

        const result: RoundResult = {
          winner: 'player',
          playerRoundScore: roundScore,
          wolfRoundScore: 0,
          playerCardsRemaining: nextPlayerHand,
          wolfCardsRemaining: [],
          reason: 'wolf_empty',
          cardsTotalScore: roundScore,
        };

        const isGameWon = nextPlayerScore >= prev.targetScore;

        return {
          ...prev,
          playerHand: nextPlayerHand,
          wolfHand: nextWolfHand,
          deck: newDeck,
          selectedPlayerCardIds: [],
          selectedWolfCardIds: [],
          playerTotalScore: nextPlayerScore,
          isRoundOver: true,
          roundResult: result,
          isGameOver: isGameWon,
          gameWinner: isGameWon ? 'player' : null,
          moveHistory: [logItem, ...prev.moveHistory],
          stats: nextStats,
        };
      }

      return {
        ...prev,
        playerHand: nextPlayerHand,
        wolfHand: nextWolfHand,
        deck: newDeck,
        selectedPlayerCardIds: [],
        selectedWolfCardIds: [],
        moveHistory: [logItem, ...prev.moveHistory],
        stats: nextStats,
      };
    });
  };

  // Surrender (Çekilme) / Auto-fold Execution
  const handleSurrender = useCallback((reason: 'player_surrender' | 'no_valid_moves' = 'player_surrender') => {
    setGameState((prev) => {
      if (prev.isRoundOver) return prev;

      const roundScore = calculateCardsValue(prev.wolfHand);
      const nextWolfScore = prev.wolfTotalScore + roundScore;
      const nextStats = { ...prev.stats };
      nextStats.roundsPlayed += 1;
      nextStats.wolfRoundsWon += 1;

      const result: RoundResult = {
        winner: 'wolf',
        playerRoundScore: 0,
        wolfRoundScore: roundScore,
        playerCardsRemaining: prev.playerHand,
        wolfCardsRemaining: prev.wolfHand,
        reason,
        cardsTotalScore: roundScore,
      };

      const isWolfGameWon = nextWolfScore >= prev.targetScore;

      // Add fold entry to move log
      const foldLog: MoveLogItem = {
        id: `fold-${Date.now()}`,
        timestamp: Date.now(),
        type: 'higher',
        description: reason === 'no_valid_moves'
          ? (translations[lang].descNoMovesFold(roundScore))
          : (translations[lang].descFold(roundScore)),
        playerCards: [],
        wolfCards: prev.wolfHand,
        cardsDrawn: 0,
        drawer: 'wolf',
      };

      return {
        ...prev,
        wolfTotalScore: nextWolfScore,
        isRoundOver: true,
        roundResult: result,
        isGameOver: isWolfGameWon,
        gameWinner: isWolfGameWon ? 'wolf' : null,
        selectedPlayerCardIds: [],
        selectedWolfCardIds: [],
        moveHistory: [foldLog, ...prev.moveHistory],
        stats: nextStats,
      };
    });
  }, [lang]);

  // Automatic Fold when no valid moves exist
  useEffect(() => {
    if (!isInGame || gameState.isRoundOver || gameState.isGameOver) return;
    if (gameState.playerHand.length === 0 || gameState.wolfHand.length === 0) return;

    const possibleMoves = findPossibleMoves(
      gameState.playerHand,
      gameState.wolfHand,
      gameState.deck.length,
      lang
    );

    if (possibleMoves.length === 0) {
      setNoMovesNotification(t.noMovesToast);
      const timer = setTimeout(() => {
        handleSurrender('no_valid_moves');
        setNoMovesNotification(null);
      }, 900);

      return () => clearTimeout(timer);
    } else {
      setNoMovesNotification(null);
    }
  }, [
    isInGame,
    gameState.playerHand,
    gameState.wolfHand,
    gameState.deck.length,
    gameState.isRoundOver,
    gameState.isGameOver,
    handleSurrender,
    lang,
    t.noMovesToast,
  ]);

  // Advance to Next Round
  const handleNextRound = () => {
    const freshDeal = dealNewRound(gameState.gameMode);
    setMoveCount(0);
    setGameState((prev) => ({
      ...prev,
      playerHand: freshDeal.playerHand,
      wolfHand: freshDeal.wolfHand,
      deck: freshDeal.deck,
      selectedPlayerCardIds: [],
      selectedWolfCardIds: [],
      currentRound: prev.currentRound + 1,
      isRoundOver: false,
      roundResult: null,
    }));
    setHintedCardIds([]);
    setHintMessage(null);
    setNoMovesNotification(null);
  };

  // Restart Entire Game
  const handleRestartGame = () => {
    const freshDeal = dealNewRound(gameMode);
    setMoveCount(0);
    setGameState({
      playerHand: freshDeal.playerHand,
      wolfHand: freshDeal.wolfHand,
      deck: freshDeal.deck,
      selectedPlayerCardIds: [],
      selectedWolfCardIds: [],
      playerTotalScore: 0,
      wolfTotalScore: 0,
      currentRound: 1,
      targetScore: 100,
      gameMode: gameMode,
      isRoundOver: false,
      roundResult: null,
      isGameOver: false,
      gameWinner: null,
      moveHistory: [],
      stats: {
        roundsPlayed: 0,
        playerRoundsWon: 0,
        wolfRoundsWon: 0,
        totalMatchesMade: 0,
        totalSumMoves: 0,
        totalSplitMoves: 0,
        totalHigherMoves: 0,
        highestRoundScore: 0,
      },
    });
    setHintedCardIds([]);
    setHintMessage(null);
    setNoMovesNotification(null);
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  };

  // Language Change
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lobo_lang', newLang);
  };

  // Hint Solver Trigger
  const handleShowHints = () => {
    const moves = findPossibleMoves(
      gameState.playerHand,
      gameState.wolfHand,
      gameState.deck.length,
      lang
    );

    if (moves.length === 0) {
      setHintMessage(
        lang === 'tr'
          ? 'Şu an oynanabilir hiçbir hamle kalmadı. Otomatik olarak çekiliniyor...'
          : 'No moves left to play right now. Automatically folding...'
      );
      setHintedCardIds([]);
      soundManager.playInvalid();
      return;
    }

    // Pick top favorable move
    const bestMove = moves[0];
    setHintedCardIds([...bestMove.playerCardIds, ...bestMove.wolfCardIds]);
    setGameState((prev) => ({
      ...prev,
      selectedPlayerCardIds: bestMove.playerCardIds,
      selectedWolfCardIds: bestMove.wolfCardIds,
    }));
    setHintMessage(
      lang === 'tr'
        ? `💡 Öneri: ${bestMove.explanation}`
        : `💡 Hint: ${bestMove.explanation}`
    );
    soundManager.playCardSelect();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#11111b] text-[#cdd6f4] font-sans select-none overflow-hidden relative">
      {/* If not in-game, render the Main Menu screen */}
      {!isInGame ? (
        <MainMenu
          onStartGame={() => {
            soundManager.startMusic();
            setIsInGame(true);
          }}
          onOpenGameModes={() => setShowGameModes(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenRules={() => setShowRules(true)}
          currentMode={gameMode}
          stats={gameState.stats}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          lang={lang}
          onLanguageChange={handleLanguageChange}
        />
      ) : (
        <>
          {/* Header Bar */}
          <HeaderBar
            playerScore={gameState.playerTotalScore}
            wolfScore={gameState.wolfTotalScore}
            currentRound={gameState.currentRound}
            targetScore={gameState.targetScore}
            currentMode={gameState.gameMode}
            isMuted={isMuted}
            lang={lang}
            onOpenMenu={() => setIsInGame(false)}
            onOpenGameModes={() => setShowGameModes(true)}
            onOpenSettings={() => setShowSettings(true)}
            onShowRules={() => setShowRules(true)}
            onShowHints={handleShowHints}
            onToggleHistory={() => setShowHistory(true)}
            onResetGame={() => setShowResetConfirm(true)}
          />

          {/* Shuffle Alert Notification Toast */}
          <AnimatePresence>
            {shuffleNotification && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#89b4fa] text-[#11111b] rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20"
              >
                <Shuffle className="w-4 h-4 animate-spin" />
                <span>{shuffleNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Moves Left Auto-Fold Notification Toast */}
          <AnimatePresence>
            {noMovesNotification && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#fab387] text-[#11111b] rounded-full font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-white/20"
              >
                <AlertTriangle className="w-4 h-4 animate-pulse text-[#11111b]" />
                <span>{noMovesNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint Alert Notification Bar */}
          <AnimatePresence>
            {hintMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#181825] border-b border-[#f9e2af]/40 px-4 py-1.5 flex items-center justify-between text-xs text-[#f9e2af] z-30"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{hintMessage}</span>
                </div>
                <button
                  onClick={() => setHintMessage(null)}
                  className="text-[#a6adc8] hover:text-[#cdd6f4] text-xs px-2 py-0.5 rounded cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Game Stage: Split Horizontally */}
          <main className="flex-1 flex flex-col justify-between relative overflow-hidden bg-[#1e1e2e]">
            {/* Top Half: Wolf Zone */}
            <WolfZone
              wolfCards={gameState.wolfHand}
              selectedCardIds={gameState.selectedWolfCardIds}
              hintedCardIds={hintedCardIds}
              onToggleCard={handleToggleWolfCard}
              disabled={gameState.isRoundOver}
              lang={lang}
            />

            {/* Center Dynamic Action Button & Central Dashed Divider */}
            <div className="h-1 flex items-center justify-center relative z-20 w-full">
              <div className="w-full border-t-2 border-dashed border-[#313244] pointer-events-none" />
              <div className="absolute">
                <CenterActionButton
                  hasSelection={hasSelection}
                  validation={validation}
                  onPlayMove={handlePlayMove}
                  onSurrender={() => handleSurrender('player_surrender')}
                  disabled={gameState.isRoundOver}
                  lang={lang}
                />
              </div>
            </div>

            {/* Bottom Half: Player Zone */}
            <PlayerZone
              playerCards={gameState.playerHand}
              deck={gameState.deck}
              selectedCardIds={gameState.selectedPlayerCardIds}
              hintedCardIds={hintedCardIds}
              onToggleCard={handleTogglePlayerCard}
              disabled={gameState.isRoundOver}
              lang={lang}
            />
          </main>
        </>
      )}

      {/* Game Mode Selection Modal */}
      <GameModeModal
        isOpen={showGameModes}
        currentMode={gameMode}
        onSelectMode={handleSelectGameMode}
        onClose={() => setShowGameModes(false)}
        lang={lang}
      />

      {/* Settings / Sound Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onResetGame={() => {
          setShowSettings(false);
          setShowResetConfirm(true);
        }}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={showResetConfirm}
        lang={lang}
        onConfirm={() => {
          handleRestartGame();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Round End Aftermath Modal */}
      <AnimatePresence>
        {gameState.isRoundOver && gameState.roundResult && !gameState.isGameOver && (
          <AftermathModal
            roundResult={gameState.roundResult}
            playerTotalScore={gameState.playerTotalScore}
            wolfTotalScore={gameState.wolfTotalScore}
            currentRound={gameState.currentRound}
            targetScore={gameState.targetScore}
            onNextRound={handleNextRound}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Grand Game Over / Championship Modal */}
      <AnimatePresence>
        {gameState.isGameOver && gameState.gameWinner && (
          <GameOverModal
            winner={gameState.gameWinner}
            playerTotalScore={gameState.playerTotalScore}
            wolfTotalScore={gameState.wolfTotalScore}
            stats={gameState.stats}
            onRestartGame={handleRestartGame}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        lang={lang}
      />

      {/* Move Log Drawer */}
      <MoveLogDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        logs={gameState.moveHistory}
        lang={lang}
      />
    </div>
  );
}

export default App;
