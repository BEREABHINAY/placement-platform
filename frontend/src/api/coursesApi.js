import api from "./axios";

export const getCoursesRequest = (params) => api.get("/courses", { params });
export const getCourseByIdRequest = (id) => api.get(`/courses/${id}`);
export const getMyEnrollmentsRequest = () => api.get("/courses/my-enrollments");
export const enrollInCourseRequest = (id) => api.post(`/courses/${id}/enroll`);
export const markModuleCompleteRequest = (id, moduleId) => api.post(`/courses/${id}/complete-module`, { moduleId });

// Admin
export const createCourseRequest = (payload) => api.post("/courses", payload);
export const updateCourseRequest = (id, payload) => api.put(`/courses/${id}`, payload);
export const deleteCourseRequest = (id) => api.delete(`/courses/${id}`);
