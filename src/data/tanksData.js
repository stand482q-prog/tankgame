// Полные данные о всех танках в игре
// Каждый танк имеет уникальные характеристики и цену улучшения

export const tanksData = {
  // Обычные танки (Common) - стартуют с 1 уровня
  common: [
    {
      id: 1,
      name: "МС-1",
      type: "common",
      baseHp: 100,
      baseDamage: 15,
      baseSpeed: 8,
      baseLevel: 1,
      maxLevel: 13,
      unlockRequirement: "Начальный танк",
      description: "Советский легкий танк, основа бронетанковых войск",
      imageUrl: "https://i.imgur.com/ms1.jpg",
      upgradeCost: {
        1: 50, 2: 75, 3: 100, 4: 150, 5: 200, 6: 300, 7: 400,
        8: 600, 9: 800, 10: 1000, 11: 1500, 12: 2000
      }
    },
    {
      id: 2,
      name: "Pz.II",
      type: "common",
      baseHp: 90,
      baseDamage: 18,
      baseSpeed: 10,
      baseLevel: 1,
      maxLevel: 13,
      unlockRequirement: "Начальный танк",
      description: "Немецкий легкий танк, быстрый и маневренный",
      imageUrl: "https://i.imgur.com/pz2.jpg",
      upgradeCost: {
        1: 50, 2: 75, 3: 100, 4: 150, 5: 200, 6: 300, 7: 400,
        8: 600, 9: 800, 10: 1000, 11: 1500, 12: 2000
      }
    },
    {
      id: 3,
      name: "BT-7",
      type: "common",
      baseHp: 110,
      baseDamage: 20,
      baseSpeed: 12,
      baseLevel: 1,
      maxLevel: 13,
      unlockRequirement: "Начальный танк",
      description: "Советский быстроходный танк, отличная скорость",
      imageUrl: "https://i.imgur.com/bt7.jpg",
      upgradeCost: {
        1: 50, 2: 75, 3: 100, 4: 150, 5: 200, 6: 300, 7: 400,
        8: 600, 9: 800, 10: 1000, 11: 1500, 12: 2000
      }
    },
    {
      id: 4,
      name: "Matilda",
      type: "common",
      baseHp: 150,
      baseDamage: 25,
      baseSpeed: 5,
      baseLevel: 1,
      maxLevel: 13,
      unlockRequirement: "Начальный танк",
      description: "Британский пехотный танк, мощная броня",
      imageUrl: "https://i.imgur.com/matilda.jpg",
      upgradeCost: {
        1: 50, 2: 75, 3: 100, 4: 150, 5: 200, 6: 300, 7: 400,
        8: 600, 9: 800, 10: 1000, 11: 1500, 12: 2000
      }
    },
    {
      id: 5,
      name: "T-34",
      type: "common",
      baseHp: 180,
      baseDamage: 30,
      baseSpeed: 9,
      baseLevel: 1,
      maxLevel: 13,
      unlockRequirement: "Начальный танк",
      description: "Легендарный советский средний танк",
      imageUrl: "https://i.imgur.com/t34.jpg",
      upgradeCost: {
        1: 50, 2: 75, 3: 100, 4: 150, 5: 200, 6: 300, 7: 400,
        8: 600, 9: 800, 10: 1000, 11: 1500, 12: 2000
      }
    }
  ],
  
  // Редкие танки (Rare) - стартуют с 3 уровня
  rare: [
    {
      id: 6,
      name: "KV-1",
      type: "rare",
      baseHp: 250,
      baseDamage: 40,
      baseSpeed: 6,
      baseLevel: 3,
      maxLevel: 13,
      unlockRequirement: "3 победы",
      description: "Советский тяжелый танк, крепкая броня",
      imageUrl: "https://i.imgur.com/kv1.jpg",
      upgradeCost: {
        3: 200, 4: 300, 5: 400, 6: 600, 7: 800, 8: 1200,
        9: 1600, 10: 2000, 11: 3000, 12: 4000
      }
    },
    {
      id: 7,
      name: "M4 Sherman",
      type: "rare",
      baseHp: 200,
      baseDamage: 35,
      baseSpeed: 8,
      baseLevel: 3,
      maxLevel: 13,
      unlockRequirement: "3 победы",
      description: "Американский средний танк, надежный и простой",
      imageUrl: "https://i.imgur.com/sherman.jpg",
      upgradeCost: {
        3: 200, 4: 300, 5: 400, 6: 600, 7: 800, 8: 1200,
        9: 1600, 10: 2000, 11: 3000, 12: 4000
      }
    },
    {
      id: 8,
      name: "Hellcat",
      type: "rare",
      baseHp: 150,
      baseDamage: 45,
      baseSpeed: 12,
      baseLevel: 3,
      maxLevel: 13,
      unlockRequirement: "3 победы",
      description: "Американский истребитель танков, высокая скорость",
      imageUrl: "https://i.imgur.com/hellcat.jpg",
      upgradeCost: {
        3: 200, 4: 300, 5: 400, 6: 600, 7: 800, 8: 1200,
        9: 1600, 10: 2000, 11: 3000, 12: 4000
      }
    },
    {
      id: 9,
      name: "Cromwell",
      type: "rare",
      baseHp: 180,
      baseDamage: 38,
      baseSpeed: 11,
      baseLevel: 3,
      maxLevel: 13,
      unlockRequirement: "3 победы",
      description: "Британский крейсерский танк, отличная скорость",
      imageUrl: "https://i.imgur.com/cromwell.jpg",
      upgradeCost: {
        3: 200, 4: 300, 5: 400, 6: 600, 7: 800, 8: 1200,
        9: 1600, 10: 2000, 11: 3000, 12: 4000
      }
    },
    {
      id: 10,
      name: "Tiger I",
      type: "rare",
      baseHp: 280,
      baseDamage: 50,
      baseSpeed: 5,
      baseLevel: 3,
      maxLevel: 13,
      unlockRequirement: "3 победы",
      description: "Немецкий тяжелый танк, легендарный Тигр",
      imageUrl: "https://i.imgur.com/tiger.jpg",
      upgradeCost: {
        3: 200, 4: 300, 5: 400, 6: 600, 7: 800, 8: 1200,
        9: 1600, 10: 2000, 11: 3000, 12: 4000
      }
    }
  ],
  
  // Эпические танки (Epic) - стартуют с 6 уровня
  epic: [
    {
      id: 11,
      name: "IS-3",
      type: "epic",
      baseHp: 320,
      baseDamage: 60,
      baseSpeed: 6,
      baseLevel: 6,
      maxLevel: 13,
      unlockRequirement: "6 побед",
      description: "Советский тяжелый танк, знаменитая щучья броня",
      imageUrl: "https://i.imgur.com/is3.jpg",
      upgradeCost: {
        6: 800, 7: 1200, 8: 1800, 9: 2400, 10: 3000,
        11: 4500, 12: 6000
      }
    },
    {
      id: 12,
      name: "Lowe",
      type: "epic",
      baseHp: 300,
      baseDamage: 65,
      baseSpeed: 5,
      baseLevel: 6,
      maxLevel: 13,
      unlockRequirement: "6 побед",
      description: "Немецкий тяжелый танк, отличная точность",
      imageUrl: "https://i.imgur.com/lowe.jpg",
      upgradeCost: {
        6: 800, 7: 1200, 8: 1800, 9: 2400, 10: 3000,
        11: 4500, 12: 6000
      }
    },
    {
      id: 13,
      name: "Bourrasque",
      type: "epic",
      baseHp: 200,
      baseDamage: 55,
      baseSpeed: 14,
      baseLevel: 6,
      maxLevel: 13,
      unlockRequirement: "6 побед",
      description: "Французский легкий танк, невероятная скорость",
      imageUrl: "https://i.imgur.com/bourrasque.jpg",
      upgradeCost: {
        6: 800, 7: 1200, 8: 1800, 9: 2400, 10: 3000,
        11: 4500, 12: 6000
      }
    },
    {
      id: 14,
      name: "Rhm.-B. WT",
      type: "epic",
      baseHp: 180,
      baseDamage: 80,
      baseSpeed: 8,
      baseLevel: 6,
      maxLevel: 13,
      unlockRequirement: "6 побед",
      description: "Немецкий истребитель танков, мощное орудие",
      imageUrl: "https://i.imgur.com/rhb.jpg",
      upgradeCost: {
        6: 800, 7: 1200, 8: 1800, 9: 2400, 10: 3000,
        11: 4500, 12: 6000
      }
    },
    {
      id: 15,
      name: "Obj 752",
      type: "epic",
      baseHp: 280,
      baseDamage: 70,
      baseSpeed: 7,
      baseLevel: 6,
      maxLevel: 13,
      unlockRequirement: "6 побед",
      description: "Советский тяжелый танк, экспериментальный",
      imageUrl: "https://i.imgur.com/obj752.jpg",
      upgradeCost: {
        6: 800, 7: 1200, 8: 1800, 9: 2400, 10: 3000,
        11: 4500, 12: 6000
      }
    }
  ],
  
  // Легендарные танки (Legendary) - стартуют с 9 уровня
  legendary: [
    {
      id: 16,
      name: "Maus",
      type: "legendary",
      baseHp: 500,
      baseDamage: 90,
      baseSpeed: 3,
      baseLevel: 9,
      maxLevel: 13,
      unlockRequirement: "9 побед",
      description: "Немецкий сверхтяжелый танк, самая мощная броня",
      imageUrl: "https://i.imgur.com/maus.jpg",
      upgradeCost: {
        9: 3000, 10: 4000, 11: 6000, 12: 8000
      }
    },
    {
      id: 17,
      name: "IS-7",
      type: "legendary",
      baseHp: 400,
      baseDamage: 85,
      baseSpeed: 6,
      baseLevel: 9,
      maxLevel: 13,
      unlockRequirement: "9 побед",
      description: "Советский тяжелый танк, вершина развития",
      imageUrl: "https://i.imgur.com/is7.jpg",
      upgradeCost: {
        9: 3000, 10: 4000, 11: 6000, 12: 8000
      }
    },
    {
      id: 18,
      name: "Grille 15",
      type: "legendary",
      baseHp: 250,
      baseDamage: 120,
      baseSpeed: 9,
      baseLevel: 9,
      maxLevel: 13,
      unlockRequirement: "9 побед",
      description: "Немецкий истребитель танков, огромный урон",
      imageUrl: "https://i.imgur.com/grille15.jpg",
      upgradeCost: {
        9: 3000, 10: 4000, 11: 6000, 12: 8000
      }
    },
    {
      id: 19,
      name: "T-100 ЛТ",
      type: "legendary",
      baseHp: 220,
      baseDamage: 60,
      baseSpeed: 16,
      baseLevel: 9,
      maxLevel: 13,
      unlockRequirement: "9 побед",
      description: "Советский легкий танк, максимальная скорость",
      imageUrl: "https://i.imgur.com/t100lt.jpg",
      upgradeCost: {
        9: 3000, 10: 4000, 11: 6000, 12: 8000
      }
    },
    {
      id: 20,
      name: "E 100",
      type: "legendary",
      baseHp: 450,
      baseDamage: 95,
      baseSpeed: 5,
      baseLevel: 9,
      maxLevel: 13,
      unlockRequirement: "9 побед",
      description: "Немецкий тяжелый танк, достойный наследник Мауса",
      imageUrl: "https://i.imgur.com/e100.jpg",
      upgradeCost: {
        9: 3000, 10: 4000, 11: 6000, 12: 8000
      }
    }
  ]
};

// Функция для получения характеристик танка на определенном уровне
// Каждый уровень дает +10% к HP и урону от базовых значений
export const getTankStatsAtLevel = (tank, level) => {
  const levelMultiplier = 1 + (level - tank.baseLevel) * 0.1;
  
  return {
    ...tank,
    currentLevel: level,
    hp: Math.floor(tank.baseHp * levelMultiplier),
    damage: Math.floor(tank.baseDamage * levelMultiplier),
    speed: tank.baseSpeed, // Скорость не меняется от уровня
  };
};

// Функция для расчета стоимости улучшения
export const getUpgradeCost = (tank, currentLevel) => {
  if (currentLevel >= tank.maxLevel) return 0;
  return tank.upgradeCost[currentLevel] || 999999; // Если нет цены - значит нельзя улучшить
};

// Все танки в одном массиве для удобства
export const allTanks = [
  ...tanksData.common,
  ...tanksData.rare,
  ...tanksData.epic,
  ...tanksData.legendary
];