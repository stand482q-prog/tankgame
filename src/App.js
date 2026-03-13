import React, { useState, useEffect } from 'react';
import Garage from './components/Garage';
import TankBattle from './components/TankBattle';
import { getTankStatsAtLevel, allTanks } from './data/tanksData';

function App() {
  const [gameState, setGameState] = useState('garage');
  const [selectedTank, setSelectedTank] = useState(null);
  const [mapType, setMapType] = useState('Эль-Халлуф');
  const [userTanks, setUserTanks] = useState({});
  const [userGold, setUserGold] = useState(1000);
  const [userStars, setUserStars] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Загрузка данных при старте
  useEffect(() => {
    const savedData = localStorage.getItem('tanksGameData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserTanks(parsed.tanks || {});
        setUserGold(parsed.gold || 1000);
        setUserStars(parsed.stars || 0);
      } catch (e) {
        console.error('Error loading saved data', e);
        initializeDefaultTanks();
      }
    } else {
      initializeDefaultTanks();
    }
  }, []);
  
  // Инициализация танков по умолчанию
  const initializeDefaultTanks = () => {
    const initialTanks = {};
    allTanks.forEach(tank => {
      initialTanks[tank.id] = {
        ...tank,
        currentLevel: tank.baseLevel,
        count: tank.id === 1 ? 1 : 0 // Только МС-1 бесплатно
      };
    });
    setUserTanks(initialTanks);
  };
  
  // Сохранение данных при изменении
  useEffect(() => {
    if (Object.keys(userTanks).length > 0) {
      localStorage.setItem('tanksGameData', JSON.stringify({
        tanks: userTanks,
        gold: userGold,
        stars: userStars
      }));
    }
  }, [userTanks, userGold, userStars]);
  
  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);
  
  // Начало боя с загрузочным экраном
  const handleStartBattle = (tank) => {
    setIsLoading(true);
    setLoadingMessage('Загрузка поля боя...');
    
    // Имитация загрузки
    setTimeout(() => {
      const tankWithStats = getTankStatsAtLevel(tank, tank.currentLevel);
      setSelectedTank(tankWithStats);
      
      const maps = ['Зимние Рудники', 'Пустыня', 'Эль-Халлуф'];
      const randomMap = maps[Math.floor(Math.random() * maps.length)];
      setMapType(randomMap);
      
      setIsLoading(false);
      setGameState('battle');
    }, 1500);
  };
  
  // Конец боя с сохранением данных
  const handleBattleEnd = (result) => {
    setIsLoading(true);
    setLoadingMessage('Возвращение в ангар...');
    
    // Сохраняем результаты боя
    if (result === 'win') {
      // Можно добавить награду за победу
      setUserGold(prev => prev + 100);
    }
    
    // Имитация загрузки
    setTimeout(() => {
      setIsLoading(false);
      setGameState('garage');
    }, 1500);
  };
  
  // Выход из боя без результата
  const handleExitBattle = () => {
    setIsLoading(true);
    setLoadingMessage('Возвращение в ангар...');
    
    setTimeout(() => {
      setIsLoading(false);
      setGameState('garage');
    }, 1000);
  };
  
  return (
    <div className="App">
      {/* Загрузочный экран */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: 'white',
          fontFamily: 'Arial'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'pulse 1.5s infinite'
          }}>
            🚀
          </div>
          <div style={{
            fontSize: '24px',
            marginBottom: '30px'
          }}>
            {loadingMessage}
          </div>
          <div style={{
            width: '200px',
            height: '4px',
            backgroundColor: '#333',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              backgroundColor: '#4CAF50',
              animation: 'loading 1.5s infinite'
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes loading {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}
      
      {/* Основной контент */}
      {gameState === 'garage' ? (
        <Garage 
          userTanks={userTanks}
          userGold={userGold}
          userStars={userStars}
          setUserTanks={setUserTanks}
          setUserGold={setUserGold}
          setUserStars={setUserStars}
          onStartBattle={handleStartBattle}
        />
      ) : (
        <TankBattle 
          playerTank={selectedTank}
          mapType={mapType}
          onBattleEnd={handleBattleEnd}
          onExit={handleExitBattle}
        />
      )}
    </div>
  );
}

export default App;