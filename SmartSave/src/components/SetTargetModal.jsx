import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign } from 'lucide-react';

const SetTargetModal = ({ isOpen, onClose }) => {
  const [targetType, setTargetType] = useState('general');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-6">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-t-4xl md:rounded-4xl p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
            <Target className="text-mpesa-green" /> Set New Target
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Target Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Savings Category</label>
            <select 
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
            >
              <option value="general">General Savings</option>
              <option value="specific">Specific Goal (Education, Laptop, etc.)</option>
            </select>
          </div>

          {/* Conditional Goal Title */}
          {targetType === 'specific' && (
            <div className="animate-in fade-in duration-200">
              <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Goal Name</label>
              <input 
                type="text" 
                placeholder="e.g. New Laptop"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Target Amount (KES)</label>
            <div className="relative">
              <input 
                type="number" 
                inputMode="numeric"
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <DollarSign className="absolute left-4 top-4 text-slate-400" size={20} />
            </div>
          </div>

          {/* Target Period */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Target Deadline</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="w-full bg-mpesa-green text-white py-5 rounded-3xl font-bold shadow-lg shadow-green-100 mt-4 active:scale-95 transition-all"
            onClick={() => {
              console.log({ targetType, title, amount, deadline });
              onClose();
            }}
          >
            Create Target
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetTargetModal;