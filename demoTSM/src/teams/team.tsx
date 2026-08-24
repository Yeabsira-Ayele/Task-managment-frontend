import React from 'react';
import { teamMembers, type TeamMember } from './teamData';
import Heading from '../components/common/Heading';

// Reusable internal Sub-component for individual cards
function TeamMemberCard({ member }: { member: TeamMember }) {
  const completionRate = member.tasks.total > 0 
    ? Math.round((member.tasks.done / member.tasks.total) * 100) 
    : 0;

  const isOnline = member.status === 'online';

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div>
        {/* Header Block */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar & Status dot */}
            <div 
              className="relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: member.color }}
            >
              {member.initials}
              <span className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
            </div>
            
            {/* Profile Info */}
            <div className="text-left">
              <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{member.role}</p>
              <p className="text-xs text-slate-400">{member.email}</p>
            </div>
          </div>
          
          <button className="text-slate-300 hover:text-slate-500 text-xs font-bold tracking-widest" aria-label="Options">
            •••
          </button>
        </div>

        {/* Stats Section */}
        <div className="flex gap-2.5 mb-6">
          <div className="flex-1 rounded-xl bg-slate-50 py-3 text-center">
            <div className="text-lg font-bold text-slate-800">{member.tasks.total}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Total</div>
          </div>
          <div className={`flex-1 rounded-xl bg-slate-50 py-3 text-center ${member.tasks.done === 0 ? 'opacity-40' : ''}`}>
            <div className="text-lg font-bold text-slate-800">{member.tasks.done}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Done</div>
          </div>
          <div className="flex-1 rounded-xl bg-slate-50 py-3 text-center">
            <div className="text-lg font-bold text-slate-800">{member.tasks.active}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">Active</div>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span>Completion rate</span>
            <span className="font-bold text-slate-800">{completionRate}%</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 rounded-full" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Block */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className={`flex items-center gap-2 text-xs font-semibold ${
          isOnline ? 'text-emerald-500' : 'text-slate-500'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </div>
        <a 
          href="#tasks" 
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View tasks →
        </a>
      </div>
    </div>
  );
}

export default function Teams() {
  // Dynamically count current online and offline states from the data file
  const onlineCount = teamMembers.filter(m => m.status === 'online').length;
  const offlineCount = teamMembers.filter(m => m.status === 'offline').length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Dynamic content rendering using template literals */}
      <Heading 
        title="Teams" 
        content={`${onlineCount} Online • ${offlineCount} Offline`} 
      />
      
      <div className="mx-auto mt-6 grid max-w-7xl gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

