import { useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import {
  Shield, Users, UserCheck, Trash2, Send, Image,
  Eye, Crown, Activity, MessageCircle, FileText, BarChart3,
  AlertTriangle, X
} from 'lucide-react';

export default function AdminPanel() {
  const { user, allUsers, deleteUser } = useAuth();
  const { posts, addPost, deletePost, onlineCount } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'mural'>('overview');
  const [muralContent, setMuralContent] = useState('');
  const [muralImage, setMuralImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!muralContent.trim() && !muralImage) return;
    addPost({
      userId: user.id,
      userNickname: user.nickname,
      userAvatar: user.avatar,
      content: muralContent.trim(),
      image: muralImage || undefined,
    });
    setMuralContent('');
    setMuralImage('');
    setShowImageInput(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMuralImage(ev.target?.result as string);
        setShowImageInput(true);
      };
      reader.readAsDataURL(file);
    }
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
    { id: 'mural' as const, label: 'Postar no Mural', icon: FileText },
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
              icon={<MessageCircle className="w-5 h-5" />}
              label="Comentários"
              value={posts.reduce((acc, p) => acc + p.comments.length, 0)}
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

          {/* Online Users */}
          <div className="card-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-400" />
              Usuários Online Agora
            </h3>
            <div className="flex flex-wrap gap-2">
              {allUsers.filter((u) => u.isOnline).map((u) => (
                <div key={u.id} className="flex items-center gap-2 bg-dark-800 rounded-full px-3 py-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white">{u.nickname}</span>
                  {u.isAdmin && <Crown className="w-3 h-3 text-gold-400" />}
                </div>
              ))}
              {allUsers.filter((u) => u.isOnline).length === 0 && (
                <p className="text-gray-500 text-sm">Nenhum usuário online</p>
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
            {normalUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum usuário cadastrado além do admin
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mural Tab */}
      {activeTab === 'mural' && (
        <div className="space-y-6">
          <div className="card-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-400" />
              Postar no Mural Oficial
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Apenas você (administrador) pode postar no mural. Todos os usuários verão estas publicações.
            </p>
            <textarea
              value={muralContent}
              onChange={(e) => setMuralContent(e.target.value)}
              placeholder="Escreva uma publicação para o mural..."
              className="w-full bg-dark-800 border border-gold-600/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-all resize-none"
              rows={4}
            />
            {showImageInput && muralImage && (
              <div className="relative mt-3">
                <img src={muralImage} alt="Preview" className="rounded-xl max-h-64 object-cover" />
                <button
                  onClick={() => { setMuralImage(''); setShowImageInput(false); }}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors"
              >
                <Image className="w-5 h-5" /> Adicionar Imagem
              </button>
              <button
                onClick={handleMuralPost}
                disabled={!muralContent.trim() && !muralImage}
                className="btn-gold ml-auto px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Publicar no Mural
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="card-dark w-full max-w-sm p-6 rounded-2xl border border-red-500/30">
            <h3 className="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-400 text-sm mb-6">
              Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-dark-800 text-white hover:bg-dark-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode, label: string, value: number, color: string, bg: string }) {
  return (
    <div className="card-dark rounded-2xl p-5 border border-gold-600/5">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
