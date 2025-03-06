'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Card = {
  id: string;
  pairId: number;
  video: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);

  const generateCards = () => {
    const pairs = [];
    // Determine number of pairs based on difficulty
    const numPairs = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    
    for (let i = 1; i <= 8; i++) {
      pairs.push({
        pairId: i,
        videos: [
          `/pairs/par-${i}/video1.mp4`,
          `/pairs/par-${i}/video2.mp4`
        ]
      });
    }

    // Shuffle and take only the number of pairs we need
    const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5).slice(0, numPairs);

    const shuffled = shuffledPairs
      .flatMap(pair => pair.videos.map(video => ({
        id: Math.random().toString(),
        pairId: pair.pairId,
        video,
        isFlipped: false,
        isMatched: false
      })))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
  };

  useEffect(() => {
    generateCards();
  }, [difficulty]);

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as Difficulty);
    resetGame(value as Difficulty);
  };

  const handleCardClick = (id: string) => {
    if (flippedCards.length < 2 && !flippedCards.includes(id)) {
      setCards(cards.map(card => 
        card.id === id ? { ...card, isFlipped: true } : card
      ));
      setFlippedCards([...flippedCards, id]);
      setMoves(moves + 1);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.pairId === secondCard?.pairId) {
        setCards(cards.map(card => 
          flippedCards.includes(card.id) ? { ...card, isMatched: true } : card
        ));
      } else {
        setTimeout(() => {
          setCards(cards.map(card => 
            flippedCards.includes(card.id) ? { ...card, isFlipped: false } : card
          ));
        }, 1000);
      }
      setFlippedCards([]);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const selector = document.querySelector('.difficulty-selector');
      if (selector && !selector.contains(event.target as Node)) {
        setShowDifficultyOptions(false);
      }
    };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
  const resetGame = (newDifficulty?: Difficulty) => {
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    // We don't need setTimeout here since the difficulty change will trigger the useEffect
    if (!newDifficulty) {
      setTimeout(() => generateCards(), 100);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-fixed bg-center"
      style={{ 
        backgroundImage: `url('/plano-de-fundo.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <header className="header-institucional">
        <h1 className="titulo-jogo">Jogo da Memória com Libras</h1>
        <button onClick={() => resetGame()} className="reset-button">Reiniciar Jogo</button>
      </header>
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 bg-white/80 p-3 md:p-4 rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold text-[#8d334b] font-poppins poppins-bold mb-2 md:mb-0">Movimentos: {moves}</h2>
          <div className="difficulty-selector relative w-full md:w-auto">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-[#8d334b] font-medium text-sm md:text-base">Nível do Jogo:</span>
              <div className="relative">
                <button 
                  onClick={() => setShowDifficultyOptions(!showDifficultyOptions)}
                  className="px-2 md:px-3 py-1 md:py-2 rounded-md font-medium bg-[#fd9c69] text-white hover:bg-[#e88c59] transition-all text-sm md:text-base"
                >
                  {difficulty === 'easy' ? 'Fácil (4 pares)' : 
                   difficulty === 'medium' ? 'Médio (6 pares)' : 
                   'Difícil (8 pares)'}
                </button>
                
                {showDifficultyOptions && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-10 w-full">
                    {difficulty !== 'easy' && (
                      <button 
                        onClick={() => {
                          handleDifficultyChange('easy');
                          setShowDifficultyOptions(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#fd9c69] hover:text-white text-[#8d334b] transition-all text-sm md:text-base"
                      >
                        Fácil (4 pares)
                      </button>
                    )}
                    {difficulty !== 'medium' && (
                      <button 
                        onClick={() => {
                          handleDifficultyChange('medium');
                          setShowDifficultyOptions(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#fd9c69] hover:text-white text-[#8d334b] transition-all"
                      >
                        Médio (6 pares)
                      </button>
                    )}
                    {difficulty !== 'hard' && (
                      <button 
                        onClick={() => {
                          handleDifficultyChange('hard');
                          setShowDifficultyOptions(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-[#fd9c69] hover:text-white text-[#8d334b] transition-all"
                      >
                        Difícil (8 pares)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {cards
            .filter(card => !card.isMatched)
            .map(card => (
            <button
              key={card.id}
              onClick={() => !card.isMatched && handleCardClick(card.id)}
              className={`aspect-[3/4] rounded-xl transition-all duration-500 [transform-style:preserve-3d] shadow-lg hover:shadow-xl ${
                card.isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
              disabled={card.isMatched || flippedCards.includes(card.id)}
            >
              <div className="absolute w-full h-full bg-[#8d334b] rounded-xl backface-hidden shadow-md" />
              <video 
                src={card.video} 
                className="w-full h-full object-cover rounded-xl [transform:rotateY(180deg)] shadow-md"
                muted
                autoPlay
                loop
              />
            </button>
          ))}
        </div>
        
        <Dialog open={gameWon} onOpenChange={setGameWon}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Parabéns! Você venceu!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-center">Total de movimentos: {moves}</p>
              <Button onClick={() => resetGame()} className="w-full bg-[#8d334b] hover:bg-[#6d2538] text-white">
                Jogar Novamente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
