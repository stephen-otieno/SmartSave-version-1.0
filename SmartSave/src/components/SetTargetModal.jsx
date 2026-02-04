import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign } from 'lucide-react';

const SetTargetModal = ({ isOpen, onClose, refreshData }) => { // Added refreshData prop
  const [targetType, setTargetType] = useState('general');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  // Inside SetTargetModal.jsx -> handleSave function

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    // 1. Check if the amount is valid
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Please enter a valid target amount.");
        return;
    }

    // 1. Correctly retrieve the token from the object
    const userData = JSON.parse(localStorage.getItem('savesmart_user'));
    const token = userData?.token; // Extract the token field

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    const payload = {
      type: targetType,
      title: title || (targetType !== 'general' ? targetType : 'General Savings'),
      targetAmount: Number(amount),
      deadline: deadline
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/targets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Use the extracted token here
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Target successfully saved!");
        onClose();
      } else {
        console.error("Auth Error:", data.msg);
        alert(`Error: ${data.msg}`);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-6">
      <div className="bg-white w-full max-w-md rounded-t-4xl md:rounded-4xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
            <Target className="text-mpesa-green" /> Set New Target
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Dropdown with unique values */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Savings Category</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-mpesa-green outline-none"
            >
              <option value="general">General Savings</option>
              <option value="education">Education</option>
              <option value="bills">Bills</option>
              <option value="furniture">Furniture</option>
              <option value="electronic">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Title shows for anything NOT general */}
          {targetType !== 'general' && (
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Goal Name</label>
              <input
                type="text"
                placeholder="e.g. Semester 2 Fees"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Target Amount (KES)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <DollarSign className="absolute left-4 top-4 text-slate-400" size={20} />
            </div>
          </div>

          {/* Deadline Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Deadline</label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl outline-none"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
            </div>
          </div>

          {/* 2. BUTTON POINTS TO handleSave */}
          <button
            className="w-full bg-mpesa-green text-white py-5 rounded-3xl font-bold active:scale-95 transition-all"
            onClick={handleSave}
          >
            Create Target
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetTargetModal;