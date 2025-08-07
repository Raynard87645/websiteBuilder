import { useState, useEffect, useRef } from 'react';
import { Send, MoreHorizontal } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import socketService from '@/services/socket';
import { formatMessageTime, cn } from '@/utils';

const ChatWindow = () => {
  const { user } = useAuthStore();
  const { activeRoom, messages, addMessage, fetchMessages } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomMessages = activeRoom ? messages[activeRoom.id] || [] : [];

  useEffect(() => {
    if (activeRoom) {
      // Fetch messages for active room
      fetchMessages(activeRoom.id);

      // Set up socket listeners for this room
      const handleNewMessage = (data: { roomId: number; message: any }) => {
        if (data.roomId === activeRoom.id) {
          addMessage(data.roomId, data.message);
        }
      };

      socketService.on('new_message', handleNewMessage);

      // Join the room via socket
      socketService.joinRoom(activeRoom.id);

      return () => {
        socketService.off('new_message', handleNewMessage);
        socketService.leaveRoom(activeRoom.id);
      };
    }
  }, [activeRoom, fetchMessages, addMessage]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    // Send via socket for real-time delivery
    socketService.sendMessage(activeRoom.id, messageContent);
  };

  if (!activeRoom) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">
                {activeRoom.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {activeRoom.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeRoom.type === 'private' ? 'Private conversation' : 'Group chat'}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {roomMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Start the conversation
            </h3>
            <p className="text-muted-foreground">
              Send a message to begin chatting in {activeRoom.name}
            </p>
          </div>
        ) : (
          roomMessages.map((message, index) => {
            const isOwn = message.user_id === user?.id;
            const showAvatar = index === 0 || roomMessages[index - 1].user_id !== message.user_id;

            return (
              <div
                key={message.id}
                className={cn(
                  'flex items-end space-x-2',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                {!isOwn && showAvatar && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {message.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {!isOwn && !showAvatar && <div className="w-8" />}
                
                <div
                  className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {!isOwn && showAvatar && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {message.username}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    'text-xs mt-1 opacity-70',
                    isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${activeRoom.name}...`}
            className="flex-1 px-4 py-2 bg-background border border-input rounded-full text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={cn(
              'p-2 rounded-full transition-colors',
              newMessage.trim()
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;