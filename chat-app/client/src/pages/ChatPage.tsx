import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { cn } from '@/utils';

const ChatPage = () => {
  const { user } = useAuthStore();
  const { fetchRooms, activeRoom } = useChatStore();

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user, fetchRooms]);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Welcome to Chat App!
              </h3>
              <p className="text-muted-foreground max-w-sm">
                Select a chat room from the sidebar to start messaging, or create a new room to begin a conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;