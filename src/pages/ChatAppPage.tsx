import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Plus, ArrowLeft, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

// type Step = 'username' | 'rooms' | 'chat';
type RoomType = 'private' | 'group';

interface Room {
  id: string;
  name: string;
  type: RoomType;
  members: string[];
  lastMessage: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

// type MessagesRecord = Record<string, Message[]>;

const ChatApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string>('');
  // const [step, setStep] = useState<Step>('username');
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'General', type: 'group', members: ['Alice', 'Bob', 'Charlie'], lastMessage: 'Hello everyone!', unread: 2 },
    { id: '2', name: 'Alice', type: 'private', members: ['Alice'], lastMessage: 'Hey there!', unread: 1 },
  ]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  // const [messages, setMessages] = useState<MessagesRecord>({
  //   '1': [
  //     { id: '1', sender: 'Alice', content: 'Hello everyone!', timestamp: new Date(Date.now() - 300000) },
  //     { id: '2', sender: 'Bob', content: 'Hey Alice! How are you?', timestamp: new Date(Date.now() - 240000) },
  //     { id: '3', sender: 'Charlie', content: 'Good morning!', timestamp: new Date(Date.now() - 180000) },
  //   ],
  //   '2': [
  //     { id: '1', sender: 'Alice', content: 'Hey there!', timestamp: new Date(Date.now() - 120000) },
  //     { id: '2', sender: 'Alice', content: 'Are you available for a quick call?', timestamp: new Date(Date.now() - 60000) },
  //   ]
  // });
  const [newMessage, setNewMessage] = useState<string>('');
  const [onlineUsers] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roomType, setRoomType] = useState<RoomType>('group');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const scrollToBottom = (): void => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages, currentRoom]);

  // Simulate receiving new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && currentRoom) {
        const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        const randomMessages = [
          'That sounds great!',
          'I agree with that',
          'Interesting point',
          'Thanks for sharing',
          'What do you think?',
          'Let me know when you\'re free',
          'Have a great day!',
          'Looking forward to it'
        ];
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        if (randomUser !== currentUser) {
          addMessage(currentRoom.id, randomUser, randomMessage);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentRoom, currentUser, onlineUsers]);

  // const handleUsernameSubmit = (): void => {
  //   if (currentUser.trim()) {
  //     setStep('rooms');
  //   }
  // };

  // const addMessage = (roomId: string, sender: string, content: string): void => {
  //   const newMsg: Message = {
  //     id: Date.now().toString(),
  //     sender,
  //     content,
  //     timestamp: new Date()
  //   };
    
  //   setMessages(prev => ({
  //     ...prev,
  //     [roomId]: [...(prev[roomId] || []), newMsg]
  //   }));

  //   // Update room's last message
  //   setRooms(prev => prev.map(room => 
  //     room.id === roomId 
  //       ? { ...room, lastMessage: content, unread: sender !== currentUser ? room.unread + 1 : 0 }
  //       : room
  //   ));
  // };

  // const sendMessage = (): void => {
  //   if (newMessage.trim() && currentRoom) {
  //     addMessage(currentRoom.id, currentUser, newMessage);
  //     setNewMessage('');
  //   }
  // };

  // const createRoom = (): void => {
  //   if (!newRoomName.trim()) return;
    
  //   const newRoom: Room = {
  //     id: Date.now().toString(),
  //     name: newRoomName,
  //     type: roomType,
  //     members: roomType === 'private' ? selectedUsers : [currentUser, ...selectedUsers],
  //     lastMessage: '',
  //     unread: 0
  //   };

  //   setRooms(prev => [...prev, newRoom]);
  //   setMessages(prev => ({ ...prev, [newRoom.id]: [] }));
  //   setIsCreateRoomOpen(false);
  //   setNewRoomName('');
  //   setSelectedUsers([]);
  //   setRoomType('group');
  // };

  // const joinRoom = (room: Room): void => {
  //   setCurrentRoom(room);
  //   setStep('chat');
    
  //   // Mark room as read
  //   setRooms(prev => prev.map(r => 
  //     r.id === room.id ? { ...r, unread: 0 } : r
  //   ));
  // };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (step === 'chat' && currentRoom) {
    const roomMessages = messages[currentRoom.id] || [];
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('rooms')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {currentRoom.type === 'group' ? (
                <Users className="h-5 w-5 text-blue-500" />
              ) : (
                <MessageCircle className="h-5 w-5 text-green-500" />
              )}
              <div>
                <h2 className="font-semibold">{currentRoom.name}</h2>
                <p className="text-xs text-gray-500">
                  {currentRoom.members.length} member{currentRoom.members.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {currentRoom.members.map(member => (
              <Badge key={member} variant="secondary" className="text-xs">
                {member}
              </Badge>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {roomMessages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === currentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border'
                }`}
              >
                {message.sender !== currentUser && (
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {message.sender}
                  </p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === currentUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatApp;