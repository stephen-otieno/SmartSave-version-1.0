import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Safety Check: Avoid destructuring from undefined
    const auth = useContext(AuthContext);
    const login = auth ? auth.login : null;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', formData);
            // This triggers the global state update
            login(res.data);
            window.location.href = '/dashboard';
        } catch (err) {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl text-center">
                <h1 className="text-3xl font-black text-brand-dark mb-2">Welcome Back</h1>
                <p className="text-slate-500 mb-8">Ready to reach your targets?</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-mpesa-green"
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-mpesa-green"
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-mpesa-green text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                        Log In <LogIn size={20} />
                    </button>
                </form>
                <p className="mt-6 text-slate-500">
                    New to SaveSmart? <a href="/register" className="text-mpesa-green font-bold">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;