/**
 * 
 * @param {Immutable.map} tower 
 * @param {string} userId 
 */
const isTowerOwner = (tower, userId) => {
  if (!tower || !userId) {
    return false;
  }
  const towerOwnerId = tower.get('ownerId');
  if (!towerOwnerId || towerOwnerId !== userId) {
    return false;
  }
  return true;
};


export {
  isTowerOwner,
};