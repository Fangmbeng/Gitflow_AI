// components/InteractiveArchitectureDiagram.tsx
'use client';

import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import {
  Database,
  Server,
  Cloud,
  Shield,
  Monitor,
  Globe,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Zap,
  GitBranch,
  Users,
  BarChart3,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Custom Node Types
const CustomServiceNode: React.FC<{ data: any }> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      api: <Globe className="w-5 h-5" />,
      database: <Database className="w-5 h-5" />,
      service: <Server className="w-5 h-5" />,
      cloud: <Cloud className="w-5 h-5" />,
      security: <Shield className="w-5 h-5" />,
      monitoring: <Monitor className="w-5 h-5" />,
      compute: <Cpu className="w-5 h-5" />,
      storage: <HardDrive className="w-5 h-5" />,
      network: <Network className="w-5 h-5" />,
      auth: <Lock className="w-5 h-5" />,
      function: <Zap className="w-5 h-5" />,
      gateway: <GitBranch className="w-5 h-5" />,
      users: <Users className="w-5 h-5" />,
      analytics: <BarChart3 className="w-5 h-5" />,
      config: <Settings className="w-5 h-5" />,
      monitor: <Eye className="w-5 h-5" />,
      alert: <AlertTriangle className="w-5 h-5" />,
      health: <CheckCircle className="w-5 h-5" />
    };
    return iconMap[type] || <Server className="w-5 h-5" />;
  };

  const getGradient = (type: string) => {
    const gradientMap: Record<string, string> = {
      api: 'from-blue-500 to-cyan-500',
      database: 'from-green-500 to-emerald-500',
      service: 'from-purple-500 to-indigo-500',
      cloud: 'from-sky-400 to-blue-500',
      security: 'from-red-500 to-pink-500',
      monitoring: 'from-orange-500 to-yellow-500',
      compute: 'from-violet-500 to-purple-500',
      storage: 'from-teal-500 to-cyan-500',
      network: 'from-indigo-500 to-blue-500',
      auth: 'from-rose-500 to-red-500',
      function: 'from-yellow-500 to-orange-500',
      gateway: 'from-cyan-500 to-teal-500',
      users: 'from-pink-500 to-rose-500',
      analytics: 'from-emerald-500 to-green-500',
      config: 'from-slate-500 to-gray-500',
      monitor: 'from-amber-500 to-orange-500',
      alert: 'from-red-600 to-rose-600',
      health: 'from-green-600 to-emerald-600'
    };
    return gradientMap[type] || 'from-gray-500 to-slate-500';
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative min-w-[200px] px-4 py-3 bg-gradient-to-br ${getGradient(data.type)} 
                  rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm
                  transition-all duration-300 cursor-pointer group`}
      style={{
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)' 
          : '0 10px 20px rgba(0,0,0,0.1)'
      }}
    >
      {/* Status Indicator */}
      <div className="absolute -top-2 -right-2">
        <div className={`w-4 h-4 rounded-full ${
          data.status === 'healthy' ? 'bg-green-400' :
          data.status === 'warning' ? 'bg-yellow-400' :
          data.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
        } border-2 border-white shadow-lg`}>
          <div className={`w-full h-full rounded-full animate-pulse ${
            data.status === 'healthy' ? 'bg-green-300' :
            data.status === 'warning' ? 'bg-yellow-300' :
            data.status === 'error' ? 'bg-red-300' : 'bg-gray-300'
          }`} />
        </div>
      </div>

      {/* Icon and Title */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-white/90">
          {getIcon(data.type)}
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{data.label}</h3>
          {data.technology && (
            <p className="text-white/70 text-xs">{data.technology}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-white/80 text-xs leading-relaxed">{data.description}</p>
      )}

      {/* Metrics */}
      {data.metrics && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="flex justify-between text-xs text-white/70">
            {data.metrics.cpu && <span>CPU: {data.metrics.cpu}</span>}
            {data.metrics.memory && <span>RAM: {data.metrics.memory}</span>}
            {data.metrics.requests && <span>RPS: {data.metrics.requests}</span>}
          </div>
        </div>
      )}

      {/* Hover Details */}
      {isHovered && data.details && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 p-3 bg-black/80 backdrop-blur-sm 
                     rounded-lg text-white text-xs min-w-[250px] z-50 border border-white/10"
        >
          <div className="space-y-1">
            {Object.entries(data.details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-white/70 capitalize">{key}:</span>
                <span className="text-white">{value as string}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const CustomCloudNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="px-6 py-4 bg-gradient-to-br from-slate-100 to-slate-200 
                 rounded-3xl shadow-xl border-2 border-slate-300/50 min-w-[300px]
                 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, #374151 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }} 
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-3">
          <Cloud className="w-6 h-6 text-slate-600" />
          <div>
            <h3 className="text-slate-800 font-bold text-lg">{data.label}</h3>
            <p className="text-slate-600 text-sm">{data.provider}</p>
          </div>
        </div>
        
        {data.services && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {data.services.map((service: string, idx: number) => (
              <div key={idx} className="px-2 py-1 bg-white/60 rounded-lg text-xs text-slate-700 text-center">
                {service}
              </div>
            ))}
          </div>
        )}

        {data.region && (
          <div className="mt-3 text-xs text-slate-500">
            Region: {data.region}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CustomDataFlowEdge: React.FC<any> = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  data 
}) => {
  const edgePath = `M${sourceX},${sourceY} Q${(sourceX + targetX) / 2},${sourceY - 50} ${targetX},${targetY}`;
  
  return (
    <g>
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
        </linearGradient>
        <marker
          id={`arrowhead-${id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={`url(#gradient-${id})`}
          />
        </marker>
      </defs>
      
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d={edgePath}
        stroke={`url(#gradient-${id})`}
        strokeWidth="3"
        fill="none"
        markerEnd={`url(#arrowhead-${id})`}
        className="drop-shadow-sm"
      />
      
      {data?.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          className="fill-slate-600 text-xs font-medium"
        >
          {data.label}
        </text>
      )}
      
      {data?.protocol && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 + 5}
          textAnchor="middle"
          className="fill-slate-500 text-xs"
        >
          {data.protocol}
        </text>
      )}
    </g>
  );
};

