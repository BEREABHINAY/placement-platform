import api from "./axios";

export const registerRequest = (payload) => api.post("/auth/register", payload);
export const verifySignupOtpRequest = (payload) => api.post("/auth/verify-signup-otp", payload);
export const resendOtpRequest = (payload) => api.post("/auth/resend-otp", payload);

export const loginRequest = (payload) => api.post("/auth/login", payload);
export const verifyLoginOtpRequest = (payload) => api.post("/auth/verify-login-otp", payload);

export const forgotPasswordRequest = (payload) => api.post("/auth/forgot-password", payload);
export const resetPasswordRequest = (payload) => api.post("/auth/reset-password", payload);

export const logoutRequest = () => api.post("/auth/logout");
export const meRequest = () => api.get("/auth/me");

export const deleteAccountRequest = (payload) => api.delete("/auth/me", { data: payload });
