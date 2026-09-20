import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../../context/BankContext';
import { SupportTicket } from '../../types';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ShieldCheck,
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  CreditCard,
  ArrowRight,
  RefreshCw,
  Info,
  ChevronRight,
  ShieldAlert,
  Headphones,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const CustomerSupportCenter: React.FC = () => {
  const {
    currentUser,
    supportTickets,
    createSupportTicket,
    sendSupportTicket,
    replySupportTicket,
    state,
  } = useBank();

  // Active view tab: 'ai-chat' or 'tickets'
  const [activeView, setActiveView] = useState<'ai-chat' | 'tickets'>('ai-chat');

  // Live AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Traditional Ticket Modal & Reply State
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('General Inquiry');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Find or determine the active Live Chat session for current user
  const userChatSession = supportTickets.find(
    (t) => t.userId === currentUser?.userId && t.channel === 'ai_chat'
  );

  // Auto-scroll chat transcript to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userChatSession?.replies, isTyping]);

  // Keep selectedTicket updated if it changes in context
  useEffect(() => {
    if (selectedTicket) {
      const refreshed = supportTickets.find((t) => t.id === selectedTicket.id);
      if (refreshed) setSelectedTicket(refreshed);
    }
  }, [supportTickets, selectedTicket]);

  /* =========================================================================
     AI ASSISTANT LOGIC & SPECIFIC WORKFLOW RULES
     =========================================================================
     1. Card Link First Restriction:
        AI must NEVER talk about or explain how to upgrade an account until a
        Gold Visa Card is explicitly linked (currentUser.hasVisaCard === true).
     2. Card Arrival Guidance:
        When customer asks "What do I do when I get the card?" or "I got my card":
        "Please email a clear photo of your Gold Visa Card along with your Customer ID
        to customer care support at support@greendotbanking.com. Include the
        amount you wish to load on the card so our team can activate it and guide you on the next steps."
     3. Feature Access Confirmation:
        When customer asks "If I get the card and link it to my account, will I get access to all features?":
        "Yes! Once your Gold Visa Card is received and linked to your profile, you will unlock full access to all banking features, including instant external wire transfers, bill payments, and mobile top-ups."
     4. 2-Hour Human Fallback Notice:
        If query cannot be answered or customer asks for human assistance:
        "An agent from our human support team will review your message and reply within 2 hours. You will receive an email notification as soon as a support agent responds."
  ========================================================================= */
  const processAIQuery = (query: string): { text: string; isFallback: boolean } => {
    const q = query.trim().toLowerCase();
    const hasVisaCard = !!currentUser?.hasVisaCard;

    // Normalizing punctuation for robust matching
    const cleanQ = q.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // 1. CARD LINK FIRST RESTRICTION
    const isUpgradeQuery =
      cleanQ.includes('upgrade') ||
      cleanQ.includes('tier 1') ||
      cleanQ.includes('tier upgrade') ||
      cleanQ.includes('how to upgrade') ||
      cleanQ.includes('upgrade my account') ||
      cleanQ.includes('higher tier') ||
      cleanQ.includes('upgrade account') ||
      cleanQ.includes('level up');

    if (isUpgradeQuery) {
      if (!hasVisaCard) {
        return {
          text:
            "Account upgrade information is restricted: You must have an active Gold Visa Card linked to your profile before your account can be considered or explained for an upgrade. Please obtain and link your Gold Visa Card first by visiting the 'How to Get Card' section or contacting customer support.",
          isFallback: false,
        };
      } else {
        return {
          text:
            "Since your Gold Visa Card is successfully linked to your account, you meet the primary requirement for an account upgrade! You can upgrade your profile to Tier 1 directly from the 'How to Upgrade' tab in your dashboard, which elevates your daily transfer limits and activates unrestricted wire processing.",
          isFallback: false,
        };
      }
    }

    // 2. CARD ARRIVAL GUIDANCE
    const isCardArrivalQuery =
      cleanQ.includes('what do i do when i get the card') ||
      cleanQ.includes('what do i do when i get card') ||
      cleanQ.includes('what to do when i get the card') ||
      cleanQ.includes('what should i do when i get the card') ||
      cleanQ.includes('i got my card') ||
      cleanQ.includes('got my card') ||
      cleanQ.includes('my card arrived') ||
      cleanQ.includes('card arrived') ||
      cleanQ.includes('received my card') ||
      cleanQ.includes('i received my card') ||
      cleanQ.includes('card has arrived') ||
      (cleanQ.includes('got') && cleanQ.includes('card')) ||
      (cleanQ.includes('received') && cleanQ.includes('card'));

    if (isCardArrivalQuery) {
      return {
        text:
          'Please email a clear photo of your Gold Visa Card along with your Customer ID to customer care support at support@greendotbanking.com. Include the amount you wish to load on the card so our team can activate it and guide you on the next steps.',
        isFallback: false,
      };
    }

    // 3. FEATURE ACCESS CONFIRMATION
    const isFeatureAccessQuery =
      cleanQ.includes('if i get the card and link it to my account will i get access to all features') ||
      cleanQ.includes('if i get the card and link it to my account will i get access to all feature') ||
      cleanQ.includes('will i get access to all features') ||
      cleanQ.includes('access to all features') ||
      (cleanQ.includes('get the card') && cleanQ.includes('all features')) ||
      (cleanQ.includes('link') && cleanQ.includes('card') && cleanQ.includes('access') && cleanQ.includes('features'));

    if (isFeatureAccessQuery) {
      return {
        text:
          'Yes! Once your Gold Visa Card is received and linked to your profile, you will unlock full access to all banking features, including instant external wire transfers, bill payments, and mobile top-ups.',
        isFallback: false,
      };
    }

    // Other helpful standard concierge queries
    if (
      cleanQ.includes('how to get card') ||
      cleanQ.includes('request card') ||
      cleanQ.includes('order card') ||
      cleanQ.includes('get a card')
    ) {
      return {
        text:
          "To request your official Greendot Gold Visa Card, visit the 'How to Get Card' tab on your sidebar. Once your card is delivered, email a photo of the card with your Customer ID to support@greendotbanking.com along with your initial funding amount.",
        isFallback: false,
      };
    }

    if (
      cleanQ.includes('routing number') ||
      cleanQ.includes('swift') ||
      cleanQ.includes('wire instructions')
    ) {
      return {
        text:
          'Greendot Bank domestic routing number is 021000021. Incoming ACH deposits and Fedwire transfers are routed through JPMorgan Chase under Federal Reserve clearance rules.',
        isFallback: false,
      };
    }

    if (
      cleanQ.includes('customer id') ||
      cleanQ.includes('my id') ||
      cleanQ.includes('what is my customer id')
    ) {
      return {
        text: `Your Greendot Customer ID is ${currentUser?.customerId || 'CUST-XXXX'}. Please quote this identifier whenever communicating with customer support or linking your card.`,
        isFallback: false,
      };
    }

    // 4. 2-HOUR HUMAN FALLBACK NOTICE
    // Catches queries asking for human help or questions outside the recognized scope
    return {
      text:
        'An agent from our human support team will review your message and reply within 2 hours. You will receive an email notification as soon as a support agent responds.',
      isFallback: true,
    };
  };

  // Submit message to Live AI Chat
  const handleSendChatMessage = (textToSend?: string) => {
    const messageText = (textToSend || chatInput).trim();
    if (!messageText || !currentUser) return;

    const now = new Date().toISOString();
    setChatInput('');

    // If no existing live chat session, create one
    let currentSession = userChatSession;
    if (!currentSession) {
      const newSessionId = 'chat-' + Date.now();
      sendSupportTicket(
        `AI Support Chat - ${currentUser.fullName} (${currentUser.customerId || 'ID'})`,
        messageText,
        {
          id: newSessionId,
          channel: 'ai_chat',
          status: 'open',
          needsHumanReply: false,
          replies: [
            {
              sender: 'user',
              senderName: currentUser.fullName,
              text: messageText,
              timestamp: now,
            },
          ],
        }
      );
      // Local reference
      currentSession = {
        id: newSessionId,
        userId: currentUser.userId,
        userName: currentUser.fullName,
        userEmail: currentUser.email,
        customerId: currentUser.customerId,
        accountNumber: currentUser.primaryAccount?.accountNumber,
        subject: `AI Support Chat - ${currentUser.fullName}`,
        message: messageText,
        status: 'open',
        channel: 'ai_chat',
        needsHumanReply: false,
        replies: [
          {
            sender: 'user',
            senderName: currentUser.fullName,
            text: messageText,
            timestamp: now,
          },
        ],
        createdAt: now,
      };
    } else {
      // Append user message to existing session
      replySupportTicket(currentSession.id, messageText, {
        sender: 'user',
        senderName: currentUser.fullName,
      });
    }

    const targetSessionId = currentSession.id;

    // Simulate AI typing and response
    setIsTyping(true);
    setTimeout(() => {
      const aiResult = processAIQuery(messageText);

      replySupportTicket(targetSessionId, aiResult.text, {
        sender: 'ai',
        senderName: 'Greendot AI Concierge',
      });

      // If fallback was triggered, mark the session as pending human reply
      if (aiResult.isFallback) {
        // Update ticket status to 'pending_human'
        const existing = supportTickets.find((t) => t.id === targetSessionId);
        if (existing) {
          existing.status = 'pending_human';
          existing.needsHumanReply = true;
        }

        // Admin Real-Time Alert: Human Support Requested
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'jade66oc@gmail.com',
            subject: `[Admin Alert] Customer Escalation - Human Support Requested (#${targetSessionId})`,
            html: `
              <div style="font-family: sans-serif; padding: 24px; background: #0b0f19; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
                <h2 style="color: #fbbf24; margin-top: 0;">Human Support Escalation Requested</h2>
                <p>A customer has triggered the human assistance fallback in live AI chat. A reply is expected within the <strong>2-hour SLA</strong> window.</p>
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Customer:</strong> ${currentUser.fullName} (${currentUser.customerId})</p>
                  <p style="margin: 4px 0;"><strong>Email:</strong> ${currentUser.email}</p>
                  <p style="margin: 4px 0;"><strong>Account:</strong> ${currentUser.primaryAccount?.accountNumber || 'Primary'}</p>
                  <p style="margin: 4px 0;"><strong>Inquiry Preview:</strong> <em>"${messageText}"</em></p>
                  <p style="margin: 4px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p style="font-size: 13px; color: #94a3b8;">You can review the live conversation transcript and reply directly to the customer in the <strong>Admin Portal &gt; AI &amp; Live Support Desk</strong>.</p>
              </div>
            `,
          }),
        }).catch((err) => console.warn('Human escalation admin email error:', err));
      }

      setIsTyping(false);
    }, 650);
  };

  // Quick Action Pill Handler
  const handleQuickQuestion = (question: string) => {
    handleSendChatMessage(question);
  };

  // Traditional Ticket Create Handler
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim() || !currentUser) return;

    createSupportTicket({
      subject: `[${ticketCategory}] ${ticketSubject}`,
      message: ticketMessage,
      category: ticketCategory,
      channel: 'ticket',
    });

    setIsCreatingTicket(false);
    setTicketSubject('');
    setTicketMessage('');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Traditional Ticket Reply Handler
  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReplyText.trim()) return;

    replySupportTicket(selectedTicket.id, ticketReplyText, {
      sender: 'user',
      senderName: currentUser?.fullName || 'Customer',
    });
    setTicketReplyText('');
  };

  // Filter conventional tickets (exclude live_chat from list, or show all)
  const conventionalTickets = supportTickets.filter(
    (t) => (currentUser?.role === 'admin' || t.userId === currentUser?.userId) && t.channel !== 'ai_chat'
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="gradient-hero text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Bot className="w-3.5 h-3.5" />
            <span>24/7 Intelligent Banking Assistant &amp; Live Concierge</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Customer Support Center</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Get immediate answers on card linking, account upgrade rules, feature access, or escalate to our live human support desk.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
          <button
            onClick={() => setActiveView('ai-chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'ai-chat'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Live Assistant</span>
          </button>
          <button
            onClick={() => setActiveView('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'tickets'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Formal Tickets ({conventionalTickets.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: AI ASSISTANT & LIVE CONCIERGE CHAT */}
      {activeView === 'ai-chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Chat Interface */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-400/20" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-slate-900">
                      Greendot AI Assistant
                    </h3>
                    <span className="text-[10px] uppercase font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Verified Bot
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>Active Session</span>
                    <span>&bull;</span>
                    <span>Direct Admin Sync</span>
                  </div>
                </div>
              </div>

              {/* Visa Card Status Badge */}
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Card Status</div>
                {currentUser?.hasVisaCard ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Gold Visa Linked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <AlertCircle className="w-3 h-3" />
                    No Card Linked
                  </span>
                )}
              </div>
            </div>

            {/* Conversation Log / Transcript */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/30 to-white">
              {/* Welcome message */}
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-emerald-50/70 border border-emerald-100 text-slate-800 p-4 rounded-2xl rounded-tl-sm text-xs leading-relaxed space-y-2 shadow-sm">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Welcome to Greendot Priority Concierge, {currentUser?.fullName}!</span>
                  </div>
                  <p className="text-slate-700">
                    I am your real-time banking assistant. Ask me anything regarding your Gold Visa Card, account upgrade requirements, feature access, or transfer policies.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    If I cannot answer your request, our human support desk is instantly notified and will reply within 2 hours.
                  </p>
                </div>
              </div>

              {/* Chat Thread Messages */}
              {userChatSession?.replies?.map((msg, index) => {
                const isUser = msg.sender === 'user';
                const isAI = msg.sender === 'ai';
                const isHumanSupport = msg.sender === 'support';

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      isUser ? 'flex-row-reverse max-w-[85%] ml-auto' : 'max-w-[85%]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm text-white ${
                        isUser
                          ? 'bg-slate-900'
                          : isHumanSupport
                          ? 'bg-blue-600'
                          : 'bg-emerald-700'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4" />
                      ) : isHumanSupport ? (
                        <Headphones className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-sm ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-sm'
                          : isHumanSupport
                          ? 'bg-blue-50/80 border border-blue-200 text-slate-800 rounded-tl-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px]">
                        <span
                          className={`font-bold ${
                            isUser
                              ? 'text-slate-300'
                              : isHumanSupport
                              ? 'text-blue-800 flex items-center gap-1'
                              : 'text-emerald-800 flex items-center gap-1'
                          }`}
                        >
                          {isHumanSupport && <ShieldCheck className="w-3 h-3 text-blue-600" />}
                          {msg.senderName}
                          {isHumanSupport && ' (Senior Support Specialist)'}
                        </span>
                        <span className={isUser ? 'text-slate-400' : 'text-slate-400'}>
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-500 font-medium ml-2">
                      Greendot AI is analyzing...
                    </span>
                  </div>
                </div>
              )}

              {/* End anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Suggested:
              </span>

              <button
                type="button"
                onClick={() => handleQuickQuestion('What do I do when I get the card?')}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all flex-shrink-0 shadow-sm"
              >
                What do I do when I get the card?
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    'If I get the card and link it to my account, will I get access to all features?'
                  )
                }
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all flex-shrink-0 shadow-sm"
              >
                Will I get access to all features once card is linked?
              </button>

              <button
                type="button"
                onClick={() => handleQuickQuestion('How do I upgrade my account?')}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all flex-shrink-0 shadow-sm"
              >
                How do I upgrade my account?
              </button>

              <button
                type="button"
                onClick={() => handleQuickQuestion('I would like to speak with a human support agent')}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50/50 transition-all flex-shrink-0 shadow-sm"
              >
                Request Human Support Agent
              </button>
            </div>

            {/* Input & Send Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="p-3.5 bg-white border-t border-slate-200/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Gold Visa Card linking, account upgrade rules, or speak to an agent..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="px-5 py-3 gradient-primary text-white font-bold text-xs rounded-2xl shadow-md hover:opacity-95 transition-all disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Right Column: Guidance & Direct Contacts */}
          <div className="space-y-6">
            {/* Card Linking Rules Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-display font-bold text-sm">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Gold Visa Card Rules</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Card Link Prerequisite</span>
                  </div>
                  <p className="text-[11px] text-emerald-900">
                    Account tier upgrades are strictly locked until an official Gold Visa Card is linked to your profile.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                    <span>Card Arrival Action</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Once received in the mail, email a photo of the card + Customer ID to{' '}
                    <strong className="text-slate-800">support@greendotbanking.com</strong> with your initial load amount.
                  </p>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Human Support Guarantee</span>
                  </div>
                  <p className="text-[11px] text-blue-900">
                    Need live assistance? Request human support anytime. Our compliance specialists reply within 2 hours with an email confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Bank Contacts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900">
                Official Support Channels
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Card Activation Email</div>
                    <div className="font-bold text-slate-800 font-mono text-[11px] truncate">
                      support@greendotbanking.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Toll-Free Phone</div>
                    <div className="font-bold text-slate-800 font-mono text-[11px]">
                      {state.appSettings.support_phone || '1-800-GREENDOT'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Your Customer ID</div>
                    <div className="font-bold text-emerald-800 font-mono text-xs">
                      {currentUser?.customerId || 'CUST-38910'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FORMAL SUPPORT TICKETS */}
      {activeView === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Tickets List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900">Your Support Tickets</h3>
              <button
                onClick={() => setIsCreatingTicket(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Open New Ticket</span>
              </button>
            </div>

            {conventionalTickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
                <MessageSquare className="w-12 h-12 text-emerald-600 mx-auto opacity-40" />
                <h4 className="font-bold text-sm text-slate-800">No Formal Tickets</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  For immediate answers, use the AI Live Assistant above, or open a formal ticket here for underwriting inquiries.
                </p>
                <button
                  onClick={() => setIsCreatingTicket(true)}
                  className="px-4 py-2 gradient-primary text-white font-bold text-xs rounded-xl shadow"
                >
                  Create First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {conventionalTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {t.id}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'pending_human'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : t.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.status === 'pending_human'
                            ? 'Pending Human Reply'
                            : t.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 truncate">{t.subject}</h4>
                      <p className="text-xs text-slate-500 truncate">{t.message}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] text-slate-400">{formatDate(t.createdAt)}</div>
                      <div className="text-xs font-bold text-emerald-700 mt-1">
                        {t.replies?.length || 0} replies &rarr;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Support Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900">
                Ticket Resolution Policies
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tickets opened through this queue are reviewed by certified bank compliance officers. Standard response time is within 2 hours during normal market clearing hours.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Email Notifications Enabled</div>
                <div>All ticket status updates trigger automated dispatch to {currentUser?.email}.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Ticket */}
      {isCreatingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">Open Support Ticket</h3>
              <button
                onClick={() => setIsCreatingTicket(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Inquiry Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-emerald-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Gold Visa Card">Gold Visa Card Linking &amp; Activation</option>
                  <option value="Account Upgrade">Account Tier Upgrade Review</option>
                  <option value="Wire Transfers">Wire Transfers &amp; Clearing</option>
                  <option value="Security & Locking">Security &amp; Account Protection</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Requesting manual activation for Gold Visa Card"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide your inquiry details, Customer ID, or card photo confirmation..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 gradient-primary text-white font-bold rounded-xl shadow"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Ticket Thread */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-700 font-bold">
                    {selectedTicket.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      selectedTicket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedTicket.status === 'pending_human'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedTicket.status === 'pending_human'
                      ? 'Pending Human Reply'
                      : selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
                  {selectedTicket.subject}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Opened {formatDate(selectedTicket.createdAt)}
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Initial message */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <div className="font-bold text-slate-800">
                {selectedTicket.userName || 'Customer'} (You)
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{selectedTicket.message}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                {formatDate(selectedTicket.createdAt)}
              </div>
            </div>

            {/* Replies thread */}
            <div className="space-y-3">
              {selectedTicket.replies?.map((rep, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-xs space-y-1 ${
                    rep.sender === 'support'
                      ? 'bg-emerald-50/70 border-emerald-200 ml-4'
                      : rep.sender === 'ai'
                      ? 'bg-blue-50/70 border-blue-200 ml-4'
                      : 'bg-slate-50 border-slate-200 mr-4'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {rep.sender === 'support' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {rep.sender === 'ai' && <Bot className="w-3.5 h-3.5 text-blue-600" />}
                      {rep.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(rep.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{rep.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            {selectedTicket.status !== 'resolved' ? (
              <form onSubmit={handleReplyTicket} className="space-y-2 pt-2 border-t border-slate-100">
                <textarea
                  required
                  rows={2}
                  placeholder="Type your reply to concierge support..."
                  value={ticketReplyText}
                  onChange={(e) => setTicketReplyText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 gradient-primary text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-bold">
                ✓ This support ticket has been marked as resolved by Greendot operations.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
