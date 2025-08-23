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
import { useQuery } from '@tanstack/react-query';
import { getFriendsUserApi } from '../api/user';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/domain/user';
import type { Room } from '../types/domain/room';
import {
  createRoomApi,
  getUserRoomsApi
} from '../api/room';

const DashboardPage: React.FC = () => {

  // useNavigate from react-router-dom
  const navigate = useNavigate()

  // DashboardPage states
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false);
  const [roomType, setRoomType] = useState<'private' | 'group'>('private');
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch current user and friends
  const user: User = JSON.parse(sessionStorage.getItem('user') || '');
  const { data: userFriends, isLoading: userFriendsLoading, error: userFriendsError } = useQuery<User[]>({
    queryKey: ["userFriends", user.id],
    queryFn: () => getFriendsUserApi(user.id),
    enabled: !!user?.id,
  })

  const { data: userRooms, isLoading: userRoomsLoading, error: userRoomsError } = useQuery<Room[]>({
    queryKey: ["userRooms", user.id],
    queryFn: () => getUserRoomsApi(user.id),
    enabled: !!user?.id,
  })

  if (userFriendsLoading || userRoomsLoading) {
    return <div>Loading...</div>;
  }
  if (userFriendsError instanceof Error) return <div>Error: {userFriendsError.message}</div>;
  if (userRoomsError instanceof Error) return <div>Error: {userRoomsError.message}</div>;



  async function createRoom() {
    const participantsId: string[] = [user.id, ...selectedUsers];
    const room = await createRoomApi(participantsId, newRoomName, roomType);
    navigate(`/chat/${room.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Chat Rooms</h1>
            <p className="text-gray-600">Welcome back, {user.username}!</p>
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
                      variant={roomType === 'private' ? 'default' : 'outline'}
                      onClick={() => setRoomType('private')}
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Private
                    </Button>
                    <Button
                      variant={roomType === 'group' ? 'default' : 'outline'}
                      onClick={() => setRoomType('group')}
                      size="sm"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Group
                    </Button>
                  </div>
                </div>

                <Input
                  placeholder={roomType === 'private' ? 'Select user for private chat' : 'Room name'}
                  value={newRoomName}
                  disabled={roomType === 'private'}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {roomType === 'private' ? 'Select User' : 'Add Members'}
                  </label>
                  <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                    {userFriends ? (
                      <div>
                        {userFriends.map(user => (
                          <label key={user.id} className="flex items-center space-x-2">
                            <input
                              type={roomType === 'private' ? 'radio' : 'checkbox'}
                              name="users"
                              checked={selectedUsers.includes(user.username)}
                              onChange={(e) => {
                                if (roomType === 'private') {
                                  setSelectedUsers(e.target.checked ? [user.id] : []);
                                  setNewRoomName(e.target.checked ? user.id : '');
                                } else {
                                  setSelectedUsers(prev =>
                                    e.target.checked
                                      ? [...prev, user.id]
                                      : prev.filter(u => u !== user.id)
                                  );
                                }
                              }}
                            />
                            <span>{user.username}</span>
                            <Badge variant="outline" className="ml-auto">online</Badge>
                          </label>
                        ))}
                      </div>
                    ) : null}
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
          {userRooms ? (
            <>
              {userRooms.map(room => (
                <Card
                  key={room.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/chat/${room.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {room.type === 'group' ? (
                          <Users className="h-5 w-5 text-blue-500" />
                        ) : (
                          <MessageCircle className="h-5 w-5 text-green-500" />
                        )}
                        <h3 className="font-semibold">{room.name ? room.name : room.participants.find(p => p.id !== user.id)?.username}</h3>
                      </div>
                      {/* {room.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {room.unread}
                        </Badge>
                      )} */}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {room.participants.length} member{room.participants.length !== 1 ? 's' : ''}
                    </p>
                    {/* {room.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {room.lastMessage}
                      </p>
                    )} */}
                  </CardContent>
                </Card>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;