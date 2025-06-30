// components/ChatHistory.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Download, Trash2, Eye } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  requirements: any;
  architectures: any[];
  messageCount: number;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  sessions, 
  onSelectSession, 
  onDeleteSession 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'architectures'>('all');

  const filteredAndSortedSessions = useMemo(() => {
    let filtered = sessions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.requirements?.prompt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(session => session.timestamp > weekAgo);
        break;
      case 'architectures':
        filtered = filtered.filter(session => session.architectures.length > 0);
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [sessions, searchTerm, sortBy, filterBy]);

  const exportHistory = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      sessions: sessions.map(session => ({
        ...session,
        timestamp: session.timestamp.toISOString()
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat History</h2>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl
                         border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                         text-gray-700 placeholder-gray-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="px-3 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            >
              <option value="all">All Conversations</option>
              <option value="recent">Recent (7 days)</option>
              <option value="architectures">With Architectures</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportHistory}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                         text-white rounded-xl text-sm font-medium flex items-center space-x-2
                         shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence>
          {filteredAndSortedSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 text-lg mb-2">No conversations found</div>
              <div className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'Start a new conversation to see it here'}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 
                             shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)]
                             transition-all duration-300 border border-white/50 cursor-pointer group"
                  onClick={() => onSelectSession(session)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {session.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{session.timestamp.toLocaleDateString()}</span>
                        </span>
                        <span>{session.messageCount} messages</span>
                        {session.architectures.length > 0 && (
                          <span className="text-indigo-600 font-medium">
                            {session.architectures.length} architectures
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSession(session);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {session.requirements && (
                    <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {session.requirements.prompt || 'No prompt available'}
                    </div>
                  )}
                  
                  {session.requirements && (
                    <div className="flex flex-wrap gap-2">
                      {session.requirements.businessType && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                          {session.requirements.businessType}
                        </span>
                      )}
                      {session.requirements.sector && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
                          {session.requirements.sector}
                        </span>
                      )}
                      {session.requirements.budget && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">
                          {session.requirements.budget}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatHistory;