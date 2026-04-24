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
    name: "",
    code: "",
    population: "",
    flag: "",
    region: "",
    capital: "",
    states: [],
  });
  const [newState, setNewState] = useState({ name: "", population: "" });

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

  useEffect(() => {
    fetchCountries();
  }, [region, search]);

  const openAdd = () => {
    setEditingCountry(null);
    setForm({
      name: "",
      code: "",
      population: "",
      flag: "",
      region: "",
      capital: "",
      states: [],
    });
    setNewState({ name: "", population: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (e, c) => {
    e.stopPropagation();
    setEditingCountry(c);
    setForm({
      name: c.name,
      code: c.code,
      population: c.population,
      flag: c.flag,
      region: c.region,
      capital: c.capital,
      states: c.states || [],
    });
    setNewState({ name: "", population: "" });
    setError("");
    setShowForm(true);
  };

  const handleDeleteCountry = async (e, id) => {
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

  const addState = () => {
    if (!newState.name || !newState.population) {
      alert("Please enter state name and population");
      return;
    }
    const stateData = {
      name: newState.name,
      population: Number(newState.population),
    };
    setForm({
      ...form,
      states: [...form.states, stateData],
    });
    setNewState({ name: "", population: "" });
  };

  const removeState = (index) => {
    setForm({
      ...form,
      states: form.states.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    try {
      setError("");
      if (!form.name || !form.code || !form.population || !form.region || !form.capital) {
        setError("All country fields are required");
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
        <div className="dashboard-header">
          <h2>Countries</h2>
          <button className="btn-add-country" onClick={openAdd}>
            + Add Country
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

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
              {error && <div className="modal-error">{error}</div>}

              {/* COUNTRY BASIC INFO */}
              <div className="form-section">
                <h4>Country Details</h4>
                {["name", "code", "population", "flag", "region", "capital"].map((field) => (
                  <input
                    key={field}
                    className="form-input"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                ))}
              </div>

              {/* STATE POPULATION SECTION */}
              <div className="form-section">
                <h4>State/Region Population Details</h4>
                <div className="state-input-group">
                  <input
                    className="form-input state-name-input"
                    placeholder="State Name"
                    value={newState.name}
                    onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                  />
                  <input
                    className="form-input state-population-input"
                    placeholder="Population"
                    type="number"
                    value={newState.population}
                    onChange={(e) => setNewState({ ...newState, population: e.target.value })}
                  />
                  <button className="btn-add-state" onClick={addState}>
                    Add State
                  </button>
                </div>

                {/* STATES LIST */}
                {form.states.length > 0 && (
                  <div className="states-list">
                    <p className="states-label">States Added ({form.states.length})</p>
                    {form.states.map((state, index) => (
                      <div className="state-item" key={index}>
                        <span>
                          {state.name} - {Number(state.population).toLocaleString()}
                        </span>
                        <button
                          className="btn-remove-state"
                          onClick={() => removeState(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FORM BUTTONS */}
              <div className="modal-buttons">
                <button className="btn-save" onClick={handleSubmit}>
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="country-grid">
          {countries.map((c) => (
            <div
              className="country-card"
              key={c.id}
              onClick={() => navigate(`/country/${c.id}`, { state: c })}
            >
              <img src={c.flag} alt={c.name} />
              <div className="country-info">
                <h3>{c.name}</h3>
                <p>
                  <strong>Population:</strong> {Number(c.population).toLocaleString()}
                </p>
                <p>
                  <strong>Region:</strong> {c.region}
                </p>
                <p>
                  <strong>Capital:</strong> {c.capital}
                </p>
                {c.states && c.states.length > 0 && (
                  <p className="states-count">
                    <strong>States:</strong> {c.states.length}
                  </p>
                )}
                <div className="country-card-buttons">
                  <button className="kbtn" onClick={(e) => openEdit(e, c)}>
                    Edit
                  </button>
                  <button className="kbtn" onClick={(e) => handleDeleteCountry(e, c.id)}>
                    Delete
                  </button>
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

















