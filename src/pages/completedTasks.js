import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Popover,
  List,
  ListItem,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gridGap: '20px',
      paddingTop: '30px', 
      margin: '0px', 
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 5,
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
        transform: 'translateY(-5px)',
      },
    },
    media: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      lineHeight: 1.5,
      marginBottom: 20,
    },
    link: {
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#333',
      color: '#fff',
      textDecoration: 'none',
      borderRadius: 5,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#555',
      },
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));


const CompletedTasks = () => {

    const { user } = useUser();
  
  const api = new TodoistApi('675513286f07a9ae9f9ec68af75d3dddad50ed69');
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const deleteTask = (deletedTask) => {
    const updatedTasks = tasks.filter(task => task.id !== deletedTask);
    setTasks(updatedTasks);
  }

  useEffect(() => {
    async function getAllTasks() {
      try {
        const response = await api.getTasks();
        console.log(response);
        setTasks(response);
      } catch (error) {
        console.log(error);
      } 
    }
    
    getAllTasks();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
      setAnchorEl(null);
  };

  const handleRedirect = () => {
    router.push('/profile'); 
  }

  const handleDeleteTask = async (task) => {
    const api = new TodoistApi('675513286f07a9ae9f9ec68af75d3dddad50ed69');
    try {
     await api.deleteTask(task.id);
     const deletedTask = task.id;
     deleteTask(deletedTask);
      handleClose();
    } catch (error) {
      console.log(error);
    }
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
                    {!user ?
                        <Button
                        href='api/auth/login'
                        color="inherit"
                        >
                        Iniciar sesión
                        </Button>
                    : 
                        <>
                            <Button
                                style={{ color: '#26a5eb'}}
                                onClick={handleRedirect}
                            >
                                Tareas Activas
                            </Button>
                            <Button
                                href='api/auth/logout'
                                style={{ color: '#ff8080'}}
                            >
                                Salir
                            </Button>
                        </>
                    } 
                </Toolbar>
            </AppBar>
            <div className={classes.container}>
                {tasks.filter(task => task.labels.length !== 0).map((task, index) => (
                    <Card key={task.id} className={classes.card}>
                    <CardContent className={classes.content}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography className={classes.title}>{task.content} </Typography>
                            <CheckCircleIcon style={{ color: green[500] }} />
                            <Button 
                              variant="outlined"
                              style={{ color: green[500], borderColor: green[500], borderRadius: '20px' }}
                            >
                              Completado
                            </Button>
                            <Button 
                              color="secondary" 
                              onClick={() => {handleDeleteTask(task)}}
                            >
                              Eliminar
                            </Button>
                      </div>
                      <Typography className={classes.text}>{task.description}</Typography>
                    </CardContent>
                  </Card>
                ))}
            </div>
        </div>
    );
}

export default withPageAuthRequired(CompletedTasks);