'use client';

import React, { useState, useEffect } from 'react';

interface Card {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const Jogo: React.FC = () => {
  const imageUrls = [
    '/images/card1.png',
    '/images/card2.png',
    '/images/card3.png',
    '/images/card4.png',
    '/images/card5.png',
    '/images/card6.png',
    '/images/card7.png',
    '/images/card8.png',
    '/images/card9.png',
  ];

  const createCards = () => {
    const cards: Card[] = [...imageUrls, ...imageUrls].map((url, index) => ({
      id: index,
      imageUrl: url,
      isFlipped: false,
      isMatched: false,
    }));
    return cards;
  };

  const shuffleCards = (cards: Card[]) => {
    return [...cards].sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const initialCards = createCards();
    setCards(shuffleCards(initialCards));
  }, []);

  const handleCardClick = (clickedCard: Card) => {
    if (
      isProcessing ||
      selectedCards.length === 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    )
      return;

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    
    setCards(newCards);
    setSelectedCards([...selectedCards, newCards.find(card => card.id === clickedCard.id)!]);
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      setIsProcessing(true);
      const [first, second] = selectedCards;
      
      if (first.imageUrl === second.imageUrl) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first.id || card.id === second.id
              ? { ...card, isMatched: true }
              : card
          )
        );
        setScore((prev) => {
          const newScore = prev + 1;
          if (newScore === 9) {
            setHasWon(true);
          }
          return newScore;
        });
        setIsProcessing(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first.id || card.id === second.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setIsProcessing(false);
        }, 1000);
      }
      setSelectedCards([]);
    }
  }, [selectedCards]);

  const resetGame = () => {
    const newCards = createCards();
    setCards(shuffleCards(newCards));
    setSelectedCards([]);
    setScore(0);
    setIsProcessing(false);
    setHasWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-8 drop-shadow-lg">
          Joguinho da Memória Pa Voce Tonton
        </h1>
        
        {hasWon && (
        <div 
          className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50"
          onClick={() => setHasWon(false)}
        >
          <h2 className="text-6xl font-bold text-yellow-300 mb-8 animate-bounce drop-shadow-lg">
            GANHOU PORRAAAA!!! 🎉
          </h2>
          <div className="relative">
            <iframe 
              src="https://giphy.com/embed/l0HlxRrCYYFVVfwWY" 
              width="480" 
              height="269" 
              className="giphy-embed rounded-lg shadow-2xl"
              frameBorder="0" 
              allowFullScreen
            />
          </div>
          <p className="text-white mt-4 text-xl">
            Clique em qualquer lugar para continuar
          </p>
        </div>
      )}
        
        <div className="text-2xl text-center text-white mb-8 font-semibold drop-shadow-lg">
          Pares encontrados: {score}/9
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                aspect-square cursor-pointer transform hover:scale-105 transition-all duration-300
                ${isProcessing ? 'pointer-events-none' : 'pointer-events-auto'}
                hover:z-10
              `}
            >
              <div
                className={`
                  relative w-full h-full transition-all duration-500
                  transform-gpu ${card.isFlipped ? '[transform:rotateY(180deg)]' : ''}
                  rounded-xl
                  [perspective:1000px]
                `}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Frente da carta */}
                <div
                  className={`
                    absolute w-full h-full
                    bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm
                    flex items-center justify-center
                    text-3xl font-bold text-blue-600
                    border-4 border-blue-300/50
                    hover:border-blue-400/70 transition-colors
                    shadow-lg rounded-xl
                    [backface-visibility:hidden]
                  `}
                >
                  ?
                </div>
                
                {/* Verso da carta */}
                <div
                  className={`
                    absolute w-full h-full
                    ${card.isMatched ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-white/95'}
                    backdrop-blur-sm rounded-xl
                    [transform:rotateY(180deg)]
                    shadow-xl
                    ${card.isMatched ? 'border-4 border-green-400/50' : ''}
                    [backface-visibility:hidden]
                  `}
                >
                  <img
                    src={card.imageUrl}
                    alt="card"
                    className="w-full h-full object-contain p-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="
            block mx-auto px-8 py-4
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:from-blue-700 hover:to-purple-700
            active:from-blue-800 active:to-purple-800
            text-white text-xl font-bold rounded-xl
            transform transition-all duration-200
            hover:scale-105 active:scale-95
            shadow-lg hover:shadow-xl
            border-2 border-white/20 hover:border-white/30
          "
        >
          Reiniciar Jogo
        </button>
      </div>
    </div>
  );
};

export default Jogo;