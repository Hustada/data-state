"use client";

import { useState, useMemo } from 'react';
import { CharityGraph } from '@/components/charity-graph/CharityGraph';
import { CharitySearch } from '@/components/search/CharitySearch';
import { CharityCard } from '@/components/ui/charity-card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Mock data with more nodes and connections
  const mockNodes = [
    {
      id: '1',
      name: 'THE RHODE ISLAND COMMUNITY FOUNDATION',
      ein: '22-2604963',
      grossReceipts: 194890954,
      contributions: 30307800,
      grantsGiven: 27774220,
      taxpayerFunds: 12502500,
      type: 'high' as const
    },
    {
      id: '2',
      name: 'THE AYCO CHARITABLE FOUNDATION',
      ein: '14-1782466',
      grossReceipts: 1068810756,
      contributions: 251058723,
      grantsGiven: 182204729,
      taxpayerFunds: 0,
      type: 'low' as const
    },
    {
      id: '3',
      name: 'UNITED WAY OF BERGEN COUNTY',
      ein: '22-6028959',
      grossReceipts: 14789968,
      contributions: 13338106,
      grantsGiven: 6713652,
      taxpayerFunds: 335000,
      type: 'medium' as const
    },
    {
      id: '4',
      name: 'VANGUARD CHARITABLE ENDOWMENT PROGRAM',
      ein: '23-2888152',
      grossReceipts: 17001668396,
      contributions: 12359829814,
      grantsGiven: 1526477194,
      taxpayerFunds: 0,
      type: 'low' as const
    },
    {
      id: '5',
      name: 'MAJOR LEAGUE BASEBALL CHARITIES INC',
      ein: '13-3346589',
      grossReceipts: 11851874,
      contributions: 7354962,
      grantsGiven: 7552246,
      taxpayerFunds: 0,
      type: 'low' as const
    }
  ];

  const mockLinks = [
    {
      source: '1',
      target: '2',
      value: 10134716
    },
    {
      source: '2',
      target: '3',
      value: 475607
    },
    {
      source: '3',
      target: '4',
      value: 1600109
    },
    {
      source: '4',
      target: '5',
      value: 56050
    },
    {
      source: '1',
      target: '4',
      value: 31054059
    }
  ];

  const connectedNodes = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    
    const connected = new Set<string>();
    mockLinks.forEach(link => {
      if (link.source === selectedNodeId) {
        connected.add(link.target);
      }
      if (link.target === selectedNodeId) {
        connected.add(link.source);
      }
    });
    return connected;
  }, [selectedNodeId]);

  const handleSearch = (ein: string, keyword: string) => {
    console.log('Searching:', { ein, keyword });
    // Will implement search logic here
  };

  const handleDownloadSVG = () => {
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'charity-graph.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const selectedCharity = selectedNodeId ? mockNodes.find(node => node.id === selectedNodeId) : null;

  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1d27] border-r border-gray-800">
        <div className="p-4">
          <img src="/logo.png" alt="Data Republican" className="h-12 mb-8" />
          <nav className="space-y-1">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Charity funding & financials</h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Track money flow and spending
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-white bg-gray-800"
              >
                Charity graph
              </Button>
            </div>
            <div className="mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Nonprofit financials
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <CharitySearch
            onSearch={handleSearch}
            onDownloadSVG={handleDownloadSVG}
            totalCharities={mockNodes.length}
          />
        </div>

        <div className="flex-1 flex gap-4 p-6 pt-0">
          {/* Graph */}
          <div className="flex-1 bg-[#1a1d27] rounded-lg overflow-hidden border border-gray-800">
            <CharityGraph
              nodes={mockNodes}
              links={mockLinks}
              onNodeClick={(node) => setSelectedNodeId(node.id)}
              selectedNodeId={selectedNodeId}
              connectedNodes={connectedNodes}
            />
          </div>

          {/* Selected charity card */}
          <div className="w-96">
            {selectedCharity && (
              <CharityCard
                key={selectedCharity.id}
                name={selectedCharity.name}
                ein={selectedCharity.ein}
                grossReceipts={selectedCharity.grossReceipts}
                contributions={selectedCharity.contributions}
                grantsGiven={selectedCharity.grantsGiven}
                taxpayerFunds={selectedCharity.taxpayerFunds}
                type={selectedCharity.type}
              />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/10 border border-red-500" />
              <span className="text-sm text-gray-400">High taxpayer funds ({'>'}$10M)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/10 border border-yellow-500" />
              <span className="text-sm text-gray-400">Medium taxpayer funds ($1M-$10M)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500/10 border border-gray-500" />
              <span className="text-sm text-gray-400">Low/No taxpayer funds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
