import React from 'react';
import { IoShieldCheckmarkOutline, IoPrintOutline } from 'react-icons/io5';

export const ReportsManagement = () => {
  const reportsList = [
    { id: "REP-992", name: "Q2 Compliance & Audit Logs", created: "2026-06-01", type: "Security" },
    { id: "REP-991", name: "Live Store Inventory Discrepancy", created: "2026-05-15", type: "Inventory" }
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-white">Compliance System Reports</h3>
        <p className="text-xs text-muted-text mt-0.5">Generate, view, and print platform compliance reports and security audits</p>
      </div>

      <div className="space-y-4">
        {reportsList.map((rep) => (
          <div key={rep.id} className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <IoShieldCheckmarkOutline size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">{rep.name}</h4>
                <p className="text-xs text-muted-text mt-1">ID: {rep.id} &bull; Created: {rep.created}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
              <IoPrintOutline size={14} />
              <span>Print PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReportsManagement;
