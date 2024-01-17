import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { useRouter } from "next/router";
import { useUser } from '@auth0/nextjs-auth0/client';
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

const Chart = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
};

  const handleMenuClose = () => {
      setAnchorEl(null);
  };

  const handleRedirect = () => {
    router.push('/profile'); 
  }

  const [completedTasks, setCompletedTasks] = useState([]);
  const { user } = useUser();
  const api = new TodoistApi('675513286f07a9ae9f9ec68af75d3dddad50ed69');

  useEffect(() => {
    async function getAllTasks() {
      try {
        const response = await api.getTasks();
        console.log(response);
        let completedTasksPerDay = Array(7).fill(0);
        response.forEach(task => {
            const dueDate = task.due && task.due.date;
            if (dueDate) { 
              completedTasksPerDay[2]++; 
            }
          });
        setCompletedTasks(completedTasksPerDay);
      } catch (error) {
        console.log(error);
      } 
    }
  
    getAllTasks();
  }, []);

  useEffect(() => {
    const data = [
      { name: "Lunes", Tareas: completedTasks[0] },
      { name: "Martes", Tareas: completedTasks[1] },
      { name: "Miercoles", Tareas: completedTasks[2] },
      { name: "Jueves", Tareas: completedTasks[3] },
      { name: "Viernes", Tareas: completedTasks[4] },
      { name: "Sabado", Tareas: completedTasks[5] },
      { name: "Domingo", Tareas: completedTasks[6] },
    ];

    setData(data);
  }, [completedTasks]);

  const [data, setData] = useState([]);
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
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
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
                  Mis tareas
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
      <Typography 
        variant="h6"
        style={{ fontWeight: 'bold', marginBottom: '20px'}}
      >
        Tareas completadas hoy
        </Typography>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Tareas" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default withPageAuthRequired(Chart);