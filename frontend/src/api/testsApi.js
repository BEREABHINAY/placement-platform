import api from "./axios";

export const getTestsRequest = (params) => api.get("/tests", { params });
export const getTestForAttemptRequest = (id) => api.get(`/tests/${id}/attempt`);
export const submitTestRequest = (id, payload) => api.post(`/tests/${id}/submit`, payload);
export const getMyAttemptsRequest = () => api.get("/tests/my-attempts");

// Admin
export const createTestRequest = (payload) => api.post("/tests", payload);
export const getTestWithAnswersRequest = (id) => api.get(`/tests/${id}/answers`);
