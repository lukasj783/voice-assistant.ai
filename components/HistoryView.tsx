
import React, { useState } from 'react';
import { ConversationHistory } from '../types';

const HistoryView: React.FC = () => {
  const [history] = useState<ConversationHistory[]>([
    {
      id: '1',
      title: 'Recipe for Italian Pasta',
      date: 'Today, 2:15 PM',
      isPinned: true,
      messages: []
    },
    {
      id: '2',
      title: 'Workout Routine Planning',
      date: 'Yesterday, 10:45 AM',
      isPinned: false,
      messages: []
    },
    {
      id: '3',
      title: 'Quantum Physics Discussion',
      date: 'Oct 24, 2024',
      isPinned: false,
      messages: []
    }
  ]);

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-sky-400">Recent Sessions</h2>
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" placeholder="Search sessions..." 
            className="bg-transparent border-none focus:ring-0 text-sm p-1 ml-2 text-slate-200"
          />
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto">
        {history.map(item => (
          <div 
            key={item.id}
            className="group flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                {item.isPinned ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                )}
              </div>
              <div>
                <h3 className="font-medium text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:text-sky-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg></button>
              <button className="p-1 hover:text-red-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
