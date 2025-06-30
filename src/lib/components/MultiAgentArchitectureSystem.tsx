import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  History, 
  Send, 
  ChevronDown, 
  PanelRight,
  Download,
  FileText,
  GitBranch,
  AlertTriangle,
  Loader2,
  Sparkles,
  Zap,
  Brain,
  Building2,
  Target,
  Users,
  DollarSign,
  Search,
  Filter,
  Calendar,
  Trash2,
  Eye,
  Settings,
  LogOut
} from 'lucide-react';

// Types
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  agentType?: 'master' | 'financial' | 'architecture' | 'documentation';
}

interface ArchitectureDesign {
  id: string;
  title: string;
  description: string;
  diagram: any;
  documentation: string;
  riskAnalysis: string;
  estimatedCost: string;
  roi: string;
  technologies?: string[];
  deploymentStrategy?: string;
  securityMeasures?: string[];
  scalingStrategy?: string;
}

interface UserRequirements {
  businessType: string;
  sector: string;
  budget: string;
  audience: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  requirements: UserRequirements;
  messages: ChatMessage[];
  architectures: ArchitectureDesign[];
}

// Configuration
const businessTypes = {
  startup: "Startup",
  enterprise: "Enterprise", 
  smb: "Small/Medium Business",
  nonprofit: "Non‑Profit",
  government: "Government",
};

const sectors = {
  fintech: "FinTech",
  healthcare: "Healthcare",
  ecommerce: "E‑commerce", 
  education: "Education",
  logistics: "Logistics",
  social: "Social / Media",
  gaming: "Gaming",
  iot: "IoT / Embedded",
};

const budgets = {
  minimal: "Minimal (<$50K)",
  low: "Low ($50K – $200K)",
  medium: "Medium ($200K – $1M)", 
  high: "High ($1M – $5M)",
  enterprise: "Enterprise (>$5M)",
};

const audiences = {
  consumer: "General Consumers",
  business: "Business Users", 
  developer: "Developers",
  enterprise: "Enterprise Clients",
  government: "Government Orgs",
};

// Utility function for safe dictionary lookup
function getDictValue<T extends Record<string, string>>(dict: T, key: string): string {
  return key in dict ? dict[key as keyof T] : key;
}

