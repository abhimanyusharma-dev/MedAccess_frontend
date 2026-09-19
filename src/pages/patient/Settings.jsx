import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Configuration saved successfully!', {
      style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-2">User Settings</h3>
        <p className="text-xs text-muted-text mb-6">Modify details, configure notification options, or audit credentials</p>

        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Display Name" defaultValue={user?.name} disabled />
          <Input label="Registered Email" defaultValue={user?.email} disabled />
          
          <div className="pt-2">
            <Button type="submit" variant="primary-green" className="w-full">
              Save Account Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Settings;
