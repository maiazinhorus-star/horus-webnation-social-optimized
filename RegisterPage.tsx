import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, User, Lock, Mail, LogIn, AlertCircle, MessageCircle, Phone, Camera, UserPlus } from 'lucide-react';

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    avatar: '',
    whatsapp: '',
    instagram: '',
    telegram: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAvatarPreview(result);
        setForm({ ...form, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    if (!form.nickname.trim()) {
      setError('O nickname é obrigatório!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = register({
        nickname: form.nickname.trim(),
        email: form.email.trim(),
        password: form.password,
        bio: form.bio.trim(),
        avatar: form.avatar || '',
        whatsapp: form.whatsapp.trim(),
        instagram: form.instagram.trim(),
        telegram: form.telegram.trim(),
      });

      if (!success) {
        setError('Email ou Nickname já está em uso!');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/horus-eye-bg.jpg)',
          filter: 'brightness(0.25)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-900/60 to-dark-950/90" />

      {/* Floating Eye */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg viewBox="0 0 200 200" className="w-[500px] h-[500px] float-anim">
          <defs>
            <linearGradient id="eyeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4a843" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
          </defs>
          <path d="M100 20 L180 80 L170 120 L130 110 L120 150 L80 150 L70 110 L30 120 L20 80 Z"
            fill="none" stroke="url(#eyeGrad2)" strokeWidth="3" opacity="0.5" />
          <circle cx="100" cy="90" r="20" fill="none" stroke="url(#eyeGrad2)" strokeWidth="3" />
          <circle cx="100" cy="90" r="8" fill="url(#eyeGrad2)" />
        </svg>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 golden-glow mb-3">
            <Eye className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold gold-text">Horus WebNation</h1>
          <p className="text-gray-400 text-sm mt-1">Crie sua conta e conecte-se</p>
        </div>

        <div className="card-dark rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-center mb-6 text-gold-400">Criar Conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center mb-2">
              <label className="cursor-pointer group">
                <div className="w-20 h-20 rounded-full bg-dark-800 border-2 border-gold-600/40 flex items-center justify-center overflow-hidden hover:border-gold-500 transition-all">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gold-600 group-hover:text-gold-400 transition-colors" />
                  )}
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">Foto de perfil</p>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nickname *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" />
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                    placeholder="Seu nickname"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Confirmar Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                    placeholder="Repita a senha"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Biografia</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 px-4 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all resize-none"
                placeholder="Conte um pouco sobre você..."
                rows={2}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-xs text-gold-400 font-semibold">Redes Sociais (opcional)</p>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                  placeholder="WhatsApp (ex: 5511999999999)"
                />
              </div>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                  placeholder="Instagram (ex: @seuuser)"
                />
              </div>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  value={form.telegram}
                  onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm placeholder-gray-500 focus:outline-none gold-border transition-all"
                  placeholder="Telegram (ex: @seuuser)"
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
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Já tem conta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
              >
                Fazer Login <LogIn className="w-4 h-4 inline" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
