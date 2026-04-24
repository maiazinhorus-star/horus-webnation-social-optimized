import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { Send, MessageCircle, Crown } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const { chatMessages, sendChatMessage, onlineCount } = useData();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!user) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    sendChatMessage(message);
    setMessage('');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    return date.toLocaleDateString('pt-BR');
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: typeof chatMessages }[] = [];
  chatMessages.forEach((msg) => {
    const dateKey = formatDate(msg.createdAt);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateKey, messages: [msg] });
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 h-[calc(100vh-4rem)] flex flex-col">
      {/* Chat Header */}
      <div className="card-dark rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Bate-Papo Horus</h2>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">{onlineCount} online</span>
            </div>
          </div>
        </div>
        <a
          href="https://whatsapp.com/channel/0029Vb7gwc9CRs1wLPWKrf3B"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-600/20 border border-green-600/30 text-green-400 px-3 py-1.5 rounded-full text-xs hover:bg-green-600/30 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Canal
        </a>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold-600/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gold-400" />
              </div>
              <p className="text-gray-500">Nenhuma mensagem ainda</p>
              <p className="text-gray-600 text-sm">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-gold-600/10" />
                <span className="text-xs text-gray-500">{group.date}</span>
                <div className="flex-1 h-px bg-gold-600/10" />
              </div>
              {group.messages.map((msg) => {
                const isMine = msg.userId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 mb-3 ${isMine ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {msg.userAvatar ? (
                        <img src={msg.userAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-black font-bold text-xs">
                          {msg.userNickname.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className={`max-w-[70%] ${isMine ? 'items-end' : ''}`}>
                      <div className={`flex items-center gap-1 mb-0.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs text-gold-400 font-semibold">
                          {msg.userNickname}
                        </span>
                        {msg.userId === 'admin-001' && <Crown className="w-3 h-3 text-gold-400" />}
                        <span className="text-[10px] text-gray-600">{formatTime(msg.createdAt)}</span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm ${
                          isMine
                            ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-black'
                            : 'bg-dark-800 text-gray-200'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="card-dark rounded-2xl p-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-dark-800 border border-gold-600/20 rounded-full px-5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="btn-gold w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
