import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name: "", email: "", profilePic: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, profilePic: user.profilePic || "" });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/profile");
      dispatch(setProfile(res.data));
    } catch (err) { console.log(err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // Check file size (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        setError("Image size must be less than 5MB");
        return;
      }

      const base64 = await convertBase64(file);
      setPreview(base64);
      setForm((prev) => ({ ...prev, profilePic: base64 }));
      setError("");
    } catch (err) {
      console.error("Upload Error", err);
      setError("Failed to upload image. Please try again.");
    }
  };

  const convertBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");
      
      if (!form.name || !form.email) {
        setError("Name and email are required");
        return;
      }

      const res = await API.put("/api/profile/update", form);
      dispatch(setProfile(res.data));
      setPreview("");
      setIsEdit(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) { 
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to update profile";
      setError(errorMsg);
    }
  };

  return (
    <Layout search={search} setSearch={setSearch}>
      <div className="profile-page">
        <div className="profile-card">
          
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          
          <div className="profile-pic-container">
            <img
              src={preview || form.profilePic || "https://i.pravatar.cc/150"}
              className="profile-img-large"
            />
            {isEdit && (
              <button
                className="profile-edit-btn"
                onClick={() => fileInputRef.current.click()}
              >
                ✏
              </button>
            )}
          </div>

          <input
            type="file" accept="image/*"
            ref={fileInputRef} hidden
            onChange={handleUpload}
          />

          {isEdit ? (
            <>
              <input className="profile-input" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
              <input className="profile-input" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
              <div className="profile-button-group">
                <button className="btn-profile-save" onClick={handleSave}>Save</button>
                <button className="btn-profile-cancel" onClick={() => { setIsEdit(false); setPreview(""); setError(""); }}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <button className="btn-edit-profile" onClick={() => setIsEdit(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;





// import { useEffect, useState } from "react";
// import API from "../services/api";
// import Layout from "../components/Layout";
// import { useDispatch, useSelector } from "react-redux";
// import { setProfile } from "../redux/authSlice";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const { user} = useSelector((state) => state.auth);

//   const [isEdit, setIsEdit] = useState(false);
//   const [search, setSearch] = useState("");
//   const [preview,setPreview] = useState("")

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     profilePic: "",
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       setForm({
//         name: user.name,
//         email: user.email,
//         profilePic: user.profilePic || "",
//       });
//     }
//   }, [user]);

//   const fetchProfile = async () => {
//     try {
//       const res = await API.get("/api/profile");
//       dispatch(setProfile(res.data));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleUpload = async (e) => {
//     try {
//       const file = e.target.files[0];
//       if (!file) return;
    
        

//       const base64 = await convertBase64(file);

//     setForm((prev) => ({
//       ...prev,
//       profilePic: base64,
//     }));

//   } catch (err) {
//     console.error("Upload Error", err);
//     }
//   }

//   const convertBase64 = (file) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//     });
//   };

//   const handleSave = async () => {
//     try {
//       const res = await API.put("/api/profile/update", form);

//       dispatch(setProfile(res.data));
//       setIsEdit(false);
//       setPreview("")
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <Layout search={search} setSearch={setSearch}>
//       <div className="profile-page">
//         <div className="profile-card">
//             <label>
//           <img
//             src={preview || form.profilePic || "https://i.pravatar.cc/150"}
//             className="profile-img"
//           />

//           {isEdit ? (
//             <>
//                 <input type="file"
//                 accept="image/*"
//                 onChange={handleUpload}
//                 hidden/>
//               <input name="name" value={form.name} onChange={handleChange} />
//               <input name="email" value={form.email} onChange={handleChange} />

//               <button onClick={handleSave}>Save</button>
//               <button onClick={() => setIsEdit(false)}>Cancel</button>
//             </>
//           ) : (
//             <>
//               <h2>{user?.name}</h2>
//               <p>{user?.email}</p>

//               <button onClick={() => setIsEdit(true)}>Edit Profile</button>
//             </>
//           )}
//           </label>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Profile;









