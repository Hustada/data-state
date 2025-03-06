"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CharityCardProps {
  name: string;
  ein: string;
  grossReceipts: number;
  contributions: number;
  grantsGiven: number;
  taxpayerFunds: number;
  type: 'high' | 'medium' | 'low';
}

export function CharityCard({
  name,
  ein,
  grossReceipts,
  contributions,
  grantsGiven,
  taxpayerFunds,
  type
}: CharityCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'high':
        return 'bg-red-900/20';
      case 'medium':
        return 'bg-yellow-500/10';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <Card className={`${getBackgroundColor()} border-0 backdrop-blur-sm`}>
      {type === 'high' && (
        <div className="bg-red-500/10 px-4 py-2 border-b border-red-500/20">
          <p className="text-red-500 text-sm font-semibold">⚠️ High Taxpayer Funds Alert! ⚠️</p>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white leading-tight">{name}</CardTitle>
        <p className="text-sm text-gray-400 mt-1">EIN: {ein}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-400">Gross receipts</span>
            <span className="text-base text-white font-mono">{formatCurrency(grossReceipts)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-400">Contributions</span>
            <span className="text-base text-white font-mono">{formatCurrency(contributions)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-400">Grants given</span>
            <span className="text-base text-white font-mono">{formatCurrency(grantsGiven)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-gray-700">
            <span className="text-sm text-gray-400">Taxpayer funds</span>
            <span className={`text-base font-mono font-bold ${type === 'high' ? 'text-red-500' : 'text-white'}`}>
              {formatCurrency(taxpayerFunds)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 