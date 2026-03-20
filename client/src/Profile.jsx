import React from 'react';
import { User, Settings, Heart, List, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  return (
    <div className="bg-[#fcfcfc] min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-slate-50">
          <div className="bg-[#1F3E35] h-32 w-full relative"></div>
          
          <div className="px-12 pb-12">
            <div className="flex flex-col md:flex-row items-end -translate-y-12 gap-6">
              <div className="w-32 h-32 rounded-full border-[6px] border-white bg-slate-200 overflow-hidden shadow-lg">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="w-full h-full object-cover opacity-80" alt="avatar" />
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-black text-[#1F3E35] uppercase tracking-tighter leading-none">Rubina Chhahari</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Member since Sep 2025</p>
              </div>
              <div className="pb-2">
                <span className="bg-[#E7C873] text-[#1F3E35] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-md">
                  Active Client
                </span>
              </div>
            </div>

            {/* Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[
                { icon: <Heart size={20}/>, title: "My Wishlist", count: "3 Saved" },
                { icon: <List size={20}/>, title: "My Inquiries", count: "1 Pending" },
                { icon: <Settings size={20}/>, title: "Account Settings", count: "Personal Info" },
                { icon: <LogOut size={20} className="text-red-500"/>, title: "Sign Out", count: "Secure Session", isDanger: true }
              ].map((item, i) => (
                <div key={i} className={`group p-6 rounded-[30px] border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all ${item.isDanger ? 'hover:border-red-100' : 'hover:border-[#E7C873]'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`${item.isDanger ? 'text-red-500' : 'text-[#1F3E35]'} opacity-70`}>{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-700 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.count}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-[#1F3E35] transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-[4px] mt-12">
          GharRush Secure Dashboard v1.0
        </p>
      </div>
    </div>
  );
};

export default Profile;