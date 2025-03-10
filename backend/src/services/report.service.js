const Report = require("../models/report.model.js");
const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");

const { handleError } = require("../utils/errorHandler.js");

async function createReport(report){
    try {
        const {
            reportType,
            contentReport,
            userReport,
            postReport
        } = report;
        const userFound = await User
        .findById(userReport)
        .exec();
        if(!userFound) return [null, "Usuario no encontrado"];
        const postFound = await Post
        .findById(postReport)
        .exec();
        if(!postFound) return [null, "Publicacion no encontrada"];
        const newReport = new Report({
            reportType,
            contentReport,
            userReport,
            postReport
        });
        await newReport.save();
        return [newReport, null];
    }
    catch(error){
        handleError(error, "report.service -> createReport")
    }
}

async function getReports(){
    try {
        const reports = await Report.find()
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReports")
    }
}

async function getReport(id){
    try {
        const report = await Report.findById(id)
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!report) return [null, "Reporte no encontrado"];
        return [report, null];
    } catch (error) {
        handleError(error, "report.service -> getReport")
    }
}

async function updateReport(id, report){
    try {
        const {
            reportType,
            contentReport,
            userReport,
            postReport
        } = report;
        const reportFound = await Report.findById(id);
        if(!reportFound) return [null, "Reporte no encontrado"];
        const userFound = await User.findById(userReport);
        if(!userFound) return [null, "Usuario no encontrado"];
        const postFound = await Post.findById(postReport);
        if(!postFound) return [null, "Publicacion no encontrada"];
        await Report.findByIdAndUpdate(id, report);
        return [report, null];
    } catch (error) {
        handleError(error, "report.service -> updateReport")
    }
}

async function deleteReport(id){
    try {
        const reportFound = await Report.findById(id);
        if(!reportFound) return [null, "Reporte no encontrado"];
        await Report.findByIdAndDelete(id);
        return [reportFound, null];
    } catch (error) {
        handleError(error, "report.service -> deleteReport")
    }
}

async function getReportsByUser(id){
    try {
        const reports = await Report.find({ userReport: id })
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReportsByUser")
    }
}

async function getReportsByPost(id){
    try {
        const reports = await Report.find({ postReport: id })
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReportsByPost")
    }
}

async function getReportsByType(reportType){
    try {
        const reports = await Report.find({ reportType })
        .populate("userReport")
        .populate("postReport")
        .exec();
        if(!reports) return [null, "No se encontraron reportes en la bbdd"];
        return [reports, null];
    } catch (error) {
        handleError(error, "report.service -> getReportsByType")
    }
}

async function approveReport(id) {
    try {
        const updatedReport = await Report.findOneAndUpdate(
            { _id: id },
            { status: 'aprobado' },
            { new: true }
        );
        if (!updatedReport) {
            throw new Error('Reporte no encontrado');
        }
        return updatedReport;
    } catch (error) {
        console.error('Error al aprobar el reporte:', error);
        throw error;
    }
}

async function rejectReport(id) {
    try {
        const updatedReport = await Report.findOneAndUpdate(
            { _id: id },
            { status: 'rechazado' },
            { new: true }
        );
        if (!updatedReport) {
            throw new Error('Reporte no encontrado');
        }
        return updatedReport;
    } catch (error) {
        console.error('Error al rechazar el reporte:', error);
        throw error;
    }
}

async function getApprovedReports() {
    try {
        const approvedReports = await Report.find({ status: 'aprobado' });
        return approvedReports;
    } catch (error) {
        console.error('Error al obtener los reportes aprobados:', error);
        throw error;
    }
}

async function getRejectedReports() {
    try {
        const rejectedReports = await Report.find({ status: 'rechazado' });
        return rejectedReports;
    } catch (error) {
        console.error('Error al obtener los reportes rechazados:', error);
        throw error;
    }
}

async function getPendingReports() {
    try {
        const pendingReports = await Report.find({ status: 'pendiente' });
        return pendingReports;
    } catch (error) {
        console.error('Error al obtener los reportes pendientes:', error);
        throw error;
    }
}



module.exports = {
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport,
    getReportsByUser,
    getReportsByPost,
    getReportsByType,
    approveReport,
    rejectReport,
    getApprovedReports,
    getRejectedReports,
    getPendingReports
};

