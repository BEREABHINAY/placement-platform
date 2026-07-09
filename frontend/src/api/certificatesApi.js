import api from "./axios";

export const getMyCertificatesRequest = () => api.get("/certificates/my-certificates");
export const verifyCertificateRequest = (certificateId) => api.get(`/certificates/verify/${certificateId}`);
export const getAllCertificatesRequest = () => api.get("/certificates"); // admin
