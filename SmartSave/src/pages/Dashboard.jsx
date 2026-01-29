import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Target, CreditCard, User, Plus, TrendingUp, ArrowDownLeft } from 'lucide-react';
import DepositModal from '../components/DepositModal';
import SetTargetModal from '../components/SetTargetModal';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
    // 1. Ensure setUser is destructured from Context
    const { user, setUser } = useContext(AuthContext) || { user: null, setUser: () => {} };
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isTargetOpen, setIsTargetOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Define fetchers with useCallback so they can be reused safely
    const refreshUserData = useCallback(async () => {
        try {
            const res = await API.get('/auth/user');
            if (res.data) setUser(res.data);
        } catch (err) {
            console.error("Failed to refresh balance", err);
        }
    }, [setUser]);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await API.get('/transactions/history');
            setTransactions(res.data);
        } catch (err) {
            console.error("Error fetching history", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Initial Load
    useEffect(() => {
        fetchHistory();
        refreshUserData();
    }, [fetchHistory, refreshUserData]);

    // 4. Polling Logic: Check for M-Pesa updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshUserData();
            fetchHistory();
        }, 5000);

        return () => clearInterval(interval);
    }, [refreshUserData, fetchHistory]);

    const savingsData = [
        { day: 'Mon', amount: 200 }, { day: 'Tue', amount: 600 },
        { day: 'Wed', amount: 400 }, { day: 'Thu', amount: 1200 },
        { day: 'Fri', amount: 800 }, { day: 'Sat', amount: 1500 },
        { day: 'Sun', amount: 1100 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-64">
            {/* Sidebar remains the same */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex-col p-6">
                <h2 className="text-mpesa-green font-bold text-2xl mb-10"><a href="/">SaveSmart</a></h2>
                <nav className="space-y-4">
                    <button className="w-full flex items-center gap-3 p-3 bg-mpesa-green/10 text-mpesa-green rounded-xl font-bold">
                        <Home size={20} /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                        <Target size={20} /> My Targets
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                        <CreditCard size={20} /> Transactions
                    </button>
                </nav>
            </aside>

            <main className="p-6 max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">
                            Hello, {user?.name?.split(' ')[0] || 'Saver'}! 👋
                        </h1>
                        <p className="text-slate-500 text-sm">Welcome back to your savings portal.</p>
                    </div>
                </header>

                {/* Balance Card - Dynamic with savingsBalance */}
                <div className="bg-mpesa-green p-8 rounded-[2.5rem] text-white shadow-xl shadow-green-100 mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm opacity-80 font-medium uppercase tracking-wider">Total Savings Balance</p>
                        <h2 className="text-5xl font-black mt-2">
                            KES {user?.savingsBalance?.toLocaleString() || '0.00'}
                        </h2>
                    </div>
                    <div className="absolute -right-10 -bottom-10 bg-white/10 w-48 h-48 rounded-full blur-3xl"></div>
                </div>

                {/* Savings Tendency Chart Section */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-brand-dark">Saving Tendency</h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1">
                            <TrendingUp size={12} /> Weekly Analysis
                        </span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={savingsData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#49b248" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#49b248" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="amount" stroke="#49b248" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 text-brand-dark">Recent Activity</h3>
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400 font-bold animate-pulse">Checking for updates...</div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-slate-400 italic">No deposits recorded yet.</p>
                            </div>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx._id} className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-mpesa-green/10 p-3 rounded-2xl text-mpesa-green">
                                            <ArrowDownLeft size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-dark">M-Pesa Deposit</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Receipt: {tx.mpesaReceiptNumber}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-mpesa-green">+ KES {tx.amount}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString('en-KE')}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Nav and Modals */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-4 flex justify-between items-center z-50">
                <Home className="text-mpesa-green" />
                <button onClick={() => setIsTargetOpen(true)}><Target className="text-slate-400" /></button>
                <button onClick={() => setIsDepositOpen(true)} className="bg-mpesa-green text-white p-4 rounded-2xl -mt-14 shadow-lg active:scale-95"><Plus size={24} /></button>
                <CreditCard className="text-slate-400" />
                <User className="text-slate-400" />
            </nav>

            <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
            <SetTargetModal isOpen={isTargetOpen} onClose={() => setIsTargetOpen(false)} />
        </div>
    );
};

export default Dashboard;