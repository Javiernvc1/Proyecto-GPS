import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { getUserInformation } from '@/services/user.service';

/* <----------------------- ICONOS --------------------------> */
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ReportIcon from '@mui/icons-material/Report'; // Importar el icono de Reporte

const SideNav = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [userRoleName, setUserRoleName] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        console.log('User ID:', user.id); // Imprimir el valor de user?.id en la consola
        try {
          const userData = await getUserInformation(user.id);
          console.log('User Data:', userData); // Imprimir el valor de userData en la consola
          if (userData) {
            const roleName = userData.data.data.roleUser?.nameRole;
            console.log('Role Name:', roleName); // Imprimir el valor de roleName en la consola
            setUserRoleName(roleName);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <ul className='justify-center p-4 border-b-2'>
      <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg '>
        <a href="" >
          <HomeIcon fontSize={"large"}/> Inicio
        </a>
      </li>

      <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg'>
        <a href="#">
          <PersonIcon fontSize={"large"}/> Perfil
        </a>
      </li>

      <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg'>
        <a href="#">
          <PersonSearchIcon fontSize={"large"}/> Buscar Usuarios
        </a>
      </li>

      {(userRoleName === 'Administrador' || userRoleName === 'Moderador') && (
        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg' onClick={() => router.push(`/ReportViewer`)}>
          <a>
            <ReportIcon fontSize={"large"} style={{ color: 'green' }}/> Gestión de Reportes
          </a>
        </li>
      )}
    </ul>
  );
};

export default SideNav;