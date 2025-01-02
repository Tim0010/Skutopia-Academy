import axios from "axios";
import { API_URL } from "../config/api";

export const searchCourses = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/public/search-courses`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Search API error:", error);
    throw new Error(error.response?.data?.message || "Failed to search courses");
  }
};
