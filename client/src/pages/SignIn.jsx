import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

const SignIn = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const { loading, error: serverError } = useSelector((state) => state.user || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Reset form and errors when modal opens or toggles
  useEffect(() => {
    if (isOpen) {
      setFormData({ username: '', email: '', password: '' });
      dispatch(signInFailure(null));
    }
  }, [isOpen, isLogin, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ... (Keep existing imports and state)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(isLogin ? '/api/auth/signin' : '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      if (!isLogin) {
        alert("Account created successfully!");
        setIsLogin(true);
        dispatch(signInFailure(null));
        setFormData({ username: '', email: '', password: '' });
      } else {
        dispatch(signInSuccess(data));
        onClose();
        
        // REDIRECT LOGIC: Only Admins and Brokers go to special dashboards
        const userRole = data.role.toLowerCase();
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else if (userRole === 'broker') {
          navigate('/broker-dashboard');
        } else {
          // Clients go to Home Page
          navigate('/');
        }
      }
    } catch (err) {
      dispatch(signInFailure("Server Connection Failed"));
    }
  };

// ... (Keep the rest of the file)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[340px] rounded-[30px] shadow-2xl relative p-6 border border-white/20">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center overflow-hidden">
             <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="w-full opacity-60" alt="avatar" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#1F3E35] text-center mb-1 uppercase tracking-tight">{isLogin ? 'Log in' : 'Sign up'}</h2>
        <p className="text-center text-slate-400 text-[9px] font-bold mb-5 tracking-widest uppercase">
          {isLogin ? "New to GharRush?" : "Have an account?"} 
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#E7C873] hover:text-[#1F3E35] font-bold underline underline-offset-4">{isLogin ? 'JOIN NOW' : 'LOG IN'}</button>
        </p>
        <div className="flex justify-center gap-5 mb-5">
          {['client', 'broker', 'admin'].map((r) => (
            <div key={r} onClick={() => setRole(r)} className="flex items-center gap-2 cursor-pointer">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${role === r ? 'border-[#1F3E35]' : 'border-slate-300'}`}>
                {role === r && <div className="w-2 h-2 bg-[#1F3E35] rounded-full"></div>}
              </div>
              <span className={`text-[9px] font-bold uppercase ${role === r ? 'text-[#1F3E35]' : 'text-slate-500'}`}>{r}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          {!isLogin && <input type="text" placeholder="USERNAME" id="username" value={formData.username} onChange={handleChange} className="w-full bg-slate-50 p-3 rounded-xl outline-none border focus:border-slate-200 text-xs font-medium" required />}
          <input type="email" placeholder="EMAIL ADDRESS" id="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 p-3 rounded-xl outline-none border focus:border-slate-200 text-xs font-medium" required />
          <input type="password" placeholder="PASSWORD" id="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-50 p-3 rounded-xl outline-none border focus:border-slate-200 text-xs font-medium" required />
          <button disabled={loading} type="submit" className="w-full bg-[#1F3E35] text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-black transition-all text-[10px] uppercase tracking-widest flex justify-center items-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={14} /> Processing</> : (isLogin ? 'Log in' : 'Create Account')}
          </button>
          <OAuth selectedRole={role} />
          {serverError && <p className='text-red-500 text-[9px] text-center font-bold uppercase mt-2'>{serverError}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;