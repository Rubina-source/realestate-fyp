import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import { Camera, LogOut, Trash2, Briefcase, Phone, AlignLeft } from 'lucide-react';

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => { setFilePerc(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)); },
      (error) => { dispatch(updateUserFailure("Upload failed")); },
      () => { getDownloadURL(uploadTask.snapshot.ref).then((url) => setFormData({ ...formData, avatar: url })); }
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
      alert("Profile updated successfully!");
    } catch (error) { dispatch(updateUserFailure(error.message)); }
  };

  if (!currentUser) return <div className='pt-40 text-center'>Please log in.</div>;

  return (
    <div className='p-6 pt-32 max-w-5xl mx-auto min-h-screen'>
      <div className='bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-slate-100'>
        <div className='h-32 bg-[#E0F2F1] w-full'></div>
        <div className='p-10 pt-0'>
          <div className='flex items-end gap-6 -mt-16 mb-10'>
            <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
            <img src={formData.avatar || currentUser.avatar} alt='pfp' className='rounded-full h-32 w-32 object-cover border-4 border-white shadow-xl cursor-pointer' onClick={() => fileRef.current.click()} />
            <div className='pb-4'>
              <h1 className='text-2xl font-black text-[#1F3E35] uppercase'>{currentUser.username}</h1>
              <p className='text-xs font-bold text-[#E7C873] uppercase tracking-[3px]'>{currentUser.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-2'>Full Name</label>
              <input type='text' id='username' defaultValue={currentUser.username} onChange={handleChange} className='w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold border focus:border-[#1F3E35]' />
            </div>

            <div className='space-y-2'>
              <label className='text-[10px] font-black text-slate-400 uppercase ml-2'>Email Address</label>
              <input type='email' id='email' defaultValue={currentUser.email} onChange={handleChange} className='w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold border focus:border-[#1F3E35]' />
            </div>

            {/* --- BROKER ONLY FIELDS --- */}
            {(currentUser.role === 'broker' || currentUser.role === 'admin') && (
              <>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-slate-400 uppercase ml-2'>Phone Number</label>
                  <div className='relative'>
                    <Phone className='absolute left-4 top-4 text-slate-300' size={16} />
                    <input type='text' id='phone' placeholder='+977' defaultValue={currentUser.phone} onChange={handleChange} className='w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none text-xs font-bold border focus:border-[#1F3E35]' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-slate-400 uppercase ml-2'>Specialization</label>
                  <div className='relative'>
                    <Briefcase className='absolute left-4 top-4 text-slate-300' size={16} />
                    <select id='specialization' defaultValue={currentUser.specialization} onChange={handleChange} className='w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none text-xs font-bold border focus:border-[#1F3E35] appearance-none'>
                      <option value="Residential">Residential Houses</option>
                      <option value="Rental">Rental Properties</option>
                      <option value="Commercial">Commercial/Offices</option>
                      <option value="Land">Land/Plots</option>
                    </select>
                  </div>
                </div>

                <div className='md:col-span-2 space-y-2'>
                  <label className='text-[10px] font-black text-slate-400 uppercase ml-2'>Professional Bio</label>
                  <div className='relative'>
                    <AlignLeft className='absolute left-4 top-4 text-slate-300' size={16} />
                    <textarea id='bio' rows='4' placeholder='Tell clients about your experience...' defaultValue={currentUser.bio} onChange={handleChange} className='w-full bg-slate-50 p-4 pl-12 rounded-2xl outline-none text-xs font-bold border focus:border-[#1F3E35]'></textarea>
                  </div>
                </div>
              </>
            )}

            <button disabled={loading} className='md:col-span-2 bg-[#1F3E35] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[4px] hover:bg-black transition-all shadow-lg'>
              {loading ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>

          <div className='flex justify-between mt-10 pt-6 border-t border-slate-50'>
            <button onClick={() => dispatch(signOutUserSuccess())} className='flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase hover:text-black'><LogOut size={14} /> Sign Out</button>
            <button className='flex items-center gap-2 text-red-300 font-bold text-[10px] uppercase hover:text-red-600'><Trash2 size={14} /> Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}