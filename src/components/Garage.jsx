import React, { useState, useEffect } from 'react';
import { allTanks, getTankStatsAtLevel, getUpgradeCost } from '../data/tanksData';

const Garage = ({ 
  userTanks, 
  userGold, 
  userStars, 
  setUserTanks, 
  setUserGold, 
  setUserStars, 
  onStartBattle 
}) => {
  const [selectedTank, setSelectedTank] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  // Обработка промокода
  const handlePromoCode = () => {
    const code = promoCode.trim().toLowerCase();
    
    if (code === 'test_full_acc') {
      const newTanks = { ...userTanks };
      allTanks.forEach(tank => {
        newTanks[tank.id] = {
          ...tank,
          currentLevel: tank.baseLevel,
          count: 100
        };
      });
      setUserTanks(newTanks);
      setUserGold(prev => prev + 1000000);
      alert('🎮 РЕЖИМ ТЕСТИРОВАНИЯ: Получено 100 копий каждого танка и 1,000,000 золота!');
    } 
    else if (code === 'new_acc') {
      const newTanks = { ...userTanks };
      const shermanTank = allTanks.find(t => t.id === 7);
      if (shermanTank) {
        if (newTanks[7]) {
          newTanks[7].count += 1;
        } else {
          newTanks[7] = {
            ...shermanTank,
            currentLevel: shermanTank.baseLevel,
            count: 1
          };
        }
      }
      setUserTanks(newTanks);
      setUserGold(prev => prev + 1000);
      alert('✅ Промокод активирован! Получено: M4 Sherman и 1000 золота!');
    }
    else if (code === 'free_chest') {
      openChest('small');
      alert('🎁 Вы получили бесплатный малый сундук!');
    }
    else {
      alert('❌ Неверный промокод');
      return;
    }
    
    setPromoCode('');
    setShowPromoInput(false);
  };
  
  // Улучшение танка
  const upgradeTank = (tankId) => {
    const tank = userTanks[tankId];
    if (!tank) return;
    
    const upgradeCost = getUpgradeCost(tank, tank.currentLevel);
    if (userGold < upgradeCost) {
      alert('Недостаточно золота!');
      return;
    }
    
    if (tank.currentLevel >= tank.maxLevel) {
      alert('Танк уже максимального уровня!');
      return;
    }
    
    setUserGold(prev => prev - upgradeCost);
    setUserTanks(prev => ({
      ...prev,
      [tankId]: {
        ...prev[tankId],
        currentLevel: prev[tankId].currentLevel + 1
      }
    }));
  };
  
  // Открытие сундука
  const openChest = (chestType) => {
    let reward = {};
    
    switch(chestType) {
      case 'small':
        reward = {
          gold: Math.floor(Math.random() * 100) + 50,
          tankCount: 1
        };
        break;
      case 'medium':
        reward = {
          gold: Math.floor(Math.random() * 300) + 150,
          tankCount: 3
        };
        break;
      case 'ultra':
        reward = {
          gold: Math.floor(Math.random() * 1000) + 500,
          tankCount: 7,
          guaranteedNew: true
        };
        break;
      default:
        return;
    }
    
    setUserGold(prev => prev + reward.gold);
    
    const newTanks = { ...userTanks };
    for (let i = 0; i < reward.tankCount; i++) {
      const rarity = Math.random();
      let tankPool;
      if (rarity < 0.6) tankPool = allTanks.filter(t => t.type === 'common');
      else if (rarity < 0.85) tankPool = allTanks.filter(t => t.type === 'rare');
      else if (rarity < 0.95) tankPool = allTanks.filter(t => t.type === 'epic');
      else tankPool = allTanks.filter(t => t.type === 'legendary');
      
      const randomTank = tankPool[Math.floor(Math.random() * tankPool.length)];
      
      if (newTanks[randomTank.id]) {
        newTanks[randomTank.id].count += 1;
      } else {
        newTanks[randomTank.id] = {
          ...randomTank,
          currentLevel: randomTank.baseLevel,
          count: 1
        };
      }
    }
    
    if (reward.guaranteedNew) {
      const missingTanks = allTanks.filter(t => !newTanks[t.id] || newTanks[t.id].count === 0);
      if (missingTanks.length > 0) {
        const newTank = missingTanks[Math.floor(Math.random() * missingTanks.length)];
        newTanks[newTank.id] = {
          ...newTank,
          currentLevel: newTank.baseLevel,
          count: 1
        };
      }
    }
    
    setUserTanks(newTanks);
  };
  
  // Покупка сундука
  const buyChest = (chestType) => {
    openChest(chestType);
  };
  
  // Сброс прогресса
  const resetProgress = () => {
    if (window.confirm('Вы уверены? Весь прогресс будет сброшен!')) {
      localStorage.removeItem('tanksGameData');
      window.location.reload();
    }
  };
  
  const ownedTanks = Object.values(userTanks).filter(tank => tank.count > 0);
  
  return (
    <div style={styles.garage}>
      <div style={styles.header}>
        <div style={styles.resources}>
          <span style={styles.resource}>💰 {userGold}</span>
          <span style={styles.resource}>⭐ {userStars}</span>
          <button 
            style={styles.promoButton}
            onClick={() => setShowPromoInput(!showPromoInput)}
          >
            🎫 Промокод
          </button>
          <button 
            style={{...styles.promoButton, backgroundColor: '#dc3545'}}
            onClick={resetProgress}
          >
            🔄 Сброс
          </button>
        </div>
        
        {showPromoInput && (
          <div style={styles.promoInput}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Введите промокод"
              style={styles.input}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePromoCode(); }}
            />
            <button onClick={handlePromoCode} style={styles.button}>
              Активировать
            </button>
          </div>
        )}
        
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
          Доступные промокоды: TEST_FULL_ACC, new_acc, free_chest
        </div>
      </div>
      
      {/* Магазин сундуков с ценами */}
      <div style={styles.chestShop}>
        <h2>Сундуки</h2>
        <div style={styles.chests}>
          <div style={styles.chest} onClick={() => buyChest('small')}>
            <div style={styles.chestIcon}>📦</div>
            <h3>Малый сундук</h3>
            <p>1 карта танка</p>
            <p style={styles.chestPrice}>50 ⭐</p>
          </div>
          
          <div style={styles.chest} onClick={() => buyChest('medium')}>
            <div style={styles.chestIcon}>📦📦</div>
            <h3>Средний сундук</h3>
            <p>3 карты танков</p>
            <p style={styles.chestPrice}>150 ⭐</p>
          </div>
          
          <div style={styles.chest} onClick={() => buyChest('ultra')}>
            <div style={styles.chestIcon}>💎</div>
            <h3>Ультра-сундук</h3>
            <p>7 карт + новая</p>
            <p style={styles.chestPrice}>500 ⭐</p>
          </div>
        </div>
      </div>
      
      {/* Список танков */}
      <div style={styles.tanksList}>
        <h2>Танки в ангаре</h2>
        {ownedTanks.length === 0 ? (
          <div style={styles.noTanks}>
            <h3>🎮 У вас нет танков!</h3>
            <p>Купите сундук или активируйте промокод new_acc</p>
          </div>
        ) : (
          <div style={styles.tanksGrid}>
            {ownedTanks.map(tank => (
              <div 
                key={tank.id} 
                style={{
                  ...styles.tankCard,
                  borderColor: tank.type === 'common' ? '#808080' :
                              tank.type === 'rare' ? '#4169E1' :
                              tank.type === 'epic' ? '#800080' : '#FFD700'
                }}
                onClick={() => setSelectedTank(tank)}
              >
                <div style={styles.tankHeader}>
                  <h3>{tank.name}</h3>
                  <span style={styles.tankCount}>x{tank.count}</span>
                </div>
                <div style={styles.tankImage}>🚀</div>
                <div style={styles.tankStats}>
                  <p>Уровень: {tank.currentLevel}/{tank.maxLevel}</p>
                  <p>❤️ {getTankStatsAtLevel(tank, tank.currentLevel).hp}</p>
                  <p>⚔️ {getTankStatsAtLevel(tank, tank.currentLevel).damage}</p>
                </div>
                {tank.count > 0 && (
                  <button 
                    style={styles.upgradeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      upgradeTank(tank.id);
                    }}
                    disabled={tank.currentLevel >= tank.maxLevel}
                  >
                    Улучшить ({getUpgradeCost(tank, tank.currentLevel)} 💰)
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedTank && (
        <div style={styles.battleButton}>
          <button
            onClick={() => onStartBattle(selectedTank)}
            style={styles.startBattle}
          >
            Начать бой на {selectedTank.name}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  garage: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    minHeight: '100vh',
    color: 'white'
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  resources: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  resource: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginRight: '10px'
  },
  promoButton: {
    padding: '8px 16px',
    backgroundColor: '#4a4a4a',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  promoInput: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px'
  },
  input: {
    padding: '8px',
    flex: 1,
    borderRadius: '5px',
    border: '1px solid #4a4a4a',
    backgroundColor: '#333',
    color: 'white'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  chestShop: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  chests: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  chest: {
    flex: '1 1 200px',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'scale(1.05)'
    }
  },
  chestIcon: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  chestPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: '5px'
  },
  tanksList: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '10px'
  },
  tanksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '10px'
  },
  tankCard: {
    backgroundColor: '#333',
    padding: '15px',
    borderRadius: '10px',
    borderLeft: '5px solid',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  tankHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  tankCount: {
    backgroundColor: '#4CAF50',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px'
  },
  tankImage: {
    fontSize: '48px',
    textAlign: 'center',
    margin: '10px 0'
  },
  tankStats: {
    fontSize: '14px'
  },
  upgradeButton: {
    width: '100%',
    padding: '8px',
    marginTop: '10px',
    backgroundColor: '#FFD700',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  battleButton: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000
  },
  startBattle: {
    padding: '15px 40px',
    fontSize: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  },
  noTanks: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#2a2a2a',
    borderRadius: '10px',
    color: '#888'
  }
};

export default Garage;