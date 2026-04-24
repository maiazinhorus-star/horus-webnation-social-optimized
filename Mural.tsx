import { useData } from './DataContext';
import { Megaphone, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Mural() {
  const { muralMessages, deleteMuralMessage } = useData();
  const { user } = useAuth();

  if (muralMessages.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gold-600 flex items-center justify-center golden-glow">
          <Megaphone className="w-6 h-6 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mural de Avisos</h2>
          <p className="text-gold-500/80 text-sm font-medium">Comunicados oficiais do Horus WebNation</p>
        </div>
      </div>

      <div className="space-y-6">
        {muralMessages.map((msg) => (
          <div 
            key={msg.id} 
            className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-dark-800 to-dark-900 border border-gold-600/30 p-6 shadow-2xl transition-all hover:border-gold-500/50"
          >
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-600/10 rounded-full blur-3xl group-hover:bg-gold-600/20 transition-all" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-gold-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                
                {user?.isAdmin && (
                  <button
                    onClick={() => deleteMuralMessage(msg.id)}
                    className="p-2 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    title="Excluir aviso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {msg.title && (
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                  {msg.title}
                </h3>
              )}
              
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                {msg.content}
              </div>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-600/50 to-transparent opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
