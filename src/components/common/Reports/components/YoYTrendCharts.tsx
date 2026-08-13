'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { yoyTrendData } from '@/lib/schoolAdminData';
import type { YoYTrendPoint } from '@/lib/schoolAdminData';

interface Props {
  band: string;
}

function TrendTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  metric: 'participation' | 'sentiment';
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point: YoYTrendPoint = payload[0].payload;

  return (
    <div
      className="rounded-xl p-3 border bg-white border-line shadow-card"
    >
      <p className="text-[13px] font-semibold mb-1 text-ink">{label}</p>
      <p className="text-[12px] text-sage">
        {metric === 'participation' ? 'Participation' : 'Positive sentiment'}: {' '}
        <span className="font-semibold">
          {metric === 'participation' ? point.participationRate : point.sentimentPositive}%
        </span>
      </p>
      <p className="text-[11px] mt-1 text-subtle">
        n= {point.responseCount} responses
      </p>
    </div>
  );
}

export default function YoYTrendCharts({ band }: Props) {
  const data = useMemo(() => yoyTrendData[band] || [], [band]);

  if (data.length < 2) return null;

  return (
    <div className="rounded-2xl p-4 sm:p-6 mb-6 bg-white border border-line shadow-card">
      <h3 className="text-[17px] font-semibold mb-4 text-ink">
        Trend across all completed periods
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-[13px] font-semibold mb-2 text-muted">Participation rate</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="participationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0072B2" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0072B2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6d6d6d', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  axisLine={{ stroke: '#e8e6e1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#6d6d6d', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: any) => `${v}%`}
                />
                <Tooltip content={<TrendTooltip metric="participation" />} cursor={{ stroke: '#e8e6e1', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="participationRate"
                  stroke="#0072B2"
                  strokeWidth={2}
                  fill="url(#participationGrad)"
                  dot={{ r: 3.5, fill: '#0072B2' }}
                  activeDot={{ r: 5, stroke: '#0072B2', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] mt-1 text-subtle">
            counts/participation — figures match the report
          </p>
        </div>

        <div>
          <p className="text-[13px] font-semibold mb-2 text-muted">Positive sentiment</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E69F00" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#E69F00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e1" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6d6d6d', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  axisLine={{ stroke: '#e8e6e1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#6d6d6d', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: any) => `${v}%`}
                />
                <Tooltip content={<TrendTooltip metric="sentiment" />} cursor={{ stroke: '#e8e6e1', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="sentimentPositive"
                  stroke="#E69F00"
                  strokeWidth={2}
                  fill="url(#sentimentGrad)"
                  dot={{ r: 3.5, fill: '#E69F00' }}
                  activeDot={{ r: 5, stroke: '#E69F00', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] mt-1 text-subtle">
            counts/participation — figures match the report
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0072B2]" />
          <span className="text-[11px] text-subtle">Participation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E69F00]" />
          <span className="text-[11px] text-subtle">Sentiment</span>
        </div>
      </div>
    </div>
  );
}