// Node Types Configuration
const nodeTypes = {
  service: CustomServiceNode,
  cloud: CustomCloudNode,
  custom: CustomServiceNode,
};

const edgeTypes = {
  dataflow: CustomDataFlowEdge,
};

interface InteractiveArchitectureDiagramProps {
  architectureData: {
    nodes: Node[];
    edges: Edge[];
  };
  title: string;
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
}

const InteractiveArchitectureDiagram: React.FC<InteractiveArchitectureDiagramProps> = ({
  architectureData,
  title,
  onNodeClick,
  onEdgeClick
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(architectureData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(architectureData.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  }, [onNodeClick]);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    onEdgeClick?.(edge);
  }, [onEdgeClick]);

  const simulateDataFlow = useCallback(() => {
    setIsSimulating(true);
    
    // Animate data flow through edges
    const animatedEdges = edges.map((edge: Edge) => ({
      ...edge,
      animated: true,
      style: {
        ...edge.style,
        stroke: '#3b82f6',
        strokeWidth: 3,
      }
    }));
    
    setEdges(animatedEdges);
    
    setTimeout(() => {
      setIsSimulating(false);
      setEdges(architectureData.edges);
    }, 5000);
  }, [edges, setEdges, architectureData.edges]);

  const resetDiagram = useCallback(() => {
    setNodes(architectureData.nodes);
    setEdges(architectureData.edges);
    setSelectedNode(null);
  }, [architectureData, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200/50 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-600">Interactive System Architecture</p>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulateDataFlow}
              disabled={isSimulating}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 
                         text-white rounded-xl text-sm font-medium flex items-center space-x-2
                         shadow-lg hover:shadow-xl transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Flow'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetDiagram}
              className="px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 
                         text-white rounded-xl text-sm font-medium flex items-center space-x-2
                         shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* React Flow Diagram */}
      <div className="w-full h-full pt-20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
          className="bg-transparent"
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls 
            className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg"
            showFitView
            showZoom
            showInteractive
          />
          
          <MiniMap 
            className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-lg"
            nodeColor={(node: Node) => {
              const typeColors: Record<string, string> = {
                api: '#3b82f6',
                database: '#10b981',
                service: '#8b5cf6',
                cloud: '#06b6d4',
                security: '#ef4444',
                monitoring: '#f59e0b',
              };
              return typeColors[node.data?.type] || '#6b7280';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#e2e8f0"
          />

          {/* Custom Panels */}
          <Panel position="top-right" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-3 m-4">
            <div className="text-xs text-slate-600 space-y-1">
              <div className="font-semibold">Legend:</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>API/Gateway</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span>Cloud</span>
              </div>
            </div>
          </Panel>

          {selectedNode && (
            <Panel position="bottom-right" className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 m-4 max-w-xs">
              <div className="space-y-2">
                <div className="font-semibold text-slate-800">{selectedNode.data.label}</div>
                <div className="text-sm text-slate-600">{selectedNode.data.description}</div>
                {selectedNode.data.technology && (
                  <div className="text-xs text-slate-500">
                    <span className="font-medium">Technology:</span> {selectedNode.data.technology}
                  </div>
                )}
                {selectedNode.data.metrics && (
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="font-medium">Metrics:</div>
                    {Object.entries(selectedNode.data.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNode(null)}
                  className="w-full mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 
                             text-slate-700 rounded-lg text-xs transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export default InteractiveArchitectureDiagram;

// Sample Data Generator for Testing
export const generateSampleArchitecture = (type: 'microservices' | 'serverless' | 'hybrid') => {
  const microservicesData = {
    nodes: [
      {
        id: 'users',
        type: 'service',
        position: { x: 50, y: 50 },
        data: { 
          label: 'Users', 
          type: 'users', 
          description: 'End users accessing the application',
          status: 'healthy'
        }
      },
      {
        id: 'api-gateway',
        type: 'service',
        position: { x: 300, y: 50 },
        data: { 
          label: 'API Gateway', 
          type: 'gateway', 
          technology: 'Kong/AWS API Gateway',
          description: 'Central entry point for all API requests',
          status: 'healthy',
          metrics: { requests: '1.2K/s', latency: '45ms' }
        }
      },
      {
        id: 'auth-service',
        type: 'service',
        position: { x: 100, y: 200 },
        data: { 
          label: 'Auth Service', 
          type: 'auth', 
          technology: 'OAuth 2.0 + JWT',
          description: 'Authentication and authorization service',
          status: 'healthy',
          metrics: { cpu: '12%', memory: '256MB' }
        }
      },
      {
        id: 'user-service',
        type: 'service',
        position: { x: 300, y: 200 },
        data: { 
          label: 'User Service', 
          type: 'service', 
          technology: 'Node.js + Express',
          description: 'User management and profile service',
          status: 'healthy',
          metrics: { cpu: '8%', memory: '512MB' }
        }
      },
      {
        id: 'order-service',
        type: 'service',
        position: { x: 500, y: 200 },
        data: { 
          label: 'Order Service', 
          type: 'service', 
          technology: 'Java Spring Boot',
          description: 'Order processing and management',
          status: 'warning',
          metrics: { cpu: '25%', memory: '1GB' }
        }
      },
      {
        id: 'payment-service',
        type: 'service',
        position: { x: 700, y: 200 },
        data: { 
          label: 'Payment Service', 
          type: 'service', 
          technology: 'Python Django',
          description: 'Payment processing service',
          status: 'healthy',
          metrics: { cpu: '15%', memory: '768MB' }
        }
      },
      {
        id: 'user-db',
        type: 'service',
        position: { x: 200, y: 350 },
        data: { 
          label: 'User Database', 
          type: 'database', 
          technology: 'PostgreSQL',
          description: 'User data storage',
          status: 'healthy',
          metrics: { connections: '45', storage: '120GB' }
        }
      },
      {
        id: 'order-db',
        type: 'service',
        position: { x: 500, y: 350 },
        data: { 
          label: 'Order Database', 
          type: 'database', 
          technology: 'MongoDB',
          description: 'Order and inventory data',
          status: 'healthy',
          metrics: { connections: '32', storage: '85GB' }
        }
      },
      {
        id: 'redis-cache',
        type: 'service',
        position: { x: 350, y: 350 },
        data: { 
          label: 'Redis Cache', 
          type: 'storage', 
          technology: 'Redis Cluster',
          description: 'Distributed caching layer',
          status: 'healthy',
          metrics: { memory: '4GB', hits: '95%' }
        }
      },
      {
        id: 'monitoring',
        type: 'service',
        position: { x: 600, y: 50 },
        data: { 
          label: 'Monitoring', 
          type: 'monitoring', 
          technology: 'Prometheus + Grafana',
          description: 'System monitoring and alerting',
          status: 'healthy'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'users', target: 'api-gateway', type: 'dataflow', data: { label: 'HTTPS', protocol: 'REST API' } },
      { id: 'e2', source: 'api-gateway', target: 'auth-service', type: 'dataflow', data: { label: 'Auth Check' } },
      { id: 'e3', source: 'api-gateway', target: 'user-service', type: 'dataflow', data: { label: 'User Requests' } },
      { id: 'e4', source: 'api-gateway', target: 'order-service', type: 'dataflow', data: { label: 'Order Requests' } },
      { id: 'e5', source: 'user-service', target: 'user-db', type: 'dataflow', data: { label: 'SQL Queries' } },
      { id: 'e6', source: 'order-service', target: 'order-db', type: 'dataflow', data: { label: 'Document Queries' } },
      { id: 'e7', source: 'order-service', target: 'payment-service', type: 'dataflow', data: { label: 'Payment Processing' } },
      { id: 'e8', source: 'user-service', target: 'redis-cache', type: 'dataflow', data: { label: 'Cache Access' } },
      { id: 'e9', source: 'order-service', target: 'redis-cache', type: 'dataflow', data: { label: 'Session Cache' } },
      { id: 'e10', source: 'monitoring', target: 'api-gateway', type: 'dataflow', data: { label: 'Metrics Collection' } },
      { id: 'e11', source: 'monitoring', target: 'user-service', type: 'dataflow' },
      { id: 'e12', source: 'monitoring', target: 'order-service', type: 'dataflow' }
    ]
  };

  const serverlessData = {
    nodes: [
      {
        id: 'users',
        type: 'service',
        position: { x: 50, y: 50 },
        data: { 
          label: 'Users', 
          type: 'users', 
          description: 'End users accessing the application',
          status: 'healthy'
        }
      },
      {
        id: 'cloudfront',
        type: 'cloud',
        position: { x: 300, y: 50 },
        data: { 
          label: 'CloudFront CDN', 
          provider: 'AWS',
          services: ['Static Assets', 'Edge Caching'],
          region: 'Global'
        }
      },
      {
        id: 'api-gateway',
        type: 'service',
        position: { x: 300, y: 180 },
        data: { 
          label: 'API Gateway', 
          type: 'gateway', 
          technology: 'AWS API Gateway',
          description: 'Serverless API management',
          status: 'healthy',
          metrics: { requests: '800/s', latency: '35ms' }
        }
      },
      {
        id: 'auth-lambda',
        type: 'service',
        position: { x: 100, y: 300 },
        data: { 
          label: 'Auth Function', 
          type: 'function', 
          technology: 'AWS Lambda',
          description: 'Authentication logic',
          status: 'healthy',
          metrics: { invocations: '500/min', duration: '120ms' }
        }
      },
      {
        id: 'user-lambda',
        type: 'service',
        position: { x: 300, y: 300 },
        data: { 
          label: 'User Function', 
          type: 'function', 
          technology: 'AWS Lambda',
          description: 'User management logic',
          status: 'healthy',
          metrics: { invocations: '300/min', duration: '95ms' }
        }
      },
      {
        id: 'order-lambda',
        type: 'service',
        position: { x: 500, y: 300 },
        data: { 
          label: 'Order Function', 
          type: 'function', 
          technology: 'AWS Lambda',
          description: 'Order processing logic',
          status: 'healthy',
          metrics: { invocations: '200/min', duration: '180ms' }
        }
      },
      {
        id: 'dynamodb',
        type: 'service',
        position: { x: 200, y: 450 },
        data: { 
          label: 'DynamoDB', 
          type: 'database', 
          technology: 'AWS DynamoDB',
          description: 'NoSQL database',
          status: 'healthy',
          metrics: { 'read-capacity': '100 RCU', 'write-capacity': '50 WCU' }
        }
      },
      {
        id: 's3',
        type: 'service',
        position: { x: 400, y: 450 },
        data: { 
          label: 'S3 Storage', 
          type: 'storage', 
          technology: 'AWS S3',
          description: 'Object storage',
          status: 'healthy',
          metrics: { objects: '2.5M', storage: '1.2TB' }
        }
      },
      {
        id: 'eventbridge',
        type: 'service',
        position: { x: 600, y: 300 },
        data: { 
          label: 'EventBridge', 
          type: 'service', 
          technology: 'AWS EventBridge',
          description: 'Event routing',
          status: 'healthy',
          metrics: { events: '1.2K/min' }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'users', target: 'cloudfront', type: 'dataflow', data: { label: 'HTTPS' } },
      { id: 'e2', source: 'cloudfront', target: 'api-gateway', type: 'dataflow', data: { label: 'API Requests' } },
      { id: 'e3', source: 'api-gateway', target: 'auth-lambda', type: 'dataflow', data: { label: 'Auth Invoke' } },
      { id: 'e4', source: 'api-gateway', target: 'user-lambda', type: 'dataflow', data: { label: 'User Invoke' } },
      { id: 'e5', source: 'api-gateway', target: 'order-lambda', type: 'dataflow', data: { label: 'Order Invoke' } },
      { id: 'e6', source: 'user-lambda', target: 'dynamodb', type: 'dataflow', data: { label: 'Data Access' } },
      { id: 'e7', source: 'order-lambda', target: 'dynamodb', type: 'dataflow', data: { label: 'Order Data' } },
      { id: 'e8', source: 'order-lambda', target: 's3', type: 'dataflow', data: { label: 'File Storage' } },
      { id: 'e9', source: 'order-lambda', target: 'eventbridge', type: 'dataflow', data: { label: 'Events' } },
      { id: 'e10', source: 'eventbridge', target: 'user-lambda', type: 'dataflow', data: { label: 'Notifications' } }
    ]
  };

  const hybridData = {
    nodes: [
      {
        id: 'users',
        type: 'service',
        position: { x: 50, y: 50 },
        data: { 
          label: 'Global Users', 
          type: 'users', 
          description: 'Users across multiple regions',
          status: 'healthy'
        }
      },
      {
        id: 'global-lb',
        type: 'service',
        position: { x: 300, y: 50 },
        data: { 
          label: 'Global Load Balancer', 
          type: 'network', 
          technology: 'Cloudflare',
          description: 'Global traffic distribution',
          status: 'healthy',
          metrics: { requests: '5K/s', regions: '12' }
        }
      },
      {
        id: 'aws-region',
        type: 'cloud',
        position: { x: 150, y: 200 },
        data: { 
          label: 'AWS Primary', 
          provider: 'Amazon Web Services',
          services: ['EC2', 'RDS', 'EKS', 'S3'],
          region: 'us-east-1'
        }
      },
      {
        id: 'azure-region',
        type: 'cloud',
        position: { x: 450, y: 200 },
        data: { 
          label: 'Azure Secondary', 
          provider: 'Microsoft Azure',
          services: ['VMs', 'AKS', 'Cosmos DB', 'Blob'],
          region: 'westeurope'
        }
      },
      {
        id: 'gcp-region',
        type: 'cloud',
        position: { x: 300, y: 350 },
        data: { 
          label: 'GCP Analytics', 
          provider: 'Google Cloud',
          services: ['BigQuery', 'Cloud Functions', 'Dataflow'],
          region: 'asia-southeast1'
        }
      },
      {
        id: 'edge-nodes',
        type: 'service',
        position: { x: 600, y: 50 },
        data: { 
          label: 'Edge Nodes', 
          type: 'network', 
          technology: 'Edge Computing',
          description: 'Regional edge computing nodes',
          status: 'healthy',
          metrics: { locations: '50+', latency: '<20ms' }
        }
      },
      {
        id: 'vpn-connect',
        type: 'service',
        position: { x: 300, y: 500 },
        data: { 
          label: 'VPN Connectivity', 
          type: 'network', 
          technology: 'Multi-Cloud VPN',
          description: 'Secure inter-cloud connectivity',
          status: 'healthy',
          metrics: { bandwidth: '10Gbps', uptime: '99.99%' }
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'users', target: 'global-lb', type: 'dataflow', data: { label: 'HTTPS', protocol: 'Global Anycast' } },
      { id: 'e2', source: 'global-lb', target: 'aws-region', type: 'dataflow', data: { label: 'Primary Traffic' } },
      { id: 'e3', source: 'global-lb', target: 'azure-region', type: 'dataflow', data: { label: 'Failover Traffic' } },
      { id: 'e4', source: 'global-lb', target: 'edge-nodes', type: 'dataflow', data: { label: 'Edge Routing' } },
      { id: 'e5', source: 'aws-region', target: 'vpn-connect', type: 'dataflow', data: { label: 'Cross-Cloud VPN' } },
      { id: 'e6', source: 'azure-region', target: 'vpn-connect', type: 'dataflow', data: { label: 'Backup Sync' } },
      { id: 'e7', source: 'vpn-connect', target: 'gcp-region', type: 'dataflow', data: { label: 'Analytics Data' } },
      { id: 'e8', source: 'aws-region', target: 'azure-region', type: 'dataflow', data: { label: 'Data Replication' } }
    ]
  };

  switch (type) {
    case 'microservices':
      return microservicesData;
    case 'serverless':
      return serverlessData;
    case 'hybrid':
      return hybridData;
    default:
      return microservicesData;
  }
};