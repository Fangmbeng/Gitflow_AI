# LangGraph Multi-Agent Integration Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
# Install all required packages
npm install

# Or with yarn
yarn install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.local.template .env.local

# Edit with your API keys
nano .env.local
```

### 3. Required Configuration
Add these essential environment variables to `.env.local`:

```bash
# REQUIRED: OpenAI API Key
OPENAI_API_KEY=sk-your-actual-openai-key-here

# REQUIRED: NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-super-secure-secret-key

# REQUIRED: Application URL
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and test the multi-agent system!

## 🔧 Detailed Setup

### Prerequisites
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **OpenAI API Key**: [Get your key](https://platform.openai.com/api-keys)
- **Git**: For version control

### OpenAI API Configuration

1. **Get API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create new secret key
   - Copy the key (starts with `sk-`)

2. **Set Usage Limits** (Recommended):
   - Go to [Usage & Billing](https://platform.openai.com/account/billing)
   - Set monthly spending limits
   - Enable usage alerts

3. **Model Access**:
   - Ensure you have access to `gpt-4-turbo-preview`
   - Check [Model permissions](https://platform.openai.com/account/limits)

### LangGraph Architecture Overview

```typescript
// Workflow Structure
Master Agent → Financial Agent ↘
                               ↘ Documentation Agent
Architecture Agent ────────────↗

// Data Flow
User Input → Master Analysis → Parallel Processing → Final Documentation
```

### File Structure
```
lib/
├── services/
│   └── langGraphService.ts     # Core LangGraph implementation
├── hooks/
│   └── useLangGraphAgent.ts    # React integration hook
└── types/
    └── agents.ts               # TypeScript interfaces

app/
└── api/
    └── llm/
        └── route.ts            # OpenAI API endpoint
```

## 🧪 Testing the Integration

### 1. Basic Functionality Test

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open browser**: `http://localhost:3000`

3. **Configure requirements**:
   - Business Type: `Startup`
   - Sector: `FinTech`
   - Budget: `Medium ($200K – $1M)`
   - Audience: `Business Users`

4. **Send test prompt**:
   ```
   I need a secure payment processing system with real-time fraud detection for a fintech startup.
   ```

5. **Expected behavior**:
   - Progress indicator shows agent steps
   - Messages appear from different agents
   - 3 architecture designs are generated
   - Each design has cost estimates and documentation

### 2. Error Handling Test

1. **Test with invalid API key**:
   ```bash
   # Temporarily set invalid key
   OPENAI_API_KEY=invalid-key
   ```

2. **Expected behavior**:
   - Error message displays
   - Fallback options provided
   - System remains stable

3. **Test with missing requirements**:
   - Leave requirements empty
   - Send prompt
   - Should request configuration completion

### 3. Performance Test

1. **Monitor API calls**:
   ```bash
   # Enable debug mode
   DEBUG_LANGGRAPH=true npm run dev
   ```

2. **Check console logs**:
   - Agent execution order
   - Response times
   - Token usage

3. **Expected performance**:
   - Master Agent: ~2-3 seconds
   - Financial Agent: ~3-4 seconds
   - Architecture Agent: ~5-8 seconds
   - Documentation Agent: ~3-5 seconds
   - **Total**: ~15-20 seconds

## 🔍 Debugging Guide

### Common Issues & Solutions

#### 1. **"OpenAI API key not configured"**
```bash
# Check environment variables
echo $OPENAI_API_KEY

# Restart development server
npm run dev
```

#### 2. **"Rate limit exceeded"**
```bash
# Check OpenAI usage dashboard
# Wait 1 minute and retry
# Consider upgrading OpenAI plan
```

#### 3. **"LangGraph initialization failed"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check LangChain versions
npm list @langchain/langgraph
```

#### 4. **Agents not responding**
```bash
# Enable detailed logging
DEBUG_OPENAI_CALLS=true npm run dev

# Check browser developer console
# Verify API endpoint is working: http://localhost:3000/api/llm
```

### Debug Tools

#### 1. **LangSmith Tracing** (Optional)
```bash
# Add to .env.local
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langsmith-key
LANGCHAIN_PROJECT=gitflow-ai-debug
```

#### 2. **Console Debugging**
```typescript
// Add to langGraphService.ts
console.log('Agent State:', JSON.stringify(state, null, 2));
console.log('LLM Response:', response.content);
```

#### 3. **Network Monitoring**
- Open browser Developer Tools
- Monitor Network tab during requests
- Check for 200 status codes on `/api/llm`

## 📊 Monitoring & Analytics

### Performance Metrics
```typescript
// Add to your monitoring dashboard
{
  "agent_response_times": {
    "master_agent_avg": "2.3s",
    "financial_agent_avg": "3.1s", 
    "architecture_agent_avg": "6.2s",
    "documentation_agent_avg": "4.1s"
  },
  "success_rate": "94.2%",
  "token_usage_per_request": "~3,500 tokens",
  "cost_per_request": "~$0.12"
}
```

### Cost Optimization
```bash
# Monitor token usage
TRACK_TOKEN_USAGE=true

# Use cheaper models for specific agents
FINANCIAL_AGENT_MODEL=gpt-3.5-turbo-16k
DOCUMENTATION_AGENT_MODEL=gpt-3.5-turbo-16k
```

## 🔒 Production Deployment

### Environment Variables for Production
```bash
# Production OpenAI Configuration
OPENAI_API_KEY=your-production-api-key
OPENAI_ORG_ID=your-organization-id

# Production URLs
NEXTAUTH_URL=https://yourdomain.com
PROD_API_URL=https://yourdomain.com/api

# Security
JWT_SECRET=super-secure-production-secret
CORS_ORIGINS=https://yourdomain.com

# Performance
RATE_LIMIT_MAX_REQUESTS=50
LANGGRAPH_TIMEOUT_MS=180000
```

### Deployment Checklist
- [ ] API keys secured in environment
- [ ] Rate limiting configured
- [ ] Error monitoring enabled (Sentry)
- [ ] Performance monitoring setup
- [ ] Database backups automated
- [ ] SSL certificates valid
- [ ] CORS properly configured
- [ ] API usage alerts set up

## 🧬 Advanced Configuration

### Custom Agent Models
```typescript
// Different models per agent for cost optimization
const agentConfigs = {
  master: { model: 'gpt-4-turbo-preview', temperature: 0.7 },
  financial: { model: 'gpt-3.5-turbo-16k', temperature: 0.3 },
  architecture: { model: 'gpt-4-turbo-preview', temperature: 0.8 },
  documentation: { model: 'gpt-3.5-turbo-16k', temperature: 0.5 }
};
```

### Memory Management
```typescript
// Configure LangGraph memory
const memory = new MemorySaver({
  maxSize: 1000,          // Max conversations stored
  ttl: 24 * 60 * 60,      // 24 hours TTL
  compressionRatio: 0.7   // Compress old conversations
});
```

### Streaming Implementation
```typescript
// Enable real-time streaming responses
export async function streamArchitectureGeneration(
  requirements: UserRequirements,
  prompt: string
): AsyncGenerator<AgentUpdate> {
  // Implementation for streaming responses
}
```

## 📈 Scaling Considerations

### Horizontal Scaling
- **Load Balancer**: Distribute requests across instances
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis for session management
- **CDN**: Static assets and file downloads

### Vertical Scaling
- **Memory**: 4GB+ for LangGraph workflows
- **CPU**: Multi-core for parallel agent execution
- **Network**: High bandwidth for OpenAI API calls

### Cost Management
- **Token Optimization**: Shorter prompts, efficient parsing
- **Model Selection**: gpt-3.5-turbo for simple tasks
- **Caching**: Cache common architecture patterns
- **Rate Limiting**: Prevent API abuse

## 🎯 Next Steps

1. **Test the basic integration** with your OpenAI key
2. **Monitor performance** and token usage
3. **Customize agent prompts** for your specific needs
4. **Add error handling** for production robustness
5. **Implement caching** for frequently requested architectures
6. **Set up monitoring** for production deployment

## 🆘 Getting Help

### Community Resources
- [LangChain Documentation](https://python.langchain.com/docs/langgraph)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GitHub Issues](https://github.com/your-repo/issues)

### Support Channels
- Email: support@gitflow-ai.com
- Discord: [Community Server](https://discord.gg/gitflow-ai)
- Documentation: [docs.gitflow-ai.com](https://docs.gitflow-ai.com)

---

**Ready to build the future of AI-powered architecture generation!** 🚀