
import React from 'react';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Popover,
  List,
  ListItem,
  Grid,
  Card,
  CardContent,
  Box,
  CardActionArea
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import StarIcon from '@material-ui/icons/Star';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  animation: {
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(-5px)',
    },
  },
}))

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  
  function handleAuthorize() {
    router.push('/profile');
  }
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
};

  const handleMenuClose = () => {
      setAnchorEl(null);
  };

  const classes = useStyles();
  return (
    <div style={{ backgroundColor: '#f2f3f5', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <List>
                <ListItem button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => router.push('/chart')}
                    >
                        Ver mis estadísticas
                    </Button>
                </ListItem>
            </List>
          </Popover>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={handleMenuClick}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Tu Desempeño
          </Typography>
          {user &&
            <Button
              style={{ color: '#26a5eb'}}
              onClick={handleAuthorize}
            >
              Mis tareas
            </Button>
          }
          {!user ?
            <Button
              href='api/auth/login'
              color="inherit"
            >
              Iniciar sesión
            </Button>
          : 
            <Button
              href='api/auth/logout'
              style={{ color: '#ff8080'}}
            >
              Salir
            </Button>
          } 
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ padding: '4rem 0' }}>
  
        <Box textAlign="center" marginBottom="4rem" style={{ display: 'flex', flexDirection: 'column'}}>
          <Typography variant="h2" component="h1" gutterBottom>
            Escribe, planifica, comparte.
          </Typography>
          <Typography variant="h5" color="textSecondary">
            Gestiona tus tareas diarias.
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Este es tu espacio de trabajo para trabajar mejor y más rápido. Escribe, planifica, comparte, mide.
          </Typography>
          <Button variant="contained" onClick={handleAuthorize} color="primary" style={{ width: '10rem'}}>
            Comenzar
          </Button>
          <img
              src="/home.jpg"
              alt="productividad"
              style={{ width: '60%', borderRadius: '1rem', marginTop: '1rem' }}
          />
        </Box>

        <Grid container spacing={4} justify="center" style={{ marginTop: '2rem'}}>
          <Grid item xs={12}>
            <Grid container spacing={4} justify="center">
              <FeatureCard
                icon={<StarIcon fontSize="large" color="primary" />}
                title="IA"
                description="Ahora con Q&A Pide lo que quieras. Nosotros tenemos la respuesta."
              />
              <FeatureCard
                icon={<LibraryBooksIcon fontSize="large" color="secondary" />}
                title="Wikis"
                description="Centraliza tus conocimientos. Buscar respuestas puede ser fácil."
              />
              <FeatureCard
                icon={<AssignmentIcon fontSize="large" color="error" />}
                title="Proyectos"
                description="Gestiona proyectos complejos sin caer en el caos."
              />
              <FeatureCard
                icon={<DescriptionIcon fontSize="large" color="action" />}
                title="Documentos"
                description="Sencillos, potentes, bonitos. Notas y documentos de nueva generación."
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );


  function FeatureCard({ icon, title, description }) {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Card raised className={classes.animation}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={2}>{icon}</Box>
              <Typography gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography variant="body2">
                {description}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
