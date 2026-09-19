import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { medicineApi } from '../../services/medicineApi';
import { Table } from '../../components/ui/Table';

export const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const list = await medicineApi.getReservations(user.id);
        setReservations(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user.id]);

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Store Name', key: 'pharmacyName' },
    { label: 'Prescribed Items', render: (row) => row.items.map(i => `${i.name} (${i.quantity}x)`).join(', ') },
    { label: 'Total Price', render: (row) => `$${row.totalAmount.toFixed(2)}` },
    { label: 'Pickup Deadline', key: 'pickupBy' },
    { label: 'Status', render: (row) => (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        row.status === 'ready' 
          ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
          : 'bg-white/5 text-muted-text border border-white/10'
      }`}>
        {row.status.toUpperCase()}
      </span>
    )}
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h3 className="text-lg font-bold text-white">Active Order Reservations</h3>
        <p className="text-xs text-muted-text mt-0.5">Manage and track ready-for-pickup medicine orders at stores</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-3 border-neon-green/20 border-t-neon-green rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <Table headers={headers} data={reservations} emptyMessage="No reservations found." />
        </div>
      )}
    </div>
  );
};
export default Reservations;
