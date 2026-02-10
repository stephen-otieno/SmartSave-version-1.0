import React, { useState } from 'react';
import { X, Smartphone, Building2, Store, ArrowRight, Wallet } from 'lucide-react';
import API from '../services/api'; // Ensure this path matches your folder structure

const DepositModal = ({ isOpen, onClose }) => {
  // 1. Missing State Variables
  const [step, setStep] = useState(1);
  const [type, setType] = useState('savings');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: '', amount: '', account: '' });

  // 2. Missing Destinations Array
  const destinations = [
    { id: 'mpesa', label: 'Other M-Pesa', icon: <Smartphone />, desc: 'Send to another number' },
    { id: 'bank', label: 'Bank Account', icon: <Building2 />, desc: 'Transfer to any bank' },
    { id: 'till', label: 'Till', icon: <Store />, desc: 'Pay a business' },
    { id: 'savings', label: 'My Savings', icon: <Wallet />, desc: 'Deposit to your goal' },
  ];

  if (!isOpen) return null;

  const handleNext = (selectedType) => {
    setType(selectedType);
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Get the stored user data
      const userData = JSON.parse(localStorage.getItem('savesmart_user'));

      // 2. Ensure token exists before sending
      if (!userData || !userData.token) {
        alert("Session expired. Please log in again.");
        return;
      }

      // 3. Attach the Bearer token to the headers
      const response = await API.post('/transactions/stkpush', {
        amount: formData.amount,
        phone: formData.phone
      }, {
        headers: {
          'x-auth-token': userData.token // Use the exact name your backend expects
        }
      });

      if (response.data.ResponseCode === "0") {
        alert("Check your phone for the M-Pesa PIN prompt! 📲");
        onClose();
      }
    } catch (err) {
      console.error("Payment Error:", err.response?.data);
      alert(err.response?.data?.msg || "Payment trigger failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-dark">
            {step === 1 ? 'Choose Destination' : `Transfer to ${type}`}
          </h2>
          <button onClick={() => { setStep(1); onClose(); }} className="p-2 bg-slate-100 rounded-full">
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 gap-3">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleNext(dest.id)}
                className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-slate-50 hover:border-mpesa-green hover:bg-white transition-all group cursor-pointer"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm text-mpesa-green group-hover:bg-mpesa-green group-hover:text-white transition-colors">
                  {dest.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-brand-dark">{dest.label}</p>
                  <p className="text-xs text-slate-400">{dest.desc}</p>
                </div>
                <ArrowRight size={18} className="ml-auto text-slate-300" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">M-Pesa Number</label>
              <input
                type="number"
                inputMode="tel"
                placeholder="2547xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {type !== 'mpesa' && type !== 'savings' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="Enter details"
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount (KES)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Amount to save"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none font-bold text-lg"
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              onClick={handlePayment}
              className={`w-full py-5 rounded-3xl font-bold transition-all cursor-pointer ${loading ? 'bg-slate-300 text-slate-500' : 'bg-mpesa-green text-white shadow-lg active:scale-95 hover:bg-opacity-90'
                }`}
            >
              {loading ? 'Sending PIN Prompt...' : 'Confirm & Pay'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositModal;