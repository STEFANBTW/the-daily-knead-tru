"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDb } from "@/app/context/db-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tabs = [
  "Overview",
  "Orders",
  "Menu",
  "Inventory",
  "Customers",
  "Staff",
  "Payments & Finance",
  "Promotions & Marketing",
  "Reviews",
  "Delivery",
  "Reports & Analytics",
  "Settings",
];

export default function AdminDashboard() {
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { menu, users, orders, reviews, updateMenuItem, deleteMenuItem, addMenuItem, setActiveUser, updateOrderStatus } = useDb();

  // Menu Management State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editCategory, setEditCategory] = useState<number>(0);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<number, boolean>>({});

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPortionSize, setNewItemPortionSize] = useState("");
  const [newItemPrepTime, setNewItemPrepTime] = useState("");
  const [newItemSpiceLevel, setNewItemSpiceLevel] = useState("");
  const [newItemPopularity, setNewItemPopularity] = useState<number | string>(0);
  const [newItemIngredients, setNewItemIngredients] = useState("");
  const [newItemAllergens, setNewItemAllergens] = useState("");
  const [newItemCustomization, setNewItemCustomization] = useState<{name: string, price: string}[]>([]);

  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const pendingOrders = orders.filter(o => o.status !== "Completed" && o.status !== "Cancelled");
  const totalRevenue = orders.filter(o => o.status === "Completed").reduce((sum, o) => sum + o.total, 0);

  const handleSaveItem = () => {
    const parsedIngredients = newItemIngredients.split(',').map(s => s.trim()).filter(Boolean);
    const parsedAllergens = newItemAllergens.split(',').map(s => s.trim()).filter(Boolean);
    
    const payload = {
       ...editingItem,
       name: newItemName,
       price: newItemPrice,
       description: newItemDescription,
       portionSize: newItemPortionSize,
       prepTime: newItemPrepTime,
       spiceLevel: newItemSpiceLevel,
       popularity: Number(newItemPopularity) || 0,
       ingredients: parsedIngredients,
       allergens: parsedAllergens,
       customization: newItemCustomization,
    };

    if (editIndex === -1) {
       addMenuItem(editCategory, payload);
    } else {
       updateMenuItem(editCategory, editIndex, payload);
    }
    setEditingItem(null);
  };

  const chartData = [
    { name: "Mon", revenue: 12000 },
    { name: "Tue", revenue: 19000 },
    { name: "Wed", revenue: 15000 },
    { name: "Thu", revenue: 22000 },
    { name: "Fri", revenue: 31000 },
    { name: "Sat", revenue: 45000 },
    { name: "Sun", revenue: 38000 },
  ];

  const executeGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
       const q = globalSearch.toLowerCase();
       if (q.includes("order") || q.startsWith("#ord")) setActiveTab("Orders");
       else if (q.includes("menu") || q.includes("item") || q.includes("food")) setActiveTab("Menu");
       else if (q.includes("user") || q.includes("customer")) setActiveTab("Customers");
       else if (q.includes("staff")) setActiveTab("Staff");
       else if (q.includes("inventory") || q.includes("stock")) setActiveTab("Inventory");
       else if (q.includes("revenue") || q.includes("finance") || q.includes("payment")) setActiveTab("Payments & Finance");
       else setActiveTab("Overview");
       setGlobalSearch(""); // Optionally clear
    }
  };



  return (
    <div className="min-h-screen pt-[var(--menu-nav-height)] bg-[#252422] text-[#EBE6DF] font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-[#EBE6DF]/20 flex flex-col pt-8 h-[calc(100vh-var(--menu-nav-height))] shrink-0 z-10 sticky top-[var(--menu-nav-height)] bg-[#252422] overflow-y-auto self-start">
        <div className="px-6 mb-8 flex flex-col justify-center">
          <h2 className="font-bold text-2xl uppercase tracking-tighter text-[#9F4F3B]">
            Ops Panel
          </h2>
          <p className="font-mono text-[10px] uppercase opacity-50 mt-1 mb-4">
            Admin Env
          </p>
          <input
            type="text"
            placeholder="Search dashboard... (Enter)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={executeGlobalSearch}
            className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none font-mono text-xs placeholder:opacity-50 focus:border-[#9F4F3B]"
          />
        </div>

        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 border-[#EBE6DF]/20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-6 py-4 font-mono text-xs uppercase tracking-widest transition-colors border-l-4 whitespace-nowrap md:whitespace-normal
                   ${
                     activeTab === tab
                       ? "bg-[#EBE6DF]/10 text-[#EBE6DF] border-[#9F4F3B]"
                       : "border-transparent text-[#EBE6DF]/50 hover:bg-[#EBE6DF]/5 hover:text-[#EBE6DF]"
                   }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-16">
        <div className="flex justify-between items-end mb-12 border-b border-[#EBE6DF]/20 pb-6">
          <h1 className="text-3xl md:text-5xl font-bold uppercase">
            {activeTab}
          </h1>
          <span className="font-mono text-sm opacity-50 border border-[#EBE6DF]/20 px-3 py-1">
            Last synced: Just now
          </span>
        </div>

        {/* Placeholder Content Based on Tab */}
        <div className="animate-in fade-in duration-500">
          {activeTab === "Overview" && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5">
                  <h3 className="font-mono text-[10px] opacity-70 uppercase mb-2">
                    Total Orders Today
                  </h3>
                  <p className="font-mono text-4xl font-bold">{orders.length}</p>
                  <span className="text-xs text-green-400 mt-2 block">
                    +12% vs yesterday
                  </span>
                </div>
                <div className="p-6 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5">
                  <h3 className="font-mono text-[10px] opacity-70 uppercase mb-2">
                    Revenue Today
                  </h3>
                  <p className="font-mono text-4xl font-bold text-[#9F4F3B]">
                    ₦{totalRevenue.toLocaleString()}
                  </p>
                  <span className="text-xs text-green-400 mt-2 block">
                    +5% vs yesterday
                  </span>
                </div>
                <div className="p-6 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5">
                  <h3 className="font-mono text-[10px] opacity-70 uppercase mb-2">
                    Pending Orders
                  </h3>
                  <p className="font-mono text-4xl font-bold">{pendingOrders.length}</p>
                  <span 
                    className="text-xs text-yellow-400 mt-2 block hover:underline cursor-pointer"
                    onClick={() => setActiveTab("Orders")}
                  >
                    View orders
                  </span>
                </div>
                <div className="p-6 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5">
                  <h3 className="font-mono text-[10px] opacity-70 uppercase mb-2">
                    Low Stock Alerts
                  </h3>
                  <p className="font-mono text-4xl font-bold">3</p>
                  <span
                    className="text-xs text-red-400 mt-2 block hover:underline cursor-pointer"
                    onClick={() => setActiveTab("Inventory")}
                  >
                    View items
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 border border-[#EBE6DF]/20 p-8">
                  <h3 className="font-bold uppercase tracking-widest mb-6 border-b border-[#EBE6DF]/20 pb-4">
                    Live Ticket Queue
                  </h3>
                  <div className="flex flex-col gap-4">
                    {pendingOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center p-4 bg-[#EBE6DF]/5 border border-[#EBE6DF]/10"
                      >
                        <div>
                          <span className="font-bold uppercase">
                            #{order.id}
                          </span>
                          <span className="font-mono text-[10px] opacity-60 ml-4">
                            {order.time}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <button className="text-[10px] uppercase font-bold tracking-widest bg-[#EBE6DF] text-[#252422] px-4 py-2 hover:bg-[#9F4F3B] hover:text-white transition-colors" onClick={() => { setActiveTab("Orders"); setViewingOrder(order); }}>
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-[#EBE6DF]/20 p-8 bg-[#9F4F3B] text-white">
                  <h3 className="font-bold uppercase tracking-widest mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-col gap-2 font-mono text-sm">
                    <button className="w-full text-left py-3 border-b border-white/20 hover:pl-2 transition-all">
                      Pause Online Orders &rarr;
                    </button>
                    <button
                      className="w-full text-left py-3 border-b border-white/20 hover:pl-2 transition-all"
                      onClick={() => setActiveTab("Menu")}
                    >
                      Mark Item Out of Stock &rarr;
                    </button>
                    <button className="w-full text-left py-3 border-b border-white/20 hover:pl-2 transition-all">
                      Broadcast Promo &rarr;
                    </button>
                    <button className="w-full text-left py-3 hover:pl-2 transition-all">
                      Contact Delivery Partner &rarr;
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                 <div className="lg:col-span-2 border border-[#EBE6DF]/20 p-8 bg-[#EBE6DF]/5">
                    <h3 className="font-bold uppercase tracking-widest text-lg mb-6 border-b border-[#EBE6DF]/20 pb-4">Revenue This Week</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#EBE6DF" opacity={0.1} />
                          <XAxis dataKey="name" stroke="#EBE6DF" opacity={0.5} fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#EBE6DF" opacity={0.5} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value / 1000}k`} />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }} 
                            contentStyle={{ backgroundColor: '#252422', borderColor: 'rgba(235, 230, 223, 0.2)', fontSize: '12px', fontFamily: 'monospace' }} 
                            formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Bar dataKey="revenue" fill="#9F4F3B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
                 
                 <div className="border border-[#EBE6DF]/20 p-8 bg-[#EBE6DF]/5">
                   <h3 className="font-bold uppercase tracking-widest text-lg mb-6 border-b border-[#EBE6DF]/20 pb-4">Top Selling Items</h3>
                   <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold">Jollof Rice & Chicken</span>
                         <span className="font-mono opacity-80 decoration-dotted underline">142 orders</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold">Catfish Pepper Soup</span>
                         <span className="font-mono opacity-80 decoration-dotted underline">89 orders</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold">Egusi & Pounded Yam</span>
                         <span className="font-mono opacity-80 decoration-dotted underline">76 orders</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold">Beef Suya</span>
                         <span className="font-mono opacity-80 decoration-dotted underline">65 orders</span>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "Orders" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center bg-[#EBE6DF]/5 p-4 border border-[#EBE6DF]/10">
                 <input type="text" placeholder="Search order ID..." className="bg-transparent border-b border-[#EBE6DF]/20 outline-none px-2 py-1 font-mono text-sm w-64 placeholder:opacity-50" />
                 <div className="flex gap-4">
                   <button className="text-xs uppercase font-bold tracking-widest border border-[#EBE6DF]/20 px-4 py-2 hover:bg-[#EBE6DF]/10">Filter</button>
                   <button className="text-xs uppercase font-bold tracking-widest bg-[#EBE6DF] text-[#252422] px-4 py-2">Export</button>
                 </div>
              </div>
              <table className="w-full text-left font-mono text-sm">
                <thead className="opacity-50 text-[10px] uppercase tracking-widest border-b border-[#EBE6DF]/20">
                  <tr>
                     <th className="py-4">Order ID</th>
                     <th className="py-4">Customer</th>
                     <th className="py-4">Time</th>
                     <th className="py-4">Status</th>
                     <th className="py-4 text-right">Total</th>
                     <th className="py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DF]/10">
                  {orders.map(order => {
                    const user = users.find(u => u.id === order.userId);
                    return (
                    <tr key={order.id} className="hover:bg-[#EBE6DF]/5">
                      <td className="py-4 font-bold max-w-[100px] truncate">#{order.id}</td>
                      <td className="py-4 truncate">{user?.name}</td>
                      <td className="py-4 text-opacity-50 text-white max-w-[150px] truncate">{order.time}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${order.status === "Preparing" ? "bg-yellow-500/10 text-yellow-500" : order.status === "On Route" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"}`}>
                           {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">₦{order.total.toLocaleString()}</td>
                      <td className="py-4 text-right"><button className="underline hover:text-[#9F4F3B]" onClick={() => setViewingOrder(order)}>View</button></td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Menu" && (
            <div className="flex flex-col gap-6">
              {!editingItem ? (
                <>
                  <div className="flex justify-between items-center bg-[#EBE6DF]/5 p-4 border border-[#EBE6DF]/10 mb-4">
                     <div className="font-mono text-sm opacity-50">Manage your menu items</div>
                     <button className="text-xs uppercase font-bold tracking-widest bg-[#9F4F3B] text-white px-4 py-2 hover:bg-opacity-80" onClick={() => { 
                        setEditingItem({}); setEditCategory(0); setEditIndex(-1); 
                        setNewItemName(""); setNewItemPrice(""); setNewItemDescription("");
                        setNewItemPortionSize("Standard"); setNewItemPrepTime("10 mins");
                        setNewItemSpiceLevel("Mild"); setNewItemPopularity(0);
                        setNewItemIngredients(""); setNewItemAllergens(""); setNewItemCustomization([]);
                     }}>+ Add New Item</button>
                  </div>
                  {menu.map((category, catIdx) => (
                    <div key={catIdx} className="mb-4">
                       <h2 
                         className="font-bold uppercase text-2xl mb-4 border-b border-[#EBE6DF]/20 pb-2 text-[#9F4F3B] cursor-pointer hover:opacity-80 transition-opacity flex justify-between items-center bg-[#EBE6DF]/5 p-4"
                         onClick={() => setCollapsedCategories(prev => ({ ...prev, [catIdx]: !prev[catIdx] }))}
                       >
                         {category.title}
                         <span className="text-sm font-mono opacity-50">{collapsedCategories[catIdx] ? '+' : '-'}</span>
                       </h2>
                       {!collapsedCategories[catIdx] && (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {category.items.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="p-6 border border-[#EBE6DF]/20 flex flex-col justify-between group hover:bg-[#EBE6DF]/5 transition-colors">
                                 <div>
                                    <h3 className="font-bold text-xl uppercase mb-2 line-clamp-1">{item.name}</h3>
                                    <p className="font-mono text-sm opacity-50 mb-4 text-[#9F4F3B] font-bold mx-1">{item.price}</p>
                                 </div>
                                 <div className="flex gap-2">
                                    <button onClick={() => { 
                                      setEditingItem(item); setEditCategory(catIdx); setEditIndex(itemIdx); 
                                      setNewItemName(item.name || ""); setNewItemPrice(item.price || ""); 
                                      setNewItemDescription(item.description || ""); setNewItemPortionSize(item.portionSize || "");
                                      setNewItemPrepTime(item.prepTime || ""); setNewItemSpiceLevel(item.spiceLevel || "");
                                      setNewItemPopularity(item.popularity || 0); setNewItemIngredients(item.ingredients?.join(', ') || "");
                                      setNewItemAllergens(item.allergens?.join(', ') || ""); setNewItemCustomization(item.customization || []);
                                    }} className="text-[10px] bg-[#EBE6DF] text-[#252422] px-3 py-2 font-bold uppercase tracking-widest hover:opacity-80">Edit</button>
                                    <button onClick={() => deleteMenuItem(catIdx, itemIdx)} className="text-[10px] border border-[#EBE6DF]/20 px-3 py-2 text-red-500 uppercase tracking-widest hover:bg-red-500/10">Delete</button>
                                 </div>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="border border-[#EBE6DF]/20 p-8 bg-[#EBE6DF]/5 w-full">
                   <h2 className="font-bold uppercase text-2xl mb-6 border-b border-[#EBE6DF]/20 pb-4">{editIndex === -1 ? 'Add Menu Item' : 'Edit Menu Item'}</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="flex flex-col gap-4">
                        <div>
                           <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Item Name</label>
                           <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                        </div>
                        <div>
                           <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Price (e.g., ₦1,500)</label>
                           <input type="text" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                        </div>
                        <div>
                           <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Category</label>
                           <select value={editCategory} onChange={e => setEditCategory(Number(e.target.value))} className="w-full bg-[#252422] border border-[#EBE6DF]/20 py-2 px-2 outline-none focus:border-[#9F4F3B] h-10">
                             {menu.map((c, i) => <option key={i} value={i}>{c.title}</option>)}
                           </select>
                        </div>
                        <div>
                           <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Description</label>
                           <textarea value={newItemDescription} onChange={e => setNewItemDescription(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B] h-24 resize-none" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Portion Size</label>
                             <input type="text" value={newItemPortionSize} onChange={e => setNewItemPortionSize(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                          </div>
                          <div>
                             <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Prep Time</label>
                             <input type="text" value={newItemPrepTime} onChange={e => setNewItemPrepTime(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                          </div>
                          <div>
                             <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Spice Level</label>
                             <input type="text" value={newItemSpiceLevel} onChange={e => setNewItemSpiceLevel(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                          </div>
                          <div>
                             <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Popularity (1-100)</label>
                             <input type="number" value={newItemPopularity} onChange={e => setNewItemPopularity(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                          </div>
                        </div>
                        
                        <div>
                           <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Ingredients (comma separated)</label>
                           <input type="text" value={newItemIngredients} onChange={e => setNewItemIngredients(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                        </div>
                        <div>
                           <label className="font-mono text-[10px] uppercase opacity-50 block mb-1">Allergens (comma separated)</label>
                           <input type="text" value={newItemAllergens} onChange={e => setNewItemAllergens(e.target.value)} className="w-full bg-transparent border-b border-[#EBE6DF]/20 py-2 outline-none focus:border-[#9F4F3B]" />
                        </div>
                        <div>
                           <div className="flex justify-between items-center mb-2">
                              <label className="font-mono text-[10px] uppercase opacity-50 block">Add-ons & Customizations</label>
                              <button type="button" onClick={() => setNewItemCustomization([...newItemCustomization, { name: "", price: "₦0" }])} className="text-[10px] border border-[#EBE6DF]/20 px-2 py-1 uppercase tracking-widest font-bold text-[#EBE6DF] hover:bg-[#EBE6DF]/10 transition-colors">+ Add Option</button>
                           </div>
                           <div className="flex flex-col gap-2 p-3 border border-[#EBE6DF]/10 bg-[#EBE6DF]/5">
                             {newItemCustomization.map((addon, index) => (
                               <div key={index} className="flex gap-4 items-center">
                                  <input type="text" placeholder="Name (e.g. Extra Beef)" value={addon.name} onChange={e => { const newC = [...newItemCustomization]; newC[index].name = e.target.value; setNewItemCustomization(newC); }} className="flex-1 bg-transparent border-b border-[#EBE6DF]/20 py-1 outline-none focus:border-[#9F4F3B] font-mono text-sm placeholder:opacity-30" />
                                  <input type="text" placeholder="Price (e.g. ₦500)" value={addon.price} onChange={e => { const newC = [...newItemCustomization]; newC[index].price = e.target.value; setNewItemCustomization(newC); }} className="w-24 bg-transparent border-b border-[#EBE6DF]/20 py-1 outline-none focus:border-[#9F4F3B] font-mono text-sm placeholder:opacity-30" />
                                  <button type="button" onClick={() => setNewItemCustomization(newItemCustomization.filter((_, i) => i !== index))} className="text-red-500 hover:text-red-400 font-bold px-2 bg-transparent opacity-50 hover:opacity-100">&times;</button>
                               </div>
                             ))}
                             {newItemCustomization.length === 0 && (
                               <p className="font-mono text-[10px] opacity-30 italic py-2 text-center">No add-ons defined.</p>
                             )}
                           </div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-4 pt-4 border-t border-[#EBE6DF]/20">
                      <button onClick={handleSaveItem} className="text-xs font-bold uppercase tracking-widest bg-[#9F4F3B] text-white px-8 py-3 hover:bg-opacity-80">Save Changes</button>
                      <button onClick={() => setEditingItem(null)} className="text-xs font-bold uppercase tracking-widest border border-[#EBE6DF]/20 px-8 py-3 hover:bg-[#EBE6DF]/10">Cancel</button>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Inventory" && (
            <div className="flex flex-col gap-6">
              <table className="w-full text-left font-mono text-sm">
                <thead className="opacity-50 text-[10px] uppercase tracking-widest border-b border-[#EBE6DF]/20">
                  <tr>
                     <th className="py-4">Item Name</th>
                     <th className="py-4">Stock Level</th>
                     <th className="py-4">Status</th>
                     <th className="py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DF]/10">
                  {['Beef (Regular)', 'Long Grain Rice', 'Palm Oil', 'Vegetables (Ugu)'].map((item, i) => (
                    <tr key={item} className="hover:bg-[#EBE6DF]/5">
                      <td className="py-4 font-bold uppercase">{item}</td>
                      <td className="py-4">{50 - i * 15} units</td>
                      <td className="py-4">{i > 1 ? <span className="text-red-400">Low Stock</span> : <span className="text-green-500">Good</span>}</td>
                      <td className="py-4 text-right"><button className="underline hover:text-[#9F4F3B]">Update</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Customers" && (
            <div className="flex flex-col gap-6 border border-[#EBE6DF]/20 p-8">
               <div className="flex justify-between items-center mb-4 border-b border-[#EBE6DF]/20 pb-4">
                 <h2 className="font-bold uppercase text-2xl">Customer Directory</h2>
                 <input type="text" placeholder="Search customer..." className="bg-transparent border-b border-[#EBE6DF]/20 outline-none px-2 py-1 font-mono text-sm w-48 placeholder:opacity-50" />
               </div>
               <div className="flex flex-col gap-4">
                  {users.map(u => {
                    const userOrders = orders.filter(o => o.userId === u.id);
                    const totalSpent = userOrders.filter(o => o.status === "Completed").reduce((sum, o) => sum + o.total, 0);
                    return (
                    <div key={u.id} className="flex justify-between items-center p-4 bg-[#EBE6DF]/5 border border-[#EBE6DF]/10 hover:bg-[#EBE6DF]/10 transition-colors cursor-pointer">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-[#EBE6DF]/20 rounded-full flex items-center justify-center font-bold font-sans">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-bold uppercase tracking-wider">{u.name}</p>
                          <p className="font-mono text-[10px] opacity-50">{u.email}</p>
                        </div>
                      </div>
                      <div className="font-mono text-sm text-right flex flex-col items-end gap-2">
                         <div>
                            <div className="opacity-50 text-[10px] uppercase mb-1">Total Spent</div>
                            ₦{totalSpent.toLocaleString()}
                         </div>
                         <button onClick={() => { setActiveUser(u); router.push('/dashboard/user'); }} className="text-xs border border-[#EBE6DF]/20 px-2 py-1 mt-2 hover:bg-[#EBE6DF]/10">Login as {u.name}</button>
                      </div>
                    </div>
                  )})}
               </div>
            </div>
          )}

          {activeTab === "Staff" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {['Managers', 'Chefs', 'Servers', 'Delivery Drivers'].map((role, i) => (
                  <div key={role} className="border border-[#EBE6DF]/20 p-6 flex flex-col gap-4 bg-[#EBE6DF]/5">
                     <h3 className="font-bold uppercase text-xl text-[#9F4F3B]">{role}</h3>
                     <p className="font-mono text-sm opacity-50">{3 + i} Active Members</p>
                     <button className="mt-auto border border-[#EBE6DF]/20 px-4 py-2 hover:bg-[#EBE6DF]/10 transition-colors uppercase text-[10px] tracking-widest font-bold">Manage Directory</button>
                  </div>
               ))}
            </div>
          )}

          {activeTab === "Payments & Finance" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5">
                   <h3 className="font-mono text-[10px] opacity-70 uppercase mb-4">Net Balance</h3>
                   <p className="font-mono text-4xl font-bold">₦25,400</p>
                </div>
                <div className="p-8 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5">
                   <h3 className="font-mono text-[10px] opacity-70 uppercase mb-4">Pending Payouts</h3>
                   <p className="font-mono text-4xl font-bold">₦9,000</p>
                </div>
              </div>
              <h3 className="font-bold uppercase mt-8 border-b border-[#EBE6DF]/20 pb-4 tracking-widest">Recent Transactions</h3>
              <div className="flex flex-col gap-2">
                {[1,2,3,4].map(i => (
                   <div key={i} className="flex justify-between py-4 border-b border-[#EBE6DF]/10 font-mono text-sm hover:px-2 transition-all cursor-default">
                     <div>
                       <span className="block mb-1">Payout to Bank ****123{i}</span>
                       <span className="text-[10px] opacity-50">May {10 - i}, 2026</span>
                     </div>
                     <span className="text-green-500">Completed</span>
                   </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Promotions & Marketing" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between border-b border-[#EBE6DF]/20 pb-6 mb-2">
                <h2 className="text-2xl font-bold uppercase tracking-widest">Active Campaigns</h2>
                <button className="w-fit text-xs uppercase font-bold tracking-widest bg-[#EBE6DF] text-[#252422] px-6 py-3 hover:opacity-90">Create Campaign</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#EBE6DF]/20 p-8 bg-[#9F4F3B] text-white flex flex-col justify-between h-48">
                  <div>
                    <h3 className="font-bold uppercase text-2xl mb-2 tracking-tighter">Weekend Special</h3>
                    <p className="font-mono text-xs opacity-80 uppercase">Active ending in 2 days</p>
                  </div>
                  <p className="font-mono text-xl font-bold border-t border-white/20 pt-4">15% OFF ALL COMBOS</p>
                </div>
                <div className="border border-[#EBE6DF]/20 p-8 bg-[#EBE6DF]/5 flex flex-col justify-between h-48">
                  <div>
                    <h3 className="font-bold uppercase text-2xl mb-2 tracking-tighter">First Order</h3>
                    <p className="font-mono text-xs opacity-50 uppercase">Always active</p>
                  </div>
                  <p className="font-mono text-xl font-bold text-[#EBE6DF] border-t border-[#EBE6DF]/20 pt-4">FREE DRINK</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="flex flex-col gap-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                 <div className="p-8 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5 flex flex-col items-center justify-center">
                    <p className="font-mono text-6xl font-bold text-[#9F4F3B] mb-2">4.8</p>
                    <p className="text-sm font-mono uppercase tracking-widest opacity-50">Average Rating</p>
                 </div>
                 <div className="lg:col-span-2 p-8 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5 flex flex-col justify-center">
                   {/* Mock progress bars */}
                   <div className="space-y-3 font-mono text-xs">
                     <div className="flex items-center gap-4"><span className="w-8">5★</span><div className="flex-1 h-2 bg-[#EBE6DF]/10 rounded-full overflow-hidden"><div className="h-full bg-[#9F4F3B] w-[80%]"></div></div></div>
                     <div className="flex items-center gap-4"><span className="w-8">4★</span><div className="flex-1 h-2 bg-[#EBE6DF]/10 rounded-full overflow-hidden"><div className="h-full bg-[#9F4F3B] w-[15%]"></div></div></div>
                     <div className="flex items-center gap-4"><span className="w-8">3★</span><div className="flex-1 h-2 bg-[#EBE6DF]/10 rounded-full overflow-hidden"><div className="h-full bg-[#9F4F3B] w-[3%]"></div></div></div>
                     <div className="flex items-center gap-4"><span className="w-8">2★</span><div className="flex-1 h-2 bg-[#EBE6DF]/10 rounded-full overflow-hidden"><div className="h-full bg-[#9F4F3B] w-[1%]"></div></div></div>
                     <div className="flex items-center gap-4"><span className="w-8">1★</span><div className="flex-1 h-2 bg-[#EBE6DF]/10 rounded-full overflow-hidden"><div className="h-full bg-[#9F4F3B] w-[1%]"></div></div></div>
                   </div>
                 </div>
               </div>
               {reviews.map((review) => {
                 const u = users.find(user => user.id === review.userId);
                 return (
                 <div key={review.id} className="border border-[#EBE6DF]/20 p-6 bg-[#EBE6DF]/5">
                   <div className="flex justify-between items-center mb-4 border-b border-[#EBE6DF]/10 pb-4">
                     <span className="font-bold uppercase tracking-wider">{u?.name || "Customer"}</span>
                     <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] opacity-50">{review.itemName}</span>
                        <span className="text-[#9F4F3B] font-bold font-mono bg-[#9F4F3B]/10 px-3 py-1">{review.rating} / 5</span>
                     </div>
                   </div>
                   <p className="font-serif text-lg opacity-80 italic">&quot;{review.comment}&quot;</p>
                 </div>
               )})}
            </div>
          )}

          {activeTab === "Delivery" && (
            <div className="flex flex-col gap-6">
               <div className="p-8 border border-[#EBE6DF]/20 bg-[#EBE6DF]/5 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                   <h2 className="font-bold uppercase text-2xl mb-2 tracking-widest text-[#9F4F3B]">Dispatch Status</h2>
                   <p className="font-mono text-sm opacity-50">4 Drivers active in your area.</p>
                 </div>
                 <button className="text-xs uppercase font-bold tracking-widest bg-[#EBE6DF] text-[#252422] px-6 py-4 transition-transform active:scale-95">Ping Drivers</button>
               </div>
               <table className="w-full text-left font-mono text-sm mt-4">
                <thead className="opacity-50 text-[10px] uppercase tracking-widest border-b border-[#EBE6DF]/20">
                  <tr>
                     <th className="py-4">Driver</th>
                     <th className="py-4">Status</th>
                     <th className="py-4 text-right">Current Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DF]/10">
                  {['John Doe', 'Michael A.', 'Sarah B.'].map((driver, i) => (
                    <tr key={driver} className="hover:bg-[#EBE6DF]/5">
                      <td className="py-4 font-bold uppercase">{driver}</td>
                      <td className="py-4"><span className="text-green-500 bg-green-500/10 px-2 py-1 uppercase text-[10px] font-bold tracking-widest">On Route</span></td>
                      <td className="py-4 text-right">#ORD-90{i + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Reports & Analytics" && (
            <div className="flex flex-col gap-6">
              <div className="h-72 border border-[#EBE6DF]/20 flex flex-col items-center justify-center bg-[#EBE6DF]/5 p-8 relative overflow-hidden">
                 <h3 className="absolute top-6 left-6 font-bold uppercase tracking-widest">Sales Velocity</h3>
                 {/* Visual Mock of a chart */}
                 <div className="flex items-end gap-2 h-32 mt-8 w-full justify-center opacity-50">
                   {[30, 45, 25, 60, 80, 50, 90, 70, 40].map((h, i) => (
                      <div key={i} className="w-8 bg-[#9F4F3B] transition-all duration-1000" style={{ height: `${h}%` }}></div>
                   ))}
                 </div>
                 <div className="absolute bottom-6 font-mono opacity-50 text-xs w-full text-center border-t border-[#EBE6DF]/10 pt-4">Last 9 Days Performance</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="border border-[#EBE6DF]/20 p-8 bg-[#EBE6DF]/5">
                  <h3 className="font-bold uppercase mb-6 text-xl tracking-tighter">Top Selling Items</h3>
                  <ol className="list-decimal pl-4 font-mono text-sm opacity-80 flex flex-col gap-4">
                    <li className="border-b border-[#EBE6DF]/10 pb-2">Egusi Soup <span className="float-right text-[#9F4F3B] font-bold">142 orders</span></li>
                    <li className="border-b border-[#EBE6DF]/10 pb-2">Jollof Rice <span className="float-right text-[#9F4F3B] font-bold">89 orders</span></li>
                    <li className="border-b border-[#EBE6DF]/10 pb-2">Plantain <span className="float-right text-[#9F4F3B] font-bold">64 orders</span></li>
                  </ol>
                </div>
                <div className="border border-[#EBE6DF]/20 p-8 bg-[#EBE6DF]/5 flex flex-col justify-center">
                  <h3 className="font-bold uppercase mb-4 text-xl tracking-tighter">Customer Retention</h3>
                  <p className="font-mono text-6xl font-bold text-[#9F4F3B]">64%</p>
                  <p className="font-mono text-xs opacity-50 mt-4 border-t border-[#EBE6DF]/10 pt-4">Returning customers this month</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="max-w-3xl flex flex-col gap-8">
               <div className="border border-[#EBE6DF]/20 p-8 flex flex-col gap-8 bg-[#EBE6DF]/5">
                  <h2 className="font-bold uppercase text-2xl border-b border-[#EBE6DF]/20 pb-4">General Settings</h2>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest opacity-50 block mb-2">Restaurant Name</label>
                    <input type="text" defaultValue="The Daily Knead" className="w-full bg-transparent border-b border-[#EBE6DF]/50 py-2 outline-none font-bold text-xl transition-colors focus:border-[#9F4F3B]" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest opacity-50 block mb-2">Contact Email</label>
                    <input type="email" defaultValue="hello@thedailyknead.com" className="w-full bg-transparent border-b border-[#EBE6DF]/50 py-2 outline-none font-mono focus:border-[#9F4F3B]" />
                  </div>
                  <div className="border border-[#EBE6DF]/10 p-4 mt-2">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#9F4F3B] bg-[#252422]" />
                      <span className="font-mono text-sm">Accepting New Orders</span>
                    </label>
                  </div>
                  <div className="flex gap-4 mt-6 pt-6 border-t border-[#EBE6DF]/10">
                     <button className="text-xs uppercase font-bold tracking-widest bg-[#9F4F3B] text-white px-8 py-4 hover:bg-opacity-90 transition-colors">Save Changes</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Viewing Order Modal */}
      {viewingOrder && (
         <div className="fixed inset-0 bg-[#252422]/90 z-50 flex items-center justify-center p-4">
            <div className="bg-[#EBE6DF] text-[#252422] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="font-bold uppercase text-2xl tracking-tighter">Order #{viewingOrder.id}</h2>
                   <p className="font-mono text-xs opacity-60 mt-1">{viewingOrder.time}</p>
                 </div>
                 <button 
                   onClick={() => setViewingOrder(null)}
                   className="w-8 h-8 flex items-center justify-center border border-[#252422] hover:bg-[#252422] hover:text-[#EBE6DF] transition-colors"
                 >
                   &times;
                 </button>
               </div>
               
               <div className="flex gap-4 mb-8">
                  <span className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${viewingOrder.status === 'Preparing' ? 'bg-yellow-500/20 text-yellow-700' : viewingOrder.status === 'On Route' ? 'bg-blue-500/20 text-blue-700' : 'bg-green-500/20 text-green-700'}`}>
                     {viewingOrder.status}
                  </span>
                  <span className="font-mono text-xs bg-[#252422]/10 px-3 py-1 font-bold">Total: ₦{viewingOrder.total.toLocaleString()}</span>
               </div>
               
               <h3 className="font-bold uppercase tracking-widest border-b border-[#252422]/20 pb-2 mb-4">Items</h3>
               <div className="flex flex-col gap-4 mb-8 border-b border-[#252422]/20 pb-8">
                 {viewingOrder.items.map((item: any, idx: number) => (
                   <div key={idx} className="flex justify-between font-mono text-sm border border-[#252422]/10 p-4 bg-white">
                      <div className="flex flex-col gap-1">
                         <span className="font-bold">{item.quantity}x {item.name}</span>
                         {item.addons && item.addons.length > 0 && (
                            <span className="text-xs opacity-60">Add-ons: {item.addons.map((a: any) => `${a.name} (${a.qty})`).join(", ")}</span>
                         )}
                      </div>
                      <span className="font-bold">₦{item.totalItemPrice?.toLocaleString() || (item.price * item.quantity).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
               
               <div className="flex flex-wrap gap-4 mt-8">
                  <button onClick={() => setViewingOrder(null)} className="text-xs font-bold uppercase tracking-widest bg-[#252422] text-[#EBE6DF] px-6 py-3 hover:bg-opacity-90">Close</button>
                  <button className="text-xs font-bold uppercase tracking-widest border border-[#252422] px-6 py-3 hover:bg-[#252422]/10">Print Receipt</button>
                  {viewingOrder.status === 'Preparing' && (
                     <button onClick={() => { updateOrderStatus(viewingOrder.id, 'On Route'); setViewingOrder({...viewingOrder, status: 'On Route'}); }} className="text-xs font-bold uppercase tracking-widest bg-blue-600 text-white px-6 py-3 ml-auto hover:bg-blue-700">Mark as On Route</button>
                  )}
                  {viewingOrder.status === 'On Route' && (
                     <button onClick={() => { updateOrderStatus(viewingOrder.id, 'Completed'); setViewingOrder({...viewingOrder, status: 'Completed'}); }} className="text-xs font-bold uppercase tracking-widest bg-green-600 text-white px-6 py-3 ml-auto hover:bg-green-700">Mark as Completed</button>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
