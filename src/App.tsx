import React, { useState, useEffect } from 'react';

// Load fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Anta&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rubik+Glitch&display=swap');

  @keyframes pixelReveal {
    0% { opacity: 0; }
    33% { opacity: 0.3; }
    66% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  .pixel-reveal {
    animation: pixelReveal 0.3s steps(3, end) forwards;
    opacity: 0;
  }

  .cyber-button {
    font-family: 'Anta', sans-serif;
    background: black;
    color: white;
    border: 2px solid white;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 0 5px white;
    font-size: clamp(1rem, 3vw, 1.3rem);
    margin: 0.5rem;
  }

  .cyber-button:hover {
    font-family: 'Rubik Glitch', system-ui;
    border-color: #fc0004;
    color: #fc0004;
    box-shadow: 0 0 15px #fc0004;
  }
`;

const items = ['CPU', 'GPU', 'RAM', 'ROM', 'BLOOD'];

const App: React.FC = () => {
  const [steps, setSteps] = useState<number[]>(items.map(() => 0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUserInfo, setShowUserInfo] = useState(false);

  // Fast delays
  const baseDotDelay = 100;
  const baseCheckDelay = 150;
  const baseShiftDelay = 200;

  const getDelays = (index: number) => {
    if (index === 4) {
      return {
        dotDelay: 50,
        checkDelay: 80,
        shiftDelay: 100
      };
    }
    return {
      dotDelay: baseDotDelay,
      checkDelay: baseCheckDelay,
      shiftDelay: baseShiftDelay
    };
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Sequential boot steps
  useEffect(() => {
    if (currentIndex >= items.length) return;

    // Show the current item's label
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[currentIndex] = 1;
      return newSteps;
    });

    let active = true;
    const { dotDelay, checkDelay, shiftDelay } = getDelays(currentIndex);

    const runSteps = async () => {
      await delay(dotDelay);
      if (!active) return;
      setSteps(prev => {
        if (prev[currentIndex] === 1) {
          const newSteps = [...prev];
          newSteps[currentIndex] = 2;
          return newSteps;
        }
        return prev;
      });

      await delay(dotDelay);
      if (!active) return;
      setSteps(prev => {
        if (prev[currentIndex] === 2) {
          const newSteps = [...prev];
          newSteps[currentIndex] = 3;
          return newSteps;
        }
        return prev;
      });

      await delay(dotDelay);
      if (!active) return;
      setSteps(prev => {
        if (prev[currentIndex] === 3) {
          const newSteps = [...prev];
          newSteps[currentIndex] = 4;
          return newSteps;
        }
        return prev;
      });

      await delay(dotDelay);
      if (!active) return;
      setSteps(prev => {
        if (prev[currentIndex] === 4) {
          const newSteps = [...prev];
          newSteps[currentIndex] = 5;
          return newSteps;
        }
        return prev;
      });

      await delay(checkDelay);
      if (!active) return;
      setSteps(prev => {
        if (prev[currentIndex] === 5) {
          const newSteps = [...prev];
          newSteps[currentIndex] = 6;
          return newSteps;
        }
        return prev;
      });

      await delay(shiftDelay);
      if (!active) return;
      setSteps(prev => {
        if (prev[currentIndex] === 6) {
          const newSteps = [...prev];
          newSteps[currentIndex] = 7;
          return newSteps;
        }
        return prev;
      });

      setCurrentIndex(prev => prev + 1);
    };

    runSteps();

    return () => {
      active = false;
    };
  }, [currentIndex]);

  // After all items, show user info
  useEffect(() => {
    if (currentIndex >= items.length) {
      const timer = setTimeout(() => setShowUserInfo(true), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Positioning for completed items (evenly spaced)
  const getCompletedTop = (index: number) => `${10 + index * 17.5}%`;

  return (
    <>
      <style>{fontStyles}</style>
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          backgroundColor: 'black',
          ...(showUserInfo && {
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }),
        }}
      >
        {!showUserInfo ? (
          // Boot screen with VT323 font
          items.map((name, index) => {
            const step = steps[index];
            if (step === 0) return null;

            return (
              <div
                key={name}
                className="absolute flex items-center whitespace-nowrap"
                style={{
                  left: 'clamp(2%, 5%, 5%)',
                  top: step === 7 ? getCompletedTop(index) : step >= 1 ? '80%' : undefined,
                  transition: 'top 0.5s ease-in-out',
                  textShadow: '0 0 2px #fc0004, 0 0 4px #fc0004',
                  fontFamily: '"VT323", monospace',
                  fontSize: 'clamp(2rem, 8vw, 5rem)',
                  lineHeight: 'clamp(1.2, 3vw, 2)',
                  fontWeight: 'normal',
                  color: '#fc0004',
                }}
              >
                <span>{name}</span>
                <span>&nbsp;</span>
                {Array.from({ length: 4 }).map((_, idx) => {
                  let char = '';
                  if (idx < 3) {
                    if (step >= 2 && idx < step - 1) char = '.';
                  } else {
                    if (step >= 6) {
                      char = '✓';
                    } else if (step >= 5) char = '.';
                  }
                  return (
                    <span key={idx} style={{ minWidth: '0.8em', textAlign: 'center' }}>
                      {char}
                    </span>
                  );
                })}
              </div>
            );
          })
        ) : (
          // User info card + buttons below
          <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Info card */}
            <div
              className="border-2 border-white bg-black text-white"
              style={{
                fontFamily: '"Anta", sans-serif',
                fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                boxShadow: '0 0 20px white',
                width: 'clamp(300px, 90%, 600px)',
                padding: '2rem',
              }}
            >
              <div className="text-center text-3xl mb-4 font-bold pixel-reveal" style={{ animationDelay: '0s' }}>
                INFO
              </div>
              <div className="w-full h-px bg-white my-3 pixel-reveal" style={{ animationDelay: '0.1s' }} />

              <div className="space-y-2">
                <div className="pixel-reveal" style={{ animationDelay: '0.2s' }}>
                  <span className="opacity-70 mr-3">{'>'}</span> Name: Jaroslav Blinkov
                </div>
                <div className="pixel-reveal" style={{ animationDelay: '0.3s' }}>
                  <span className="opacity-70 mr-3">{'>'}</span> Username: Bl1tz2200
                </div>
                <div className="pixel-reveal" style={{ animationDelay: '0.4s' }}>
                  <span className="opacity-70 mr-3">{'>'}</span> Birth date: 20xx.11.01
                </div>
                <div className="pixel-reveal" style={{ animationDelay: '0.5s' }}>
                  <span className="opacity-70 mr-3">{'>'}</span> Spec: DevOps, CyberSec
                </div>
              </div>

              <div className="w-full h-px bg-white my-4 pixel-reveal" style={{ animationDelay: '0.6s' }} />

              <div className="flex justify-end items-center pixel-reveal" style={{ animationDelay: '0.7s' }}>
                <span className="opacity-70 mr-3">STATUS:</span>
                <span
                  style={{
                    fontFamily: '"Anta", sans-serif',
                    fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
                    lineHeight: 1,
                    color: 'white',
                    textShadow: '0 0 8px white',
                  }}
                >
                  [OK]
                </span>
              </div>
            </div>

            {/* Buttons below the card */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="cyber-button" onClick={() => window.open('https://t.me/Bl1tz2200', '_blank')}>Telegram</button>
              <button className="cyber-button" onClick={() => window.open('https://discord.gg/NdknV3FU', '_blank')}>Discord</button>
              <button className="cyber-button" onClick={() => window.open('https://github.com/bl1tz2200', '_blank')}>Github</button>
              <button className="cyber-button" onClick={() => window.open('https://t.me/anonaskbot?start=nwak452ygk5lkzb', '_blank')}>AnonAsk</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
