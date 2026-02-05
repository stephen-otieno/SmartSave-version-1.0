import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Save, RefreshCcw } from 'lucide-react';

const AllocationManager = ({ targets, currentRules, onUpdate }) => {
    const [rules, setRules] = useState([]);

    // Initialize rules based on current targets
    useEffect(() => {
        const initialRules = targets.map(t => {
            const existing = currentRules?.find(r => r.targetId === t._id);
            return {
                targetId: t._id,
                title: t.title,
                percentage: existing ? existing.percentage : 0
            };
        });
        setRules(initialRules);
    }, [targets, currentRules]);

    

    const handleSliderChange = (targetId, value) => {
        setRules(prev => prev.map(r => 
            r.targetId === targetId ? { ...r, percentage: Number(value) } : r
        ));
    };

    const total = rules.reduce((sum, r) => sum + r.percentage, 0);

    const saveRules = async () => {
        if (total !== 100) {
            return alert(`Total must be 100%. Current total: ${total}%`);
        }
        try {
            await API.post('/users/update-rules', { savingsRules: rules });
            alert("Allocation rules updated!");
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("Failed to save rules", err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-brand-dark">Deposit Allocation</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${total === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    Total: {total}%
                </span>
            </div>

            <div className="space-y-6">
                {rules.map((rule) => (
                    <div key={rule.targetId} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-slate-600">
                            <span>{rule.title}</span>
                            <span className="text-mpesa-green font-bold">{rule.percentage}%</span>
                        </div>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={rule.percentage}
                            onChange={(e) => handleSliderChange(rule.targetId, e.target.value)}
                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-mpesa-green"
                        />
                    </div>
                ))}
            </div>

            <button 
                onClick={saveRules}
                disabled={total !== 100}
                className={`mt-8 w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold transition-all ${total === 100 ? 'bg-mpesa-green text-white shadow-lg shadow-green-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
                <Save size={20} /> Save Allocation Rules
            </button>
        </div>
    );
};

export default AllocationManager;