import { useState, useEffect } from 'react';
import Image from 'next/image';

type Card = {
  id: number;
  img: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const images = [
    '/img/card1.jpg',
    '/img/card2.jpg',
    '/img/card3.jpg',
    '/img/card4.jpg',
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedImages = [...images, ...images];
    const shuffledCards = duplicatedImages
      .sort(() => Math.random() - 0.5)
      .map((img, index) => ({
        id: index,
        img: img,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlippedCards;
      if (cards[first].img === cards[second].img) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Jogo da Memória
        </h1>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-white text-xl text-center">
            Movimentos: {moves}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="aspect-square relative cursor-pointer"
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`w-full h-full transition-all duration-500 transform-gpu preserve-3d
                  ${card.isFlipped ? 'rotate-y-180' : ''}`}
              >
                {/* Frente da carta */}
                <div className="absolute w-full h-full bg-white rounded-xl flex items-center justify-center text-3xl font-bold text-purple-500 shadow-lg backface-hidden">
                  ?
                </div>
                
                {/* Verso da carta */}
                <div className="absolute w-full h-full rounded-xl overflow-hidden rotate-y-180 backface-hidden">
                  <Image
                    src={card.img}
                    alt="card"
                    layout="fill"
                    objectFit="cover"
                    className="transform -scale-x-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-white text-purple-500 rounded-full font-semibold
              shadow-lg hover:bg-purple-50 transform transition-all duration-200
              hover:scale-105 active:scale-95"
          >
            Reiniciar Jogo
          </button>
        </div>
      </div>
    </div>
  );
}