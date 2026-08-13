'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ParticipationSentimentTrendProps {
  periodALabel: string;
  periodBLabel: string;
  rateA: number;
  rateB: number;
  sentimentA: number;
  sentimentB: number;
  isLoading?: boolean;
}

function SkeletonTrendCard() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
      <div className="h-4 rounded-full w-32 mb-1 bg-sage-50" />
      <div className="h-3 rounded-full w-48 mb-3 bg-sage-50" />
      <div className="rounded-xl mb-2 h-[180px] bg-sage-50" />
      <div className="flex items-center justify-between mt-2">
        <div className="h-3 rounded-full w-24 bg-sage-50" />
        <div className="h-3 rounded-full w-24 bg-sage-50" />
      </div>
    </div>
  );
}

export default function ParticipationSentimentTrend({
  periodALabel,
  periodBLabel,
  rateA,
  rateB,
  sentimentA,
  sentimentB,
  isLoading = false,
}: ParticipationSentimentTrendProps) {
  const rateData = [
    { period: periodALabel, rate: rateA },
    { period: periodBLabel, rate: rateB },
  ];

  const sentimentData = [
    { period: periodALabel, positive: sentimentA },
    { period: periodBLabel, positive: sentimentB },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonTrendCard />
        <SkeletonTrendCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
        <h4 className="text-[14px] font-semibold mb-1 text-ink">
          Participation trend
        </h4>
        <p className="text-[12px] mb-3 text-subtle">Response rate across periods</p>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rateData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: '#6d6d6d', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={{ stroke: '#e8e6e1' }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6d6d6d', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e8e6e1',
                  borderRadius: 12,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: '#2b2b2b',
                }}
                formatter={(value: any) => [`${value}%`, 'Response rate'] as [string, string]}
              />
              <Area type="monotone" dataKey="rate" stroke="#586d4d" fill="#586d4d" fillOpacity={0.12} strokeWidth={2} dot={{ fill: '#586d4d', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-2 text-[13px]">
          <div>
            <span className="text-subtle">{periodALabel}: </span>
            <span className="font-semibold text-ink">{rateA}%</span>
          </div>
          <div>
            <span className="text-subtle">{periodBLabel}: </span>
            <span className="font-semibold text-ink">{rateB}%</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-white border border-line shadow-card">
        <h4 className="text-[14px] font-semibold mb-1 text-ink">
          Sentiment trend
        </h4>
        <p className="text-[12px] mb-3 text-subtle">Positive sentiment share</p>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sentimentData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: '#6d6d6d', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={{ stroke: '#e8e6e1' }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6d6d6d', fontSize: 12, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e8e6e1',
                  borderRadius: 12,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: '#2b2b2b',
                }}
                formatter={(value: any) => [`${value}%`, 'Positive sentiment'] as [string, string]}
              />
              <Area type="monotone" dataKey="positive" stroke="#6d28d9" fill="#6d28d9" fillOpacity={0.10} strokeWidth={2} dot={{ fill: '#6d28d9', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-2 text-[13px]">
          <div>
            <span className="text-subtle">{periodALabel}: </span>
            <span className="font-semibold text-ink">{sentimentA}%</span>
          </div>
          <div>
            <span className="text-subtle">{periodBLabel}: </span>
            <span className="font-semibold text-ink">{sentimentB}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}