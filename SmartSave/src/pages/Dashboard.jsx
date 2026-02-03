import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Target, CreditCard, User, Plus, TrendingUp, ArrowDownLeft } from 'lucide-react';
import DepositModal from '../components/DepositModal';
import SetTargetModal from '../components/SetTargetModal';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
    // 1. Ensure setUser is destructured from Context
    const { user, setUser } = useContext(AuthContext) || { user: null, setUser: () => { } };
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isTargetOpen, setIsTargetOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);


    const refreshUserData = useCallback(async () => {
        try {
            // Change '/auth/user' to '/auth'
            const res = await API.get('/auth');

            if (res.data) {
                const currentSession = JSON.parse(localStorage.getItem('savesmart_user'));
                const updatedData = {
                    ...currentSession,
                    ...res.data
                };

                setUser(updatedData);
                localStorage.setItem('savesmart_user', JSON.stringify(updatedData));
                console.log("Dashboard Synced. Current Balance:", res.data.savingsBalance);
            }
        } catch (err) {
            console.error("Sync failed:", err.response?.status);
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

    // 4. Polling Logic: Check for M-Pesa updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshUserData();
            fetchHistory();
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshUserData, fetchHistory]);

    const chartData = transactions.slice(0, 7).reverse().map((tx, index) => ({
        // Adding the index or time makes the point unique to the tooltip
        day: `${new Date(tx.date).toLocaleDateString('en-KE', { weekday: 'short' })} ${index + 1}`,
        amount: tx.amount,
        fullDate: new Date(tx.date).toLocaleTimeString() // Optional for extra detail
    }));

    // Fallback to dummy data only if there are no transactions yet
    const displayData = chartData.length > 0 ? chartData : [
        { day: 'Start', amount: 0 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-64">
            {/* Sidebar remains the same */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex-col p-6">
                <h2 className="text-mpesa-green font-bold text-2xl mb-10"><a href="/">SmartSave</a></h2>
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
                            <AreaChart data={displayData}> {/* Change savingsData to displayData */}
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#49b248" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#49b248" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                {/* Update Tooltip to show KES prefix */}
                                <Tooltip
                                    // Force the tooltip to read the 'amount' property explicitly
                                    formatter={(value) => `KES ${value.toLocaleString()}`}
                                    labelStyle={{ color: '#1e293b' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount" // <--- Ensure this is 'amount'
                                    stroke="#49b248"
                                    strokeWidth={3}
                                    fill="url(#colorAmount)"
                                    // Add animationDuration to ensure it snaps to new values
                                    animationDuration={500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Targets Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-brand-dark">My Savings Goals</h3>
                        <button onClick={() => setIsTargetOpen(true)} className="text-mpesa-green text-sm font-bold">+ Add New</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user?.targets?.length > 0 ? (
                            user.targets.map((target) => {
                                // Calculate percentage carefully
                                const current = Number(target.currentAmount || 0);
                                const goal = Number(target.targetAmount || 1);
                                const percentage = (current / goal) * 100;

                                return (
                                    <div key={target._id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{target.type}</p>
                                                <h4 className="font-bold text-brand-dark">{target.title}</h4>
                                            </div>
                                            <span className="bg-green-50 text-mpesa-green text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                                                {target.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-500">Progress</span>
                                            {/* Added .toFixed(2) for the accuracy you wanted */}
                                            <span className="font-bold text-brand-dark">
                                                KES {current.toFixed(2)} / {goal.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-mpesa-green h-full transition-all duration-1000 flex items-center justify-end"
                                                // Ensure even a tiny progress shows a tiny bit of green
                                                style={{ width: `${Math.max(percentage, current > 0 ? 2 : 0)}%` }}
                                            >
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                            {percentage.toFixed(1)}% Completed
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-2 bg-slate-100/50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem] text-center">
                                <p className="text-slate-400">No targets set yet. Start by setting a goal!</p>
                            </div>
                        )}
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

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-4 flex justify-between items-center z-50">
                <Home className="text-mpesa-green" />
                {/* Fixed the button logic here */}
                <button onClick={() => setIsTargetOpen(true)}><Target className="text-slate-400" /></button>
                <button onClick={() => setIsDepositOpen(true)} className="bg-mpesa-green text-white p-4 rounded-2xl -mt-14 shadow-lg active:scale-95"><Plus size={24} /></button>
                <CreditCard className="text-slate-400" />
                <User className="text-slate-400" />
            </nav>

            <DepositModal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
            />

            {/* Ensure this is the ONLY SetTargetModal and it's INSIDE the Dashboard function */}
            <SetTargetModal
                isOpen={isTargetOpen}
                onClose={() => setIsTargetOpen(false)}
                refreshData={refreshUserData}
            />
        </div>
    );
};

export default Dashboard;