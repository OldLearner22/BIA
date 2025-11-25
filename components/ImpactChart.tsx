import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ImpactLevel } from '../types';

interface ImpactChartProps {
  activities: Activity[];
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ activities }) => {
  // Calculate distribution of priorities
  const data = [
    { name: 'Critical', count: 0, color: '#ef4444' }, // red-500
    { name: 'High', count: 0, color: '#f97316' },     // orange-500
    { name: 'Medium', count: 0, color: '#eab308' },   // yellow-500
    { name: 'Low', count: 0, color: '#22c55e' },      // green-500
  ];

  activities.forEach(act => {
    if (act.priority === ImpactLevel.CRITICAL || act.priority === ImpactLevel.CATASTROPHIC) data[0].count++;
    else if (act.priority === ImpactLevel.HIGH) data[1].count++;
    else if (act.priority === ImpactLevel.MEDIUM) data[2].count++;
    else data[3].count++;
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};