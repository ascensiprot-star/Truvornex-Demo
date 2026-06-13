import { useState } from 'react';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('Services');

    const categories = ['Services', 'Restaurants', 'Jobs', 'Events', 'Housing'];

    const nearbyProviders = [
        {
            id: 1,
            name: "Marcus V.",
            role: "Private Concierge",
            image: "https://lh3.googleusercontent.com/aida/AP1WRLtKLjXiejGW1uf_djtSf9lbE1oPYBI5bCEW21bV4pirU74SqPFGrksmZCZj56RwhbtZ943NrCA8MkcA3B-cs6_16mdxnDtXj42Hce_0yr-yLl-SEyMN75ntIrMm7Z58KO4EAxEv2zGdRxnSpTfK5IP8LrrJSQP2KijE5Cr9fygjn4W0Hf6rs1KwJXW4zq1nacu41KLTFXDHl8fVnmZakAypLowQIMmw8xCrqqqMLeUJHvd3gx4qagQwvjs",
            statusColor: "bg-green-500"
        },
        {
            id: 2,
            name: "Elena Rose",
            role: "Personal Chef",
            image: "https://lh3.googleusercontent.com/aida/AP1WRLsOo0klgBxwqK-xiF3EEKFwTdkfWlO18DsDlkaQBXFJQbC0-aNjQe0TRkGuszMmFz0R_rnRGty0tSrrBlzWehqMo4zqJw3NCPS2LZtB-YP1l2X9V390ZF7odwjXOkaNLtWeFIinWk6yQxZ3B6UGBu0v5-xsgVpA24ne6A5Y3A3M5Tjyk9OnI49t2pPZNZvqEd-bYESPgRe3RKFxeykXvWV0amQx7ebqdRzGqsSB_bvLYZWKjWJzyWrYrdY",
            statusColor: "bg-green-500"
        },
        {
            id: 3,
            name: "David Chen",
            role: "Wellness Lead",
            image: "https://lh3.googleusercontent.com/aida/AP1WRLuMaSQQ_BTdVrtUH3nGy7FbeIBKE2JSzqp0pdOmF2i05-zokgH07BJ3yEcG-Muj18pyJ9RdAVyi9cxu9psJE9WP8n8VVl-mpDX12eDbunmg5GhIFsIwx2_gX-JW0uuPmxcpN0deLxBdxDLjvkhaB3ZZeFieAYdHyuzgdUb2NuJJrWZpB9j8i9datk4NdF8vgxf3KUBaobNsIVPBVaBJ9eq8Otv_k25XgPsfCCxEfOtt8uuec056MDT_Kco",
            statusColor: "bg-gray-500"
        },
        {
            id: 4,
            name: "Sarah K.",
            role: "Estate Mgmt",
            image: "https://lh3.googleusercontent.com/aida/AP1WRLta-JWh1gvJWxKtvPBYJ45ZBqSqwwBAdhuP2SOoWKwu6sHZ8bPi8DymBe0_Zv07rVoet4K6jIc3yr7br7kQ8_a-FupcwSulyL5JRE0B1H_qYrwyp2zZGJxHEhFOpUIG0wbR0B_Gdl2JQPgBgvbMYnfYljLj1u07LKbYhQ9cLyANyWNYFUrn_dX-1wAM4chst9lN_YW2pydL0VEA8O_sljkbW0hGXUJWQMwM4BogZYB7zTXiQLpgf3uQHEg",
            statusColor: "bg-green-500"
        }
    ];

    const upcomingEvents = [
        {
            id: 1,
            title: "Jazz Underground",
            location: "The Vanguard • 21:00",
            month: "OCT",
            day: "12",
            isPrimary: true,
            plusCount: 24,
            avatars: ["bg-gray-500", "bg-gray-400", "bg-gray-300"]
        },
        {
            id: 2,
            title: "Digital Art Expo",
            location: "MoMA Annex • 10:00",
            month: "OCT",
            day: "15",
            isPrimary: false,
            plusCount: 82,
            avatars: ["bg-gray-500", "bg-gray-400"]
        },
        {
            id: 3,
            title: "Chef's Table: Noir",
            location: "Private Atelier • 19:30",
            month: "OCT",
            day: "18",
            isPrimary: false,
            plusCount: 4,
            avatars: ["bg-gray-500"]
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="mb-xl">
                <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-lg">
                    Discover New York
                </h2>
                <div className="relative w-full max-w-2xl">
                    <input 
                        className="w-full h-14 bg-surface-container-high border-subtle rounded-lg px-12 text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all duration-200" 
                        placeholder="Search services, tables, or events..." 
                        type="text" 
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">tune</span>
                </div>
            </section>

            {/* Category Pills */}
            <section className="mb-xl overflow-x-auto no-scrollbar flex gap-sm py-2">
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all duration-200 active:scale-95 ${
                            activeCategory === category 
                                ? 'bg-primary text-on-primary' 
                                : 'bg-surface-container-high border-subtle text-on-surface-variant hover:text-primary'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </section>

            {/* Nearby Services */}
            <section className="mb-xl">
                <div className="flex justify-between items-end mb-md">
                    <h3 className="font-headline-md text-headline-md text-primary">Nearby Services</h3>
                    <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">SEE ALL</a>
                </div>
                <div className="flex gap-md overflow-x-auto no-scrollbar pb-4">
                    {nearbyProviders.map(provider => (
                        <div key={provider.id} className="min-w-[160px] p-md bg-surface-container-low border-subtle rounded-xl flex flex-col items-center text-center hover:bg-surface-container transition-colors cursor-pointer group">
                            <div className="relative mb-sm">
                                <img 
                                    alt={provider.name} 
                                    src={provider.image} 
                                    className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                                <span className={`absolute bottom-0 right-0 w-4 h-4 ${provider.statusColor} border-2 border-surface-container-low rounded-full`}></span>
                            </div>
                            <p className="font-label-md text-label-md text-primary truncate w-full">{provider.name}</p>
                            <p className="font-body-sm text-[12px] text-on-surface-variant">{provider.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Providers */}
            <section className="mb-xl">
                <h3 className="font-headline-md text-headline-md text-primary mb-md">Featured Providers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    {/* Large Card 1 */}
                    <div className="group relative aspect-[4/5] md:aspect-video rounded-xl overflow-hidden border-subtle cursor-pointer">
                        <img 
                            alt="The Obsidian Room" 
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-500" 
                            src="https://lh3.googleusercontent.com/aida/AP1WRLsraC2w5dcUTZ0k7G0BIh_8efDlhNowjVfXg1m1h7-bbz3gOjHsUYy7f-T3OPV9B-acw9WeCLXh2w36BNQXBU-cYTuGNJaThZ1VZGF_gX8m2PfVb0IbFT9wTmBCvREXTMNI4sNKkXdKFQfKsVaQYy8iKm3ADGA_d56j02uNafPVQ-ylEKiEmOZMTCvsBsj84SdkjhgBUwGowqmn6oSPc_Me8XIJDP33OJEzrGwlA7k26HDAp_dOhi3vX9Q" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                        <div className="absolute bottom-0 p-lg w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-1 rounded mb-sm inline-block">PREMIUM SELECTION</span>
                                    <h4 className="font-headline-lg text-headline-lg text-primary">The Obsidian Room</h4>
                                    <p className="font-body-sm text-on-surface-variant">Upper East Side • 0.4 miles away</p>
                                </div>
                                <div className="flex items-center gap-1 bg-surface/80 backdrop-blur px-3 py-1 rounded-full border-subtle">
                                    <span className="material-symbols-outlined text-primary text-[16px]">star</span>
                                    <span className="font-label-md text-label-md text-primary">4.9</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Large Card 2 */}
                    <div className="group relative aspect-[4/5] md:aspect-video rounded-xl overflow-hidden border-subtle cursor-pointer">
                        <img 
                            alt="Linear Coffee Co." 
                            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-500" 
                            src="https://lh3.googleusercontent.com/aida/AP1WRLsK_ZV-nrvb-Omfq1YSC7KZeBFnwS9yUa856iMOKJB6uyZRQFnG6xknFNE2q4e7rXy_1lURKdAaJ-sYbGbLPSLxtjkTbLZDU0C86YxC7zo9hqLQ1L7Aak4RpE7lgR59brZVXMw5dmzXOCNL92453KMbggUMo86U6NK9GG5OZXD9oKVxDgIYLZV9Bb2_Dn0EpuQJUjvS1n92QPkBg7QxQ7GtgJlCmtGIeFQO5JvFHWmQ-ZvziOd8diAAcAg" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                        <div className="absolute bottom-0 p-lg w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2 py-1 rounded mb-sm inline-block">NEW ARRIVAL</span>
                                    <h4 className="font-headline-lg text-headline-lg text-primary">Linear Coffee Co.</h4>
                                    <p className="font-body-sm text-on-surface-variant">Chelsea • 1.2 miles away</p>
                                </div>
                                <div className="flex items-center gap-1 bg-surface/80 backdrop-blur px-3 py-1 rounded-full border-subtle">
                                    <span className="material-symbols-outlined text-primary text-[16px]">star</span>
                                    <span className="font-label-md text-label-md text-primary">4.7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Strip */}
            <section className="mb-xl">
                <h3 className="font-headline-md text-headline-md text-primary mb-md">Upcoming Events</h3>
                <div className="flex gap-md overflow-x-auto no-scrollbar pb-2">
                    {upcomingEvents.map(event => (
                        <div key={event.id} className="min-w-[280px] bg-surface-container border-subtle rounded-xl p-md flex items-center gap-md hover:bg-surface-container-high transition-colors cursor-pointer">
                            <div className={`w-16 h-20 flex flex-col items-center justify-center rounded-lg shrink-0 ${event.isPrimary ? 'bg-primary text-on-primary' : 'bg-surface-container-highest border border-subtle text-primary'}`}>
                                <span className="font-label-sm text-label-sm">{event.month}</span>
                                <span className="font-headline-md text-headline-md font-bold">{event.day}</span>
                            </div>
                            <div>
                                <h5 className="font-label-md text-label-md text-primary mb-xs">{event.title}</h5>
                                <p className="font-body-sm text-[12px] text-on-surface-variant">{event.location}</p>
                                <div className="mt-2 flex -space-x-2">
                                    {event.avatars.map((avatar, index) => (
                                        <div key={index} className={`w-6 h-6 rounded-full border border-surface ${avatar}`}></div>
                                    ))}
                                    <span className="pl-4 font-label-sm text-label-sm text-on-surface-variant">+{event.plusCount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}