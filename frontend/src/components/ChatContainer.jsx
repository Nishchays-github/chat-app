import React, { useEffect } from 'react';
import useChatStore from '../store/useChatStore.js';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from '../skeletons/MessageSkeleton.jsx';
import { toast } from 'react-hot-toast';

const ChatContainer = () => {
  const { 
    messages , // Default to empty array if undefined
    isMessagesLoading, 
    selectedUser, 
    getMessages,
    getLivemessages
  } = useChatStore();
  
  // Fetch messages when selected user changes
  useEffect(() => {
    getMessages(selectedUser?._id);
    getLivemessages(selectedUser?._id); 
  }, [selectedUser?.id,getMessages,getLivemessages]);
  if (isMessagesLoading) {
    return (
      <div className='flex flex-col h-full'>
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  // Safely check messages array
  const hasMessages = messages && messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!hasMessages ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-gray-500'>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => {
            // Determine if message is from the selected user (other person in chat)
            const isFromSelectedUser = message?.senderId === selectedUser?._id;
            
            return (
              <div 
                key={message?._id || Math.random()} // Fallback key if _id missing
                className={`flex ${isFromSelectedUser ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isFromSelectedUser 
                    ? 'bg-neutral text-neutral-content rounded-tl-none'
                    : 'bg-primary text-primary-content rounded-tr-none'
                }`}>
                  {message?.text}
                  
                  {message?.image && (
                    <div className="mt-2">
                      <img 
                        src={message.image} 
                        alt="message attachment" 
                        className="max-w-full rounded-lg"
                        onError={(e) => e.target.style.display = 'none'} // Hide if image fails to load
                      />
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {message?.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    }) : ''}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <MessageInput />
    </div>
  );
};

export default ChatContainer;