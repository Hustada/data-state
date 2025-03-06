"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CharitySearchProps {
  onSearch: (ein: string, keyword: string) => void;
  onDownloadSVG: () => void;
  totalCharities: number;
}

export function CharitySearch({ onSearch, onDownloadSVG, totalCharities }: CharitySearchProps) {
  const [ein, setEin] = useState('');
  const [keyword, setKeyword] = useState('');

  const handleEINSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(ein, '');
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch('', keyword);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Charity graph</h2>
          <p className="text-sm text-gray-400">
            Use the search and keywords to filter charities, then BFS expansion is performed automatically.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-500">{totalCharities} charities displayed</span>
          <Button
            onClick={onDownloadSVG}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download SVG
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <form onSubmit={handleEINSubmit} className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="XX-XXXXXXX or 9 digits"
            value={ein}
            onChange={(e) => setEin(e.target.value)}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <Button type="submit" variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
            Add EIN
          </Button>
        </form>

        <form onSubmit={handleKeywordSubmit} className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Keyword or phrase..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <Button type="submit" variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
} 