const API = "https://polar-management-system-1.onrender.com/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const getCurrentEnergy = () => {
  return request("/energy/current");
};

export const getEnergyHistory = () => {
  return request("/energy/history");
};

export const getForecast = () => {
  return request("/forecast/load", {
    method: "POST",
    body: JSON.stringify({
      hours: 24,
      temperature_c: -18,
      solar_kw: 18,
      wind_kw: 15,
    }),
  });
};

export const getOptimization = (data) => {
  return request("/optimization/recommend", {
    method: "POST",
    body: JSON.stringify(data),
  });
};