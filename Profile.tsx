import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import {
  User, Camera, Save, Edit3, Phone, AtSign, MessageCircle,
  Calendar, Mail, Heart, Share2, Send
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { posts, likePost, addComment, deletePost } = useData();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    whatsapp: user?.whatsapp || '',
    instagram: user?.instagram || '',
    telegram: user?.telegram || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const userPosts = posts.filter((p) => p.userId === user.id);

  const handleSave = () => {
    updateUser({
      ...form,
      avatar: avatarPreview,
    });
    setEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = (post: typeof posts[0], platform: string) => {
    const text = encodeURIComponent(`Veja este post de ${post.userNickname} no Horus WebNation! 👁️\n\n${post.content}`);
    const url = encodeURIComponent('https://horuswebnation.com');
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${post.content}\n\nCompartilhado do Horus WebNation 👁️`);
        alert('Link copiado! Compartilhe no Instagram.');
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShareMenu(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Agora';
    if (mins < 60) return `${mins}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR');
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    addComment(postId, {
      userId: user.id,
      userNickname: user.nickname,
      userAvatar: user.avatar,
      content,
    });
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="card-dark rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-gold-900 via-gold-700 to-gold-900 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url(/images/horus-eye-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <label className="cursor-pointer group relative inline-block">
              <div className="w-24 h-24 rounded-full border-4 border-dark-900 bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden">
                {avatarPreview || user.avatar ? (
                  <img src={avatarPreview || user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-black" />
                )}
              </div>
              {editing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
              {editing && <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />}
            </label>
          </div>

          {/* Info */}
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Nickname</label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2 px-4 text-white text-sm focus:outline-none gold-border"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Biografia</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2 px-4 text-white text-sm focus:outline-none gold-border resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp</label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2 px-4 text-white text-sm focus:outline-none gold-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-1"><AtSign className="w-3 h-3" /> Instagram</label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2 px-4 text-white text-sm focus:outline-none gold-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Telegram</label>
                  <input
                    type="text"
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                    className="w-full bg-dark-800 border border-gold-600/30 rounded-xl py-2 px-4 text-white text-sm focus:outline-none gold-border"
                  />
                </div>
              </div>
              <button onClick={handleSave} className="btn-gold px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" /> Salvar
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.nickname}</h2>
                  <p className="text-gray-400 text-sm mt-1">{user.bio || 'Nenhuma biografia'}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Editar
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Entrou em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </span>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 mt-4">
                {user.whatsapp && (
                  <a href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-green-600/20 text-green-400 px-3 py-1.5 rounded-full text-xs hover:bg-green-600/30 transition-all">
                    <Phone className="w-3 h-3" /> WhatsApp
                  </a>
                )}
                {user.instagram && (
                  <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-pink-600/20 text-pink-400 px-3 py-1.5 rounded-full text-xs hover:bg-pink-600/30 transition-all">
                    <AtSign className="w-3 h-3" /> Instagram
                  </a>
                )}
                {user.telegram && (
                  <a href={`https://t.me/${user.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-full text-xs hover:bg-blue-600/30 transition-all">
                    <MessageCircle className="w-3 h-3" /> Telegram
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Minhas Publicações ({userPosts.length})</h3>
        {userPosts.length === 0 ? (
          <div className="card-dark rounded-2xl p-8 text-center">
            <p className="text-gray-500">Você ainda não fez nenhuma publicação</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <div key={post.id} className="card-dark rounded-2xl overflow-hidden mb-4">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden">
                    {post.userAvatar ? (
                      <img src={post.userAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-black font-bold text-xs">{post.userNickname.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-white text-sm font-semibold">{post.userNickname}</span>
                    <span className="text-gray-500 text-xs ml-2">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <button onClick={() => deletePost(post.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6h16zM10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
              {post.content && <div className="px-4 pb-3 text-sm text-gray-200">{post.content}</div>}
              {post.image && <img src={post.image} alt="" className="w-full max-h-80 object-cover" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
