import { useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import {
  Shield, Users, UserCheck, Trash2, Send, Image,
  Eye, Crown, Activity, MessageCircle, FileText, BarChart3,
  AlertTriangle, X, Megaphone
} from 'lucide-react';

export default function AdminPanel() {
  const { user, allUsers, deleteUser } = useAuth();
  const { posts, onlineCount, addMuralMessage, muralMessages, deleteMuralMessage } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'mural'>('overview');
  const [muralContent, setMuralContent] = useState('');
  const [muralTitle, setMuralTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
        <p className="text-gray-400">Apenas o administrador pode acessar este painel.</p>
      </div>
    );
  }

  const normalUsers = allUsers.filter((u) => !u.isAdmin);
  const totalUsers = allUsers.length;

  const handleMuralPost = () => {
    if (!muralContent.trim()) return;
    addMuralMessage(muralContent.trim(), muralTitle.trim() || undefined);
    setMuralContent('');
    setMuralTitle('');
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    setConfirmDelete(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral', icon: BarChart3 },
    { id: 'users' as const, label: 'Usuários', icon: Users },
    { id: 'mural' as const, label: 'Gerenciar Mural', icon: Megaphone },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="card-dark rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center golden-glow">
            <Shield className="w-7 h-7 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gold-text flex items-center gap-2">
              Painel do Administrador
              <Crown className="w-5 h-5 text-gold-400" />
            </h2>
            <p className="text-gray-400 text-sm">Bem-vindo, {user.nickname}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gold-600 text-black'
                : 'bg-dark-800 text-gray-400 hover:text-white border border-gold-600/20'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total de Usuários"
              value={totalUsers}
              color="text-blue-400"
              bg="bg-blue-400/10"
            />
            <StatCard
              icon={<UserCheck className="w-5 h-5" />}
              label="Usuários Online"
              value={onlineCount}
              color="text-green-400"
              bg="bg-green-400/10"
            />
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Total de Posts"
              value={posts.length}
              color="text-gold-400"
              bg="bg-gold-400/10"
            />
            <StatCard
              icon={<Megaphone className="w-5 h-5" />}
              label="Avisos no Mural"
              value={muralMessages.length}
              color="text-purple-400"
              bg="bg-purple-400/10"
            />
          </div>

          {/* Recent Activity */}
          <div className="card-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold-400" />
              Atividade Recente
            </h3>
            <div className="space-y-3">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
                  <Eye className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      <span className="text-gold-400 font-semibold">{post.userNickname}</span>
                      {' '}publicou: {post.content || '(imagem)'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma atividade recente</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card-dark rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gold-600/10">
            <h3 className="text-lg font-semibold text-white">
              Gerenciar Usuários ({normalUsers.length})
            </h3>
          </div>
          <div className="divide-y divide-gold-600/10">
            {normalUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-dark-800/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black font-bold">{u.nickname.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{u.nickname}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs flex items-center gap-1 ${u.isOnline ? 'text-green-400' : 'text-gray-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${u.isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
                        {u.isOnline ? 'Online' : 'Offline'}
                      </span>
                      <span className="text-xs text-gray-600">
                        Entrou em {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmDelete(u.id)}
                  className="flex items-center gap-1.5 text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-lg text-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mural Tab */}
      {activeTab === 'mural' && (
        <div className="space-y-6">
          <div className="card-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gold-400" />
              Novo Aviso no Mural
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={muralTitle}
                onChange={(e) => setMuralTitle(e.target.value)}
                placeholder="Título do aviso (opcional)"
                className="w-full bg-dark-800 border border-gold-600/20 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-all"
              />
              <textarea
                value={muralContent}
                onChange={(e) => setMuralContent(e.target.value)}
                placeholder="Conteúdo do aviso..."
                className="w-full bg-dark-800 border border-gold-600/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-all resize-none"
                rows={4}
              />
              <button
                onClick={handleMuralPost}
                disabled={!muralContent.trim()}
                className="btn-gold w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                Publicar no Mural
              </button>
            </div>
          </div>

          <div className="card-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Avisos Atuais</h3>
            <div className="space-y-4">
              {muralMessages.map((msg) => (
                <div key={msg.id} className="bg-dark-800 rounded-xl p-4 border border-gold-600/10 flex justify-between items-start">
                  <div>
                    {msg.title && <h4 className="text-gold-400 font-bold mb-1">{msg.title}</h4>}
                    <p className="text-gray-300 text-sm">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(msg.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => deleteMuralMessage(msg.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {muralMessages.length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum aviso publicado no mural</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-400 mb-6">Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-dark-700 text-white font-semibold hover:bg-dark-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode, label: string, value: number | string, color: string, bg: string }) {
  return (
    <div className="card-dark rounded-2xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
