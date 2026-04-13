function ChatBot({ activeTab, setActiveTab }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([
        { role: 'assistant', content: "Hello! I'm AeroBot 🤖. I'm here to help you understand how nature inspires engineering. Ask me about the 'Kingfisher Beak' or 'Owl Wings'!" }
    ]);
    const [input, setInput] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const messagesEndRef = React.useRef(null);
    const inputRef = React.useRef(null);

    // Enhanced suggestions with preloaded answers for instant response
    const suggestions = [
        { 
            label: "🦉 Owl Silence", 
            query: "How do owls fly silently?",
            answer: "Owls are masters of stealth! 🦉 Their serrated feathers break up air turbulence into smaller currents (micro-turbulences), allowing them to fly silently. We can test this in the Simulation Lab! NAVIGATE_TO:simulation"
        },
        { 
            label: "🐋 Whale Efficiency", 
            query: "Why do whales have bumps on fins?",
            answer: "Humpback whales have bumpy fins called 'tubercles' 🐋. These bumps channel water flow and create vortices that help them turn tight corners without stalling (losing lift). You can see how this improves efficiency in the Simulation tab! NAVIGATE_TO:simulation"
        }
    ];

    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
        scrollToBottom();
    }, [isOpen]);

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSuggestionClick = (suggestion) => {
        // Add user message
        const userMsg = { role: 'user', content: suggestion.query };
        setMessages(prev => [...prev, userMsg]);
        
        // Instant response
        setIsTyping(true);
        setTimeout(() => {
            processResponse(suggestion.answer);
        }, 600); // Slight natural delay for "typing" effect, much faster than full processing
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Check if input matches a suggestion exactly (case-insensitive)
        const matchedSuggestion = suggestions.find(s => s.query.toLowerCase() === userMsg.content.toLowerCase());
        if (matchedSuggestion) {
            setTimeout(() => processResponse(matchedSuggestion.answer), 600);
            return;
        }

        // Prepare Context
        const context = `
            You are AeroBot, an enthusiastic and knowledgeable AI guide for the "Aerodynamics x Biology" website.
            Your goal is to explain biomimicry concepts simply and engagingly.
            
            Current Page: ${activeTab}
            
            Knowledge Base:
            - **Intro**: Explains how biology offers masterclasses in fluid dynamics (air/water flow).
            - **PPT**: Contains lecture slides (PDF/PPTX) on wing mechanics.
            - **Simulation**:
              - *Interactive Wind Turbine Explorer*: Advanced simulation environment for wind turbine aerodynamics. Users can explore efficiency and rotational forces.
            - **Real Life**: Case studies like Shark Skin (dermal denticles reducing drag), Kingfisher bullet train, and Boxfish (stable car shape).
            
            Directives:
            - If the user asks to see something, use the command "NAVIGATE_TO:[tab_id]" at the end.
              - Tabs: 'intro', 'ppt', 'simulation', 'reallife', 'developers'.
            - Keep answers short (max 3-4 sentences).
            - Use emojis to be friendly.
            - If asked about yourself, say you are AeroBot, built to bridge nature and engineering.
        `;

        try {
            let responseText = "";
            let usedFallback = false;

            // 1. Try AI Agent
            try {
                if (typeof invokeAIAgent !== 'undefined') {
                    const history = messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');
                    const prompt = `User Question: ${userMsg.content}\n\nChat History:\n${history}`;
                    responseText = await invokeAIAgent(context, prompt);
                } else {
                    throw new Error("AI Agent missing");
                }
            } catch (err) {
                console.warn("AI Agent unavailable, using fallback:", err);
                usedFallback = true;
            }

            // 2. Fallback Logic
            if (usedFallback || !responseText) {
                await new Promise(r => setTimeout(r, 1000)); // Simulated thinking time
                const lowerInput = userMsg.content.toLowerCase();
                
                if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                    responseText = "Hi there! 👋 I'm ready to explore aerodynamics with you. Try asking about 'Owls' or 'Wind Turbines'.";
                } else if (lowerInput.includes('owl') || lowerInput.includes('noise') || lowerInput.includes('silent')) {
                    responseText = "Owls are masters of stealth! 🦉 Their serrated feathers break up air turbulence, allowing them to fly silently. We can test this in the Simulation Lab! NAVIGATE_TO:simulation";
                } else if (lowerInput.includes('whale') || lowerInput.includes('fin') || lowerInput.includes('bump') || lowerInput.includes('tubercle')) {
                    responseText = "Humpback whales have bumpy fins called 'tubercles' 🐋. These bumps help them turn tight corners without losing lift. You can see how this improves efficiency in the Simulation tab! NAVIGATE_TO:simulation";
                } else if (lowerInput.includes('shark') || lowerInput.includes('skin') || lowerInput.includes('swim')) {
                    responseText = "Shark skin is covered in tiny scales called 'dermal denticles' 🦈. They reduce drag and keep the skin clean. Read more in our Case Studies. NAVIGATE_TO:reallife";
                } else if (lowerInput.includes('sim') || lowerInput.includes('demo') || lowerInput.includes('lab')) {
                    responseText = "Head over to the Simulation Lab to play with our interactive wind tunnel and 3D physics demos! 🧪 NAVIGATE_TO:simulation";
                } else if (lowerInput.includes('dev') || lowerInput.includes('team') || lowerInput.includes('made')) {
                    responseText = "This project was built by a talented team of AI engineers! 👨‍💻 You can meet them on the Developers page. NAVIGATE_TO:developers";
                } else {
                    responseText = "I'm not 100% sure about that, but I know a lot about how nature inspires flight! ✈️ Try asking about 'biomimicry' or check out our Simulations. NAVIGATE_TO:simulation";
                }
            }

            processResponse(responseText);

        } catch (error) {
            console.error("Chat Error", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm feeling a bit dizzy... 😵 Please try asking something else!" }]);
            setIsTyping(false);
        }
    };

    const processResponse = (responseText) => {
        let finalContent = responseText;
        if (responseText.includes("NAVIGATE_TO:")) {
            const match = responseText.match(/NAVIGATE_TO:([a-z_]+)/);
            if (match && match[1]) {
                setActiveTab(match[1]);
                finalContent = responseText.replace(/NAVIGATE_TO:[a-z_]+/, '').trim();
            }
        }
        setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none" data-name="chat-bot">
            {/* Chat Window */}
            <div className={`pointer-events-auto bg-[#0f172a] border border-emerald-500/30 rounded-2xl shadow-2xl w-[90vw] sm:w-96 flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
                isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-90 translate-y-10 h-0'
            }`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-4 flex items-center justify-between shrink-0 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
                            <div className="icon-bot text-white text-xl"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base">AeroBot</h3>
                            <div className="flex items-center gap-1.5 opacity-90">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-xs text-slate-300 font-medium">AI Assistant Online</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                    >
                        <div className="icon-x text-xl"></div>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-700/50 scrollbar-track-transparent bg-slate-950/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                    <div className="icon-bot text-emerald-400 text-xs"></div>
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                                msg.role === 'user' 
                                ? 'bg-emerald-600 text-white rounded-tr-sm' 
                                : 'bg-slate-800 border border-white/5 text-slate-200 rounded-tl-sm'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                             <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                <div className="icon-bot text-emerald-400 text-xs"></div>
                            </div>
                            <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-4 shadow-md flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Suggestions */}
                {messages.length < 3 && !isTyping && (
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-slate-900 border-t border-white/5">
                        {suggestions.map((s, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                className="whitespace-nowrap px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 hover:text-emerald-300 hover:border-emerald-500/50 transition-colors"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-white/10 shrink-0">
                    <div className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-slate-500"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-900/20"
                        >
                            <div className="icon-send text-sm"></div>
                        </button>
                    </div>
                </form>
            </div>

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto mt-4 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group relative ${
                    isOpen ? 'bg-slate-800 text-emerald-400 border-2 border-emerald-500' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-2 border-white/10'
                }`}
            >
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0f172a] animate-bounce"></span>
                )}
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <div className="icon-chevron-down text-2xl"></div> : <div className="icon-message-circle text-3xl"></div>}
                </div>
                
                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
                        Ask AeroBot!
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </div>
                )}
            </button>
        </div>
    );
}