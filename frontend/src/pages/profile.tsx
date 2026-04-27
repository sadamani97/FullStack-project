import { useEffect, useRef, useState, FC } from "react";
import API from "../services/api";
import Layout from "../components/Layout.tsx";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";

interface FormData {
  name: string;
  email: string;
  profilePic: string;
}

const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState<FormData>({ name: "", email: "", profilePic: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, profilePic: user.profilePic || "" });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/profile");
      dispatch(setProfile(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError("Image size must be less than 5MB");
        return;
      }

      const base64 = await convertBase64(file);
      setPreview(base64 as string);
      setForm((prev) => ({ ...prev, profilePic: base64 as string }));
      setError("");
    } catch (err) {
      console.error("Upload Error", err);
      setError("Failed to upload image. Please try again.");
    }
  };

  const convertBase64 = (file: File): Promise<string | ArrayBuffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
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
    } catch (err: any) {
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
                onClick={() => fileInputRef.current?.click()}
              >
                ✏
              </button>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handleUpload}
          />

          {isEdit ? (
            <>
              <input
                className="profile-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="profile-input"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="profile-button-group">
                <button className="btn-profile-save" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="btn-profile-cancel"
                  onClick={() => {
                    setIsEdit(false);
                    setPreview("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <button className="btn-edit-profile" onClick={() => setIsEdit(true)}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
