import { rows, cols } from './simulation-variables.js';

export const generateValidCoordinates = (pokemons, hunters, police) => {
  let randomX, randomY;

  let someoneThere = true;
  while (someoneThere) {
    randomX = Math.floor(Math.random() * (rows - 1));
    randomY = Math.floor(Math.random() * (cols - 1));

    someoneThere = isSomeoneThere(randomX, randomY, pokemons, hunters, police);
  }

  return [randomX, randomY];
}

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const copyArrayOfObjects = (array) => {
  array = [...array];
  for (let i = 0; i < array.length; i++) {
    array[i] = { ...array[i] };
  }

  return array;
}

export const isOutOfBounds = (x, y) => {
  return x < 0 || x >= rows || y < 0 || y >= cols;
}

export const isSomeoneThere = (x, y, pokemons, hunters, police) => {
  let someoneThere = false;
  pokemons.forEach(pokemon => {
    someoneThere = someoneThere || (pokemon.x === x && pokemon.y === y);
  });
  if (someoneThere) return someoneThere;

  hunters.forEach(hunter => {
    someoneThere = someoneThere || (hunter.x === x && hunter.y === y);
  });
  if (someoneThere) return someoneThere;

  police.forEach(policeman => {
    someoneThere = someoneThere || (policeman.x === x && policeman.y === y);
  });

  return someoneThere;
}

export const getDistanceSq = (x1, y1, x2, y2) => {
  return (x1 - x2) *
    (x1 - x2) +
    (y1 - y2) *
    (y1 - y2);
}

export const isInSight = (x1, y1, x2, y2, sightDistance) => {
  const distanceSq = getDistanceSq(x1, y1, x2, y2);
  const sightDistanceSq = sightDistance * sightDistance;
  return distanceSq <= sightDistanceSq;
}

export const getNearestInSight = (x, y, sightDistance, entities) => {
  let nearestEntity = null;

  entities.forEach(entity => {
    if (isInSight(x, y, entity.x, entity.y, sightDistance)) {
      if (!nearestEntity) {
        nearestEntity = entity;

      } else {
        const distanceSq = getDistanceSq(x, y, entity.x, entity.y);
        const nearestPokemonDistanceSq = getDistanceSq(x, y, nearestEntity.x, nearestEntity.y);

        if (distanceSq < nearestPokemonDistanceSq) {
          nearestEntity = entity;
        }
      }
    }
  }); 
  return nearestEntity;
}

export const getMoveToGetCloseTo = (x1, y1, x2, y2) => {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  if (xDiff < 0 && yDiff < 0) {
    return [-1, -1];

  } else if (xDiff === 0 && yDiff < 0) {
    return [0, -1];

  } else if (xDiff > 0 && yDiff < 0) {
    return [1, -1];

  } else if (xDiff > 0 && yDiff === 0) {
    return [1, 0];

  } else if (xDiff > 0 && yDiff > 0) {
    return [1, 1];

  } else if (xDiff === 0 && yDiff > 0) {
    return [0, 1];

  } else if (xDiff < 0 && yDiff > 0) {
    return [-1, 1];

  } else if (xDiff < 0 && yDiff === 0) {
    return [-1, 0];
  }

  return [0, 0];
}

export const copySimulationState = (state) => {
  return {
    ...state,
    hunters: copyArrayOfObjects(state.hunters),
    police: copyArrayOfObjects(state.police),
    pokemons: copyArrayOfObjects(state.pokemons),
  };
}