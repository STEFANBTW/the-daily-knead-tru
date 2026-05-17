"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDb } from "@/app/context/db-context";
import { useCart } from "@/app/context/cart-context";

const tabs = [
  "Home",
  "My Orders",
  "My Reviews",
  "Addresses",
  "Favorites",
  "Notifications",
  "Profile & Settings",
];

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { users, activeUser, setActiveUser, orders, reviews, updateUser } = useDb();
  const { addToCart } = useCart();

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart({
        id: Math.random().toString(36).substr(2, 9),
        itemId: item.name, // Mocking ID logic
        name: item.name,
        basePrice: parseInt(item.price.replace(/[^\d]/g, '') || "0", 10) / item.quantity,
        qty: item.quantity,
        addons: item.addons || [],
        totalItemPrice: item.totalItemPrice || (parseInt(item.price.replace(/[^\d]/g, '') || "0", 10)),
      });
    });
    router.push('/menu?cart=open');
  };

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  if (!activeUser) {
    return (
      <div className="min-h-screen pt-[var(--menu-nav-height)] bg-[#EBE6DF] flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold uppercase mb-8 text-[#252422]">Sign In</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => setActiveUser(user)}
              className="border border-[#252422] p-6 text-left hover:bg-[#252422] hover:text-[#EBE6DF] transition-colors flex items-center gap-4 group bg-[#F2ECE4]"
            >
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center font-bold text-lg">{user.avatar}</div>
              <div>
                <p className="font-bold uppercase tracking-wider">{user.name}</p>
                <p className="font-mono text-[10px] opacity-70 group-hover:opacity-100">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === activeUser.id);
  const userReviews = reviews.filter(r => r.userId === activeUser.id);
  const activeOrder = userOrders.find(o => o.status !== "Completed" && o.status !== "Cancelled");
  const pastOrders = userOrders.filter(o => o.status === "Completed" || o.status === "Cancelled");

  return (
    <div className="min-h-screen pt-[var(--menu-nav-height)] bg-[#EBE6DF] font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-[#252422] bg-[#F2ECE4] flex flex-col pt-8 h-[calc(100vh-var(--menu-nav-height))] shrink-0 z-10 sticky top-[var(--menu-nav-height)] overflow-y-auto self-start">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full border border-[#252422] flex items-center justify-center font-bold bg-[#EBE6DF]">{activeUser.avatar}</div>
             <div>
               <h2 className="font-bold uppercase text-sm">{activeUser.name}</h2>
               <button onClick={() => setActiveUser(null)} className="font-mono text-[10px] uppercase text-[#9F4F3B] hover:underline">Switch User</button>
             </div>
          </div>
          <p className="font-mono text-[10px] uppercase opacity-50 border-t border-[#252422]/20 pt-4">User Env</p>
        </div>

        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 border-[#252422]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-6 py-4 font-mono text-xs uppercase tracking-widest transition-colors border-l-4 whitespace-nowrap md:whitespace-normal
                   ${
                     activeTab === tab
                       ? "bg-[#252422] text-[#EBE6DF] border-[#9F4F3B]"
                       : "border-transparent text-[#252422]/60 hover:bg-[#252422]/5 hover:text-[#252422]"
                   }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-16">
        <h1 className="text-3xl md:text-5xl font-bold uppercase mb-12 border-b border-[#252422] pb-6">
          {activeTab}
        </h1>

        <div className="animate-in fade-in duration-500">
          {activeTab === "Home" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border border-[#252422] bg-[#F2ECE4]">
                <h3 className="font-bold uppercase mb-2">Active Order</h3>
                {activeOrder ? (
                  <>
                    <p className="font-mono text-sm opacity-70 mb-4">{activeOrder.status} your meal</p>
                    <button className="text-xs uppercase font-bold tracking-widest text-[#9F4F3B] hover:underline" onClick={() => setActiveTab("My Orders")}>Track Order &rarr;</button>
                  </>
                ) : (
                  <>
                    <p className="font-mono text-sm opacity-70 mb-4">No active orders</p>
                    <Link href="/menu" className="text-xs uppercase font-bold tracking-widest text-[#9F4F3B] hover:underline">Order Now &rarr;</Link>
                  </>
                )}
              </div>
              <div className="p-6 border border-[#252422] bg-[#F2ECE4]">
                <h3 className="font-bold uppercase mb-2">Total Orders</h3>
                <p className="font-mono text-3xl font-bold text-[#9F4F3B] mb-2">{userOrders.length}</p>
                <button
                  className="text-xs uppercase font-bold tracking-widest hover:underline"
                  onClick={() => setActiveTab("My Orders")}
                >
                  View History &rarr;
                </button>
              </div>
              <div className="p-6 border border-[#252422] bg-[#9F4F3B] text-[#EBE6DF]">
                <h3 className="font-bold uppercase mb-2">Quick Reorder</h3>
                {pastOrders.length > 0 ? (
                  <>
                    <p className="font-mono text-sm opacity-80 mb-4 truncate">{pastOrders[0].items.map(i => i.name).join(", ")}</p>
                    <button onClick={() => handleReorder(pastOrders[0])} className="text-xs uppercase font-bold tracking-widest hover:underline text-[#F2ECE4]">Order Now &rarr;</button>
                  </>
                ) : (
                  <p className="font-mono text-sm opacity-80">You haven't placed any orders yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "My Orders" && (
            <div className="flex flex-col gap-8">
              {activeOrder && (
                <div className="border border-[#252422] p-8 bg-[#F2ECE4]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-xl uppercase mb-1">
                        Order #{activeOrder.id}
                      </h3>
                      <p className="font-mono text-xs opacity-60">
                        {activeOrder.time}
                      </p>
                    </div>
                    <span className={`font-mono text-[10px] uppercase px-3 py-1 font-bold tracking-wider ${activeOrder.status === 'On Route' ? 'bg-green-600 text-white' : 'bg-[#9F4F3B] text-white'}`}>
                      {activeOrder.status}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-[#252422]/10 mb-6 flex overflow-hidden">
                    <div className={`h-full bg-[#9F4F3B] ${activeOrder.status === "Preparing" ? "w-1/3" : activeOrder.status === "On Route" ? "w-2/3" : "w-full"}`}></div>
                  </div>
                  <div className="flex justify-between font-mono text-xs uppercase mb-6 opacity-50">
                    <span className={activeOrder.status === "Preparing" ? "text-[#9F4F3B] font-bold opacity-100" : ""}>Preparing</span>
                    <span className={activeOrder.status === "On Route" ? "text-[#9F4F3B] font-bold opacity-100" : ""}>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>

                  <div className="border-t border-[#252422]/20 pt-4 mt-4 mb-6">
                     {activeOrder.items.map((item, idx) => (
                       <div key={idx} className="flex justify-between font-mono text-sm py-1">
                         <span>{item.quantity}x {item.name}</span>
                         <span>{item.price}</span>
                       </div>
                     ))}
                  </div>

                  <button className="text-xs uppercase font-bold tracking-widest border border-[#252422] px-6 py-3 hover:bg-[#252422] hover:text-white transition-colors">
                    Contact Support
                  </button>
                </div>
              )}

              <h4 className="font-bold uppercase tracking-widest border-b border-[#252422] pb-2 mt-4">
                Past Orders
              </h4>
              <div className="divide-y divide-[#252422]/20 border border-[#252422] bg-white">
                {pastOrders.length === 0 ? (
                   <div className="p-6 text-center font-mono text-sm opacity-50">No past orders.</div>
                ) : pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 flex flex-col md:flex-row justify-between md:items-center hover:bg-[#252422]/5 transition-colors gap-4"
                  >
                    <div>
                      <p className="font-bold uppercase">Order #{order.id}</p>
                      <p className="font-mono text-xs opacity-60">
                        {order.time} • ₦{order.total.toLocaleString()}
                      </p>
                      <p className="font-mono text-xs mt-2 text-[#9F4F3B]">{order.items.map(i => i.name).join(", ")}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                       <span className="font-mono text-[10px] uppercase px-2 py-1 bg-green-100 text-green-800">{order.status}</span>
                       <button onClick={() => handleReorder(order)} className="font-mono text-[10px] uppercase underline hover:text-[#9F4F3B]">
                         Reorder
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "My Reviews" && (
            <div className="flex flex-col gap-6">
               <h4 className="font-bold uppercase tracking-widest border-b border-[#252422] pb-2">Your Feedback</h4>
               {userReviews.length === 0 ? (
                  <p className="font-mono text-sm opacity-50">You haven't left any reviews yet.</p>
               ) : userReviews.map(r => (
                  <div key={r.id} className="border border-[#252422] p-6 bg-white">
                     <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#252422]/10">
                        <span className="font-bold uppercase tracking-wider">{r.itemName}</span>
                        <div className="flex items-center gap-4">
                           <span className="font-mono text-xs opacity-50">{r.date}</span>
                           <span className="text-[#9F4F3B] font-bold font-mono bg-[#9F4F3B]/10 px-3 py-1">{r.rating} / 5</span>
                        </div>
                     </div>
                     <p className="font-serif text-lg opacity-80 italic">&quot;{r.comment}&quot;</p>
                  </div>
               ))}
            </div>
          )}

          {activeTab === "Addresses" && (
            <div className="flex flex-col gap-6">
               <div className="flex justify-between items-center border-b border-[#252422] pb-2">
                 <h4 className="font-bold uppercase tracking-widest">Saved Addresses</h4>
                 <button className="text-[10px] uppercase font-bold tracking-widest bg-[#252422] text-[#EBE6DF] px-3 py-1 hover:bg-[#9F4F3B] transition-colors">+ Add New</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="border border-[#252422] p-6 bg-white flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                       <div>
                         <span className="font-mono text-[10px] uppercase bg-[#9F4F3B] text-white px-2 py-1 mb-2 block w-max">Default</span>
                         <h5 className="font-bold">Home</h5>
                       </div>
                       <div className="flex gap-2">
                         <span className="font-mono text-[10px] uppercase cursor-pointer hover:underline">Edit</span>
                         <span className="font-mono text-[10px] uppercase text-red-600 cursor-pointer hover:underline">Delete</span>
                       </div>
                    </div>
                    <p className="font-mono text-sm opacity-80">14B Admiralty Way<br/>Lekki Phase 1, Lagos</p>
                 </div>
               </div>
            </div>
          )}

          {activeTab === "Favorites" && (
            <div className="flex flex-col gap-6">
               <h4 className="font-bold uppercase tracking-widest border-b border-[#252422] pb-2">Your Favorites</h4>
               <p className="font-mono text-sm opacity-50">You haven't saved any items yet.</p>
               <Link href="/menu" className="w-max border border-[#252422] px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#252422] hover:text-[#EBE6DF] transition-colors">Browse Menu</Link>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="flex flex-col gap-4">
               <h4 className="font-bold uppercase tracking-widest border-b border-[#252422] pb-2">Recent Notifications</h4>
               <div className="border border-[#252422] p-4 bg-white opacity-60">
                 <p className="font-mono text-xs opacity-50 mb-1">Yesterday, 4:30 PM</p>
                 <p className="font-bold text-sm">Your order #ORD-901 has been delivered. Enjoy your meal!</p>
               </div>
               <div className="border border-[#252422] p-4 bg-white opacity-60">
                 <p className="font-mono text-xs opacity-50 mb-1">May 07, 10:00 AM</p>
                 <p className="font-bold text-sm">New menu item alert: Try our special Catfish Pepper Soup today!</p>
               </div>
            </div>
          )}

          {activeTab === "Profile & Settings" && (
            <div className="max-w-2xl flex flex-col gap-8">
               <div className="border border-[#252422] p-8 flex flex-col gap-6 bg-white relative">
                  <div className="flex justify-between items-center border-b border-[#252422]/20 pb-4">
                     <h2 className="font-bold uppercase text-xl">Personal Info</h2>
                     {!editProfileMode ? (
                       <button onClick={() => { setEditName(activeUser.name); setEditEmail(activeUser.email); setEditProfileMode(true); }} className="text-[10px] uppercase font-bold tracking-widest border border-[#252422] px-3 py-1 hover:bg-[#252422] hover:text-[#EBE6DF] transition-colors">Edit</button>
                     ) : (
                       <div className="flex gap-2">
                         <button onClick={() => { setEditProfileMode(false); }} className="text-[10px] uppercase font-bold tracking-widest border border-[#252422] px-3 py-1 hover:bg-[#252422]/10 transition-colors">Cancel</button>
                         <button onClick={() => { updateUser(activeUser.id, { name: editName, email: editEmail }); setEditProfileMode(false); }} className="text-[10px] uppercase font-bold tracking-widest bg-[#9F4F3B] text-white px-3 py-1 hover:bg-opacity-80 transition-colors">Save</button>
                       </div>
                     )}
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest opacity-50 block mb-2">Full Name</label>
                    <input type="text" readOnly={!editProfileMode} value={editProfileMode ? editName : activeUser.name} onChange={e => setEditName(e.target.value)} className={`w-full ${!editProfileMode ? 'bg-[#EBE6DF]/50 cursor-not-allowed' : 'bg-white focus:border-[#9F4F3B]'} border-b border-[#252422]/20 py-2 px-3 outline-none font-bold transition-colors`} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest opacity-50 block mb-2">Email Address</label>
                    <input type="email" readOnly={!editProfileMode} value={editProfileMode ? editEmail : activeUser.email} onChange={e => setEditEmail(e.target.value)} className={`w-full ${!editProfileMode ? 'bg-[#EBE6DF]/50 cursor-not-allowed' : 'bg-white focus:border-[#9F4F3B]'} border-b border-[#252422]/20 py-2 px-3 outline-none font-mono transition-colors`} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest opacity-50 block mb-2">Member Since</label>
                    <p className="font-mono text-sm">{activeUser.joinDate}</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
