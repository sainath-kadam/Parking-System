import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Vehicle APIs to check vechile already exists or not
export const getVehicleByNumber = async (vehicleNumber: string) => {
  const response = await api.get(`/getVehicleDetails/${vehicleNumber}`);
  return response.data;
};

// Parking APIs to check-in vehicles
export const checkIn = async (data: any) => {
  const response = await api.post("/parking/check-in", data);
  return response.data;
};

// Parking APIs to check-out vehicles
export const checkOut = async (data: any) => {
  const response = await api.post("/parking/check-out", data);
  return response.data;
};



// to get details of active parking by vehicle number or token id there, rate amount and all
export const getActiveEntry = async (
  vehicleNumber?: string,
  tokenId?: string
) => {
  const params: any = {};
  if (vehicleNumber) params.vehicleNumber = vehicleNumber;
  if (tokenId) params.tokenId = tokenId;
  const response = await api.get(`/getParkingDetails/${vehicleNumber}`, { params });
  return response.data;
};



export const getDashboardStats = async (filter: 'today' | 'week' | 'month') => {
  try {
    const response = await fetch(`/${filter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};


export default api;


// services/api.ts

export const getAllVehiclesList = async (params?: {
  filter?: 'all' | 'today' | 'week' | 'month' | 'custom';
  from?: string;
  to?: string;
  vehicleNumber?: string;
  driverMobile?: string;
  ownerMobile?: string;
  status?: 'active' | 'completed' | 'all';
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filter type (backend expects 'filter' param)
    if (params?.filter) {
      queryParams.append('filter', params.filter);
    }

    // Only add from/to for custom filter
    if (params?.filter === 'custom') {
      if (params?.from) {
        queryParams.append('from', params.from);
      }
      if (params?.to) {
        queryParams.append('to', params.to);
      }
    }

    // Add search filters
    if (params?.vehicleNumber) {
      queryParams.append('vehicleNumber', params.vehicleNumber);
    }
    if (params?.driverMobile) {
      queryParams.append('driverMobile', params.driverMobile);
    }
    if (params?.ownerMobile) {
      queryParams.append('ownerMobile', params.ownerMobile);
    }

    // Add status filter
    if (params?.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }

    const response = await fetch(
      `/api/list?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};