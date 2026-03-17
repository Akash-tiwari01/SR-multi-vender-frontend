'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Package, MapPin, LogOut, Camera, 
  ChevronRight, ShieldCheck, Bell, CreditCard 
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';

// Simulation of a Service Layer (SOLID: Separation of Concerns)
const ProfileService = {
  async getProfile() {
    // API Call: GET /api/user/profile
    return {
      name: "Akash Tiwari",
      email: "akash@example.com",
      phone: "+91 9876543210",
      avatar: null,
      joinedAt: "Jan 2024"
    };
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await ProfileService.getProfile();
        setUser(data);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-brand-primary font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Toaster position="top-right" />
      
      {/* Header / Banner */}
      <div className="h-48 bg-brand-primary relative">
        <div className="absolute -bottom-12 left-6 md:left-12 flex items-end gap-4">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-slate-200 overflow-hidden shadow-xl">
              {user?.avatar ? (
                <Image src={user.avatar} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-secondary text-brand-primary">
                  <User size={48} />
                </div>
              )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg text-brand-primary hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          <div className="mb-2 hidden md:block">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{user?.name}</h1>
            <p className="text-brand-secondary text-xs font-bold uppercase tracking-widest">Member since {user?.joinedAt}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-16 md:mt-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-2">
            <NavButton 
              icon={<User size={18}/>} 
              label="Personal Info" 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
            <NavButton 
              icon={<Package size={18}/>} 
              label="My Orders" 
              active={activeTab === 'orders'} 
              onClick={() => setActiveTab('orders')} 
            />
            <NavButton 
              icon={<MapPin size={18}/>} 
              label="Addresses" 
              active={activeTab === 'address'} 
              onClick={() => setActiveTab('address')} 
            />
            <NavButton 
              icon={<CreditCard size={18}/>} 
              label="Saved Payments" 
              active={activeTab === 'payment'} 
              onClick={() => setActiveTab('payment')} 
            />
            <hr className="my-4 border-slate-200" />
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all">
              <LogOut size={18} />
              <span className="uppercase text-sm tracking-tighter">Logout Account</span>
            </button>
          </aside>

          {/* Tab Content Area */}
          <section className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[500px]">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-brand-primary uppercase tracking-tighter">Account Settings</h2>
                  <button className="text-xs font-bold text-brand-secondary border-b-2 border-brand-secondary pb-0.5">EDIT PROFILE</button>
                </div>

                <div className="space-y-6">
                  <InfoField label="Full Name" value={user?.name} />
                  <InfoField label="Email Address" value={user?.email} />
                  <InfoField label="Phone Number" value={user?.phone} />
                  
                  <div className="mt-10 p-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center gap-4">
                    <ShieldCheck className="text-brand-accent" />
                    <div>
                      <p className="text-xs font-black text-brand-primary uppercase">Identity Verified</p>
                      <p className="text-[10px] text-brand-primary/60">Your account is secured with two-factor authentication.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-20 animate-in fade-in duration-500">
                <Package size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="font-bold text-brand-primary">No Recent Orders</h3>
                <p className="text-sm text-slate-400">Items you purchase will appear here.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/** * Modular Components (SOLID: Single Responsibility)
 */

function NavButton({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
        active 
          ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20 scale-[1.02]' 
          : 'bg-white text-slate-500 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-black uppercase tracking-tighter">{label}</span>
      </div>
      <ChevronRight size={16} className={active ? 'opacity-100' : 'opacity-30'} />
    </button>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="group border-b border-slate-50 pb-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-brand-primary">{value || 'Not provided'}</p>
    </div>
  );
}