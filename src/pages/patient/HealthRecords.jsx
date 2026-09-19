import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { IoWarningOutline, IoBandageOutline, IoHeartHalfOutline } from 'react-icons/io5';

export const HealthRecords = () => {
  const { user } = useAuth();
  const details = user?.details || {};

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-white">Digital Health Records</h3>
        <p className="text-xs text-muted-text mt-0.5">Maintain allergy, condition, and immunization disclosures securely</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Allergies Card */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <IoWarningOutline size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Disclosed Allergies</h4>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {details.allergies?.map((item, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-red-500/5 text-red-400 border border-red-500/10 text-xs font-semibold">
                {item}
              </span>
            )) || <span className="text-xs text-muted-text">No allergies registered.</span>}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400">
              <IoHeartHalfOutline size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Chronic Conditions</h4>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {details.chronicConditions?.map((item, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-yellow-500/5 text-yellow-400 border border-yellow-500/10 text-xs font-semibold">
                {item}
              </span>
            )) || <span className="text-xs text-muted-text">No conditions disclosed.</span>}
          </div>
        </div>

        {/* Immunizations */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neon-green/10 text-neon-green">
              <IoBandageOutline size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">General Health Summary</h4>
          </div>
          <div className="text-sm text-muted-text space-y-2 pt-2">
            <p><strong>Primary Provider:</strong> Dr. Evelyn Martinez (Metropolis Cardiology)</p>
            <p><strong>System Status:</strong> Clean record. Last compliance review completed June 2026.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default HealthRecords;
