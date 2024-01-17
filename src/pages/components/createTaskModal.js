import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Router, useRouter } from 'next/router';
import {
  Fab,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { TodoistApi } from "@doist/todoist-api-typescript";
import toast, { Toaster } from 'react-hot-toast';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 5,
  },
  input: {
    marginBottom: 20,
  },
}));

export default function CreateTask( {createTask} ) {
  const classes = useStyles();
  
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateTask = async () => {
    if(content !== '' && description !== '' && duration !== '') {
      try {
        const api = new TodoistApi('9bb39fa113cdb19b6b09c79ad0e47afff9bf3484');
        const createdTask = await api.addTask({
          content,
          description,
          dueString: `${duration}`,
        });
        createTask(createdTask);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error('Todos los campos son obligatorios');
    }
  };

  return (
    <div>
      <Fab
        color="primary"
        className={classes.fab}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <TextField
              label="Tarea"
              variant="outlined"
              fullWidth
              className={classes.input}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <TextField
              label="Descripción"
              variant="outlined"
              fullWidth
              className={classes.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={classes.input}>
              <FormControl variant="outlined">
                <InputLabel>Duración</InputLabel>
                <Select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  label="Duración"
                  style={{ width: "8rem" }} 
                >
                  <MenuItem value={30}>30 minutos</MenuItem>
                  <MenuItem value={45}>45 minutos</MenuItem>
                  <MenuItem value={60}>60 minutos</MenuItem>
                </Select>
              </FormControl> 
            </div>  
            <Button variant="contained" color="primary" onClick={handleCreateTask}>
              Crear tarea
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}