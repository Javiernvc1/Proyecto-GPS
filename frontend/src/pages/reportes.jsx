import { useEffect, useState } from 'react';
import NavBar from '@/components/nav/NavBar';
import SideNav from '@/components/nav/SideNav';

const GestionReportes = () => {
    return (
      <div>
        <NavBar />
        <div style={{ display: 'flex' }}>
          <SideNav />
          <div style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
            <h1>Gestión de Reportes</h1>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default GestionReportes;