import axios from "axios";

// Locally, "/api" is caught by the Vite dev proxy (see vite.config.js) and forwarded to
// http://localhost:5000. In production there's no dev server to proxy through, so the
// deployed frontend needs the real backend URL — set VITE_API_URL in your hosting
// provider's environment variables (e.g. Vercel) to something like:
//   https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // send the httpOnly JWT cookie automatically
});

export default api;
