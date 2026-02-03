import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Wallet, TrendingUp, Bell, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize navigate
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Main Container: Full width on mobile, centered max-width on laptop */}
      <div className="w-full max-w-5xl flex flex-col min-h-screen px-6 py-10 md:py-20">

        {/* Header/Logo Section */}
        <div className="flex items-center gap-2 mb-10 md:justify-center">
          <div className="bg-mpesa-green p-2 rounded-lg shadow-sm">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-brand-dark text-xl tracking-tight">SmartSave</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12 md:text-center md:mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark leading-[1.1] mb-6">
            {getGreeting()}, <br className="md:hidden" />
            <span className="text-mpesa-green">Smart Saver</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl md:mx-auto">
            Securely track your savings tendency and reach your targets via M-Pesa transactions.
          </p>
        </div>

        {/* Feature Cards: 1 column on mobile, 2 columns on laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-5 border border-slate-100 hover:border-mpesa-green transition-all">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <TrendingUp className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-dark text-lg">Visual Analysis</h3>
              <p className="text-slate-500">View interactive line graphs of your habits.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl flex items-center gap-5 border border-slate-100 hover:border-mpesa-green transition-all">
            <div className="bg-orange-100 p-4 rounded-2xl">
              <Bell className="text-orange-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-dark text-lg">Instant Alerts</h3>
              <p className="text-slate-500">Personalized emails for every deposit.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col md:flex-row md:justify-center gap-4">
          <button
            onClick={() => navigate('/register')} // Navigate to Register
            className="w-full md:w-64 bg-mpesa-green text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-95 active:scale-95 transition-all cursor-pointer"
          >
            Start Saving Now <ChevronRight size={20} />
          </button>

          <button
            onClick={() => navigate('/login')} // Navigate to Login
            className="w-full md:w-64 bg-white text-slate-600 py-5 rounded-3xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Log In
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;