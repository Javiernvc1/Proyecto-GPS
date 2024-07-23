/* <----------------------- FUNCIONES -------------------------> */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getNotifications } from '@/services/notification.service.js';


/* <---------------------- COMPONENTES ------------------------> */
import UserAvatar from "../common/UserAvatar.jsx";


/* <---------------- COMPONENTES MATERIAL UI ------------------> */
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';

/* <----------------------- ICONOS --------------------------> */
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ExploreIcon from '@mui/icons-material/Explore';

/* <----------------------- SERVICIOS  -----------------------> */
import { logout } from "../../services/auth.service.js"
import { getUserInformation, getUserImage } from "../../services/user.service.js"
import { searchContent } from "../../services/visualization.service.js"


export default function PrimarySearchAppBar( { userId }) {
  // Estado para almacenar las notificaciones
  const [notifications, setNotifications] = useState([]);

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

// Función para cargar las notificaciones
const loadNotifications = async () => {
  try {
    const fetchedNotifications = await getNotifications(userId);
    // Asegúrate de que fetchedNotifications sea un arreglo antes de llamar a setNotifications
    if (Array.isArray(fetchedNotifications)) {
      setNotifications(fetchedNotifications);
    } else {
      // Si fetchedNotifications no es un arreglo, puedes establecer notifications a un arreglo vacío o manejar el error como prefieras
      setNotifications([]);
    }
  } catch (error) {
    console.error('Error al cargar las notificaciones', error);
    // En caso de error, también asegúrate de establecer notifications a un arreglo vacío o manejar el error como prefieras
    setNotifications([]);
  }
};
  // Cargar las notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // Función para abrir el menú de notificaciones
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú de notificaciones
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

  // Menu normal
  const renderMenu = (
    <Menu anchorEl={anchorEl} id={menuId} keepMounted open={isMenuOpen} onClose={handleMenuClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={()=>{
        router.push(`/profile/${userId}`);
        handleMenuClose();
      }}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
      <MenuItem onClick={ () => {
          logout()
          router.push('/auth');
        }
        }>Cerrar sesión

      </MenuItem>

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  // Menu movil
  const renderMobileMenu = (
    <Menu anchorEl={mobileMoreAnchorEl} id={mobileMenuId} keepMounted open={isMobileMenuOpen} onClose={handleMobileMenuClose}
       anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem>

        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
  
            <NotificationsIcon />
          
        </IconButton>
        <p>Notifications</p> 

      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Perfil</p>
      </MenuItem>

    </Menu>
  );


    // ID para el menú de notificaciones
    const notificationMenuId = 'primary-search-notification-menu';

    // Menú de notificaciones
  // Renderiza el menú de notificaciones con las notificaciones obtenidas
  const renderNotificationMenu = (
      <Menu
        anchorEl={notificationAnchorEl}
        id="primary-search-notification-menu"
        keepMounted
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
      >
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationMenuClose} 
          style={{ backgroundColor: notification.read ? 'transparent' : '#f0f0f0' }}>
            <Typography variant="body2">
              {notification.contentNotification}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {new Date(notification.dateNotification).toLocaleString()}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
  );



  
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
  
    const handleSearch = async () => {
      try {
        const data = await searchContent(query);
        setResults(data); // Asume que los resultados están en data directamente
      } catch (error) {
        console.error("Error al buscar contenido:", error);
        // Manejar el error adecuadamente
      }
    };

    const handleInputChange = (event) => {
      setQuery(event.target.value);
    };
  
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        handleSearch();
      }
    };


  return (
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" className='bg-zinc-800'>
        <Toolbar>
        
        {/* Texto barra de navegacion */}
          {/* <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block', fontStyle:'oblique' } }}>
            FORUM
          </Typography> */}
          <Avatar className='cursor-pointer hover:bg-zinc-700 p-1 transition' alt="Logo" src="/icons/ovni1.png" sx={{ width: 60, height: 60 }} onClick={ () => { router.push('/')}} />


        {/* Barra de busqueda */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}/>
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Mensajes, notificaciones y Avatar */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            <IconButton size="large" color="inherit" onClick={() => router.push("/")}>
                <HomeIcon />
            </IconButton>

            <IconButton size="large" color="inherit">
                <ExploreIcon />
            </IconButton>


            {/* Mensajes */}
            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> */}

            {/* Notificaciones*/}
            {/* <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={7} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}

            <IconButton size="large" aria-label="show notifications" aria-controls={notificationMenuId}
              aria-haspopup="true"
                onClick={handleNotificationMenuOpen}
                color="inherit"
              >
              <NotificationsIcon />
            </IconButton>

            {/* Favoritos*/}
            {/* <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={2} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton> */}

            {/* Avatar */}
            <IconButton size="large" edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
              <UserAvatar userId={userId} />
            </IconButton>
            
          </Box>

      	  {/* Boton mas opciones (tres puntos) en pantalla mas pequeña */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationMenu}
    </Box>
  );


}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
