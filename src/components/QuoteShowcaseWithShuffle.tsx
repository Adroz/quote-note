import React, { useState, useCallback } from 'react';
import { Quote } from '@/types';
import { QuoteCard } from './QuoteCard';

export const QuoteShowcaseWithShuffle: React.FC = () => {
  // Sample quotes data
  const sampleQuotes: Quote[] = [
    {
      id: 'sample-1',
      text: "Don't count the days. Make the days count.",
      author: "Muhammad Ali",
      tags: ["motivation", "✨"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'showcase-user'
    },
    {
      id: 'sample-2',
      text: "Almost everything will work again if you unplug it for a few minutes, including you.",
      author: "Anne Lamott",
      tags: ["wisdom"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'showcase-user'
    },
    {
      id: 'sample-3',
      text: "The secret of life is to waste time in ways that you like.",
      author: "Jerry Seinfeld",
      tags: ["humor", "😂"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'showcase-user'
    },
    {
      id: 'sample-4',
      text: "There are risks and costs to action. But they are far less than the long-range risks of comfortable inaction.",
      author: "John F. Kennedy",
      tags: ["action", "💪"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'showcase-user'
    },
    {
      id: 'sample-5',
      text: "Most of the time you don't need more information, you need more courage.",
      author: "James Clear",
      tags: ["courage"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'showcase-user'
    },
    {
      id: 'sample-6',
      text: "Don't live in your dreams, live your dreams",
      author: "",
      tags: ["dreams", "🌟"],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'showcase-user'
    }
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Define a simple function to handle clicks directly
  const handleClick = () => {
    const newIndex = (currentQuoteIndex + 1) % sampleQuotes.length;
    setCurrentQuoteIndex(newIndex);
  };

  return (
    <div className="showcase-mode w-full max-w-md">
      <div className="w-full">
        <QuoteCard quote={sampleQuotes[currentQuoteIndex]} isShowcase={true} />
      </div>
      
      <button 
        onClick={handleClick}
        className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-md transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
        type="button"
        aria-label="Show another quote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Shuffle Quote
      </button>
    </div>
  );
}; 