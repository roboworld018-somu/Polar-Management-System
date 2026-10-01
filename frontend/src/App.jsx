import { useEffect, useMemo, useState } from "react";
import { getCurrentEnergy, getEnergyHistory, getForecast, getOptimization } from "./services/api";

function Card({ title, value, unit, note, icon }) {
  return (
    <div className="card metric-card">
      <div className="metric-top">
        <span className="icon">{icon}</span>
        <span className="muted">{title}</span>
      </div>
      <div className="metric-value">{value}<small>{unit}</small></div>
      <div className="metric-note">{note}</div>
    </div>
  );
}

function MiniChart({ values, labels, label, unit = "kW" }) {
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * 100;
    const y = 92 - (v / max) * 72;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="chart-wrap">
      <div className="chart-title">{label}<span>{unit}</span></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="chart-labels">
        {labels.map((x) => <span key={x}>{x}</span>)}
      </div>
    </div>
  );
}

export default function App() {
  const [energy, setEnergy] = useState(null);
  const [history, setHistory] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [e, h, f] = await Promise.all([
        getCurrentEnergy(),
        getEnergyHistory(),
        getForecast(),
      ]);
      setEnergy(e);
      setHistory(h);
      setForecast(f);
      const opt = await getOptimization({
        load_kw: e.load_kw,
        solar_kw: e.solar_kw,
        wind_kw: e.wind_kw,
        battery_percent: e.battery_percent,
        temperature_c: e.temperature_c,
      });
      setOptimization(opt);
      setOnline(true);
    } catch (error) {
      console.error(error);
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(loadDashboard, 30000);
    return () => clearInterval(timer);
  }, []);

  const forecastValues = useMemo(
    () => forecast?.forecast?.slice(0, 12).map((x) => x.predicted_load_kw) || [],
    [forecast]
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <strong>POLAR<span>GRID</span></strong>
            <small>Energy Command</small>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Forecasting</a>
          <a>Renewables</a>
          <a>Optimization</a>
          <a>Reports</a>
        </nav>

        <div className="station">
          <span className="station-dot" />
          <div>
            <b>Polar Station</b>
            <small>Antarctic Research Zone</small>
          </div>
        </div>
      </aside>

      <main>
        <header className="header">
          <div>
            <p className="eyebrow">SMART ENERGY MANAGEMENT</p>
            <h1>Station Dashboard</h1>
            <p className="subtitle">AI-assisted energy monitoring, forecasting and optimization.</p>
          </div>
          <div className="header-actions">
            <span className={online ? "status online" : "status offline"}>
              <i /> {online ? "System Online" : "Backend Offline"}
            </span>
            <button onClick={loadDashboard}>↻ Refresh</button>
          </div>
        </header>

        {loading && !energy ? (
          <div className="loading card">Loading station data...</div>
        ) : (
          <>
            <section className="metrics">
              <Card title="Current Load" value={energy?.load_kw ?? "--"} unit=" kW" note="Station demand" icon="⚡" />
              <Card title="Solar Generation" value={energy?.solar_kw ?? "--"} unit=" kW" note="Renewable input" icon="☀" />
              <Card title="Wind Generation" value={energy?.wind_kw ?? "--"} unit=" kW" note="Renewable input" icon="≈" />
              <Card title="Battery" value={energy?.battery_percent ?? "--"} unit="%" note="Available storage" icon="▣" />
            </section>

            <section className="grid two">
              <div className="card">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">ENERGY FLOW</p>
                    <h2>Generation vs Demand</h2>
                  </div>
                  <span className="pill">Live data</span>
                </div>
                {history && (
                  <MiniChart
                    values={history.load}
                    labels={history.labels}
                    label="Station load"
                  />
                )}
              </div>

              <div className="card">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">AI FORECAST</p>
                    <h2>Next 12 Hours</h2>
                  </div>
                  <span className="pill ai">ML</span>
                </div>
                <MiniChart
                  values={forecastValues.length ? forecastValues : [40, 41, 42, 43]}
                  labels={["+1h", "+3h", "+5h", "+7h", "+9h", "+11h"]}
                  label="Predicted load"
                />
              </div>
            </section>

            <section className="grid two lower">
              <div className="card recommendation">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">OPTIMIZATION ENGINE</p>
                    <h2>Recommended Action</h2>
                  </div>
                  <span className="pill ai">AI</span>
                </div>
                <div className="recommendation-main">
                  <div className="recommendation-icon">✓</div>
                  <div>
                    <strong>{optimization?.recommended_action || "Calculating..."}</strong>
                    <p>Backup power: <b>{optimization?.backup_power_kw ?? "--"} kW</b> · Battery: <b>{optimization?.battery_action || "--"}</b></p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">STATION CONDITIONS</p>
                    <h2>Operating Snapshot</h2>
                  </div>
                </div>
                <div className="snapshot">
                  <div><span>Temperature</span><b>{energy?.temperature_c ?? "--"} °C</b></div>
                  <div><span>Renewable Power</span><b>{((energy?.solar_kw || 0) + (energy?.wind_kw || 0)).toFixed(1)} kW</b></div>
                  <div><span>Fuel Use</span><b>{energy?.fuel_consumption_lph ?? "--"} L/h</b></div>
                </div>
              </div>
            </section>
          </>
        )}

        <footer>SIH 26061 · AI-Driven Smart Energy Management System for Polar Research Stations</footer>
      </main>
    </div>
  );
}
