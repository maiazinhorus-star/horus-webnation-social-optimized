import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, User, Lock, UserPlus, LogIn, AlertCircle, Crown } from 'lucide-react';

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Email/Nickname ou senha incorretos!');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/horus-eye-bg.jpg)',
          filter: 'brightness(0.25)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-900/60 to-dark-950/90" />

      {/* Floating Eye of Horus SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg viewBox="0 0 200 200" className="w-[500px] h-[500px] float-anim">
          <defs>
            <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a843" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
          </defs>
          {/* Eye of Horus simplified */}
          <path d="M100 20 L180 80 L170 120 L130 110 L120 150 L80 150 L70 110 L30 120 L20 80 Z"
            fill="none" stroke="url(#eyeGrad)" strokeWidth="3" opacity="0.5" />
          <circle cx="100" cy="90" r="20" fill="none" stroke="url(#eyeGrad)" strokeWidth="3" />
          <circle cx="100" cy="90" r="8" fill="url(#eyeGrad)" />
          <path d="M30 80 L20 60 M170 80 L180 60" stroke="url(#eyeGrad)" strokeWidth="2" opacity="0.5" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 golden-glow mb-4">
            <Eye className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold gold-text">Horus WebNation</h1>
          <p className="text-gray-400 mt-2 flex items-center justify-center gap-1">
            <Crown className="w-4 h-4 text-gold-500" />
            A Rede Social dos Escolhidos
            <Crown className="w-4 h-4 text-gold-500" />
          </p>
        </div>

        <div className="card-dark rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gold-400">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email ou Nickname</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-600" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none gold-border transition-all"
                  placeholder="Digite seu email ou nickname"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none gold-border transition-all"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 rounded-lg p-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Não tem conta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
              >
                Criar Conta <UserPlus className="w-4 h-4 inline" />
              </button>
            </p>
          </div>
        </div>

        {/* WhatsApp Channel */}
        <div className="mt-6 text-center">
          <a
            href="https://whatsapp.com/channel/0029Vb7gwc9CRs1wLPWKrf3B"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600/20 border border-green-600/40 text-green-400 px-6 py-3 rounded-xl hover:bg-green-600/30 transition-all text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Canal Oficial no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
