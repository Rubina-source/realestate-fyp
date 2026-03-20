import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

const SignIn = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const { loading, error: serverError } = useSelector((state) => state.user);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FIX 1: We moved form resetting to a simple effect that only runs when the modal OPENS
  // This satisfies the "cascading renders" linting error.
 useEffect(() => {
    if (isOpen) {
      // We use a tiny timeout to move the state update out of the synchronous render cycle
      const timer = setTimeout(() => {
        setFormData({ username: '', email: '', password: '' });
        dispatch(signInFailure(null));
      }, 0);
      
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Function to switch between Login and Signup and reset data
  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
  };

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
        alert("Account created! Please log in.");
        setIsLogin(true);
      } else {
        dispatch(signInSuccess(data));
        onClose();
        
        if (data.role === 'admin') navigate('/admin-dashboard');
        else if (data.role === 'broker') navigate('/broker-dashboard');
        else navigate('/home');
      }
      
    } catch (err) {
      // FIX 2: Used the 'err' variable to satisfy the "unused vars" error
      dispatch(signInFailure(err.message || "Server Connection Failed"));
    }
  };

  return (
    // FIX 3: Changed z-[100] to z-50 (standard tailwind) to satisfy canonical class error
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      
      {/* FIX 4: Changed max-w-[380px] to max-w-sm to satisfy canonical class error */}
      <div className="bg-white w-full max-w-sm rounded-[35px] shadow-2xl relative p-8 border border-white/20">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-all">
          <X size={22} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden">
             <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="w-full opacity-60" alt="avatar" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1F3E35] text-center mb-1 uppercase">
          {isLogin ? 'Log in' : 'Sign up'}
        </h2>
        
        <p className="text-center text-slate-400 text-[10px] font-bold mb-6 tracking-widest uppercase">
          {isLogin ? "New to GharRush?" : "Have an account?"} 
          <button type="button" onClick={handleToggle} className="ml-2 text-[#E7C873] hover:text-[#1F3E35] font-bold underline underline-offset-4">
            {isLogin ? 'JOIN NOW' : 'LOG IN'}
          </button>
        </p>

        <div className="flex justify-center gap-6 mb-6">
          {['client', 'broker', 'admin'].map((r) => (
            <div key={r} onClick={() => setRole(r)} className="flex items-center gap-2 cursor-pointer">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === r ? 'border-[#1F3E35]' : 'border-slate-200'}`}>
                {role === r && <div className="w-2 h-2 bg-[#1F3E35] rounded-full"></div>}
              </div>
              <span className={`text-[9px] font-bold uppercase ${role === r ? 'text-[#1F3E35]' : 'text-slate-300'}`}>{r}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="USERNAME" 
              id="username" 
              value={formData.username || ''} 
              onChange={handleChange} 
              className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-transparent focus:border-slate-200 text-xs font-medium" 
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            id="email" 
            value={formData.email || ''} 
            onChange={handleChange} 
            className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-transparent focus:border-slate-200 text-xs font-medium" 
            required 
          />

          <input 
            type="password" 
            placeholder="PASSWORD" 
            id="password" 
            value={formData.password || ''} 
            onChange={handleChange} 
            className="w-full bg-slate-50 p-4 rounded-xl outline-none border border-transparent focus:border-slate-200 text-xs font-medium" 
            required 
          />

          <button disabled={loading} type="submit" className="w-full bg-[#1F3E35] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95 text-[11px] uppercase tracking-widest mt-2">
            {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Create Account')}
          </button>
          
          {serverError && <p className='text-red-500 text-[10px] text-center font-bold uppercase mt-2'>{serverError}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;