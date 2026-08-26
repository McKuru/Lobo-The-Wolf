import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, GameState, MoveLogItem, RoundResult } from './types';
import {
  dealNewRound,
  validateMove,
  findPossibleMoves,
  calculateCardsValue,
  shuffleDeck,
} from './utils/gameLogic';
import { soundManager } from './utils/audio';
import { Language, translations } from './utils/i18n';
import { HeaderBar } from './components/HeaderBar';
import { WolfZone } from './components/WolfZone';
import { PlayerZone } from './components/PlayerZone';
import { CenterActionButton } from './components/CenterActionButton';
import { AftermathModal } from './components/AftermathModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { MoveLogDrawer } from './components/MoveLogDrawer';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { AnimatePresence, motion } from 'motion/react';
import { Info, Shuffle } from 'lucide-react';

export default function App() {
  // Language State with localStorage persistence
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lobo_lang');
    return saved === 'en' || saved === 'tr' ? saved : 'tr';
  });

  const t = translations[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lobo_lang', newLang);
  };

  // Game State
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialDeal = dealNewRound();
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

  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [shuffleNotification, setShuffleNotification] = useState<string | null>(null);
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

      // 2. Draw cards from deck
      let newDeck = [...prev.deck];
      const drawnCards: Card[] = [];
      for (let i = 0; i < drawnCount && newDeck.length > 0; i++) {
        drawnCards.push(newDeck.shift()!);
      }

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

  // Surrender (Çekilme) Execution
  const handleSurrender = useCallback(() => {
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
        reason: 'player_surrender',
        cardsTotalScore: roundScore,
      };

      const isWolfGameWon = nextWolfScore >= prev.targetScore;

      return {
        ...prev,
        wolfTotalScore: nextWolfScore,
        isRoundOver: true,
        roundResult: result,
        isGameOver: isWolfGameWon,
        gameWinner: isWolfGameWon ? 'wolf' : null,
        selectedPlayerCardIds: [],
        selectedWolfCardIds: [],
        stats: nextStats,
      };
    });
  }, []);

  // Advance to Next Round
  const handleNextRound = () => {
    const freshDeal = dealNewRound();
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
  };

  // Restart Entire Game
  const handleRestartGame = () => {
    const freshDeal = dealNewRound();
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
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
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
          ? 'Şu an direkt eşleşen veya toplanabilen bir hamle yok. Daha büyük bir kartla "Üst" hamlesi yapabilir veya çekilebilirsiniz.'
          : 'No direct match or sum moves available right now. You can play a higher card (Over) or fold.'
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
      {/* Header Bar */}
      <HeaderBar
        playerScore={gameState.playerTotalScore}
        wolfScore={gameState.wolfTotalScore}
        currentRound={gameState.currentRound}
        targetScore={gameState.targetScore}
        isMuted={isMuted}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onToggleSound={handleToggleSound}
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
              onSurrender={handleSurrender}
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
