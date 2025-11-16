"use client";

import { useState } from "react";

// Dictionary of Musqueam (hən̓q̓əmin̓əm̓) and Hul'q'umi'num' (Coast Salish) words and their English translations
const indigenousWordDictionary: Record<string, string> = {
  // Musqueam (hən̓q̓əmin̓əm̓)
  "xʷməθkʷəy̓əm": "Musqueam (the name of the Musqueam people)",
  "ʔəy̓ skʷeyəɬ": "Welcome / Hello",
  "tə sχʷəy̓": "My name is",
  "hən̓q̓əmin̓əm̓": "Musqueam language (hən̓q̓əmin̓əm̓)",
  "tátələt": "Be learning, be studying",
  "táʔtələt": "Be learning, be studying",
  "stéʔexʷəł": "Children",
  // Hul'q'umi'num' (Coast Salish)
  "hul'q'umi'num'": "Hul'q'umi'num' language (Coast Salish)",
  "spaal'": "Raven",
  "spaal": "Raven",
  "Sun": "Sun",
  "sumshathut": "Sun",
  "huy ch q'u": "Thank you",
  "tthu shhwulmuhw": "The Coast Salish people",
  "tthu shhwulmuhw qul": "Coast Salish",
};

function processIndigenousText(text: string): Array<{ text: string; isIndigenous: boolean; translation?: string }> {
  const parts: Array<{ text: string; isIndigenous: boolean; translation?: string }> = [];
  let lastIndex = 0;

  const sortedWords = Object.keys(indigenousWordDictionary).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    sortedWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'g'
  );

  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        isIndigenous: false,
      });
    }

    const matchedWord = match[0];
    const translation = indigenousWordDictionary[matchedWord];
    parts.push({
      text: matchedWord,
      isIndigenous: true,
      translation: translation || matchedWord,
    });

    lastIndex = match.index + matchedWord.length;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isIndigenous: false,
    });
  }

  if (parts.length === 0) {
    parts.push({ text, isIndigenous: false });
  }

  return parts;
}

interface IndigenousTextProps {
  text: string;
  className?: string;
}

export default function IndigenousText({ text, className = "" }: IndigenousTextProps) {
  const parts = processIndigenousText(text);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.isIndigenous) {
          return (
            <IndigenousWord
              key={index}
              word={part.text}
              translation={part.translation || part.text}
            />
          );
        }
        return <span key={index}>{part.text}</span>;
      })}
    </span>
  );
}

interface IndigenousWordProps {
  word: string;
  translation: string;
}

function IndigenousWord({ word, translation }: IndigenousWordProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-block group">
      <span
        className="font-bold underline cursor-help decoration-amber-600 text-amber-900 hover:text-amber-700 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {word}
      </span>
      {showTooltip && (
        <span className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-amber-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in duration-200 block">
          <span className="relative block">
            {translation}
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 block">
              <span className="border-4 border-transparent border-t-amber-900 block"></span>
            </span>
          </span>
        </span>
      )}
    </span>
  );
}

