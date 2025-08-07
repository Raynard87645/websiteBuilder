import { useState } from 'react';
import { LogOut, Plus, Search, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { cn, getInitials, formatTime } from '@/utils';

const ChatSidebar = () => {
  const { user, logout } = useAuthStore();
  const { rooms, activeRoom, setActiveRoom } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Chat App</h1>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-muted rounded-md transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">
              {user ? getInitials(user.username) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground px-2">
              Rooms ({filteredRooms.length})
            </h2>
            <button
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Create new room"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No rooms found' : 'No rooms yet'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {!searchQuery && 'Create a room to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  className={cn(
                    'w-full p-3 rounded-md text-left transition-colors',
                    'hover:bg-muted',
                    activeRoom?.id === room.id ? 'bg-primary/10 border border-primary/20' : ''
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-secondary-foreground">
                        {getInitials(room.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {room.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(room.updated_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {room.type === 'private' ? 'Private chat' : 'Group chat'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;