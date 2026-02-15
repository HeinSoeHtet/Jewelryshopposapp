import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Newspaper, Sparkles, ArrowUp, ArrowDown, Coins, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface GoldPrice {
  karat: string;
  price: number;
  change: number;
  changePercent: number;
}

interface HourlyGoldPrice {
  time: string;
  price: number;
  change: number;
}

interface HourlyExchangeRate {
  time: string;
  rate: number;
  change: number;
}

export function News() {
  // Mock hourly gold prices - In production, this would come from an API
  const worldGoldHourlyPrices: HourlyGoldPrice[] = [
    { time: '08:00', price: 2089.50, change: 0 },
    { time: '09:00', price: 2091.20, change: 1.70 },
    { time: '10:00', price: 2088.75, change: -2.45 },
    { time: '11:00', price: 2092.30, change: 3.55 },
    { time: '12:00', price: 2090.15, change: -2.15 },
    { time: '13:00', price: 2094.80, change: 4.65 },
    { time: '14:00', price: 2093.50, change: -1.30 },
    { time: '15:00', price: 2095.25, change: 1.75 },
  ];

  // Mock hourly USD to MMK exchange rates
  const usdToMmkHourlyRates: HourlyExchangeRate[] = [
    { time: '08:00', rate: 2100.00, change: 0 },
    { time: '09:00', rate: 2102.50, change: 2.50 },
    { time: '10:00', rate: 2101.75, change: -0.75 },
    { time: '11:00', rate: 2105.00, change: 3.25 },
    { time: '12:00', rate: 2103.50, change: -1.50 },
    { time: '13:00', rate: 2107.25, change: 3.75 },
    { time: '14:00', rate: 2106.00, change: -1.25 },
    { time: '15:00', rate: 2108.50, change: 2.50 },
  ];

  const currentWorldPrice = worldGoldHourlyPrices[worldGoldHourlyPrices.length - 1];
  const dayStartPrice = worldGoldHourlyPrices[0].price;
  const totalDayChange = currentWorldPrice.price - dayStartPrice;
  const totalDayChangePercent = (totalDayChange / dayStartPrice) * 100;

  const currentExchangeRate = usdToMmkHourlyRates[usdToMmkHourlyRates.length - 1];
  const dayStartRate = usdToMmkHourlyRates[0].rate;
  const totalRateChange = currentExchangeRate.rate - dayStartRate;
  const totalRateChangePercent = (totalRateChange / dayStartRate) * 100;

  const lastUpdated = new Date();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-amber-50 mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
          <Newspaper className="size-6 sm:size-8 text-amber-400" />
          Gold Price Dashboard
        </h2>
        <p className="text-amber-200/60 text-sm sm:text-lg">Real-time world gold price and currency exchange tracking</p>
      </div>

      {/* Gold Prices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* World Gold Price - Hourly */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-50 flex items-center gap-2">
                <Coins className="size-6 text-amber-400" />
                World Gold Price (24K)
              </CardTitle>
            </div>
            <p className="text-xs text-amber-200/50 mt-2">
              Last updated: {format(lastUpdated, 'MMM dd, yyyy hh:mm a')}
            </p>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {/* Current Price Summary */}
            <div className="p-5 bg-slate-900/50 rounded-xl border border-amber-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-amber-200/70 mb-1">Current Price</div>
                  <div className="text-3xl font-bold text-amber-50">
                    ${currentWorldPrice.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 text-lg font-semibold ${
                    totalDayChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {totalDayChange >= 0 ? (
                      <ArrowUp className="size-5" />
                    ) : (
                      <ArrowDown className="size-5" />
                    )}
                    ${Math.abs(totalDayChange).toFixed(2)}
                  </div>
                  <div className={`text-sm ${
                    totalDayChangePercent >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'
                  }`}>
                    {totalDayChangePercent >= 0 ? '+' : ''}{totalDayChangePercent.toFixed(2)}% today
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Prices */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-amber-200/70 mb-3">
                <Clock className="size-4" />
                <span>Hourly Price Movement</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {worldGoldHourlyPrices.map((item, index) => (
                  <div 
                    key={item.time} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      index === worldGoldHourlyPrices.length - 1 
                        ? 'bg-amber-500/20 border-amber-500/40' 
                        : 'bg-slate-900/20 border-amber-500/10 hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        index === worldGoldHourlyPrices.length - 1
                          ? 'bg-amber-500/30 text-amber-200'
                          : 'bg-slate-800/50 text-amber-200/60'
                      }`}>
                        {item.time}
                      </div>
                      <div className="text-amber-50 font-semibold">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      item.change > 0 ? 'text-emerald-400' : 
                      item.change < 0 ? 'text-red-400' : 
                      'text-amber-200/50'
                    }`}>
                      {item.change > 0 && <ArrowUp className="size-3" />}
                      {item.change < 0 && <ArrowDown className="size-3" />}
                      {item.change !== 0 ? `$${Math.abs(item.change).toFixed(2)}` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* USD to MMK Exchange Rate - Hourly */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-50 flex items-center gap-2">
                <Coins className="size-6 text-blue-400" />
                USD to MMK Exchange Rate
              </CardTitle>
            </div>
            <p className="text-xs text-amber-200/50 mt-2">
              Last updated: {format(lastUpdated, 'MMM dd, yyyy hh:mm a')}
            </p>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {/* Current Rate Summary */}
            <div className="p-5 bg-slate-900/50 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-amber-200/70 mb-1">Current Rate</div>
                  <div className="text-3xl font-bold text-amber-50">
                    {currentExchangeRate.rate.toFixed(2)} MMK
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 text-lg font-semibold ${
                    totalRateChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {totalRateChange >= 0 ? (
                      <ArrowUp className="size-5" />
                    ) : (
                      <ArrowDown className="size-5" />
                    )}
                    {Math.abs(totalRateChange).toFixed(2)}
                  </div>
                  <div className={`text-sm ${
                    totalRateChangePercent >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'
                  }`}>
                    {totalRateChangePercent >= 0 ? '+' : ''}{totalRateChangePercent.toFixed(2)}% today
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Exchange Rates */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-amber-200/70 mb-3">
                <Clock className="size-4" />
                <span>Hourly Rate Movement</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {usdToMmkHourlyRates.map((item, index) => (
                  <div 
                    key={item.time} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      index === usdToMmkHourlyRates.length - 1 
                        ? 'bg-blue-500/20 border-blue-500/40' 
                        : 'bg-slate-900/20 border-blue-500/10 hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        index === usdToMmkHourlyRates.length - 1
                          ? 'bg-blue-500/30 text-blue-200'
                          : 'bg-slate-800/50 text-amber-200/60'
                      }`}>
                        {item.time}
                      </div>
                      <div className="text-amber-50 font-semibold">
                        {item.rate.toFixed(2)} MMK
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      item.change > 0 ? 'text-emerald-400' : 
                      item.change < 0 ? 'text-red-400' : 
                      'text-amber-200/50'
                    }`}>
                      {item.change > 0 && <ArrowUp className="size-3" />}
                      {item.change < 0 && <ArrowDown className="size-3" />}
                      {item.change !== 0 ? `${Math.abs(item.change).toFixed(2)}` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}