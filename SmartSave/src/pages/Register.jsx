import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import API from '../services/api';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', mpesaNumber: '' });
    const navigate = useNavigate(); // Initialize the navigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', formData);
            
            // 1. Alert the user that registration was successful
            alert("Registration successful! Please log in to continue.");
            
            // 2. Redirect to the Login page instead of the Dashboard
            navigate('/login'); 
            
        } catch (err) {
            alert(err.response?.data?.msg || "Registration failed. Check your connection.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl">
                <h1 className="text-3xl font-black text-brand-dark mb-2">Join SmartSave</h1>
                <p className="text-slate-500 mb-8">Secure your future, one KES at a time.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... (Keep your input fields exactly as they are) ... */}
                    
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input type="text" placeholder="Full Name" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-mpesa-green"
                            onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input type="email" placeholder="Email Address" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-mpesa-green"
                            onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input type="password" placeholder="Password" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-mpesa-green"
                            onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input type="text" placeholder="M-Pesa Number (254...)" required className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-mpesa-green"
                            onChange={e => setFormData({ ...formData, mpesaNumber: e.target.value })} />
                    </div>

                    <button className="w-full bg-mpesa-green text-white py-5 rounded-3xl font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-95 transition-all">
                        Create Account <ArrowRight size={20} />
                    </button>
                </form>
                
                <p className="mt-6 text-center text-slate-500">
                    Already have an account? <button onClick={() => navigate('/login')} className="text-mpesa-green font-bold">Log In</button>
                </p>
            </div>
        </div>
    );
};

export default Register;