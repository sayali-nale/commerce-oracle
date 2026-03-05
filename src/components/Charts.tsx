import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie, Label } from 'recharts';

export interface PriceHistoryPoint {
  month: string;
  price: number;
}

export interface PlatformPrice {
  name: string;
  price: number;
  color: string;
}

export const PriceTrajectoryChart = ({ data }: { data: PriceHistoryPoint[] }) => (
  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
          </linearGradient>
        </defs>
        {/* Removed CartesianGrid for a cleaner UI */}
        <XAxis 
          dataKey="month" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `₹${value/1000}k`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
          itemStyle={{ color: '#F8FAFC' }}
          formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
        />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="#2563EB" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorPrice)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const PlatformComparisonChart = ({ data }: { data: PlatformPrice[] }) => {
  const minPrice = Math.min(...data.map(d => d.price));
  
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40 }}>
          <XAxis type="number" hide domain={['dataMin - 1000', 'auto']} />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#F8FAFC' }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
          />
          <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.price === minPrice ? '#22C55E' : '#334155'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ConfidenceGauge = ({ score = 82 }: { score?: number }) => {
  const data = [
    { name: 'Score', value: score, fill: score > 70 ? '#22C55E' : score > 40 ? '#F59E0B' : '#EF4444' },
    { name: 'Remaining', value: 100 - score, fill: '#1E293B' },
  ];

  return (
    <div className="h-[200px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Label 
              value={`${score}`} 
              position="center" 
              fill="#F8FAFC" 
              className="text-3xl font-bold font-mono"
              dy={-10}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className={cn(
          "font-medium text-sm",
          score > 70 ? "text-secondary" : score > 40 ? "text-accent" : "text-danger"
        )}>
          {score > 70 ? "Optimal Buy Window" : score > 40 ? "Neutral Window" : "Wait for Drop"}
        </p>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
