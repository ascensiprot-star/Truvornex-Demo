import React, { useState } from "react";
import { Search } from "lucide-react";

export function Editorial() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const categories = [
    { name: "Cleaning", colSpan: 2, rowSpan: 1 },
    { name: "Plumbing", colSpan: 1, rowSpan: 2 },
    { name: "Electrical", colSpan: 1, rowSpan: 1 },
    { name: "Moving", colSpan: 2, rowSpan: 2 },
    { name: "Beauty", colSpan: 1, rowSpan: 1 },
    { name: "Personal Chef", colSpan: 1, rowSpan: 1 },
    { name: "Fitness", colSpan: 1, rowSpan: 1 },
    { name: "Tutoring", colSpan: 2, rowSpan: 1 },
    { name: "Pet Care", colSpan: 1, rowSpan: 1 },
    { name: "Photography", colSpan: 1, rowSpan: 2 },
    { name: "Tech Support", colSpan: 2, rowSpan: 1 },
    { name: "Gardening", colSpan: 1, rowSpan: 1 },
  ];

  return (
    <div
      className={`flex h-[900px] w-[1280px] overflow-hidden ${
        isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-white text-black"
      }`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Sidebar */}
      <div
        className={`w-[220px] flex flex-col justify-between p-8 border-r ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tighter mb-12 uppercase">
            Truvornex
          </h1>
          <nav className="flex flex-col gap-4 text-[13px] tracking-wide">
            <a href="#" className="font-semibold underline underline-offset-4 decoration-1">
              Home
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              Explore
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              Simon AI
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              Spending
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              Profile
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              Messages
            </a>
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
              Saved
            </a>
          </nav>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-left text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto">
          {/* Header/Search */}
          <div className="flex items-center gap-4 mb-16">
            <Search className="w-5 h-5 opacity-50" />
            <input
              type="text"
              placeholder="What do you need done today?"
              className={`flex-1 bg-transparent text-lg placeholder-opacity-40 outline-none pb-2 border-b ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            />
          </div>

          {/* Hero */}
          <div className="mb-20">
            <h2 className="text-[72px] font-bold leading-[0.95] tracking-tighter mb-8">
              Expert care for <br />
              your neighborhood.
            </h2>
            <button className="text-sm uppercase tracking-widest font-semibold border-b border-current pb-1">
              Book a Service
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-8 mb-20">
            {[
              { num: "2,400+", label: "Providers" },
              { num: "98%", label: "Satisfaction" },
              { num: "15K+", label: "Jobs Completed" },
              { num: "4.9★", label: "Average Rating" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`pt-4 border-t ${
                  isDarkMode ? "border-white" : "border-black"
                }`}
              >
                <div className="text-3xl font-bold tracking-tight mb-1">
                  {stat.num}
                </div>
                <div className="text-[11px] uppercase tracking-widest opacity-60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="mb-20">
            <h3 className="text-[11px] uppercase tracking-[0.2em] mb-8 opacity-60">
              Select Category
            </h3>
            <div className="grid grid-cols-4 gap-4 auto-rows-[80px]">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  className={`p-4 flex items-end cursor-pointer group ${
                    isDarkMode ? "bg-gray-900" : "bg-gray-100"
                  }`}
                  style={{
                    gridColumn: \`span \${cat.colSpan}\`,
                    gridRow: \`span \${cat.rowSpan}\`,
                  }}
                >
                  <span className="text-lg font-medium tracking-tight border-b border-transparent group-hover:border-current transition-colors">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] mb-8 opacity-60">
              Local Events
            </h3>
            <div className="flex flex-col gap-6">
              {[
                { date: "Oct 12", title: "Block Party Cleanup", location: "Downtown Square" },
                { date: "Oct 15", title: "Community Gardening Day", location: "Westside Park" },
                { date: "Oct 20", title: "Tech Repair Workshop", location: "City Library" },
              ].map((event, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between pb-6 border-b ${
                    isDarkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <div className="text-[13px] uppercase tracking-widest opacity-60 w-16">
                      {event.date}
                    </div>
                    <div className="text-xl font-medium tracking-tight">
                      {event.title}
                    </div>
                  </div>
                  <div className="text-sm opacity-60">{event.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
