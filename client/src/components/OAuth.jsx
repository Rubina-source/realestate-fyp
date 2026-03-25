import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

// We receive 'selectedRole' as a prop from SignIn.jsx
export default function OAuth({ selectedRole }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          role: selectedRole, // Send the chosen role to the backend
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      
      const userRole = data.role.toLowerCase();
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'broker') {
        navigate('/broker-dashboard');
      } else {
        // Normal clients go Home
        navigate('/');
      }

      // REDIRECT LOGIC
      const role = data.role.toLowerCase();
      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'broker') navigate('/broker-dashboard');
      else navigate('/client-dashboard');

    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  return (
    <button onClick={handleGoogleClick} type='button' className='w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm mt-2 cursor-pointer'>
      <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-4" alt="google" />
      Continue with Google
    </button>
  );
}