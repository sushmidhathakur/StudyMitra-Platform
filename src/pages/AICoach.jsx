import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';

export default function AICoach() {
  const { userProfile } = useAuth();
  const { roadmap, progress } = useRoadmap();
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! I'm your AI Coach. I know you're currently working on your roadmap. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        // Construct context
        const context = `You are StudyMitra AI, a helpful learning coach.
The user is studying: ${roadmap?.title || 'a custom roadmap'}.
They are currently on Day ${progress?.currentDay || 1}.
Topic: ${roadmap?.parsedDays?.[(progress?.currentDay || 1) - 1]?.topic || 'Unknown'}.
Keep answers concise, encouraging, and tailored to this topic.`;

        const requestBody = {
          contents: [
            { 
              role: 'user', 
              parts: [{ text: context + '\n\nUser Question: ' + userMsg }] 
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        };

        const modelName = 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        console.log('📤 Sending AI Coach request:', { 
          model: modelName, 
          url: url.replace(apiKey, 'YOUR_API_KEY'),
          bodyPreview: requestBody.contents[0].parts[0].text.substring(0, 100) 
        });

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        console.log('📥 API Response Status:', response.status, response.statusText);

        const data = await response.json();
        
        console.log('📊 API Response Data:', data);

        // Check if response was successful
        if (!response.ok) {
          console.error('❌ API Error (Status ' + response.status + '):', data.error?.message || JSON.stringify(data));
          
          // Handle quota exceeded
          if (response.status === 429 || data.error?.message?.includes('quota')) {
            console.warn('⚠️ API Quota Exceeded - Using fallback response');
            const fallbackResponse = generateFallbackResponse(userMsg, roadmap?.parsedDays?.[(progress?.currentDay || 1) - 1]?.topic);
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `⚠️ My AI brain is resting (quota exceeded). Here's a helpful tip instead:\n\n${fallbackResponse}` 
            }]);
            setLoading(false);
            return;
          }
          
          // Handle 404 (model not found)
          if (response.status === 404) {
            console.warn('⚠️ Model not found');
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: '🔄 Model endpoint not available. Please try again later.' 
            }]);
            setLoading(false);
            return;
          }
          
          const errorMsg = data.error?.message || `API Error ${response.status}: ${response.statusText}`;
          setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${errorMsg}` }]);
          setLoading(false);
          return;
        }

        // Extract text from response
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!aiText) {
          console.error('❌ No text in response:', data);
          setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't extract a response. Please try again." }]);
          setLoading(false);
          return;
        }
        
        console.log('✅ AI Response:', aiText.substring(0, 100) + '...');
        setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
      } else {
        console.warn('⚠️ API key not configured');
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `I see you're asking about "${userMsg}". Since my API key isn't configured yet, I can't give a real answer. Add VITE_GEMINI_API_KEY to your .env file to activate my brain! 🧠` 
          }]);
          setLoading(false);
        }, 1000);
        return;
      }
    } catch (err) {
      console.error('🔥 Error in AI Coach:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Oops! ${err.message}. Please check your API key and connection.` }]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback response generator when API quota is exceeded
  const generateFallbackResponse = (userQuestion, currentTopic) => {
    const tips = {
      default: [
        '💡 Break down complex topics into smaller chunks. Master one concept before moving to the next.',
        '📝 Practice writing summaries of what you learn. This helps solidify your understanding.',
        '⏱️ Use the Pomodoro technique: 25 min focus + 5 min break. Great for maintaining momentum!',
        '🔄 Review previously learned material regularly. Spaced repetition is key to long-term retention.',
        '🎯 Set specific goals for each study session. Know exactly what you want to achieve before starting.',
      ],
      introduction: ['Start with fundamentals. Don\'t skip basics - they\'re the foundation for everything!'],
      project: ['Build incrementally. Start with a minimal version, then add features one by one.'],
      advanced: ['Deep dive into the theory. Understand the "why" behind advanced concepts, not just the "how".'],
      practice: ['Do it repeatedly. Practice is the only way to master new skills.'],
      review: ['Test yourself. Try explaining concepts in your own words or teaching someone else.'],
    };

    let tip = tips.default[Math.floor(Math.random() * tips.default.length)];
    
    if (currentTopic) {
      const topicLower = currentTopic.toLowerCase();
      for (const [key, tipList] of Object.entries(tips)) {
        if (key !== 'default' && topicLower.includes(key)) {
          tip = tipList[0];
          break;
        }
      }
    }

    return tip;
  };

  return (
    <AppLayout>
      <div className="animate-fade-in" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bot size={28} color="#a855f7" />
            AI Learning Coach
          </h1>
          <p className="section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Context-aware help for your journey <Sparkles size={14} color="#f59e0b" />
          </p>
        </div>

        {/* Chat window */}
        <div className="glass" style={{
          flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.2)'
        }}>
          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: 16,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'user' ? 'rgba(79,142,247,0.1)' : 'rgba(168,85,247,0.1)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(79,142,247,0.3)' : 'rgba(168,85,247,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'user' ? <User size={18} color="#4f8ef7" /> : <Bot size={18} color="#a855f7" />}
                </div>
                <div style={{
                  background: msg.role === 'user' ? '#4f8ef7' : 'rgba(0,0,0,0.2)',
                  color: msg.role === 'user' ? 'white' : '#e2e8f0',
                  padding: '12px 18px', borderRadius: 16,
                  borderTopRightRadius: msg.role === 'user' ? 4 : 16,
                  borderTopLeftRadius: msg.role === 'assistant' ? 4 : 16,
                  fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 16, alignSelf: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#a855f7" />
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 18px', borderRadius: 16, borderTopLeftRadius: 4 }}>
                  <Loader2 size={18} className="animate-spin" color="#a855f7" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px 32px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
              <input
                type="text"
                className="input-glass"
                placeholder="Ask about today's topic, concepts, or request a quiz..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ flex: 1, borderRadius: 999, paddingLeft: 24 }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: input.trim() ? '#a855f7' : 'rgba(168,85,247,0.2)',
                  color: 'white', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Send size={20} style={{ marginLeft: input.trim() ? 4 : 0 }} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
