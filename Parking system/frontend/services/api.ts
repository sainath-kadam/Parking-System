import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Vehicle APIs
export const getVehicleByNumber = async (vehicleNumber: string) => {
  const response = await api.get(`/vehicle/${vehicleNumber}`);
  return response.data;
};

export const createVehicle = async (data: any) => {
  const response = await api.post("/vehicle", data);
  return response.data;
};

// Parking APIs
export const checkIn = async (data: any) => {
  const response = await api.post("/parking/check-in", data);
  return response.data;
};

export const checkOut = async (data: any) => {
  const response = await api.post("/parking/check-out", data);
  return response.data;
};

export const getActiveParkings = async () => {
  const response = await api.get("/parking/active");
  return response.data;
};

export const getActiveEntry = async (
  vehicleNumber?: string,
  tokenId?: string
) => {
  const params: any = {};
  if (vehicleNumber) params.vehicleNumber = vehicleNumber;
  if (tokenId) params.tokenId = tokenId;
  const response = await api.get("/parking/active-entry", { params });
  return response.data;
};

export const getParkingHistory = async (params?: {
  from?: string;
  to?: string;
}) => {
  const response = await api.get("/parking/history", { params });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/parking/stats");
  return response.data;
};

export const getParkingByToken = async (tokenId: string) => {
  // This endpoint needs to be created in backend
  // For now, we'll use a workaround
  const response = await api.get(`/parking/token/${tokenId}`);
  return response.data;
};

export default api;
