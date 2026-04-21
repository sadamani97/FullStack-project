import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", code: "", population: "", flag: "", region: "", capital: ""
  });

  const fetchCountries = async () => {
    try {
      setError("");
      const params = {};
      if (region) params.region = region;
      if (search) params.search = search;
      const res = await API.get("/api/countries", { params });
      setCountries(res.data);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to fetch countries";
      setError(errorMsg);
    }
  };

 useEffect(() => { fetchCountries(); }, [region, search]);

  const openAdd = () => {
    setEditingCountry(null);
    setForm({ name: "", code: "", population: "", flag: "", region: "", capital: "" });
    setShowForm(true);
  };

  const openEdit = (e, c) => {
    e.stopPropagation(); // don't navigate to detail page
    setEditingCountry(c);
    setForm({ name: c.name, code: c.code, population: c.population, flag: c.flag, region: c.region, capital: c.capital });
    setShowForm(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this country?")) return;
    try {
      await API.delete(`/api/countries/${id}`);
      fetchCountries();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete country";
      setError(errorMsg);
    }
  };

  const handleSubmit = async () => {
    try {
      setError("");
      if (!form.name || !form.code || !form.population || !form.region || !form.capital) {
        setError("All fields are required");
        return;
      }
      
      if (editingCountry) {
        await API.put(`/api/countries/${editingCountry.id}`, form);
      } else {
        await API.post("/api/countries", form);
      }
      setShowForm(false);
      fetchCountries();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error saving country";
      setError(errorMsg);
    }
  };



return (
    <Layout search={search} setSearch={setSearch}>
      <div className="ds-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Countries</h2>
          <button onClick={openAdd}>+ Add Country</button>
        </div>

        {error && <div style={{ color: "red", marginBottom: "10px", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px" }}>{error}</div>}

        <div className="filter">
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Filter by Region</option>
            <option value="Europe">Europe</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Africa">Africa</option>
          </select>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingCountry ? "Edit Country" : "Add Country"}</h3>
              {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
              {["name","code","population","flag","region","capital"].map((field) => (
                <input key={field} placeholder={field} value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              ))}
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button onClick={handleSubmit}>Save</button>
                <button onClick={() => { setShowForm(false); setError(""); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="country-grid">
          {countries.map((c) => (
            <div className="country-card" key={c.id}
              onClick={() => navigate(`/country/${c.id}`, { state: c })}>
              <img src={c.flag} alt={c.name} />
              <div className="country-info">
                <h3>{c.name}</h3>
                <p><strong>Population:</strong> {Number(c.population).toLocaleString()}</p>
                <p><strong>Region:</strong> {c.region}</p>
                <p><strong>Capital:</strong> {c.capital}</p>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  <button className="kbtn" onClick={(e) => openEdit(e, c)}>Edit</button>
                  <button className="kbtn" onClick={(e) => handleDelete(e, c.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;








//   return (
//     <Layout search={search} setSearch={setSearch}>
//       <div className="ds-container">      
//         <h2>Countries</h2>
//       <div className="filter">
//       <select value={region} onChange={(e) => setRegion(e.target.value)}>
//         <option value="">Filter by Region</option>
//         <option value="Europe">Europe</option>
//         <option value="Americas">Americas</option>
//         <option value="Asia">Asia</option>
//         <option value="Africa">Africa</option>
//       </select>
//       </div>


//       <div className="country-grid">
//         {filteredCountries.map((c) => (
//           <div
//             className="country-card"
//             key={c.id}
//             onClick={() => viewCountry(c)}
//           >
//             <img src={c.flag} alt={c.name} />
//             <div className="country-info">
//               <h3>{c.name}</h3>
//               <p>
//                 <strong>Population:</strong> {c.population.toLocaleString()}
//               </p>
//               <p>
//                 <strong>Region:</strong> {c.region}
//               </p>
//               <p>
//                 <strong>Capital:</strong> {c.capital}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//       </div>

//     </Layout>
//   );
// };

// export default Dashboard;

















