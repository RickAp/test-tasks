import { useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";

function TaskTimer({ duration, onComplete, id }) {
  const storageKey = `task${id}`;
  const parsedDuration = parseInt(duration, 10);
  const initialTime = isNaN(parsedDuration) ? 0 : parsedDuration * 60;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(!initialTime);

  // Función para verificar si estamos en el entorno del cliente
  const isClient = () => typeof window === 'object';

  useEffect(() => {
    // Solo acceder a localStorage si estamos en el cliente
    if (isClient()) {
      const storedTime = localStorage.getItem(storageKey);
      if (storedTime) {
        setTimeLeft(parseInt(storedTime, 10));
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (isPaused || timeLeft === 0 || !isClient()) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(intervalId);
          onComplete();
          return 0;
        }
        const newTimeLeft = prevTime - 1;
        localStorage.setItem(storageKey, newTimeLeft.toString());
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPaused, timeLeft, storageKey]);

  const resetTimer = () => {
    const newTime = initialTime;
    setTimeLeft(newTime);
    if (isClient()) {
      localStorage.setItem(storageKey, newTime.toString());
    }
    setIsPaused(false); 
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
  <>
    <Button onClick={togglePause}>
      {isPaused ? "Reanudar" : "Pausar"}
    </Button>
    <Button onClick={resetTimer} color="secondary">
      Reiniciar
    </Button>
    <Typography style={{ color: "#ff8080", fontSize: "20px", fontWeight: "bold" }}>
      {Number.isNaN(minutes) || Number.isNaN(seconds) ? "00:00" : `${minutes}:${seconds.toString().padStart(2, "0")}`}
    </Typography>
  </>
  );
}

export default TaskTimer;