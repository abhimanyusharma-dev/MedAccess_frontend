import React from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';

export const Notifications = () => {
  const list = [
    { id: 1, title: "Scan Digitization Rx Request", desc: "Patient Alex Rivera uploaded prescription scanning rx_1002.", date: "1 hour ago" },
    { id: 2, title: "Stock Capacity Notice", desc: "Amoxicillin 500mg has fallen below 20 units threshold.", date: "4 hours ago" }
  ];

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div>
        <h3 className="text-lg font-bold text-white">Notifications Registry</h3>
        <p className="text-xs text-muted-text mt-0.5">Track real-time system alerts, stock notifications, and patient scans uploads</p>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <div key={item.id} className="glass-panel rounded-2xl p-5 border border-white/5 flex gap-4 items-start hover:border-white/10 transition-colors">
            <div className="p-2.5 rounded-xl bg-electric-blue/10 text-electric-blue flex-shrink-0">
              <IoNotificationsOutline size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white leading-none">{item.title}</h4>
              <p className="text-xs text-muted-text">{item.desc}</p>
              <span className="text-[10px] font-semibold text-muted-text inline-block pt-1">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Notifications;
