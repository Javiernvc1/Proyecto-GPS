/* <----------------------- FUNCIONES -------------------------> */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
/* <----------------------- ICONOS --------------------------> */
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import { logout } from "../../services/auth.service.js"
import { getUserInformation, getUserImage } from "../../services/user.service.js";

const SideNav = ({ userId }) => {
  const router = useRouter();

  const [dataUser, setDataUser] = useState('');
  const [imageUser, setImageUser] = useState('');

  const getDataUser = async () => {
    try {
      const response = await getUserInformation(userId);
      setDataUser(response.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect( () => {
    getDataUser();
  },[]);

  return (
      <ul className='justify-center p-4 border-b-2'>

        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg '>
          <a href="/" >
            <HomeIcon fontSize={"large"}/> Inicio
          </a>
        </li>

        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg'>
        <button
          className='flex items-center'
          onClick={() => {
            router.push(`/profile/${userId}`);
          }}
        >
          <PersonIcon fontSize={"large"} /> Perfil
        </button>
        </li>

        <li className='py-2 px-4 hover:bg-zinc-200 cursor-pointer rounded-lg'>
          <a href="#">
            <PersonSearchIcon fontSize={"large"}/> Buscar Usuarios
          </a>
        </li>
      </ul>

  )
}

export default SideNav;