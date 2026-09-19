import React, { useState, useEffect } from 'react';
import { pharmacyApi } from '../../services/pharmacyApi';
import { ChartWrapper } from '../../components/charts/ChartWrapper';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export const PharmacyAnalytics = () => {
  const [revenueLogs, setRevenueLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await pharmacyApi.getPharmacyAnalytics("phr_01");
        setRevenueLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-white">Advanced Store Analytics</h3>
        <p className="text-xs text-muted-text mt-0.5">Analyze monthly sales trends, earnings growth, and fulfillment ratios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Revenue trends ($)" subtitle="Monthly gross revenue growth" loading={loading}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0B1728', borderColor: 'rgba(255,255,255,0.08)', color: '#FFF' }} />
              <Bar dataKey="revenue" fill="#00B0FF" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Order Digitisations count" subtitle="Total filled prescriptions count" loading={loading}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.04} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0B1728', borderColor: 'rgba(255,255,255,0.08)', color: '#FFF' }} />
              <Line type="monotone" dataKey="orders" stroke="#00E676" strokeWidth={2.5} name="Orders Filled" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
};
export default PharmacyAnalytics;
