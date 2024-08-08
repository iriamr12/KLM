import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [position, setPosition] = useState(50); // Initial position of the airplane
  const [clouds, setClouds] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const gameAreaRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      setPosition((prev) => Math.max(prev - 5, 0)); // Changed from 10 to 5
    } else if (event.key === 'ArrowDown') {
      setPosition((prev) => Math.min(prev + 5, 90)); // Changed from 10 to 5
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClouds((prev) => {
        const newClouds = prev.map(cloud => ({
          ...cloud,
          left: cloud.left - 2.5 // Reduce cloud movement speed
        })).filter(cloud => cloud.left > -10);

        if (Math.random() < 0.1) {
          newClouds.push({
            top: Math.random() * 90,
            left: 100
          });
        }

        return newClouds;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    clouds.forEach(cloud => {
      const cloudTop = cloud.top;
      const cloudBottom = cloud.top + 10; // Assume cloud height is 10%
      const cloudLeft = cloud.left;
      const cloudRight = cloud.left + 10; // Assume cloud width is 10%
      const airplaneTop = position;
      const airplaneBottom = position + 10; // Assume airplane height is 10%
      const airplaneLeft = 10; // Constant left position of the airplane
      const airplaneRight = 15; // Assume airplane width is 5% for more precision

      if (
        airplaneRight > cloudLeft &&
        airplaneLeft < cloudRight &&
        airplaneBottom > cloudTop &&
        airplaneTop < cloudBottom
      ) {
        setGameOver(true);
      }
    });
  }, [clouds, position]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="game-area" ref={gameAreaRef}>
      {gameOver ? (
        <div className="game-over">
          <h1>Game Over</h1>
          <p>
            Thank you for playing. Remember, at KLM, safety and excellence are our priorities.
          </p>
          <p>
            We strive to provide exceptional and sustainable service on every flight.
          </p>
          <p>
            Fly <a href='https://www.klm.nl/en?gad_source=1'>with us</a> again and explore the world with KLM!
          </p>
        </div>
      ) : (
        <>
          <div className="airplane" style={{ top: `${position}%` }}></div>
          {clouds.map((cloud, index) => (
            <div key={index} className="cloud" style={{ top: `${cloud.top}%`, left: `${cloud.left}%` }}></div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
