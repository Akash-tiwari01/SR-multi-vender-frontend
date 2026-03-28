'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Package, MapPin, LogOut, Camera, 
  ChevronRight, ShieldCheck, Bell, CreditCard, Edit2, Plus, Trash2, X, Save
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { updateProfileRequest, logout } from '@/modules/user/state/userSlice';
import { fetchOrdersRequest, createReturnRequest } from '@/modules/orders/state/orderSlice';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { user, isLoading } = useSelector((state) => state.user);
  const { orders, isLoading: isOrderLoading, isReturnLoading } = useSelector((state) => state.order);
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address_1: '', address_2: '', city: '', state: '', pin: '', landmark: ''
  });

  // Orders State
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnForm, setReturnForm] = useState({ order: '', subject: '', message: '' });

  useEffect(() => {
    if (!user) {
      // If user isn't fetched or logged out, boot them to login or home
      // Optionally router.push('/')
    } else {
      setProfileForm({ 
        name: user.name || '', 
        email: user.email || '', 
        phone: user.phone || '' 
      });
    }
  }, [user]);

  // Fetch orders gracefully upon hitting the orders tab
  useEffect(() => {
    if (activeTab === 'orders') {
      dispatch(fetchOrdersRequest());
    }
  }, [activeTab, dispatch]);

  // --- Profile Handlers ---
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileRequest(profileForm));
    setIsEditingProfile(false);
    toast.success("Profile updating...");
  };

  // --- Address Handlers ---
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const currentAddresses = user?.address ? [...user.address] : [];

    if (editingAddressIndex !== null) {
      currentAddresses[editingAddressIndex] = addressForm;
    } else {
      currentAddresses.push(addressForm);
    }

    dispatch(updateProfileRequest({ address: currentAddresses }));
    setIsAddressModalOpen(false);
    toast.success("Addresses updating...");
  };

  const handleDeleteAddress = (index) => {
    if (confirm("Delete this address forever?")) {
      const currentAddresses = user?.address ? [...user.address] : [];
      currentAddresses.splice(index, 1);
      dispatch(updateProfileRequest({ address: currentAddresses }));
    }
  };

  const openNewAddressModal = () => {
    setAddressForm({ address_1: '', address_2: '', city: '', state: '', pin: '', landmark: '' });
    setEditingAddressIndex(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (address, index) => {
    setAddressForm(address);
    setEditingAddressIndex(index);
    setIsAddressModalOpen(true);
  };

  // --- Order Handlers ---
  const openReturnModal = (orderId) => {
    setReturnForm({ order: orderId, subject: '', message: '' });
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    dispatch(createReturnRequest(returnForm));
    setIsReturnModalOpen(false);
    toast.success("Return Request Processed.");
  };

  const filteredOrders = orders?.filter((ord) => {
    if (orderFilter === 'ALL') return true;
    if (orderFilter === 'DELIVERED') return ord.status === 'DELIVERED';
    if (orderFilter === 'CANCELLED') return ord.status === 'CANCELLED';
    if (orderFilter === 'RETURNED') return ord.status?.includes('RETURN');
    if (orderFilter === 'ONGOING') return !['DELIVERED', 'CANCELLED', 'RETURNED', 'RETURN REQUEST', 'RETURN COMPLETED'].includes(ord.status);
    return true;
  }) || [];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!user) return <div className="h-screen flex items-center justify-center text-brand-primary font-bold">Please log in to view this page...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 relative">
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
            <h1 className="text-2xl font-black text-white tracking-tighter">{user?.name}</h1>
            <p className="text-brand-secondary text-xs font-bold uppercase tracking-widest">{user?.role} - MEMBER</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-16 md:mt-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-2">
            <NavButton 
              icon={<User size={18}/>} label="Personal Info" 
              active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} 
            />
            <NavButton 
              icon={<MapPin size={18}/>} label="Manage Addresses" 
              active={activeTab === 'address'} onClick={() => setActiveTab('address')} 
            />
            <NavButton 
              icon={<Package size={18}/>} label="My Orders" 
              active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} 
            />
            <hr className="my-4 border-slate-200" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all">
              <LogOut size={18} />
              <span className="uppercase text-sm tracking-tighter">Logout Account</span>
            </button>
          </aside>

          {/* Tab Content Area */}
          <section className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[500px]">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-brand-primary tracking-tighter">Account Settings</h2>
                  {!isEditingProfile && (
                    <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 text-xs font-bold text-brand-secondary border-b-2 border-brand-secondary pb-0.5">
                      <Edit2 size={14} /> EDIT PROFILE
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-6">
                    <InfoField label="Full Name" value={user?.name} />
                    <InfoField label="Email Address" value={user?.email} />
                    <InfoField label="Phone Number" value={user?.phone} />
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                      <input 
                        type="text" required
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
                      <input 
                        type="email" 
                        value={profileForm.email} 
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 block">Phone</label>
                      <input 
                        type="text" required
                        value={profileForm.phone} 
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50">Cancel</button>
                      <button type="submit" disabled={isLoading} className="flex-1 bg-brand-primary text-white font-bold py-2 rounded-xl hover:bg-brand-primary/90 disabled:opacity-50">Save Changes</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === 'address' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-brand-primary tracking-tighter">Saved Addresses</h2>
                  <button onClick={openNewAddressModal} className="flex items-center gap-2 text-xs font-bold bg-brand-primary text-white px-4 py-2 rounded-full hover:scale-105 transition-transform">
                    <Plus size={14} /> ADD NEW
                  </button>
                </div>

                {(!user?.address || user?.address.length === 0) ? (
                  <div className="text-center py-20">
                    <MapPin size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="font-bold text-brand-primary">No Addresses Found</h3>
                    <p className="text-sm text-slate-400">Add a shipping or billing address to ease checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.address.map((addr, idx) => (
                      <div key={idx} className="border border-slate-200 p-5 rounded-2xl relative hover:border-brand-primary transition-colors">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button onClick={() => openEditAddressModal(addr, idx)} className="text-slate-400 hover:text-brand-primary"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteAddress(idx)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <p className="font-bold text-brand-primary mb-2 line-clamp-1">{addr.address_1}</p>
                        <p className="text-sm text-slate-500">{addr.address_2}</p>
                        <p className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.pin}</p>
                        <p className="text-sm text-slate-500 font-medium mt-1">Landmark: {addr.landmark || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                  <h2 className="text-xl font-black text-brand-primary tracking-tighter">My Orders</h2>
                  
                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    {['ALL', 'ONGOING', 'DELIVERED', 'RETURNED', 'CANCELLED'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${orderFilter === f ? 'bg-brand-primary text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {isOrderLoading ? (
                  <div className="text-center py-20 text-brand-primary font-bold">Loading your orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-20 animate-in fade-in duration-500">
                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="font-bold text-brand-primary">No Orders Found</h3>
                    <p className="text-sm text-slate-400">Items matching this filter will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOrders.map(order => (
                      <div key={order._id} className="border border-slate-100 bg-slate-50 hover:bg-white transition-colors rounded-3xl p-6 relative shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-4">
                           <div>
                             <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Order ID</p>
                             <p className="font-bold text-brand-primary">#{order.order_id || order._id.slice(-6).toUpperCase()}</p>
                             <p className="text-xs font-bold text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                  order.status?.includes('RETURN') ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status}
                              </span>
                              <p className="font-black text-lg text-brand-primary mt-2">₹{order.total_amount}</p>
                           </div>
                        </div>

                        {/* Order Products Snippet */}
                        <div className="space-y-3">
                           {order.products?.map((prod, idx) => (
                             <div key={idx} className="flex gap-4 items-center">
                               {prod.image ? (
                                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 overflow-hidden relative">
                                    <Image src={prod.image} alt="product" fill className="object-cover" />
                                  </div>
                               ) : (
                                  <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                                    <Package size={20} />
                                  </div>
                               )}
                               <div className="flex-1">
                                  <p className="text-sm font-bold text-brand-primary line-clamp-1">{prod.name}</p>
                                  <p className="text-xs font-bold text-slate-500">Qty: {prod.quantity}</p>
                               </div>
                             </div>
                           ))}
                        </div>

                        {/* Return Item Trigger */}
                        {order.status === 'DELIVERED' && (
                           <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                              <button onClick={() => openReturnModal(order._id)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:text-white px-4 py-2 border border-rose-200 rounded-xl hover:bg-rose-500 hover:shadow-lg shadow-rose-500/30 transition-all">
                                 Issue Return
                              </button>
                           </div>
                        )}
                        {/* Status Check if Return currently processing */}
                        {order.status === 'RETURN REQUEST' && (
                           <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                              <span className="text-xs font-bold text-orange-500">Return Processing...</span>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </section>
        </div>
      </main>

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-brand-primary tracking-tighter">
                {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Address Line 1 *</label>
                  <input required value={addressForm.address_1} onChange={(e) => setAddressForm({...addressForm, address_1: e.target.value})} type="text" className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary" placeholder="Street, Flat no." />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Address Line 2</label>
                  <input value={addressForm.address_2} onChange={(e) => setAddressForm({...addressForm, address_2: e.target.value})} type="text" className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary" placeholder="Locality, Sector" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">City *</label>
                  <input required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} type="text" className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary" placeholder="City" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">State *</label>
                  <input required value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} type="text" className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary" placeholder="State" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Pincode *</label>
                  <input required value={addressForm.pin} onChange={(e) => setAddressForm({...addressForm, pin: e.target.value})} type="text" className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary" placeholder="000000" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Landmark</label>
                  <input value={addressForm.landmark} onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})} type="text" className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary" placeholder="Near hospital" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-4">
                 <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50">Cancel</button>
                 <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primary/90 disabled:opacity-50">
                    <Save size={18} /> Save Address
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-brand-primary tracking-tighter">Request Return</h3>
              <button onClick={() => setIsReturnModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleReturnSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Subject / Reason Category *</label>
                <select required value={returnForm.subject} onChange={(e) => setReturnForm({...returnForm, subject: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary">
                  <option value="" disabled>Select a reason...</option>
                  <option value="Damaged/Defective Item">Damaged/Defective Item</option>
                  <option value="Wrong Item Received">Wrong Item Received</option>
                  <option value="Changed Mind">Changed Mind</option>
                  <option value="Item Not as Described">Item Not as Described</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Detailed Message *</label>
                <textarea required value={returnForm.message} onChange={(e) => setReturnForm({...returnForm, message: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-brand-primary min-h-[100px]" placeholder="Please provide specific details regarding this return..." />
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-4">
                 <button type="button" onClick={() => setIsReturnModalOpen(false)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50">Cancel</button>
                 <button type="submit" disabled={isReturnLoading} className="flex-1 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors">
                    {isReturnLoading ? 'Submitting...' : 'Submit Request'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents
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