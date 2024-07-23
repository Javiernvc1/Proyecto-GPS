import axios from "./root.service";

const headers = {
    "Content-Type": "application/json",
};

export const createReport = async (reportData) => {
    try {
        return await axios.post("/reports/createReport", reportData, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> createReport", error);
    }
};

export const getReports = async () => {
    try {
        return await axios.get("/reports/getReports", { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getReports", error);
    }
};

export const getReport = async (id) => {
    try {
        return await axios.get(`reports/getReport/${id}`, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getReport", error);
    }
};

export const updateReport = async (id, reportData) => {
    try {
        return await axios.put(`/reports/updateReport/${id}`, reportData, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> updateReport", error);
    }
};

export const deleteReport = async (id) => {
    try {
        return await axios.delete(`reports/deleteReport/${id}`, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> deleteReport", error);
    }
};

export const getReportsByUser = async (userId) => {
    try {
        return await axios.get(`reports/getReportsByUser/${userId}`, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getReportsByUser", error);
    }
};

export const getReportsByPost = async (postId) => {
    try {
        return await axios.get(`reports/getReportsByPost/${postId}`, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getReportsByPost", error);
    }
};

export const getReportsByType = async (reportType) => {
    try {
        return await axios.get(`reports/getReportsByType/${reportType}`, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getReportsByType", error);
    }
};

export const approveReport = async (id) => {
    try {
        return await axios.put(`reports/approveReport/${id}`, {}, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> approveReport", error);
    }
};

export const rejectReport = async (id) => {
    try {
        return await axios.put(`reports/rejectReport/${id}`, {}, { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> rejectReport", error);
    }
};

export const getApprovedReports = async () => {
    try {
        return await axios.get("reports/getApprovedReports", { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getApprovedReports", error);
    }
};

export const getRejectedReports = async () => {
    try {
        return await axios.get("reports/getRejectedReports", { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getRejectedReports", error);
    }
};

export const getPendingReports = async () => {
    try {
        return await axios.get("reports/getPendingReports", { headers });
    } catch (error) {
        console.log("FRONTEND: Error en report.service -> getPendingReports", error);
    }
};