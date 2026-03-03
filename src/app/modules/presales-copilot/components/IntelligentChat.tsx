import React, { useState, useRef, useEffect } from 'react';
import {
    Bot,
    ArrowRight,
    FileText,
    Search,
    Loader2,
    PanelRightClose,
    PanelRightOpen,
    Layout,
    ArrowLeft,
    Trash2
} from 'lucide-react';
import { Project, ChatMessage, CopilotMode } from '../types';
import { saveChatMessages, clearChatHistory } from '../api';
import { usePresalesCopilot } from '../context/PresalesCopilotContext';
import { sendProjectChatMessage } from '../../../ai/chatAgent';
import BriefResults from '../../briefs/components/BriefResults';
import { GeneratedBrief } from '../../briefs/constants';

interface IntelligentChatProps {
    project: Project;
    onBack: () => void;
}

const IntelligentChat: React.FC<IntelligentChatProps> = ({ project, onBack }) => {
    const {
        chatHistoryByProjectId,
        loadingChatForProjects,
        loadChatHistoryForProject,
        invalidateChat,
    } = usePresalesCopilot();

    const cachedMessages = chatHistoryByProjectId.get(project._id!) || [];
    const [messages, setMessages] = useState<ChatMessage[]>(cachedMessages);
    const [inputText, setInputText] = useState('');
    const [mode, setMode] = useState<CopilotMode>('assistant');
    const [isTyping, setIsTyping] = useState(false);
    const [toolStatus, setToolStatus] = useState<string | null>(null);
    const isChatLoading = loadingChatForProjects.has(project._id!);

    // Artifact Visualization State
    const [activeArtifact, setActiveArtifact] = useState<GeneratedBrief | null>(null);
    const [showArtifactPanel, setShowArtifactPanel] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, toolStatus]);

    // Load History
    useEffect(() => {
        const loadHistory = async () => {
            await loadChatHistoryForProject(project._id!);
            const loaded = chatHistoryByProjectId.get(project._id!);
            if (loaded && loaded.length > 0) {
                setMessages(loaded);
            } else {
                setMessages([
                    { role: 'assistant', content: `Hello! I am your Intelligent Presales Copilot for **${project.name}**. I've indexed your materials and I'm ready to help.` }
                ]);
            }
        };
        loadHistory();
    }, [project._id, loadChatHistoryForProject, chatHistoryByProjectId, project.name]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isTyping) return;

        const userMsg: ChatMessage = { role: 'user', content: inputText };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInputText('');
        setIsTyping(true);
        setToolStatus(null);

        try {
            const response = await sendProjectChatMessage(
                project._id!,
                newMessages,
                project,
                mode,
                {},
                (status: string) => setToolStatus(status)
            );

            const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: response.content,
                artifact: response.artifact,
                sources: response.sources
            };

            const finalMessages = [...newMessages, assistantMsg];
            setMessages(finalMessages);

            // Persist to DB
            await saveChatMessages(project._id!, finalMessages);
            invalidateChat(project._id!);

            if (response.artifact) {
                setActiveArtifact(response.artifact);
                setShowArtifactPanel(true);
            }
        } catch (error) {
            console.error('[DEBUG] handleSendMessage failed:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsTyping(false);
            setToolStatus(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = async () => {
        if (confirm('Are you sure you want to clear the chat history for this project?')) {
            await clearChatHistory(project._id!);
            invalidateChat(project._id!);
            setMessages([{ role: 'assistant', content: "Chat history cleared. How can I help you now?" }]);
        }
    };

    return (
        <div className="flex flex-row h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div className={`flex flex-col h-full transition-all duration-300 ${showArtifactPanel ? 'w-1/2' : 'w-full'}`}>
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className={`p-2 rounded-lg ${mode === 'assistant' ? 'bg-primary-100 text-primary-600' :
                            mode === 'writer' ? 'bg-purple-100 text-purple-600' :
                                'bg-orange-100 text-orange-600'
                            }`}>
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 truncate max-w-[200px]">{project.name}</h2>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                <span className="text-primary-600">{project.industry}</span>
                                <span>•</span>
                                <span>{mode} Mode</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setMode('assistant')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'assistant' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Assistant
                            </button>
                            <button
                                onClick={() => setMode('writer')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'writer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Writer
                            </button>
                            <button
                                onClick={() => setMode('critic')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'critic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Critic
                            </button>
                        </div>

                        <button
                            onClick={handleClearChat}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        {!showArtifactPanel && activeArtifact && (
                            <button
                                onClick={() => setShowArtifactPanel(true)}
                                className="p-2 text-primary-400 hover:text-primary-600 border border-primary-100 rounded-lg hover:bg-primary-50 transition-all"
                                title="Open Brief View"
                            >
                                <PanelRightOpen className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {isChatLoading && messages.length === 0 ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-200" />
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                      max-w-[85%] rounded-2xl p-4 shadow-sm
                      ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                    }
                  `}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    {/* Sources display */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase mb-2">
                                                <FileText className="w-3 h-3" /> Sources
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, sIdx) => (
                                                    <div
                                                        key={sIdx}
                                                        className="bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] group relative cursor-help"
                                                        title={source.snippet}
                                                    >
                                                        <div className="font-bold text-gray-700 truncate max-w-[120px]">{source.fileName}</div>
                                                        <div className="text-gray-400 mt-0.5">Score: {(source.score * 100).toFixed(0)}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {msg.artifact && (
                                        <button
                                            onClick={() => {
                                                setActiveArtifact(msg.artifact!);
                                                setShowArtifactPanel(true);
                                            }}
                                            className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors border border-primary-100"
                                        >
                                            <Layout className="w-4 h-4" />
                                            View Full Generated Brief
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                                <span className="text-xs text-gray-400">
                                    {toolStatus ? toolStatus : 'Processing...'}
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                disabled={isTyping}
                                className="w-full bg-gray-100 border-0 rounded-full px-6 py-3.5 pr-12 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm disabled:opacity-50"
                                placeholder="Ask anything about the project documents..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() || isTyping}
                                className={`absolute right-2 top-1.5 p-2 rounded-full transition-all ${inputText.trim() && !isTyping
                                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-2 gap-4">
                        <button
                            onClick={() => setInputText("Summarize the key solution benefits mentioned in the documents")}
                            className="text-[10px] text-gray-400 hover:text-primary-600 flex items-center gap-1 transition-colors"
                        >
                            <FileText className="w-3 h-3" /> Summary
                        </button>
                        <button
                            onClick={() => setInputText("What are the main implementation risks based on context?")}
                            className="text-[10px] text-gray-400 hover:text-primary-600 flex items-center gap-1 transition-colors"
                        >
                            <Search className="w-3 h-3" /> Risk Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Artifact Side Panel */}
            {showArtifactPanel && activeArtifact && (
                <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col animate-in slide-in-from-right duration-300 shadow-xl z-20 absolute right-0 top-[60px] bottom-0">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary-600" />
                            Project Brief
                        </h3>
                        <button
                            onClick={() => setShowArtifactPanel(false)}
                            className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
                        >
                            <PanelRightClose className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <BriefResults brief={activeArtifact} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntelligentChat;
