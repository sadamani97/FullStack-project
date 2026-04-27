import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FC } from "react";

interface State {
  name: string;
  population: number;
}

interface CountryState {
  id: number;
  name: string;
  flag: string;
  population: number;
  region: string;
  capital: string;
  states?: State[];
}

const CountryDetails: FC = () => {
  const { state } = useLocation() as { state: CountryState | null };
  const navigate = useNavigate();

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
    "#8884D8",
  ];

  if (!state) return <h2>No Data</h2>;

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">
        <div className="flag-section">
          <img src={state.flag} alt={state.name} />
        </div>

        <div className="info-section">
          <h2>{state.name}</h2>
          <p>
            <strong>Population:</strong> {state.population.toLocaleString()}
          </p>
          <p>
            <strong>Region:</strong> {state.region}
          </p>
          <p>
            <strong>Capital:</strong> {state.capital}
          </p>
        </div>

        {state.states && state.states.length > 0 && (
          <div className="chart-container">
            <h3>State Population Distribution</h3>
            <div className="chart-wrapper">
              <PieChart width={600} height={500}>
                <Pie
                  data={state.states}
                  dataKey="population"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={140}
                  label={{
                    position: "outside" as const,
                    fill: "#333",
                    fontSize: 12,
                  }}
                  labelLine={true}
                >
                  {state.states.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => value.toLocaleString()}
                  contentStyle={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetails;