// Enhanced Neumorphic Dropdown Component
const NeumorphicDropdown: React.FC<{
  label: string;
  options: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  icon: React.ComponentType<any>;
  gradientFrom: string;
  gradientTo: string;
  zIndex?: string;
}> = ({ label, options, value, onChange, icon: Icon, gradientFrom, gradientTo, zIndex = "z-50" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${zIndex}`} ref={dropdownRef}>
      <motion.button
        whileHover={{ 
          scale: 1.02,
          boxShadow: "inset 6px 6px 12px rgba(0,0,0,0.1), inset -6px -6px 12px rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.15)"
        }}
        whileTap={{ 
          scale: 0.98,
          boxShadow: "inset 8px 8px 16px rgba(0,0,0,0.15), inset -8px -8px 16px rgba(255,255,255,0.7)"
        }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gradient-to-br from-gray-50 via-white to-gray-100
                   rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]
                   transition-all duration-500 flex items-center justify-between
                   text-gray-700 font-medium border-2 border-transparent
                   hover:border-gradient-to-r hover:${gradientFrom} hover:${gradientTo}
                   backdrop-blur-sm relative overflow-hidden group`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-0 
                        group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
        
        <div className="flex items-center space-x-3 relative z-10">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className={`p-2 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white
                       shadow-[4px_4px_8px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.9)]`}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
          <div className="text-left">
            <div className="text-xs text-gray-500 font-medium">{label}</div>
            <div className="text-sm font-semibold">
              {value ? options[value] : `Select ${label}`}
            </div>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="relative z-10"
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, rotateX: -15 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="absolute bottom-full mb-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl 
                       shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/50
                       overflow-hidden max-h-40 overflow-y-auto"
            style={{ zIndex: 9999 }}
          >
            {Object.entries(options).map(([key, optionLabel], index) => (
              <motion.button
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  x: 8,
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onChange(key);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 
                           hover:text-indigo-600 transition-all duration-300
                           border-b border-gray-100/50 last:border-b-0
                           flex items-center space-x-3"
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
                <span>{optionLabel}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// History View Component
const HistoryView: React.FC<{
  chatSessions: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateNew: () => void;
  formatTimeAgo: (date: Date) => string;
}> = ({ chatSessions, onSelectSession, onDeleteSession, onCreateNew, formatTimeAgo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'architectures'>('all');

  const filteredAndSortedSessions = React.useMemo(() => {
    let filtered = chatSessions;

    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

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

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [chatSessions, searchTerm, sortBy, filterBy]);

  return (
    <div className="w-full flex flex-col bg-gradient-to-br from-gray-50/80 via-white/60 to-indigo-50/80 backdrop-blur-md ml-16">
      {/* History Header */}
      <div className="p-6 border-b border-white/50 bg-gradient-to-r from-white/80 via-white/60 to-gray-50/80 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Chat History
          </h2>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 
                       text-white rounded-xl font-semibold flex items-center space-x-2
                       shadow-lg transition-all duration-300"
          >
            <MessageSquare className="w-5 h-5" />
            <span>New Chat</span>
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl
                         border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                         text-gray-700 placeholder-gray-500 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium"
            >
              <option value="all">All Conversations</option>
              <option value="recent">Recent (7 days)</option>
              <option value="architectures">With Architectures</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="space-y-4">
          {filteredAndSortedSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400 text-lg mb-2">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </div>
              <div className="text-gray-500 text-sm mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Start a new conversation to see it here'}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateNew}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 
                           text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
              >
                Start Your First Chat
              </motion.button>
            </motion.div>
          ) : (
            filteredAndSortedSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  scale: 1.02, 
                  rotateY: 2,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
                }}
                className="bg-gradient-to-br from-white/80 via-white/60 to-gray-50/80 backdrop-blur-md 
                           rounded-2xl p-6 cursor-pointer border border-white/50
                           shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)]
                           transition-all duration-500 transform perspective-1000 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1" onClick={() => onSelectSession(session)}>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent 
                                   group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300 mb-2">
                      {session.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatTimeAgo(session.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{session.messages.length} messages</span>
                      </span>
                      {session.architectures.length > 0 && (
                        <span className="flex items-center space-x-1 text-indigo-600 font-medium">
                          <GitBranch className="w-4 h-4" />
                          <span>{session.architectures.length} architectures</span>
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
                
                {session.messages.length > 0 && (
                  <div className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed" onClick={() => onSelectSession(session)}>
                    {session.messages[0]?.content || 'No messages yet'}
                  </div>
                )}
                
                {session.requirements && Object.values(session.requirements).some(val => val) && (
                  <div className="flex flex-wrap gap-2" onClick={() => onSelectSession(session)}>
                    {session.requirements.businessType && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 
                                   rounded-lg text-xs font-medium shadow-sm"
                      >
                        {getDictValue(businessTypes, session.requirements.businessType)}
                      </motion.span>
                    )}
                    {session.requirements.sector && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 
                                   rounded-lg text-xs font-medium shadow-sm"
                      >
                        {getDictValue(sectors, session.requirements.sector)}
                      </motion.span>
                    )}
                    {session.requirements.budget && (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-2 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 
                                   rounded-lg text-xs font-medium shadow-sm"
                      >
                        {getDictValue(budgets, session.requirements.budget)}
                      </motion.span>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const MultiAgentArchitectureSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<UserRequirements>({
    businessType: '',
    sector: '',
    budget: '',
    audience: ''
  });
  
  const [generatedArchitectures, setGeneratedArchitectures] = useState<ArchitectureDesign[]>([]);
  const [selectedArchitecture, setSelectedArchitecture] = useState<ArchitectureDesign | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<'diagram' | 'documentation' | 'risk'>('diagram');
  const [isConfigExpanded, setIsConfigExpanded] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with sample chat sessions
  useEffect(() => {
    const sampleSessions: ChatSession[] = [
      {
        id: '1',
        title: 'E-commerce Platform Architecture',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        requirements: { businessType: 'startup', sector: 'ecommerce', budget: 'medium', audience: 'consumer' },
        messages: [
          { id: '1', content: 'I need a scalable e-commerce platform with real-time inventory management', isUser: true, timestamp: new Date() },
          { id: '2', content: 'Master Agent: Analyzing your e-commerce requirements for startup with medium budget...', isUser: false, timestamp: new Date(), agentType: 'master' }
        ],
        architectures: []
      },
      {
        id: '2', 
        title: 'FinTech Payment System',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        requirements: { businessType: 'enterprise', sector: 'fintech', budget: 'high', audience: 'business' },
        messages: [
          { id: '1', content: 'Design a secure payment processing system with PCI compliance', isUser: true, timestamp: new Date() },
          { id: '2', content: 'Master Agent: Creating secure FinTech architecture with enterprise-grade security...', isUser: false, timestamp: new Date(), agentType: 'master' }
        ],
        architectures: []
      },
      {
        id: '3',
        title: 'Healthcare Data Platform', 
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        requirements: { businessType: 'enterprise', sector: 'healthcare', budget: 'enterprise', audience: 'enterprise' },
        messages: [
          { id: '1', content: 'HIPAA compliant healthcare data management system with AI analytics', isUser: true, timestamp: new Date() },
          { id: '2', content: 'Master Agent: Designing HIPAA compliant architecture with enterprise data governance...', isUser: false, timestamp: new Date(), agentType: 'master' }
        ],
        architectures: []
      }
    ];
    setChatSessions(sampleSessions);
  }, []);

  // Auto-collapse config after first message
  useEffect(() => {
    if (messages.length > 0) {
      setIsConfigExpanded(false);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      timestamp: new Date(),
      requirements: { businessType: '', sector: '', budget: '', audience: '' },
      messages: [],
      architectures: []
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setGeneratedArchitectures([]);
    setRequirements({ businessType: '', sector: '', budget: '', audience: '' });
    setCurrentView('chat');
    setIsConfigExpanded(true);
  };

  const loadChatSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setRequirements(session.requirements);
    setGeneratedArchitectures(session.architectures);
    setCurrentView('chat');
    setIsSliderOpen(false);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setMessages([]);
      setGeneratedArchitectures([]);
      setRequirements({ businessType: '', sector: '', budget: '', audience: '' });
      setCurrentSessionId('');
    }
  };

  const saveCurrentSession = useCallback(() => {
    if (currentSessionId && messages.length > 0) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? {
              ...session,
              messages,
              requirements,
              architectures: generatedArchitectures,
              title: messages.find(m => m.isUser)?.content.slice(0, 50) + '...' || 'Untitled Chat'
            }
          : session
      ));
    }
  }, [currentSessionId, messages, requirements, generatedArchitectures]);

  useEffect(() => {
    saveCurrentSession();
  }, [saveCurrentSession]);

  const processMasterAgentDecision = useCallback(async (prompt: string, requirements: UserRequirements) => {
    setIsLoading(true);
    
    // Master Agent Analysis
    const masterMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `Master Agent: Analyzing requirements for ${getDictValue(businessTypes, requirements.businessType)} in ${getDictValue(sectors, requirements.sector)} sector with ${getDictValue(budgets, requirements.budget)} budget targeting ${getDictValue(audiences, requirements.audience)}...`,
      isUser: false,
      timestamp: new Date(),
      agentType: 'master'
    };
    
    setMessages(prev => [...prev, masterMessage]);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Financial Analysis
    const financialMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: `Financial Agent: Conducting ROI analysis and cost optimization for ${requirements.budget} budget range...`,
      isUser: false,
      timestamp: new Date(),
      agentType: 'financial'
    };
    
    setMessages(prev => [...prev, financialMessage]);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Architecture Generation
    const architectureMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      content: `Architecture Agent: Generating 3 optimized system designs tailored for ${requirements.sector} sector requirements...`,
      isUser: false,
      timestamp: new Date(),
      agentType: 'architecture'
    };
    
    setMessages(prev => [...prev, architectureMessage]);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate Mock Architectures based on requirements
    const mockArchitectures: ArchitectureDesign[] = [
      {
        id: '1',
        title: 'Microservices Cloud-Native Architecture',
        description: 'Scalable microservices architecture with Kubernetes orchestration and service mesh',
        diagram: { nodes: [], edges: [] },
        documentation: `# Microservices Cloud-Native Architecture

## Executive Summary
Enterprise-grade microservices architecture designed for ${getDictValue(sectors, requirements.sector)} sector, optimized for ${getDictValue(businessTypes, requirements.businessType)} scale with ${getDictValue(budgets, requirements.budget)} budget.

## Core Components
- **API Gateway**: Kong/AWS API Gateway with rate limiting and authentication
- **Service Mesh**: Istio for service-to-service communication
- **Container Orchestration**: Kubernetes with auto-scaling
- **Database**: PostgreSQL cluster with read replicas
- **Caching**: Redis Cluster for session management
- **Message Queue**: Apache Kafka for event streaming
- **Monitoring**: Prometheus + Grafana stack
- **Security**: OAuth 2.0 + JWT with zero-trust architecture

## Cloud Infrastructure
- **Primary Provider**: AWS/Azure/GCP based on budget requirements
- **CI/CD Pipeline**: GitLab CI/Jenkins with automated testing
- **Infrastructure as Code**: Terraform for reproducible deployments
- **Backup Strategy**: Cross-region replication with point-in-time recovery
- **Security Compliance**: ${requirements.sector === 'healthcare' ? 'HIPAA' : requirements.sector === 'fintech' ? 'PCI DSS' : 'SOC 2'} compliant

## Deployment Strategy
1. **Development Environment**: Local Kubernetes with Skaffold
2. **Staging Environment**: Minikube cluster for testing
3. **Production Environment**: Multi-AZ deployment with blue-green strategy
4. **Monitoring**: Real-time alerting and automated incident response

## Performance Specifications
- **Availability**: 99.9% uptime SLA
- **Scalability**: Auto-scaling from 2 to 100+ instances
- **Latency**: <100ms response time for 95th percentile
- **Throughput**: 10,000+ requests per second capacity`,
        riskAnalysis: `# Risk Analysis & Mitigation Strategy

## Technical Risks
### High Complexity Risk
- **Impact**: Increased development and operational overhead
- **Probability**: Medium
- **Mitigation**: Implement comprehensive documentation, training programs, and gradual migration approach

### Performance Bottlenecks
- **Impact**: System degradation under high load
- **Probability**: Low with proper design
- **Mitigation**: Load testing, performance monitoring, and auto-scaling policies

## Operational Risks
### Skill Gap Risk
- **Impact**: Difficulty maintaining and scaling the system
- **Probability**: Medium for ${getDictValue(businessTypes, requirements.businessType)}
- **Mitigation**: Investment in team training, hiring experienced DevOps engineers, managed services adoption

### Vendor Lock-in
- **Impact**: Difficulty switching cloud providers
- **Probability**: Medium
- **Mitigation**: Multi-cloud strategy, containerization, and vendor-agnostic technologies

## Financial Risks
### Cost Overrun Risk
- **Impact**: Budget exceeding ${getDictValue(budgets, requirements.budget)} range
- **Probability**: Medium
- **Mitigation**: Regular cost monitoring, budget alerts, and resource optimization

## Security Risks
### Data Breach Risk
- **Impact**: Critical for ${requirements.sector} sector
- **Probability**: Low with proper security measures
- **Mitigation**: End-to-end encryption, regular security audits, compliance monitoring

## Future Recommendations
1. **Phase 1 (0-6 months)**: Core microservices implementation
2. **Phase 2 (6-12 months)**: Advanced monitoring and optimization
3. **Phase 3 (12+ months)**: AI/ML integration and edge computing
4. **Continuous**: Security updates and compliance reviews`,
        estimatedCost: requirements.budget === 'minimal' ? '$45K - $65K' : 
                      requirements.budget === 'low' ? '$120K - $180K' :
                      requirements.budget === 'medium' ? '$400K - $650K' :
                      requirements.budget === 'high' ? '$1.2M - $2.1M' :
                      '$2.5M - $4.2M',
        roi: requirements.budget === 'minimal' ? '180% over 2 years' :
             requirements.budget === 'low' ? '220% over 2.5 years' :
             requirements.budget === 'medium' ? '280% over 3 years' :
             requirements.budget === 'high' ? '320% over 3.5 years' :
             '380% over 4 years',
        technologies: ['Kubernetes', 'Istio', 'PostgreSQL', 'Redis', 'Kafka', 'Prometheus'],
        deploymentStrategy: 'Blue-Green with Canary releases',
        securityMeasures: ['OAuth 2.0', 'JWT', 'mTLS', 'RBAC', 'Network Policies'],
        scalingStrategy: 'Horizontal Pod Autoscaling with custom metrics'
      },
      {
        id: '2',
        title: 'Serverless Event-Driven Architecture',
        description: 'Cost-effective serverless architecture with event-driven patterns and auto-scaling',
        diagram: { nodes: [], edges: [] },
        documentation: `# Serverless Event-Driven Architecture

## Executive Summary
Serverless-first architecture optimized for ${getDictValue(sectors, requirements.sector)} applications with ${getDictValue(budgets, requirements.budget)} budget, providing maximum cost efficiency and automatic scaling.

## Core Components
- **Compute**: AWS Lambda/Azure Functions with custom runtimes
- **API Management**: API Gateway with request/response transformation
- **Database**: DynamoDB/CosmosDB with on-demand scaling
- **Event Processing**: EventBridge/Event Grid for decoupled communication
- **Storage**: S3/Blob Storage with lifecycle management
- **CDN**: CloudFront/Azure CDN for global content delivery
- **Authentication**: Cognito/Azure AD B2C integration
- **Monitoring**: CloudWatch/Application Insights with custom dashboards

## Event-Driven Patterns
- **Command Query Responsibility Segregation (CQRS)**
- **Event Sourcing** for audit trails
- **Saga Pattern** for distributed transactions
- **Circuit Breaker** for fault tolerance

## Cost Optimization
- **Pay-per-execution** pricing model
- **Automatic scaling** to zero when not in use
- **Reserved capacity** for predictable workloads
- **Spot instances** for batch processing

## Integration Strategy
- **Third-party APIs**: Webhooks and event-driven integrations
- **Legacy Systems**: Event bridges and API gateways
- **Real-time Processing**: WebSocket connections and streaming
- **Batch Processing**: Scheduled functions and queues`,
        riskAnalysis: `# Serverless Risk Analysis

## Technical Risks
### Cold Start Latency
- **Impact**: Initial request delays (100-500ms)
- **Probability**: High for infrequent functions
- **Mitigation**: Provisioned concurrency, connection pooling, and function warming

### Vendor Lock-in
- **Impact**: Platform dependency limiting portability
- **Probability**: High
- **Mitigation**: Serverless framework adoption, multi-cloud functions, containerized functions

## Operational Risks
### Debugging Complexity
- **Impact**: Difficult troubleshooting in distributed environment
- **Probability**: Medium
- **Mitigation**: Distributed tracing, comprehensive logging, and observability tools

### Function Timeout Limits
- **Impact**: Long-running processes may fail
- **Probability**: Medium
- **Mitigation**: Function chaining, step functions, and asynchronous processing

## Financial Risks
### Unexpected Cost Spikes
- **Impact**: Sudden increase in execution costs
- **Probability**: Medium
- **Mitigation**: Budget alerts, cost monitoring, and rate limiting

## Future Recommendations
1. **Immediate**: Core serverless functions deployment
2. **3-6 months**: Advanced event patterns implementation
3. **6-12 months**: Edge computing and global distribution
4. **Ongoing**: Cost optimization and performance tuning`,
        estimatedCost: requirements.budget === 'minimal' ? '$15K - $35K' :
                      requirements.budget === 'low' ? '$45K - $85K' :
                      requirements.budget === 'medium' ? '$120K - $220K' :
                      requirements.budget === 'high' ? '$300K - $550K' :
                      '$600K - $1.1M',
        roi: '420% over 2 years',
        technologies: ['AWS Lambda', 'DynamoDB', 'EventBridge', 'API Gateway', 'CloudFront'],
        deploymentStrategy: 'Blue-Green with gradual traffic shifting',
        securityMeasures: ['IAM Roles', 'VPC Endpoints', 'Secrets Manager', 'WAF'],
        scalingStrategy: 'Automatic scaling based on demand'
      },
      {
        id: '3',
        title: 'Hybrid Multi-Cloud Architecture',
        description: 'Enterprise-grade hybrid architecture with multi-cloud resilience and edge computing',
        diagram: { nodes: [], edges: [] },
        documentation: `# Hybrid Multi-Cloud Architecture

## Executive Summary
Enterprise-resilient architecture spanning multiple cloud providers and edge locations, designed for ${getDictValue(sectors, requirements.sector)} sector with ${getDictValue(budgets, requirements.budget)} budget requirements.

## Multi-Cloud Strategy
- **Primary Cloud**: AWS for core services and data processing
- **Secondary Cloud**: Azure for backup and disaster recovery
- **Edge Computing**: Cloudflare Workers for global distribution
- **Hybrid Connectivity**: VPN and private connections between clouds

## Core Infrastructure
- **Global Load Balancing**: Traffic distribution across regions
- **Cross-Cloud Replication**: Real-time data synchronization
- **Unified Monitoring**: Single pane of glass for all environments
- **Identity Federation**: Single sign-on across all platforms
- **Disaster Recovery**: Automated failover with RPO <15min, RTO <30min

## Edge Computing Integration
- **CDN**: Global content delivery with edge caching
- **Edge Functions**: Processing at edge locations
- **IoT Integration**: Edge device management and data processing
- **Real-time Analytics**: Low-latency data processing

## Compliance & Governance
- **Multi-region Compliance**: Data residency requirements
- **Unified Security Policies**: Consistent security across clouds
- **Audit & Compliance**: Centralized logging and compliance reporting
- **Data Governance**: Master data management across environments`,
        riskAnalysis: `# Hybrid Multi-Cloud Risk Analysis

## Complexity Risks
### Multi-Cloud Management
- **Impact**: Increased operational complexity
- **Probability**: High
- **Mitigation**: Unified management tools, automation, and specialized training

### Network Latency
- **Impact**: Cross-cloud communication delays
- **Probability**: Medium
- **Mitigation**: Strategic data placement, caching, and regional optimization

## Financial Risks
### Cost Management Complexity
- **Impact**: Difficult cost tracking across providers
- **Probability**: High
- **Mitigation**: Unified billing dashboard, cost allocation tags, and regular reviews

### Data Transfer Costs
- **Impact**: High egress charges between clouds
- **Probability**: Medium
- **Mitigation**: Data locality optimization and intelligent routing

## Security Risks
### Increased Attack Surface
- **Impact**: More endpoints to secure
- **Probability**: Medium
- **Mitigation**: Zero-trust architecture, unified security monitoring

## Future Recommendations
1. **Phase 1**: Single cloud deployment with multi-cloud preparation
2. **Phase 2**: Secondary cloud integration and disaster recovery
3. **Phase 3**: Full multi-cloud optimization and edge computing
4. **Ongoing**: Continuous optimization and cost management`,
        estimatedCost: requirements.budget === 'minimal' ? 'Not recommended' :
                      requirements.budget === 'low' ? '$180K - $280K' :
                      requirements.budget === 'medium' ? '$650K - $950K' :
                      requirements.budget === 'high' ? '$1.8M - $2.8M' :
                      '$3.5M - $5.5M',
        roi: requirements.budget === 'enterprise' ? '250% over 4 years' : '180% over 4 years',
        technologies: ['Multi-Cloud', 'Kubernetes', 'Terraform', 'Consul', 'Vault'],
        deploymentStrategy: 'Multi-region active-active with automated failover',
        securityMeasures: ['Zero-Trust', 'mTLS', 'SIEM', 'DLP', 'HSM'],
        scalingStrategy: 'Global auto-scaling with intelligent routing'
      }
    ];

    setGeneratedArchitectures(mockArchitectures);
    
    // Documentation Agent
    const docMessage: ChatMessage = {
      id: (Date.now() + 3).toString(),
      content: `Documentation Agent: Generated comprehensive technical documentation, risk assessments, and deployment guides for all architecture options.`,
      isUser: false,
      timestamp: new Date(),
      agentType: 'documentation'
    };
    
    setMessages(prev => [...prev, docMessage]);

    const finalMessage: ChatMessage = {
      id: (Date.now() + 4).toString(),
      content: `Analysis complete! Generated 3 optimized architecture designs tailored for your ${getDictValue(sectors, requirements.sector)} ${getDictValue(businessTypes, requirements.businessType)} with ${getDictValue(budgets, requirements.budget)} budget targeting ${getDictValue(audiences, requirements.audience)}. Each design includes detailed cost analysis, ROI projections, risk assessments, and implementation roadmaps. Click any design to explore interactive diagrams and comprehensive documentation.`,
      isUser: false,
      timestamp: new Date(),
      agentType: 'master'
    };
    
    setMessages(prev => [...prev, finalMessage]);
    setIsLoading(false);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    // Create new session if none exists
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: inputMessage.slice(0, 50) + '...',
        timestamp: new Date(),
        requirements,
        messages: [],
        architectures: []
      };
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const hasAllRequirements = Object.values(requirements).every(val => val !== '');
    
    if (hasAllRequirements) {
      await processMasterAgentDecision(inputMessage, requirements);
    } else {
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Please complete the project configuration below (Business Type, Sector, Budget, and Target Audience) so I can generate optimized architecture designs tailored to your specific requirements.',
        isUser: false,
        timestamp: new Date(),
        agentType: 'master'
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsConfigExpanded(true);
    }
  }, [inputMessage, requirements, processMasterAgentDecision, currentSessionId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadAll = async (architecture: ArchitectureDesign) => {
    // Simulate comprehensive file download
    console.log(`Initiating download of complete architecture package for: ${architecture.title}`);
    
    // Create mock ZIP file content
    const files = {
      'README.md': `# ${architecture.title}\n\n${architecture.description}\n\nGenerated by Gitflow AI Multi-Agent System`,
      'architecture-diagram.json': JSON.stringify(architecture.diagram, null, 2),
      'technical-documentation.md': architecture.documentation,
      'risk-analysis.md': architecture.riskAnalysis,
      'deployment-guide.md': `# Deployment Guide\n\nStep-by-step deployment instructions for ${architecture.title}`,
      'cost-analysis.json': JSON.stringify({
        estimatedCost: architecture.estimatedCost,
        roi: architecture.roi,
        breakdown: {
          infrastructure: '60%',
          development: '25%',
          operations: '15%'
        }
      }, null, 2)
    };

    // Simulate download process
    const blob = new Blob([JSON.stringify(files, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${architecture.title.toLowerCase().replace(/\s+/g, '-')}-complete-package.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingle = async (architecture: ArchitectureDesign, type: string) => {
    const fileMap = {
      diagram: { content: JSON.stringify(architecture.diagram, null, 2), ext: 'json' },
      documentation: { content: architecture.documentation, ext: 'md' },
      risk: { content: architecture.riskAnalysis, ext: 'md' }
    };

    const file = fileMap[type as keyof typeof fileMap];
    if (file) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${architecture.title.toLowerCase().replace(/\s+/g, '-')}-${type}.${file.ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"
        />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 w-full pt-4 pb-6 z-50 bg-gradient-to-b from-slate-50/90 via-blue-50/60 to-transparent backdrop-blur-md">
        <div className="grid grid-cols-3 items-center px-8">
          {/* Left - Gitflow AI Branding */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex justify-start"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "12px 12px 24px rgba(0,0,0,0.15), -12px -12px 24px rgba(255,255,255,0.9)"
              }}
              className="flex items-center space-x-3 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3
                         shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] 
                         border border-white/50 group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white
                           shadow-[4px_4px_8px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.9)]"
              >
                <GitBranch className="w-5 h-5" />
              </motion.div>
              <span className="font-bold text-gray-800 text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gitflow AI
              </span>
            </motion.div>
          </motion.div>

          {/* Center - Chat/History Toggle */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 
                            shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.9)]
                            border-2 border-gray-200/50 relative">
              <div className="flex space-x-1">
                {[
                  { key: 'chat', icon: MessageSquare, label: 'Chat', gradient: 'from-indigo-500 to-purple-600' },
                  { key: 'history', icon: History, label: 'History', gradient: 'from-purple-500 to-pink-600' }
                ].map(({ key, icon: Icon, label, gradient }) => (
                  <motion.button
                    key={key}
                    whileHover={{ 
                      scale: 1.02,
                      y: currentView !== key ? -1 : 0
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentView(key as 'chat' | 'history')}
                    className={`relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 
                               flex items-center space-x-2 text-sm z-10
                      ${currentView === key 
                        ? `bg-gradient-to-r ${gradient} text-white shadow-[4px_4px_8px_rgba(0,0,0,0.2)] transform` 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50/50'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold">{label}</span>
                    
                    {currentView === key && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <motion.div
                className={`absolute top-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-xl 
                           bg-gradient-to-r ${currentView === 'chat' ? 'from-indigo-500 to-purple-600' : 'from-purple-500 to-pink-600'}
                           shadow-[4px_4px_8px_rgba(0,0,0,0.2)]`}
                animate={{
                  x: currentView === 'chat' ? 6 : 'calc(100% + 6px)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </motion.div>

          {/* Right - Auth Buttons */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-3 justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(99,102,241,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold
                         shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_6px_rgba(255,255,255,0.1)]
                         transition-all duration-300"
            >
              Sign Up
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 h-full w-16 bg-white/80 backdrop-blur-xl border-r border-white/50 z-40
                   shadow-[8px_0_16px_rgba(0,0,0,0.1)] flex flex-col items-center py-24"
      >
        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={createNewSession}
          className="w-12 h-12 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl
                     shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)]
                     flex items-center justify-center transition-all duration-300"
          title="New Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.1, x: 2 }}
          className="w-12 h-12 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 rounded-xl
                     shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.9)]
                     flex items-center justify-center transition-all duration-300 cursor-pointer"
          title="Account"
        >
          <span className="font-bold text-sm">JD</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 rounded-xl
                     shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.9)]
                     flex items-center justify-center transition-all duration-300"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
            const currentIndex = themes.indexOf(theme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            setTheme(nextTheme);
          }}
          className="p-3 bg-white/80 backdrop-blur-xl rounded-xl mb-4
                     shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)]
                     border border-white/50 hover:shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.9)]
                     transition-all duration-300"
          title={`Theme: ${theme}`}
        >
          {theme === 'light' && <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />}
          {theme === 'dark' && <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-600 to-slate-800" />}
          {theme === 'system' && <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 mt-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 text-red-600 rounded-xl
                     shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.9)]
                     flex items-center justify-center transition-all duration-300"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex h-full pt-24 relative z-10">
        {currentView === 'chat' ? (
          <>
            {/* Chat View */}
            <div className={`transition-all duration-700 ease-in-out ${isSliderOpen ? 'w-1/4' : 'w-full'} flex flex-col ml-16`}>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 pb-4 custom-scrollbar">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <motion.div 
                        whileHover={{ 
                          scale: 1.01,
                          boxShadow: message.isUser 
                            ? "0 8px 25px rgba(99,102,241,0.2)" 
                            : "0 8px 25px rgba(0,0,0,0.1)"
                        }}
                        className={`max-w-2xl rounded-2xl px-5 py-3 backdrop-blur-xl relative overflow-hidden ${
                          message.isUser 
                            ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white ml-12 shadow-[8px_8px_16px_rgba(99,102,241,0.2),-4px_-4px_8px_rgba(255,255,255,0.1)]' 
                            : 'bg-gradient-to-br from-white/95 via-white/85 to-gray-50/95 text-gray-800 mr-12 shadow-[8px_8px_16px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.9)] border border-white/50'
                        }`}>
                        
                        <div className="flex items-start space-x-3 relative z-10">
                          {!message.isUser && (
                            <motion.div 
                              className="flex-shrink-0 mt-0.5"
                              animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <div className={`p-2 rounded-xl bg-gradient-to-br text-white shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)]
                                              ${message.agentType === 'master' 
                                                ? 'from-indigo-500 via-purple-600 to-pink-500' 
                                                : message.agentType === 'financial' 
                                                  ? 'from-green-500 to-emerald-600'
                                                  : message.agentType === 'architecture'
                                                    ? 'from-blue-500 to-cyan-600'
                                                    : message.agentType === 'documentation'
                                                      ? 'from-orange-500 to-red-600'
                                                      : 'from-purple-500 to-pink-600'
                                              }`}>
                                {message.agentType === 'master' && <Brain className="w-4 h-4" />}
                                {message.agentType === 'financial' && <DollarSign className="w-4 h-4" />}
                                {message.agentType === 'architecture' && <GitBranch className="w-4 h-4" />}
                                {message.agentType === 'documentation' && <FileText className="w-4 h-4" />}
                                {!message.agentType && <Sparkles className="w-4 h-4" />}
                              </div>
                            </motion.div>
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap leading-relaxed text-base">{message.content}</p>
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.6 }}
                              transition={{ delay: 0.3 }}
                              className="text-xs opacity-60 mt-2 block font-medium"
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center items-center py-8"
                  >
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-white/80 via-white/60 to-gray-50/80 
                                    backdrop-blur-md rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5 text-indigo-600" />
                      </motion.div>
                      <span className="text-gray-700 font-medium">AI Agents Processing...</span>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex space-x-1"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Generated Architectures */}
                {generatedArchitectures.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mt-6 space-y-4"
                  >
                    <motion.h3 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold text-center mb-4"
                    >
                      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Generated Architecture Designs
                      </span>
                    </motion.h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedArchitectures.map((arch, index) => (
                        <motion.div
                          key={arch.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                            y: -3
                          }}
                          onClick={() => {
                            setSelectedArchitecture(arch);
                            setIsSliderOpen(true);
                          }}
                          className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 backdrop-blur-xl 
                                     rounded-2xl p-4 cursor-pointer border border-white/50
                                     shadow-[8px_8px_16px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.9)]
                                     transition-all duration-500 group relative overflow-hidden h-fit"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                          
                          <div className="relative z-10">
                            <div className="mb-3">
                              <motion.h4 
                                className="text-base font-bold mb-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500"
                              >
                                {arch.title}
                              </motion.h4>
                              <p className="text-gray-600 leading-relaxed text-xs line-clamp-2">{arch.description}</p>
                            </div>
                            
                            <div className="mb-3">
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-1px_-1px_2px_rgba(255,255,255,0.9)] border border-white/50"
                              >
                                <div className="text-xs text-gray-500 font-medium">Estimated Cost</div>
                                <div className="font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                  {arch.estimatedCost}
                                </div>
                                <div className="text-xs bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-semibold mt-1">
                                  ROI: {arch.roi}
                                </div>
                              </motion.div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <motion.button
                                whileHover={{ 
                                  scale: 1.05, 
                                  boxShadow: "0 6px 20px rgba(99,102,241,0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadAll(arch);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 
                                           text-white rounded-lg font-medium flex items-center space-x-1
                                           shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1px_-1px_2px_rgba(255,255,255,0.1)]
                                           transition-all duration-300 backdrop-blur-sm border border-white/20 text-xs"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </motion.button>
                              
                              <span className="flex items-center space-x-1 text-indigo-600 font-medium text-xs">
                                <span>View details</span>
                                <PanelRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="w-full flex justify-center py-4 px-6">
                <div className="w-full max-w-2xl mx-auto">
                  <div className="mb-3">
                    <div className="relative">
                      <motion.textarea
                        whileFocus={{ 
                          scale: 1.01,
                          boxShadow: "inset 4px 4px 8px rgba(99,102,241,0.1), inset -4px -4px 8px rgba(255,255,255,0.9), 0 0 0 2px rgba(99,102,241,0.1)"
                        }}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe your architecture requirements..."
                        className="w-full px-4 py-3 pr-14 bg-white/90 backdrop-blur-xl rounded-xl
                                   shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]
                                   border border-white/50 resize-none focus:outline-none
                                   text-gray-700 placeholder-gray-500 text-sm leading-relaxed transition-all duration-300
                                   font-medium"
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '96px' }}
                      />
                      
                      <motion.button
                        whileHover={{ 
                          scale: 1.1, 
                          boxShadow: "0 6px 20px rgba(99,102,241,0.3)"
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2
                                   p-2.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 
                                   text-white rounded-lg shadow-[4px_4px_8px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                                   transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>

{/* Project Configuration */}
<div className="space-y-3 relative z-50">
                    <motion.button
                      onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                      className="w-full text-xs font-semibold text-gray-600 flex items-center justify-center space-x-2
                                 hover:text-indigo-600 transition-colors duration-300 py-2 rounded-lg hover:bg-gray-50/50 relative z-10"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                      >
                        <GitBranch className="w-4 h-4" />
                      </motion.div>
                      <span>Project Configuration</span>
                      <motion.div
                        animate={{ rotate: isConfigExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isConfigExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-visible relative z-40"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-2 relative z-20"
                            >
                              <label className="text-sm font-semibold text-gray-600 flex items-center space-x-2">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                <span>Business Type</span>
                              </label>
                              <NeumorphicDropdown
                                label="Business Type"
                                options={businessTypes}
                                value={requirements.businessType}
                                onChange={(value) => setRequirements(prev => ({ ...prev, businessType: value }))}
                                icon={Building2}
                                gradientFrom="from-blue-500"
                                gradientTo="to-indigo-600"
                                zIndex="z-[57]"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-2 relative z-30"
                            >
                              <label className="text-sm font-semibold text-gray-600 flex items-center space-x-2">
                                <Target className="w-4 h-4 text-green-600" />
                                <span>Business Sector</span>
                              </label>
                              <NeumorphicDropdown
                                label="Sector"
                                options={sectors}
                                value={requirements.sector}
                                onChange={(value) => setRequirements(prev => ({ ...prev, sector: value }))}
                                icon={Target}
                                gradientFrom="from-green-500"
                                gradientTo="to-emerald-600"
                                zIndex="z-[58]"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="space-y-2 relative z-40"
                            >
                              <label className="text-sm font-semibold text-gray-600 flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-purple-600" />
                                <span>Budget Range</span>
                              </label>
                              <NeumorphicDropdown
                                label="Budget"
                                options={budgets}
                                value={requirements.budget}
                                onChange={(value) => setRequirements(prev => ({ ...prev, budget: value }))}
                                icon={DollarSign}
                                gradientFrom="from-purple-500"
                                gradientTo="to-pink-600"
                                zIndex="z-[59]"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="space-y-2 relative z-50"
                            >
                              <label className="text-sm font-semibold text-gray-600 flex items-center space-x-2">
                                <Users className="w-4 h-4 text-orange-600" />
                                <span>Target Audience</span>
                              </label>
                              <NeumorphicDropdown
                                label="Audience"
                                options={audiences}
                                value={requirements.audience}
                                onChange={(value) => setRequirements(prev => ({ ...prev, audience: value }))}
                                icon={Users}
                                gradientFrom="from-orange-500"
                                gradientTo="to-red-600"
                                zIndex="z-[60]"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>             
            </div>
          </>
        ) : (
          <HistoryView
            chatSessions={chatSessions}
            onSelectSession={loadChatSession}
            onDeleteSession={deleteSession}
            onCreateNew={createNewSession}
            formatTimeAgo={formatTimeAgo}
          />
        )}

        {/* Sliding Panel */}
        <AnimatePresence>
          {isSliderOpen && selectedArchitecture && currentView === 'chat' && (
            <motion.div
              initial={{ x: '100%', opacity: 0, rotateY: 90 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: '100%', opacity: 0, rotateY: 90 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-3/4 bg-gradient-to-br from-white/95 via-white/85 to-gray-50/95 backdrop-blur-md 
                         border-l border-white/50 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.1)]"
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/90 via-white/80 to-gray-50/90 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    {selectedArchitecture.title}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSliderOpen(false)}
                    className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 
                               transition-all duration-300 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]"
                  >
                    <PanelRight className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
                
                {/* Document Tabs */}
                <div className="flex space-x-2 mb-4">
                  {[
                    { key: 'diagram', label: 'Interactive Diagram', icon: GitBranch, gradient: 'from-blue-500 to-cyan-500' },
                    { key: 'documentation', label: 'Documentation', icon: FileText, gradient: 'from-green-500 to-emerald-500' },
                    { key: 'risk', label: 'Risk Analysis', icon: AlertTriangle, gradient: 'from-orange-500 to-red-500' }
                  ].map(({ key, label, icon: Icon, gradient }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveDocument(key as any)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 text-sm
                        ${activeDocument === key 
                          ? `bg-gradient-to-r ${gradient} text-white shadow-lg transform translate-y-[-2px]` 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Download Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(34,197,94,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadAll(selectedArchitecture)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 
                               text-white rounded-xl text-sm font-medium flex items-center space-x-2
                               shadow-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All (ZIP)</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59,130,246,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadSingle(selectedArchitecture, activeDocument)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 
                               text-white rounded-xl text-sm font-medium flex items-center space-x-2
                               shadow-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Current</span>
                  </motion.button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {activeDocument === 'diagram' && (
                    <motion.div
                      key="diagram"
                      initial={{ opacity: 0, y: 20, rotateX: -10 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="h-full"
                    >
                      <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80 
                                      rounded-3xl h-full flex items-center justify-center backdrop-blur-sm
                                      border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                        <div className="text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <GitBranch className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                          </motion.div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Interactive Diagram
                          </h3>
                          <p className="text-gray-500 mb-4">React Flow diagram visualization</p>
                          <div className="text-sm text-gray-600 max-w-md mx-auto">
                            Interactive system architecture diagram showing component relationships, 
                            data flows, and infrastructure topology for {selectedArchitecture.title}.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeDocument === 'documentation' && (
                    <motion.div
                      key="documentation"
                      initial={{ opacity: 0, y: 20, rotateX: -10 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="prose prose-indigo max-w-none"
                    >
                      <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 rounded-3xl p-6 
                                      shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]
                                      backdrop-blur-sm border border-white/50">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
{selectedArchitecture.documentation}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeDocument === 'risk' && (
                    <motion.div
                      key="risk"
                      initial={{ opacity: 0, y: 20, rotateX: -10 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="prose prose-red max-w-none"
                    >
                      <div className="bg-gradient-to-br from-white/90 via-white/80 to-red-50/90 rounded-3xl p-6 
                                      shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]
                                      backdrop-blur-sm border border-white/50">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
{selectedArchitecture.riskAnalysis}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MultiAgentArchitectureSystem;