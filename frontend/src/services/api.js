const API = "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const getCurrentEnergy = () => request("/energy/current");
export const getEnergyHistory = () => request("/energy/history");

export const getForecast = () =>
  request("/forecast/load", {
    method: "POST",
    body: JSON.stringify({
      hours: 24,
      temperature_c: -18,
      solar_kw: 18,
      wind_kw: 15,
    }),
  });

export const getOptimization = (data) =>
  request("/optimization/recommend", {
    method: "POST",
    body: JSON.stringify(data),
  });
