import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import NavBar from '@/components/nav/NavBar';
import { getReports, approveReport, rejectReport, updateReport, getReportTypes } from '@/services/report.service'; // Asegúrate de que la ruta sea correcta
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CheckCircle, Pending, Cancel } from '@mui/icons-material';

const GestionReportes = () => {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reportTypes, setReportTypes] = useState([]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReport(null);
    setIsEditMode(false);
  };

  const handleApproveReport = async (report) => {
    try {
      console.log('ID del reporte:', report.id); // Verifica el ID del reporte aquí
      const updatedReport = await approveReport(report.id);
      console.log('Reporte aprobado:', updatedReport);
  
      // Actualizar el estado de los reportes con el status del reporte actualizado
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === report.id ? { ...row, status: updatedReport.status } : row
        )
      );
      handleClose();
    } catch (error) {
      console.error('Error al aprobar el reporte:', error);
    }
  };

  const handleRejectReport = async (report) => {
    try {
      console.log('ID del reporte:', report.id); // Verifica el ID del reporte aquí
      const updatedReport = await rejectReport(report.id);
      console.log('Reporte rechazado:', updatedReport);

      // Actualizar el estado de los reportes con el status del reporte actualizado
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === report.id ? { ...row, status: updatedReport.status } : row
        )
      );
      handleClose();
    } catch (error) {
      console.error('Error al rechazar el reporte:', error);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        console.log('Response from getReports:', response); // Ver la respuesta completa del servidor
        console.log('response.data:', response.data); // Ver la estructura de response.data
        const reports = response.data.data.data;
        const formattedData = reports
          .filter(report => report.postReport) // Filtrar reportes sin publicación asociada
          .map(report => {
            console.log('Report data:', report); // Ver los valores de reportType, contentReport, userReport y postReport
            return {
              id: report._id, // ID del reporte
              reportType: report.reportType, 
              userReport: report.userReport.username, 
              userReportId: report.userReport._id,
              postReport: report.postReport.title, 
              postReportId: report.postReport._id, 
              status: report.status,
              contentReport: report.contentReport, 
              postUser: report.postReport.author,
              dateReport: new Date(report.dateReport).toLocaleString('es-ES', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              }), 
            };
          });
        setRows(formattedData);
      } catch (error) {
        setRows([]); 
      }
    };

    fetchReports();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID del Reporte', flex: 1 },
    { field: 'postReport', headerName: 'Publicación Reportada', flex: 1 },
    { field: 'userReport', headerName: 'Usuario Reportante', flex: 1 },
    { field: 'reportType', headerName: 'Tipo de Reporte', flex: 1 },
    { field: 'contentReport', headerName: 'Contenido del Reporte', flex: 1 },
    { field: 'status', headerName: 'Estado', flex: 1 },
    { field: 'dateReport', headerName: 'Fecha del Reporte', flex: 1 }, 
    { field: 'acciones', headerName: 'Acciones', flex: 1, renderCell: (params) => (
        <strong>
          <IconButton aria-label="view" style={{ marginRight: 10 }} onClick={() => handleViewReport(params.row)}>
            <VisibilityIcon sx={{ color: 'blue' }} />
          </IconButton>
          <IconButton aria-label="approve" style={{ marginRight: 10 }} onClick={() => handleApproveReport(params.row)}>
            <CheckIcon sx={{ color: 'green' }} />
          </IconButton>
          <IconButton aria-label="reject" style={{ marginRight: 10 }} onClick={() => handleRejectReport(params.row)}>
            <CloseIcon sx={{ color: 'red' }} />
          </IconButton>
        </strong>
      ) 
    }
  ];

  return (
    <div>
      <NavBar />
<div style={{ display: 'flex' }}>
  <div style={{ marginLeft: '20px', padding: '20px', width: '200px', backgroundColor: '#f4f4f4', height: '100vh', marginTop: '60px' }}>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ marginBottom: '10px' }}>
        <Button variant="text" fullWidth sx={{ justifyContent: 'flex-start', color: 'black' }} startIcon={<CheckCircle />}>
          Ver Reportes Aprobados
        </Button>
      </li>
      <li style={{ marginBottom: '10px' }}>
        <Button variant="text" fullWidth sx={{ justifyContent: 'flex-start', color: 'black' }} startIcon={<Pending />}>
          Ver Reportes Pendientes
        </Button>
      </li>
      <li>
        <Button variant="text" fullWidth sx={{ justifyContent: 'flex-start', color: 'black' }} startIcon={<Cancel />}>
          Ver Reportes Rechazados
        </Button>
      </li>
    </ul>
  </div>
          <div style={{ marginLeft: '20px', padding: '20px', width: '100%' }}>
          <h1 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Lista de Reportes</h1>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
            <DataGrid 
              rows={rows} 
              columns={columns} 
              pageSize={5} 
              checkboxSelection 
              getRowId={(row) => row.id} // Usar id como identificador
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-columnHeader': {
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-cell': {
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                },
              }}
            />
          </div>
        </div>
      </div>
      <Modal open={Boolean(selectedReport)} onClose={handleClose}>
        <Box sx={{ 
          width: '50%', // Ajusta el ancho aquí
          maxWidth: '600px', // Ancho máximo
          margin: 'auto', // Centra el modal
          mt: '10%', // Margen superior para centrar verticalmente
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          position: 'relative' // Añadir posición relativa para el botón de cierre
        }}>
          <IconButton 
            aria-label="close" 
            onClick={handleClose} 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8 
            }}
          >
            <CloseIcon />
          </IconButton>
    <Typography variant="h6" component="h2" gutterBottom>
      Detalles del Reporte
    </Typography>
    <Box mb={4} />
          {selectedReport && (
            <form>
              <Typography variant="body1" component="p">
                <strong>ID del Reporte:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.id}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Publicación Reportada:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.postReport}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Usuario Reportante:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.userReport}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Tipo de Reporte:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.reportType}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Contenido del Reporte:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.contentReport}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Estado:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.status}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Fecha del Reporte:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.dateReport}
              </Typography>
              <Box mb={2} />

              <Typography variant="body1" component="p">
                <strong>Fecha del Reporte:</strong>
              </Typography>
              <Typography variant="body1" component="p">
                {selectedReport.dateReport}
              </Typography>
              <Box mb={2} />
  </form>
)}
</Box>
</Modal>
</div>
);
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default GestionReportes;