import React from 'react';
import { 
  Home, Compass, Cpu, Wallet, User, MessageSquare, Bookmark, Moon, 
  Search, Sparkles, Droplets, Wrench, Zap, Truck, Scissors, ChefHat, 
  Dumbbell, GraduationCap, Dog, Camera, Monitor, Sprout, ChevronRight,
  ArrowRight
} from 'lucide-react';

export function ArcLinear() {
  return (
    <div 
      className="flex h-[900px] w-[1280px] overflow-hidden text-[#ededed] selection:bg-[#ededed] selection:text-[#0a0a0a]"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#0a0a0a'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Sidebar */}
      <div 
        className="flex flex-col w-[220px] shrink-0 border-r"
        style={{ backgroundColor: '#0d0d0d', borderColor: '#1e1e1e' }}
      >
        <div className="flex items-center h-14 px-6 border-b" style={{ borderColor: '#1e1e1e' }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#ededed]" />
            <span className="font-semibold text-sm tracking-tight uppercase">Truvornex</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8 hide-scrollbar">
          <NavGroup title="Main">
            <NavItem icon={<Home size={14} />} label="Home" active />
            <NavItem icon={<Compass size={14} />} label="Explore" />
            <NavItem icon={<Cpu size={14} />} label="Simon AI" />
          </NavGroup>

          <NavGroup title="Personal">
            <NavItem icon={<Wallet size={14} />} label="Spending" />
            <NavItem icon={<User size={14} />} label="Profile" />
            <NavItem icon={<MessageSquare size={14} />} label="Messages" />
            <NavItem icon={<Bookmark size={14} />} label="Saved" />
          </NavGroup>
        </div>

        <div className="p-4 border-t" style={{ borderColor: '#1e1e1e' }}>
          <button className="flex items-center justify-between w-full px-2 py-2 text-[#888888] hover:text-[#ededed] transition-colors group">
            <span className="text-[10px] uppercase tracking-[0.1em] font-medium">Theme</span>
            <Moon size={14} className="group-hover:text-[#ededed]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <div className="flex items-center justify-between h-14 px-8 border-b shrink-0 z-10 bg-[#0a0a0a]" style={{ borderColor: '#1e1e1e' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input 
                type="text" 
                placeholder="Search services, providers..." 
                className="h-8 w-64 bg-[#141414] border border-[#1e1e1e] rounded-full pl-9 pr-4 text-xs focus:outline-none focus:border-[#444] transition-colors placeholder:text-[#555]"
              />
            </div>
            <div className="flex items-center gap-2">
              {['Cleaning', 'Plumbing', 'Moving'].map(chip => (
                <button key={chip} className="h-8 px-3 rounded-full border border-[#1e1e1e] text-[11px] font-medium text-[#888888] hover:text-[#ededed] hover:border-[#333] transition-colors">
                  {chip}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded bg-[#ededed] text-[#0a0a0a] hover:bg-white transition-colors">
               <Sparkles size={14} />
               <span>Book Now</span>
             </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-12 py-16 hide-scrollbar">
          <div className="max-w-5xl mx-auto flex flex-col gap-16">
            
            {/* Hero */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-medium">System Status: Online</span>
                <h1 className="text-5xl font-medium tracking-tight leading-none">
                  Neighborhood Services.<br/>
                  <span className="text-[#555]">Operating System.</span>
                </h1>
              </div>
              <p className="text-[#888888] text-sm max-w-md leading-relaxed">
                High-performance marketplace for local professionals. Verified providers, guaranteed execution, seamless transactions.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-px bg-[#1e1e1e]">
              <Stat value="2,400+" label="Providers" />
              <Stat value="98%" label="Satisfaction" />
              <Stat value="15K+" label="Jobs Completed" />
              <Stat value="4.9" label="Average Rating" />
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-[0.1em] font-medium text-[#888888]">Service Modules</h2>
                <button className="text-[10px] uppercase tracking-wider text-[#555] hover:text-[#ededed] flex items-center gap-1 transition-colors">
                  View Directory <ArrowRight size={10} />
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-px bg-[#1e1e1e]">
                <Category icon={<Droplets size={20} strokeWidth={1.5} />} label="Cleaning" />
                <Category icon={<Wrench size={20} strokeWidth={1.5} />} label="Plumbing" />
                <Category icon={<Zap size={20} strokeWidth={1.5} />} label="Electrical" />
                <Category icon={<Truck size={20} strokeWidth={1.5} />} label="Moving" />
                <Category icon={<Scissors size={20} strokeWidth={1.5} />} label="Beauty" />
                <Category icon={<ChefHat size={20} strokeWidth={1.5} />} label="Personal Chef" />
                <Category icon={<Dumbbell size={20} strokeWidth={1.5} />} label="Fitness" />
                <Category icon={<GraduationCap size={20} strokeWidth={1.5} />} label="Tutoring" />
                <Category icon={<Dog size={20} strokeWidth={1.5} />} label="Pet Care" />
                <Category icon={<Camera size={20} strokeWidth={1.5} />} label="Photography" />
                <Category icon={<Monitor size={20} strokeWidth={1.5} />} label="Tech Support" />
                <Category icon={<Sprout size={20} strokeWidth={1.5} />} label="Gardening" />
              </div>
            </div>

            {/* Events */}
            <div className="flex flex-col gap-6 pb-16">
               <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-[0.1em] font-medium text-[#888888]">Upcoming Local Events</h2>
              </div>
              
              <div className="flex flex-col border border-[#1e1e1e]">
                <EventRow 
                  date="OCT 24" 
                  title="Neighborhood Block Party & Service Expo" 
                  location="Central Park Pavilion" 
                  status="REGISTERING" 
                />
                <EventRow 
                  date="OCT 28" 
                  title="Home Maintenance Workshop" 
                  location="Community Center" 
                  status="WAITLIST" 
                />
                <EventRow 
                  date="NOV 02" 
                  title="Culinary Showcase: Local Chefs" 
                  location="Downtown Market" 
                  status="OPEN" 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function NavGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#555] font-medium px-2">
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`
      flex items-center gap-3 px-2 py-1.5 text-xs font-medium tracking-wide uppercase transition-all
      ${active 
        ? 'text-[#ededed] border-l-2 border-[#ededed] bg-[#141414]' 
        : 'text-[#888888] hover:text-[#ededed] border-l-2 border-transparent hover:bg-[#111] hover:border-[#333]'
      }
    `}>
      <span className={active ? 'text-[#ededed]' : 'text-[#555]'}>{icon}</span>
      {label}
    </button>
  );
}

function Stat({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col gap-2 bg-[#0a0a0a] p-6 justify-center">
      <div className="text-3xl font-medium tracking-tight text-[#ededed]">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.15em] text-[#555] font-medium">{label}</div>
    </div>
  );
}

function Category({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] aspect-square group hover:bg-[#0f0f0f] transition-colors cursor-pointer relative overflow-hidden">
      <div className="text-[#555] group-hover:text-[#ededed] group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[#888888] group-hover:text-[#ededed] font-medium transition-colors">
        {label}
      </div>
      <div className="absolute inset-0 border border-transparent group-hover:border-[#333] pointer-events-none transition-colors" />
    </button>
  );
}

function EventRow({ date, title, location, status }: { date: string, title: string, location: string, status: string }) {
  return (
    <div className="flex items-center p-4 border-b border-[#1e1e1e] last:border-b-0 hover:bg-[#111] transition-colors group cursor-pointer text-sm">
      <div className="w-24 text-[11px] uppercase tracking-[0.1em] text-[#555] font-medium group-hover:text-[#888]">
        {date}
      </div>
      <div className="flex-1 text-[#ededed] font-medium">
        {title}
      </div>
      <div className="w-48 text-[#888888] text-xs">
        {location}
      </div>
      <div className="w-24 flex justify-end">
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-[#141414] border border-[#1e1e1e] font-medium
          ${status === 'OPEN' ? 'text-green-400' : ''}
          ${status === 'WAITLIST' ? 'text-yellow-400' : ''}
          ${status === 'REGISTERING' ? 'text-[#ededed]' : ''}
        `}>
          {status}
        </span>
      </div>
    </div>
  );
}
