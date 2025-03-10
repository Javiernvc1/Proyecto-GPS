const ReportService = require('../services/report.service');
const { respondSuccess, respondError } = require('../utils/resHandler');
const { handleError } = require('../utils/errorHandler');


async function createReport(req, res) {
    try {
        const { body } = req;
        const [newReport, reportError] = await ReportService.createReport(body);
        if (reportError) return respondError(req, res, 400, reportError);
        if (!newReport) return respondError(req, res, 400, 'No se creo el reporte');
        respondSuccess(req, res, 201, newReport);
    } catch (error) {
        handleError(error, 'report.controller -> createReport');
        respondError(req, res, 500, 'No se creo reporte');
    }
}

async function getReports(req, res) {
    try {
        const [reports, errorReports] = await ReportService.getReports();
        if (errorReports) return respondError(res, 500, 'Error al buscar reportes');
        reports.length === 0
            ? respondSuccess(req, res, 200, 'No existen reportes en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes reportes: ', data: reports });
    } catch (error) {
        handleError(error, 'report.controller -> getReports');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function getReport(req, res) {
    try {
        const { params } = req;
        const [report, reportError] = await ReportService.getReport(params.id);
        if (reportError) return respondError(req, res, 404, reportError);
        respondSuccess(req, res, 200, report);
    } catch (error) {
        handleError(error, 'report.controller -> getReport');
        respondError(req, res, 500, 'No se pudo encontrar reporte');
    }
}

async function updateReport(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [report, reportError] = await ReportService.updateReport(id, body);
        if (reportError) return respondError(req, res, 400, reportError);
        if (!report) return respondError(req, res, 400, 'No se encontro reporte asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Reporte actualizado', data: report });
    } catch (error) {
        handleError(error, 'report.controller -> updateReport');
        respondError(req, res, 500, 'No se pudo actualizar reporte');
    }
}

async function deleteReport(req, res) {
    try {
        const { id } = req.params;
        const [report, reportError] = await ReportService.deleteReport(id);
        if (reportError) return respondError(req, res, 400, reportError);
        if (!report) return respondError(req, res, 400, 'No se encontro reporte asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Reporte eliminado', data: report });
    } catch (error) {
        handleError(error, 'report.controller -> deleteReport');
        respondError(req, res, 500, 'No se pudo eliminar reporte');
    }
}

async function getReportsByUser(req, res) {
    try {
        const { params } = req;
        const [reports, errorReports] = await ReportService.getReportsByUser(params.id);
        if (errorReports) return respondError(req, res, 404, errorReports);
        respondSuccess(req, res, 200, reports);
    } catch (error) {
        handleError(error, 'report.controller -> getReportsByUser');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function getReportsByPost(req, res) {
    try {
        const { params } = req;
        const [reports, errorReports] = await ReportService.getReportsByPost(params.id);
        if (errorReports) return respondError(req, res, 404, errorReports);
        respondSuccess(req, res, 200, reports);
    } catch (error) {
        handleError(error, 'report.controller -> getReportsByPost');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function getReportsByType(req, res) {
    try {
        const { params } = req;
        const [reports, errorReports] = await ReportService.getReportsByType(params.reportType);
        if (errorReports) return respondError(req, res, 404, errorReports);
        respondSuccess(req, res, 200, reports);
    } catch (error) {
        handleError(error, 'report.controller -> getReportsByType');
        respondError(req, res, 500, 'No se pudo encontrar reportes');
    }
}

async function approveReport(req, res) {
    try {
        const { id } = req.params;
        const updatedReport = await ReportService.approveReport(id);
        if (!updatedReport) {
            return respondError(req, res, 400, 'Reporte no encontrado');
        }
        const successMessage = `El reporte con el ID ${id} ha sido aprobado.`;
        respondSuccess(req, res, 200, { message: successMessage, report: updatedReport });
    } catch (error) {
        handleError(error, 'report.controller -> approveReport');
        respondError(req, res, 500, 'Error al aprobar el reporte');
    }
}

async function rejectReport(req, res) {
    try {
        const { id } = req.params;
        const updatedReport = await ReportService.rejectReport(id);
        if (!updatedReport) {
            return respondError(req, res, 400, 'Reporte no encontrado');
        }
        const successMessage = `El reporte con el ID ${id} ha sido rechazado.`;
        respondSuccess(req, res, 200, { message: successMessage, report: updatedReport });
    } catch (error) {
        handleError(error, 'report.controller -> rejectReport');
        respondError(req, res, 500, 'Error al rechazar el reporte');
    }
}

async function getApprovedReports(req, res) {
    try {
        const approvedReports = await ReportService.getApprovedReports();
        respondSuccess(req, res, 200, { reports: approvedReports });
    } catch (error) {
        handleError(error, 'report.controller -> getApprovedReports');
        respondError(req, res, 500, 'Error al obtener los reportes aprobados');
    }
}

async function getRejectedReports(req, res) {
    try {
        const rejectedReports = await ReportService.getRejectedReports();
        respondSuccess(req, res, 200, { reports: rejectedReports });
    } catch (error) {
        handleError(error, 'report.controller -> getRejectedReports');
        respondError(req, res, 500, 'Error al obtener los reportes rechazados');
    }
}

async function getPendingReports(req, res) {
    try {
        const pendingReports = await ReportService.getPendingReports();
        respondSuccess(req, res, 200, { reports: pendingReports });
    } catch (error) {
        handleError(error, 'report.controller -> getPendingReports');
        respondError(req, res, 500, 'Error al obtener los reportes pendientes');
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
    getPendingReports,
};