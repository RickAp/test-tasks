import React, { useState } from 'react';
import { Button, Modal, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TodoistApi } from "@doist/todoist-api-typescript";
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

const useStyles = makeStyles((theme) => ({
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
  textField: {
    marginBottom: theme.spacing(2),
  },
  link: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#6495ED',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 5,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#1E90FF',
    },
  },
  linkCompleted: {
    display: 'inline-block',
    padding: '10px 20px',
    marginLeft: '25px',
    backgroundColor: '#90ee90',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 5,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#4ee44e',
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
}));

const ButtonModalTask = ({ task, deleteTask, updateTask, completeTask }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task?.content);
  const [description, setDescription] = useState(task?.description);
  const classes = useStyles();
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpdateTask = async () => {
    if (!title || !description) {
      toast.error('Los campos son obligatorios');
      return;
    }

    const api = new TodoistApi('9bb39fa113cdb19b6b09c79ad0e47afff9bf3484');
    try {
      const updatedTask = await api.updateTask(task.id, {
        content: title,
        description: description,
      });
      updateTask(updatedTask);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async () => {
    const api = new TodoistApi('9bb39fa113cdb19b6b09c79ad0e47afff9bf3484');
    try {
     await api.deleteTask(task.id);
     const deletedTask = task.id;
     deleteTask(deletedTask);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteTask = async () => {
    const api = new TodoistApi('9bb39fa113cdb19b6b09c79ad0e47afff9bf3484');
    try {
      const completedTask = await api.updateTask(task.id, {
        labels: ['completed'],
      });
      completeTask(completedTask);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} className={classes.link}>
        Editar Tarea
      </Button>
      <Button onClick={handleCompleteTask} className={classes.linkCompleted}>
        Completada
      </Button>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <div className={classes.paper}>
          <Typography className={classes.title}>Editar Tarea</Typography>
          <form>
            <TextField
              label="Título"
              fullWidth
              value={title}
              onChange={handleTitleChange}
              className={classes.textField}
            />
            <TextField
              label="Descripción"
              fullWidth
              value={description}
              onChange={handleDescriptionChange}
              className={classes.textField}
            />
            <Button color="primary" onClick={handleUpdateTask}>
              Guardar cambios
            </Button>
            <Button color="secondary" onClick={handleDeleteTask}>
              Eliminar tarea
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ButtonModalTask;