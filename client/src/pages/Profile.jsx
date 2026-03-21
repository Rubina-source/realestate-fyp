import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { 
  updateUserStart, updateUserSuccess, updateUserFailure, 
  deleteUserStart, deleteUserSuccess, deleteUserFailure,  
  signOutUserStart, signOutUserSuccess, signOutUserFailure
} from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, LogOut, Loader2 } from 'lucide-react';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultAvatar = "https://images.icon-icons.com/1674/PNG/512/person_110935.png";

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setFileUploadError(false);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => { 
        setFileUploadError(true); 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      alert("Profile Updated Successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Permanent action: Delete your account?")) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  if (!currentUser) return <div className='pt-40 text-center font-bold text-slate-500'>Please log in to view profile.</div>;

  return (
    <div className='p-6 pt-32 max-w-5xl mx-auto min-h-screen bg-[#fcfcfc]'>
      <div className='bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100'>
        
        {/* TOP BANNER (Light Blue from your reference) */}
        <div className='h-28 bg-[#E0F2F1] w-full'></div>

        <div className='p-10 pt-0'>
          {/* PHOTO SECTION */}
          <div className='flex flex-wrap items-end gap-6 -mt-14 mb-10'>
            <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
            <img
              src={formData.avatar || currentUser?.avatar || defaultAvatar}
              alt='profile'
              className='rounded-full h-32 w-32 object-cover border-4 border-white shadow-md bg-white'
            />
            <div className='flex gap-4 pb-4'>
              <button onClick={() => fileRef.current.click()} className='text-[#26A69A] font-bold hover:underline text-xs uppercase tracking-wider'>Change Photo</button>
              <button onClick={() => setFormData({...formData, avatar: defaultAvatar})} className='text-slate-400 font-bold hover:underline text-xs uppercase tracking-wider'>Remove</button>
            </div>
            {filePerc > 0 && filePerc < 100 && (
                <span className='pb-4 text-[10px] font-black text-[#1F3E35]'>UPLOADING: {filePerc}%</span>
            )}
            {fileUploadError && (
                <span className='pb-4 text-[10px] font-black text-red-500'>UPLOAD ERROR (MAX 2MB)</span>
            )}
          </div>

          {/* FORM GRID (Horizontal layout matching reference) */}
          <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='flex flex-col gap-2'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>Username *</label>
              <input type='text' id='username' defaultValue={currentUser?.username} onChange={handleChange} className='border border-slate-200 p-4 rounded-xl outline-none focus:border-[#1F3E35] text-xs font-medium bg-slate-50/50' />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>Email Address *</label>
              <input type='email' id='email' defaultValue={currentUser?.email} onChange={handleChange} className='border border-slate-200 p-4 rounded-xl outline-none focus:border-[#1F3E35] text-xs font-medium bg-slate-50/50' />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-1'>Account Role</label>
              <input type='text' disabled value={currentUser?.role} className='border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-300 uppercase bg-transparent' />
            </div>

            <div className='flex items-end'>
               <button type='button' className='w-full border-2 border-slate-100 p-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition text-[10px] uppercase tracking-widest'>Change Password</button>
            </div>

            <div className='flex items-end lg:col-span-2'>
              <button disabled={loading} className='w-full bg-[#1F3E35] text-white p-4 rounded-xl font-black hover:bg-black shadow-lg transition uppercase text-[10px] tracking-[3px] flex justify-center items-center gap-2'>
                {loading ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : 'Save Updates'}
              </button>
            </div>
          </form>

          {/* ACCOUNT ACTIONS */}
          <div className='mt-12 pt-6 border-t border-slate-50 flex justify-between items-center'>
             <button onClick={handleSignOut} className='flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase hover:text-black transition-colors'>
                <LogOut size={14}/> Sign Out
             </button>
             <button onClick={handleDeleteUser} className='flex items-center gap-2 text-red-300 font-bold text-[10px] uppercase hover:text-red-600 transition-colors'>
                <Trash2 size={14}/> Delete Account
             </button>
          </div>
        </div>
      </div>

      {/* --- FAVORITES SECTION --- */}
      <div className='mt-12'>
        <div className='flex items-center justify-between mb-6'>
            <h2 className='flex items-center gap-2 text-lg font-black text-[#1F3E35] uppercase tracking-tighter'>
                <Heart className='text-red-500' fill='currentColor' size={20} /> Saved Properties
            </h2>
            <Link to='/listings' className='text-[10px] font-black text-[#E7C873] uppercase underline decoration-2 underline-offset-4'>Explore More</Link>
        </div>
        
        <div className='bg-white p-16 rounded-[40px] border-2 border-dashed border-slate-100 text-center shadow-inner'>
            <p className='text-slate-300 text-[11px] font-bold uppercase tracking-[4px]'>Your wishlist is currently empty</p>
        </div>
      </div>
    </div>
  );
}