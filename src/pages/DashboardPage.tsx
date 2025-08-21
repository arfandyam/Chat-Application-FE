import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import {
  Card,
  CardContent,
} from '../components/ui/card';
import {
  Users,
  MessageCircle,
  Plus
} from "lucide-react"
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useState } from 'react';
import type { User } from '../types/domain/user';

const DashboardPage: React.FC = () => {
  const currentUser: User = JSON.parse(sessionStorage.getItem('user') || '');
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Chat Rooms</h1>
            <p className="text-gray-600">Welcome back, {currentUser.username}!</p>
          </div>

          <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Type</label>
                  <div className="flex gap-2">
                    <Button
                      variant={roomType === 'group' ? 'default' : 'outline'}
                      onClick={() => setRoomType('group')}
                      size="sm"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Group
                    </Button>
                    <Button
                      variant={roomType === 'private' ? 'default' : 'outline'}
                      onClick={() => setRoomType('private')}
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Private
                    </Button>
                  </div>
                </div>

                <Input
                  placeholder={roomType === 'private' ? 'Select user for private chat' : 'Room name'}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {roomType === 'private' ? 'Select User' : 'Add Members'}
                  </label>
                  <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                    {onlineUsers.filter(user => user !== currentUser).map(user => (
                      <label key={user} className="flex items-center space-x-2">
                        <input
                          type={roomType === 'private' ? 'radio' : 'checkbox'}
                          name="users"
                          checked={selectedUsers.includes(user)}
                          onChange={(e) => {
                            if (roomType === 'private') {
                              setSelectedUsers(e.target.checked ? [user] : []);
                              setNewRoomName(e.target.checked ? user : '');
                            } else {
                              setSelectedUsers(prev =>
                                e.target.checked
                                  ? [...prev, user]
                                  : prev.filter(u => u !== user)
                              );
                            }
                          }}
                        />
                        <span>{user}</span>
                        <Badge variant="outline" className="ml-auto">online</Badge>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={createRoom} className="w-full">
                  Create Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => (
            <Card
              key={room.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => joinRoom(room)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {room.type === 'group' ? (
                      <Users className="h-5 w-5 text-blue-500" />
                    ) : (
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    )}
                    <h3 className="font-semibold">{room.name}</h3>
                  </div>
                  {room.unread > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {room.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {room.members.length} member{room.members.length !== 1 ? 's' : ''}
                </p>
                {room.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;