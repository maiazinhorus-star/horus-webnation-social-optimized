import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { Users, Phone, AtSign, MessageCircle, Crown, User } from 'lucide-react';

export default function UsersList() {
  const { allUsers, user: currentUser } = useAuth();
  const { onlineCount } = useData();
  const [displayUsers, setDisplayUsers] = useState(allUsers);

  // Sincronizar o estado local com o AuthContext
  useEffect(() => {
    setDisplayUsers(allUsers);
  }, [allUsers]);

  if (!currentUser) return null;

  const normalUsers = displayUsers.filter((u) => !u.isAdmin && u.id !== currentUser.id);
  const adminUser = displayUsers.find((u) => u.isAdmin);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="card-dark rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
            <Users className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Usuários do Horus</h2>
            <p className="text-sm text-gray-400">
              {displayUsers.length} cadastrados • {onlineCount} online
            </p>
          </div>
        </div>
      </div>

      {/* Admin Card */}
      {adminUser && (
        <div className="card-dark rounded-2xl p-4 mb-4 border border-gold-600/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden golden-glow">
              {adminUser.avatar ? (
                <img src={adminUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Crown className="w-6 h-6 text-black" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{adminUser.nickname}</span>
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="text-xs bg-gold-600/20 text-gold-400 px-2 py-0.5 rounded-full">Dono</span>
              </div>
              <p className="text-gray-400 text-sm">{adminUser.bio || '👁️ Dono do Horus WebNation'}</p>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <div className={`w-2 h-2 rounded-full ${adminUser.isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
              {adminUser.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-3">
        {normalUsers.map((u) => (
          <div key={u.id} className="card-dark rounded-2xl p-4 hover:border-gold-600/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden">
                {u.avatar ? (
                  <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">{u.nickname}</span>
                  <span className={`flex items-center gap-1 text-xs ${u.isOnline ? 'text-green-400' : 'text-gray-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${u.isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
                    {u.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                {u.bio && <p className="text-gray-400 text-xs mt-0.5 truncate">{u.bio}</p>}
                <div className="flex items-center gap-2 mt-2">
                  {u.whatsapp && (
                    <a href={`https://wa.me/${u.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors" title="WhatsApp">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {u.instagram && (
                    <a href={`https://instagram.com/${u.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 transition-colors" title="Instagram">
                      <AtSign className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {u.telegram && (
                    <a href={`https://t.me/${u.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors" title="Telegram">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600">
                Seguindo
              </span>
            </div>
          </div>
        ))}

        {normalUsers.length === 0 && (
          <div className="card-dark rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum outro usuário cadastrado ainda</p>
            <p className="text-gray-600 text-sm mt-1">Convide seus amigos para o Horus WebNation!</p>
          </div>
        )}
      </div>

      {/* WhatsApp Channel Banner */}
      <div className="mt-8 card-dark rounded-2xl p-5 bg-gradient-to-r from-green-900/20 to-dark-800 border border-green-600/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-600/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Canal Oficial no WhatsApp</h3>
            <p className="text-gray-400 text-sm">Fique por dentro de todas as novidades!</p>
          </div>
          <a
            href="https://whatsapp.com/channel/0029Vb7gwc9CRs1wLPWKrf3B"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all"
          >
            Acessar
          </a>
        </div>
      </div>
    </div>
  );
}
