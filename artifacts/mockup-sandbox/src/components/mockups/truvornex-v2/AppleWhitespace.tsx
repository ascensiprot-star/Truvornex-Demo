import React, { useState } from 'react';
import { 
  Home, Compass, Sparkles, CreditCard, User, MessageSquare, 
  Bookmark, Moon, Sun, Search, MapPin, Calendar, Star,
  Droplets, Wrench, Zap, Truck, Scissors, ChefHat, Dumbbell, 
  BookOpen, Dog, Camera, Laptop, Leaf, ArrowRight
} from 'lucide-react';

export function AppleWhitespace() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Compass, label: 'Explore' },
    { icon: Sparkles, label: 'Simon AI' },
    { icon: CreditCard, label: 'Spending' },
    { icon: User, label: 'Profile' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Bookmark, label: 'Saved' },
  ];

  const categories = [
    { icon: Droplets, label: 'Cleaning' },
    { icon: Wrench, label: 'Plumbing' },
    { icon: Zap, label: 'Electrical' },
    { icon: Truck, label: 'Moving' },
    { icon: Scissors, label: 'Beauty' },
    { icon: ChefHat, label: 'Personal Chef' },
    { icon: Dumbbell, label: 'Fitness' },
    { icon: BookOpen, label: 'Tutoring' },
    { icon: Dog, label: 'Pet Care' },
    { icon: Camera, label: 'Photography' },
    { icon: Laptop, label: 'Tech Support' },
    { icon: Leaf, label: 'Gardening' },
  ];

  const stats = [
    { value: '2,400+', label: 'Providers' },
    { value: '98%', label: 'Satisfaction' },
    { value: '15K+', label: 'Jobs Done' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  const events = [
    { title: 'Community Farmers Market', date: 'This Saturday, 9 AM', location: 'Downtown Square' },
    { title: 'Neighborhood Cleanup', date: 'Sunday, 10 AM', location: 'Riverside Park' },
    { title: 'Block Party', date: 'Next Friday, 6 PM', location: 'Elm Street' }
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .aw-container { font-family: 'Inter', sans-serif; }
        .aw-hero-glow {
          position: absolute;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%);
          top: -300px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
        }
        .aw-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .aw-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className={`aw-container flex h-[900px] w-[1280px] overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Sidebar */}
        <aside className={`w-[220px] flex-shrink-0 flex flex-col justify-between py-8 px-4 ${isDarkMode ? 'bg-[#111111]' : 'bg-white border-r border-gray-100'}`}>
          <div>
            <div className="flex items-center gap-3 px-4 mb-12">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                <span className="font-bold text-lg leading-none">T</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">Truvornex</span>
            </div>
            
            <nav className="flex flex-col gap-2">
              {navItems.map((item, i) => (
                <button 
                  key={i}
                  className={`flex items-center gap-3 px-4 py-[12px] text-[15px] transition-colors ${
                    item.active 
                      ? (isDarkMode ? 'text-white border-l-2 border-white bg-white/5 rounded-r-lg' : 'text-black border-l-2 border-black bg-black/5 rounded-r-lg') 
                      : (isDarkMode ? 'text-gray-400 hover:text-white border-l-2 border-transparent' : 'text-gray-500 hover:text-black border-l-2 border-transparent')
                  }`}
                >
                  <item.icon size={18} strokeWidth={item.active ? 2.5 : 2} />
                  <span className={item.active ? 'font-medium' : 'font-normal'}>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="px-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-3 px-4 py-[12px] text-[15px] transition-colors border-l-2 border-transparent w-full ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto hide-scrollbar">
          {isDarkMode && <div className="aw-hero-glow" />}
          
          <div className="max-w-5xl mx-auto px-12 py-16 relative z-10">
            
            {/* Header / Search */}
            <header className="flex justify-between items-center mb-20">
              <div className={`flex items-center w-[480px] h-14 rounded-full px-6 transition-all ${
                isDarkMode ? 'bg-[#1a1a1a] hover:bg-[#222222] border border-white/5' : 'bg-white hover:shadow-md border border-gray-200'
              }`}>
                <Search size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                <input 
                  type="text" 
                  placeholder="What do you need help with?" 
                  className="bg-transparent border-none outline-none w-full ml-4 text-[15px] placeholder:text-gray-500"
                />
              </div>
              
              <div className={`flex items-center gap-4 px-5 py-3 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-[#1a1a1a] text-gray-300 border border-white/5' : 'bg-white text-gray-700 border border-gray-200'
              }`}>
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </header>

            {/* Hero Section */}
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <div className="flex justify-center gap-3 mb-8">
                {['Emergency', 'Same Day', 'Top Rated', 'Affordable'].map((chip, i) => (
                  <span key={i} className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase ${
                    isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {chip}
                  </span>
                ))}
              </div>
              <h1 className="text-[56px] leading-[1.1] font-bold tracking-[-0.03em] mb-6">
                Your neighborhood's <br /> best, <span className={isDarkMode ? 'text-gray-400' : 'text-gray-400'}>on demand.</span>
              </h1>
              <p className={`text-lg max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Book trusted local professionals for cleaning, plumbing, tech support, and everything in between.
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center mb-24">
              <div className={`flex items-center px-12 py-6 rounded-2xl gap-16 ${
                isDarkMode ? 'bg-[#111111] border border-white/5' : 'bg-white shadow-sm border border-gray-100'
              }`}>
                {stats.map((stat, i) => (
                  <div key={i} className="text-center flex flex-col gap-1">
                    <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                    <span className={`text-xs uppercase tracking-wider font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            <div className="mb-24">
              <div className="flex justify-between items-end mb-8 px-2">
                <h2 className="text-2xl font-semibold tracking-tight">Explore Services</h2>
                <button className={`text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  See all <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-6 gap-6">
                {categories.map((cat, i) => (
                  <div 
                    key={i} 
                    className={`aw-card aspect-square rounded-[16px] flex flex-col items-center justify-center gap-4 cursor-pointer ${
                      isDarkMode ? 'bg-[#111111] border border-white/5 hover:border-white/10' : 'bg-white border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <cat.icon size={32} strokeWidth={1.5} />
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Section */}
            <div>
              <div className="flex justify-between items-end mb-8 px-2">
                <h2 className="text-2xl font-semibold tracking-tight">Local Happenings</h2>
                <button className={`text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  More events <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <div 
                    key={i}
                    className={`aw-card rounded-[16px] p-6 cursor-pointer ${
                      isDarkMode ? 'bg-[#111111] border border-white/5' : 'bg-white border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <Calendar size={18} className={isDarkMode ? 'text-white' : 'text-black'} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className={`flex flex-col gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-2"><MapPin size={14} /> {event.location}</span>
                      <span className="flex items-center gap-2"><Calendar size={14} /> {event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
