import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

interface TokenGateProps {
    onValidated: () => void;
}

const resolveApiBaseUrl = () => {
    const envBase = import.meta.env.VITE_API_URL;
    if (envBase) return envBase.replace(/\/$/, '');
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin.replace(/\/$/, '');
    if (origin.includes('localhost:5173')) return 'http://localhost:3001';
    return origin;
};

const API_BASE_URL = resolveApiBaseUrl();

const TokenGate: React.FC<TokenGateProps> = ({ onValidated }) => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token.trim()) {
            setError('Please enter a valid token.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/validate-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (response.ok) {
                onValidated();
            } else {
                setError('Incorrect or expired token.');
            }
        } catch (err) {
            setError('Connection error while validating token.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] h-full w-full bg-slate-50 rounded-xl border border-slate-200">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Lock className="w-6 h-6 text-blue-600" />
                </div>

                <h2 className="text-2xl font-semibold text-slate-800 text-center mb-2">Restricted Access</h2>
                <p className="text-slate-500 text-center mb-8">
                    The Presales Copilot module requires a developer token (DEV_TOKEN) to access.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-1">
                            Access Token
                        </label>
                        <input
                            id="token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your DEV_TOKEN"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !token.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                    >
                        {isLoading ? 'Validating...' : 'Access Copilot'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TokenGate;
