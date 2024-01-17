import { useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";

function TaskTimer({ duration, onComplete, id }) {
  
  const storageKey = `task${id}`;
  let time;
  if (typeof window !== 'undefined') {
    time = parseInt(localStorage.getItem(storageKey));
  }
  const [timeLeft, setTimeLeft] = useState(
    time || duration * 60
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return; 
    } else {
      const intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(intervalId);
            onComplete();
            return 0;
          }
          const newTimeLeft = prev - 1;
          localStorage.setItem(storageKey, newTimeLeft);
          return newTimeLeft;
        });
      }, 1000);
  
      return () => clearInterval(intervalId);
    }
  }, [duration, onComplete, storageKey, isPaused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
  <>
  <Button
      onClick={() => {isPaused ? setIsPaused(false) : setIsPaused(true) }}
    >
      {isPaused ? "Reanudar" : "Pausar"}
    </Button>
    <Typography style={{ color: "#ff8080", fontSize: "20px", fontWeight: "bold" }}>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </Typography>
  </>
  );
}

export default TaskTimer;