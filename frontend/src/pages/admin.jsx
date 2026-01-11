import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// The main App component for the admin dashboard.
const App = () => {
    // State to manage the active tab: 'orderDetails' or 'doneOrders'
    const [activeTab, setActiveTab] = useState('orderDetails');

    // Function to set the active tab
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="bg-[#1e1e1e] text-gray-300 antialiased p-4 sm:p-6 lg:p-8 min-h-screen">
            {/* Main Container */}
            <div className="bg-[#2a2a2a] rounded-3xl shadow-2xl p-6 lg:p-8">

                {/* Top Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-8">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <span className="text-3xl lg:text-4xl font-bold text-white">11:02</span>
                        <span className="text-lg text-gray-400">Tuesday, 18 Jan</span>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                        <div className="relative">
                            <select className="bg-[#3e3e3e] border border-[#4e4e4e] text-gray-200 text-sm rounded-xl py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Today</option>
                                <option>Yesterday</option>
                                <option>Tomorrow</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select className="bg-[#3e3e3e] border border-[#4e4e4e] text-gray-200 text-sm rounded-xl py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Now</option>
                                <option>Later</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <div className="relative">
                            <select className="bg-[#3e3e3e] border border-[#4e4e4e] text-gray-200 text-sm rounded-xl py-2 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>1st Floor</option>
                                <option>2nd Floor</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-[1fr_350px] gap-6">

                    {/* Left Section (Tables) */}
                    <section className="bg-[#2a2a2a] p-4 rounded-2xl shadow-inner">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6">
                            {/* Table Cards - These are examples */}
                            <div className="table-card bg-[#3e3e3e] hover:bg-[#5e5e5e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-gray-200">11</span>
                            </div>
                            <div className="table-card bg-[#3e3e3e] hover:bg-[#5e5e5e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-gray-200">2</span>
                            </div>
                            <div className="table-card bg-[#3b666a] hover:bg-[#4b868e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">3</span>
                                <div className="text-xs text-white opacity-70 mt-1">11:00-12:30</div>
                            </div>
                            <div className="table-card bg-[#3e3e3e] hover:bg-[#5e5e5e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-gray-200">4</span>
                            </div>
                            <div className="table-card bg-[#8e6b3b] hover:bg-[#a67d46] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">5</span>
                                <div className="text-xs text-white opacity-70 mt-1">12:15-13:30</div>
                            </div>
                            <div className="table-card bg-[#8e6b3b] hover:bg-[#a67d46] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">6</span>
                                <div className="text-xs text-white opacity-70 mt-1">12:00-15:30</div>
                            </div>
                            <div className="table-card bg-[#8e6b3b] hover:bg-[#a67d46] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">7</span>
                                <div className="text-xs text-white opacity-70 mt-1">12:30-14:30</div>
                            </div>
                            <div className="table-card bg-[#3b666a] hover:bg-[#4b868e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">8</span>
                                <div className="text-xs text-white opacity-70 mt-1">12:30-14:30</div>
                            </div>
                            <div className="table-card bg-[#d49a4a] hover:bg-[#e0b060] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">9</span>
                                <div className="text-xs text-white opacity-70 mt-1">10:30-12:30</div>
                            </div>
                            <div className="table-card bg-[#3b666a] hover:bg-[#4b868e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">10</span>
                                <div className="text-xs text-white opacity-70 mt-1">11:00-12:30</div>
                            </div>
                            <div className="table-card bg-[#8e6b3b] hover:bg-[#a67d46] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">11</span>
                                <div className="text-xs text-white opacity-70 mt-1">15:00-16:30</div>
                            </div>
                            <div className="table-card bg-[#8e6b3b] hover:bg-[#a67d46] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">12</span>
                                <div className="text-xs text-white opacity-70 mt-1">12:30-15:30</div>
                            </div>
                            <div className="table-card bg-[#3b666a] hover:bg-[#4b868e] transition-colors p-4 rounded-2xl text-center cursor-pointer">
                                <span className="text-3xl font-bold text-white">13</span>
                                <div className="text-xs text-white opacity-70 mt-1">13:00-14:30</div>
                            </div>
                            {/* End of Table Cards */}
                        </div>
                    </section>

                    {/* Right Section (Order Details & Done Orders) */}
                    <section className="bg-[#2a2a2a] p-4 rounded-2xl shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Orders</h2>
                            <button className="bg-[#4e4e4e] hover:bg-[#6e6e6e] text-white p-2 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center justify-start gap-2 mb-4 p-1 bg-[#3e3e3e] rounded-xl">
                            <button
                                onClick={() => handleTabClick('orderDetails')}
                                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'orderDetails' ? 'bg-[#5e5e5e] text-white' : 'text-gray-400 hover:bg-[#4e4e4e]'}`}
                            >
                                Order Details
                            </button>
                            <button
                                onClick={() => handleTabClick('doneOrders')}
                                className={`flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'doneOrders' ? 'bg-[#5e5e5e] text-white' : 'text-gray-400 hover:bg-[#4e4e4e]'}`}
                            >
                                Done Orders
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {/* Order Details Content */}
                            {activeTab === 'orderDetails' && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input type="text" placeholder="Search orders..." className="w-full bg-[#3e3e3e] border border-[#4e4e4e] text-sm rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Order Item Card */}
                                    <div className="bg-[#3e3e3e] p-4 rounded-2xl flex justify-between items-center transition-colors hover:bg-[#4e4e4e]">
                                        <div>
                                            <div className="text-sm text-gray-400">12:30 - 14:30</div>
                                            <div className="font-semibold text-white">Order #12345</div>
                                            <div className="text-sm text-gray-400">Table 7</div>
                                        </div>
                                        <div className="text-sm text-gray-400">4 items</div>
                                    </div>
                                    
                                    <div className="bg-[#3e3e3e] p-4 rounded-2xl flex justify-between items-center transition-colors hover:bg-[#4e4e4e]">
                                        <div>
                                            <div className="text-sm text-gray-400">10:30 - 12:30</div>
                                            <div className="font-semibold text-white">Order #12346</div>
                                            <div className="text-sm text-gray-400">Table 8</div>
                                        </div>
                                        <div className="text-sm text-gray-400">2 items</div>
                                    </div>

                                    <div className="bg-[#3e3e3e] p-4 rounded-2xl flex justify-between items-center transition-colors hover:bg-[#4e4e4e]">
                                        <div>
                                            <div className="text-sm text-gray-400">12:30 - 15:30</div>
                                            <div className="font-semibold text-white">Order #12347</div>
                                            <div className="text-sm text-gray-400">Table 12</div>
                                        </div>
                                        <div className="text-sm text-gray-400">5 items</div>
                                    </div>
                                </div>
                            )}

                            {/* Done Orders Content */}
                            {activeTab === 'doneOrders' && (
                                <div className="space-y-4">
                                    {/* Done Order Item Card */}
                                    <div className="bg-[#3e3e3e] p-4 rounded-2xl flex justify-between items-center transition-colors hover:bg-[#4e4e4e] opacity-70">
                                        <div>
                                            <div className="text-sm text-gray-400">10:00 - 11:30</div>
                                            <div className="font-semibold text-white">Order #12340</div>
                                            <div className="text-sm text-gray-400">Table 3</div>
                                        </div>
                                        <div className="text-sm text-gray-400">3 items</div>
                                    </div>

                                    <div className="bg-[#3e3e3e] p-4 rounded-2xl flex justify-between items-center transition-colors hover:bg-[#4e4e4e] opacity-70">
                                        <div>
                                            <div className="text-sm text-gray-400">09:00 - 10:00</div>
                                            <div className="font-semibold text-white">Order #12339</div>
                                            <div className="text-sm text-gray-400">Table 1</div>
                                        </div>
                                        <div className="text-sm text-gray-400">1 item</div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </section>

                </div>

                {/* Bottom Navigation Bar */}
                <footer className="flex justify-center items-center mt-6 lg:mt-8">
                    <div className="flex items-center space-x-6 lg:space-x-8 bg-[#3e3e3e] p-2 rounded-full shadow-lg">
                        <button className="flex items-center text-sm font-medium py-2 px-4 rounded-full bg-[#5e5e5e] text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M4 21h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zm2-17h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm6 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                            <span>Reservations</span>
                        </button>
                        <a href="#" className="flex items-center text-sm font-medium py-2 px-4 rounded-full text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-10 10c0 5.514 4.486 10 10 10s10-4.486 10-10A10 10 0 0 0 12 2zm1 14.828c-2.457.067-4.148-1.574-4.524-4.328h-2.186A8 8 0 0 1 12 4.024v2.072c-1.393.308-2.316 1.092-2.316 2.304 0 1.258.91 2.054 2.316 2.32V16.828zm2-6.5h-2v-4.308c1.392-.308 2.316-1.092 2.316-2.304 0-1.258-.91-2.054-2.316-2.32V3.024a8 8 0 0 1 7.18 7.304H15zm-3-1.004c2.457-.067 4.148 1.574 4.524 4.328h2.186a8 8 0 0 1-7.71-7.304v-2.072c1.393.308 2.316 1.092 2.316 2.304 0 1.258-.91 2.054-2.316 2.32V9.324z"/></svg>
                            <span>History</span>
                        </a>
                        <a href="#" className="flex items-center text-sm font-medium py-2 px-4 rounded-full text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M4 21h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1zM5 5h14v14H5V5zm4 10h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/></svg>
                            <span>Statistics</span>
                        </a>
                        <a href="#" className="flex items-center text-sm font-medium py-2 px-4 rounded-full text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zM8 7a4 4 0 1 1 4 4 4 4 0 0 1-4-4zm-1 9a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7v-2h-2v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2H7v2z"/></svg>
                            <span>Contacts</span>
                        </a>
                        <a href="#" className="flex items-center text-sm font-medium py-2 px-4 rounded-full text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16 8 8 0 0 1 0 16zm-1-11v-2h2v2h-2zm0 4v-4h2v4h-2z"/></svg>
                            <span>Profile</span>
                        </a>
                        <a href="#" className="flex items-center text-sm font-medium py-2 px-4 rounded-full text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M19.92 12.08c-.28-.53-.78-.88-1.3-.92-.6-.05-1.12.3-1.42.7-.3.4-.38.9-.38 1.4-1.28.43-1.8 1.25-1.9 2.15-.05.5.3 1 .8 1.05.5.05 1-.3 1.28-.73.28-.43.53-.78.88-1.08.35-.3.8-.45 1.3-.45.5 0 .95.15 1.3.45.35.3.6.65.88 1.08.28.43.78.78 1.3.73.5-.05 1-.3 1.28-.73.28-.43.3-.92.2-1.4-.08-.5-.38-1-.9-1.4-.28-.35-.78-.65-1.3-.8zm-4.32-6.52c-.53-.28-.88-.78-.92-1.3-.05-.6.3-1.12.7-1.42.4-.3.9-.38 1.4-.38 1.2.43 1.8 1.25 1.9 2.15.05.5-.3 1-.8 1.05-.5.05-1-.3-1.28-.73-.28-.43-.53-.78-.88-1.08-.35-.3-.8-.45-1.3-.45-.5 0-.95.15-1.3.45-.35.3-.6.65-.88 1.08-.28.43-.78.78-1.3.73-.5-.05-1-.3-1.28-.73-.28-.43-.3-.92-.2-1.4-.08-.5-.38-1-.9-1.4-.28-.35-.78-.65-1.3-.8z"/></svg>
                            <span>Settings</span>
                        </a>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default App;
