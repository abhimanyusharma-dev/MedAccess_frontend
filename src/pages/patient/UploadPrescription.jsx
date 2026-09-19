import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { medicineApi } from '../../services/medicineApi';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const UploadPrescription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        patientId: user.id,
        patientName: user.name,
        pharmacyId: "phr_01", // Default mock target pharmacy
        instructions: data.instructions,
        file: data.prescriptionFile[0]
      };
      
      const newRx = await medicineApi.uploadPrescription(payload);
      toast.success(`Prescription ${newRx.id} uploaded and sent to Apex BioCare!`, {
        style: { background: '#0B1728', color: '#FFF', border: '1px solid rgba(0, 230, 118, 0.2)' }
      });
      reset();
    } catch (err) {
      toast.error('Upload failed. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-2">Upload Prescription Scanner</h3>
        <p className="text-xs text-muted-text mb-6">Scan and upload image or PDF of your doctor's prescription. Our pharmacists will review and prepare it.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-1.5 w-full text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-text pl-1">Prescription Scan (PDF/Image)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full bg-dark-card border border-dark-border focus:border-electric-blue focus:ring-1 focus:ring-electric-blue rounded-xl px-4 py-3 text-white outline-none transition-all duration-200"
              {...register('prescriptionFile', { required: 'Please upload a prescription scan file.' })}
            />
            {errors.prescriptionFile && (
              <span className="text-xs text-red-400 font-medium pl-1">{errors.prescriptionFile.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 w-full text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-text pl-1 font-sans">Patient notes & dosage instructions</label>
            <textarea
              placeholder="Provide instructions, drug details, allergy disclosures or preferred pickup times..."
              rows={4}
              className="w-full bg-dark-card border border-dark-border focus:border-electric-blue focus:ring-1 focus:ring-electric-blue rounded-xl px-4 py-3 text-white placeholder-muted-text outline-none transition-all duration-200 resize-none"
              {...register('instructions')}
            />
          </div>

          <Button
            type="submit"
            variant="primary-green"
            isLoading={loading}
            className="w-full"
          >
            Submit Prescription Scan
          </Button>
        </form>
      </div>
    </div>
  );
};
export default UploadPrescription;
