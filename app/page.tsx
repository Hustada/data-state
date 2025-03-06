"use client";

import { useState, useMemo } from 'react';
import { CharityGraph } from '@/components/charity-graph/CharityGraph';
import { CharitySearch } from '@/components/search/CharitySearch';
import { CharityCard } from '@/components/ui/charity-card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Mock data matching the scale of mockups
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
    },
    {
      id: '6',
      name: 'COMMUNITY FOUNDATION OF NEW JERSEY',
      ein: '22-2281783',
      grossReceipts: 85672341,
      contributions: 45123890,
      grantsGiven: 32567890,
      taxpayerFunds: 8500000,
      type: 'medium' as const
    },
    {
      id: '7',
      name: 'NATIONAL PHILANTHROPIC TRUST',
      ein: '23-7825575',
      grossReceipts: 2345678901,
      contributions: 1987654321,
      grantsGiven: 876543210,
      taxpayerFunds: 15000000,
      type: 'high' as const
    },
    {
      id: '8',
      name: 'AMERICAN RED CROSS',
      ein: '53-0196605',
      grossReceipts: 3456789012,
      contributions: 2345678901,
      grantsGiven: 1234567890,
      taxpayerFunds: 25000000,
      type: 'high' as const
    },
    {
      id: '9',
      name: 'BOYS & GIRLS CLUBS OF AMERICA',
      ein: '13-5562976',
      grossReceipts: 789012345,
      contributions: 567890123,
      grantsGiven: 345678901,
      taxpayerFunds: 5000000,
      type: 'medium' as const
    },
    {
      id: '10',
      name: 'HABITAT FOR HUMANITY INTERNATIONAL',
      ein: '91-1914868',
      grossReceipts: 456789012,
      contributions: 345678901,
      grantsGiven: 234567890,
      taxpayerFunds: 12000000,
      type: 'high' as const
    },
    {
      id: '11',
      name: 'FEEDING AMERICA',
      ein: '36-3673599',
      grossReceipts: 2345678901,
      contributions: 1987654321,
      grantsGiven: 1654321098,
      taxpayerFunds: 18000000,
      type: 'high' as const
    },
    {
      id: '12',
      name: 'UNITED WAY WORLDWIDE',
      ein: '13-1635294',
      grossReceipts: 4567890123,
      contributions: 3456789012,
      grantsGiven: 2345678901,
      taxpayerFunds: 7500000,
      type: 'medium' as const
    },
    {
      id: '13',
      name: 'GATES FOUNDATION TRUST',
      ein: '91-1663695',
      grossReceipts: 5678901234,
      contributions: 4567890123,
      grantsGiven: 3456789012,
      taxpayerFunds: 20000000,
      type: 'high' as const
    },
    {
      id: '14',
      name: 'ROCKEFELLER FOUNDATION',
      ein: '13-1659629',
      grossReceipts: 789012345,
      contributions: 678901234,
      grantsGiven: 567890123,
      taxpayerFunds: 0,
      type: 'low' as const
    },
    {
      id: '15',
      name: 'SALVATION ARMY',
      ein: '13-5562351',
      grossReceipts: 3456789012,
      contributions: 2345678901,
      grantsGiven: 1234567890,
      taxpayerFunds: 15000000,
      type: 'high' as const
    },
    {
      id: '16',
      name: 'CATHOLIC CHARITIES USA',
      ein: '53-0196620',
      grossReceipts: 1234567890,
      contributions: 987654321,
      grantsGiven: 876543210,
      taxpayerFunds: 8000000,
      type: 'medium' as const
    },
    {
      id: '17',
      name: 'YMCA OF THE USA',
      ein: '36-3258696',
      grossReceipts: 2345678901,
      contributions: 1876543210,
      grantsGiven: 1654321098,
      taxpayerFunds: 12000000,
      type: 'high' as const
    },
    {
      id: '18',
      name: 'GOODWILL INDUSTRIES',
      ein: '53-0196517',
      grossReceipts: 4321098765,
      contributions: 3210987654,
      grantsGiven: 2109876543,
      taxpayerFunds: 9000000,
      type: 'medium' as const
    },
    {
      id: '19',
      name: 'BOYS & GIRLS CLUBS OF AMERICA FOUNDATION',
      ein: '58-1934512',
      grossReceipts: 567890123,
      contributions: 456789012,
      grantsGiven: 345678901,
      taxpayerFunds: 6000000,
      type: 'medium' as const
    },
    {
      id: '20',
      name: 'AMERICAN CANCER SOCIETY',
      ein: '13-1788491',
      grossReceipts: 3456789012,
      contributions: 2345678901,
      grantsGiven: 1234567890,
      taxpayerFunds: 11000000,
      type: 'high' as const
    },
    {
      id: '21',
      name: 'MAYO CLINIC',
      ein: '41-6011702',
      grossReceipts: 5678901234,
      contributions: 4567890123,
      grantsGiven: 3456789012,
      taxpayerFunds: 25000000,
      type: 'high' as const
    },
    {
      id: '22',
      name: 'ST. JUDE CHILDREN\'S RESEARCH HOSPITAL',
      ein: '62-0646012',
      grossReceipts: 4567890123,
      contributions: 3456789012,
      grantsGiven: 2345678901,
      taxpayerFunds: 18000000,
      type: 'high' as const
    },
    {
      id: '23',
      name: 'UNITED WAY OF GREATER LOS ANGELES',
      ein: '95-1922010',
      grossReceipts: 123456789,
      contributions: 98765432,
      grantsGiven: 87654321,
      taxpayerFunds: 3000000,
      type: 'medium' as const
    },
    {
      id: '24',
      name: 'SILICON VALLEY COMMUNITY FOUNDATION',
      ein: '20-5205488',
      grossReceipts: 6789012345,
      contributions: 5678901234,
      grantsGiven: 4567890123,
      taxpayerFunds: 0,
      type: 'low' as const
    }
  ];

  const mockLinks = [
    { source: '1', target: '2', value: 10134716 },
    { source: '2', target: '3', value: 475607 },
    { source: '3', target: '4', value: 1600109 },
    { source: '4', target: '5', value: 56050 },
    { source: '1', target: '4', value: 31054059 },
    { source: '6', target: '3', value: 2500000 },
    { source: '7', target: '6', value: 5000000 },
    { source: '8', target: '7', value: 7500000 },
    { source: '9', target: '8', value: 1000000 },
    { source: '10', target: '9', value: 3000000 },
    { source: '11', target: '10', value: 4500000 },
    { source: '12', target: '11', value: 6000000 },
    { source: '1', target: '6', value: 2000000 },
    { source: '7', target: '12', value: 8000000 },
    { source: '4', target: '8', value: 12000000 },
    { source: '2', target: '9', value: 3500000 },
    { source: '5', target: '10', value: 1500000 },
    { source: '3', target: '11', value: 2800000 },
    { source: '6', target: '12', value: 4200000 },
    { source: '13', target: '14', value: 15000000 },
    { source: '14', target: '15', value: 8000000 },
    { source: '15', target: '16', value: 5000000 },
    { source: '16', target: '17', value: 3000000 },
    { source: '17', target: '18', value: 4000000 },
    { source: '18', target: '19', value: 2500000 },
    { source: '19', target: '20', value: 1800000 },
    { source: '20', target: '21', value: 12000000 },
    { source: '21', target: '22', value: 9000000 },
    { source: '22', target: '23', value: 4500000 },
    { source: '23', target: '24', value: 2000000 },
    { source: '13', target: '1', value: 20000000 },
    { source: '15', target: '4', value: 15000000 },
    { source: '17', target: '7', value: 8000000 },
    { source: '19', target: '10', value: 5000000 },
    { source: '21', target: '2', value: 10000000 },
    { source: '23', target: '5', value: 3000000 },
    { source: '24', target: '8', value: 7000000 },
    { source: '14', target: '11', value: 6000000 },
    { source: '16', target: '3', value: 4000000 },
    { source: '18', target: '6', value: 5500000 },
    { source: '20', target: '9', value: 3500000 },
    { source: '22', target: '12', value: 8500000 }
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
          <div className="flex-1 bg-[#1f2937] rounded-lg overflow-hidden border border-gray-800">
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
