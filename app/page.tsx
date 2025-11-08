'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Calendar, Clock, Users, MessageSquare, Sparkles, Plus, X, Upload } from 'lucide-react';

// Types
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
}

interface ConnectedCalendar {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'custom';
  color: string;
  events: CalendarEvent[];
}

const AISchedulingPlatform: React.FC = () => {
  // State Management
  const [isRecording, setIsRecording] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hi! I'm your AI scheduling assistant. Connect your calendars on the right, and I'll help you find the perfect meeting times. What would you like to schedule?",
      timestamp: new Date()
    }
  ]);
  const [calendars, setCalendars] = useState<ConnectedCalendar[]>([]);
  const [showAddCalendar, setShowAddCalendar] = useState(false);
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calendar providers
  const calendarProviders = [
    { type: 'google' as const, name: 'Google Calendar', color: 'bg-blue-500' },
    { type: 'outlook' as const, name: 'Outlook Calendar', color: 'bg-cyan-500' },
    { type: 'apple' as const, name: 'Apple Calendar', color: 'bg-gray-500' },
    { type: 'custom' as const, name: 'Custom Calendar', color: 'bg-purple-500' }
  ];

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Voice Recording
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const voiceInput = "Schedule a 1-hour meeting with the team next week";
        setUserInput(voiceInput);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      if (calendars.length === 0) {
        response = "I notice you haven't connected any calendars yet. Please add your calendars on the right so I can help you find available time slots. You can connect Google Calendar, Outlook, Apple Calendar, or add a custom calendar.";
      } else {
        response = `I've analyzed your ${calendars.length} connected calendar(s). Looking at your schedule, I found these optimal time slots:\n\n• Wednesday, Nov 13 at 2:00 PM - 3:00 PM (95% quality score)\n• Thursday, Nov 14 at 10:00 AM - 11:00 AM (90% quality score)\n• Friday, Nov 15 at 3:00 PM - 4:00 PM (85% quality score)\n\nThese times avoid all conflicts and fall within business hours. Which slot works best for you?`;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add Calendar
  const handleAddCalendar = (type: 'google' | 'outlook' | 'apple' | 'custom') => {
    const provider = calendarProviders.find(p => p.type === type);
    if (!provider) return;

    // Mock events for demo
    const mockEvents: CalendarEvent[] = [
      {
        id: `${type}-1`,
        title: 'Team Standup',
        start: '2025-11-11T09:00',
        end: '2025-11-11T09:30',
        color: provider.color
      },
      {
        id: `${type}-2`,
        title: 'Client Meeting',
        start: '2025-11-12T14:00',
        end: '2025-11-12T15:00',
        color: provider.color
      },
      {
        id: `${type}-3`,
        title: 'Project Review',
        start: '2025-11-13T10:00',
        end: '2025-11-13T11:30',
        color: provider.color
      }
    ];

    const newCalendar: ConnectedCalendar = {
      id: Date.now().toString(),
      name: provider.name,
      type,
      color: provider.color,
      events: mockEvents
    };

    setCalendars(prev => [...prev, newCalendar]);
    setShowAddCalendar(false);

    // Add system message
    const systemMsg: Message = {
      id: Date.now().toString(),
      sender: 'assistant',
      text: `Great! I've connected your ${provider.name}. I can now see ${mockEvents.length} events and help you schedule around them.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  // Remove Calendar
  const handleRemoveCalendar = (id: string) => {
    setCalendars(prev => prev.filter(cal => cal.id !== id));
  };

  // Get all events from all calendars
  const allEvents = calendars.flatMap(cal => cal.events);

  // Generate week view time slots
  const generateWeekView = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM
    
    return { days, hours };
  };

  const { days, hours } = generateWeekView();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Scheduler
                </h1>
                <p className="text-xs text-slate-400">Voice-First AI Scheduling Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{calendars.length} Calendar{calendars.length !== 1 ? 's' : ''} Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Side - Chat Interface */}
          <div className="w-1/2 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                  <p className="text-xs text-slate-400">Powered by Gemini AI</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs">
                          🤖
                        </div>
                        <span className="text-xs text-slate-400">AI Assistant</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-linear-to-r from-purple-500 to-pink-500'
                        : 'bg-slate-800 border border-slate-700'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                    <div className={`text-xs text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-xl transition-all shrink-0 ${
                    isRecording
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use voice..."
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Calendar Management */}
          <div className="w-1/2 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Calendar Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold">Your Calendars</h2>
                </div>
                <button
                  onClick={() => setShowAddCalendar(!showAddCalendar)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Calendar
                </button>
              </div>

              {/* Add Calendar Panel */}
              {showAddCalendar && (
                <div className="mt-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400 mb-3">Select a calendar provider:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {calendarProviders.map((provider) => (
                      <button
                        key={provider.type}
                        onClick={() => handleAddCalendar(provider.type)}
                        className="flex items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-purple-500 transition-all"
                      >
                        <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                        <span className="text-sm">{provider.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Connected Calendars List */}
            {calendars.length > 0 && (
              <div className="p-4 border-b border-slate-700/50">
                <p className="text-xs text-slate-400 mb-2">Connected:</p>
                <div className="flex flex-wrap gap-2">
                  {calendars.map((cal) => (
                    <div key={cal.id} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                      <div className={`w-2 h-2 rounded-full ${cal.color}`} />
                      <span className="text-sm">{cal.name}</span>
                      <button
                        onClick={() => handleRemoveCalendar(cal.id)}
                        className="ml-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar View */}
            <div className="flex-1 overflow-auto p-4">
              {calendars.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-lg font-semibold mb-2">No Calendars Connected</h3>
                    <p className="text-sm text-slate-400 mb-4">Add your calendars to get started</p>
                    <button
                      onClick={() => setShowAddCalendar(true)}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-all"
                    >
                      Add Your First Calendar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Week View Grid */}
                  <div className="bg-slate-800/30 rounded-xl p-4 overflow-x-auto">
                    <div className="min-w-[600px]">
                      {/* Days Header */}
                      <div className="grid grid-cols-6 gap-2 mb-2">
                        <div className="text-xs text-slate-500 font-medium">Time</div>
                        {days.map((day) => (
                          <div key={day} className="text-xs text-slate-400 font-medium text-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Time Slots */}
                      {hours.map((hour) => (
                        <div key={hour} className="grid grid-cols-6 gap-2 mb-1">
                          <div className="text-xs text-slate-500 py-2">
                            {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                          </div>
                          {days.map((day, dayIndex) => {
                            const hasEvent = allEvents.some(event => {
                              const eventHour = new Date(event.start).getHours();
                              return eventHour === hour;
                            });
                            
                            return (
                              <div
                                key={`${day}-${hour}`}
                                className={`py-2 px-2 rounded border ${
                                  hasEvent
                                    ? 'bg-purple-500/20 border-purple-500/50'
                                    : 'bg-slate-800/50 border-slate-700/30'
                                } hover:border-purple-500/50 transition-colors cursor-pointer`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
                    <div className="space-y-2">
                      {allEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                          <div className={`w-3 h-3 rounded-full ${event.color}`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{event.title}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(event.start).toLocaleString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <Clock className="w-4 h-4 text-slate-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISchedulingPlatform;