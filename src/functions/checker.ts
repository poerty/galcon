/**
 *
 * @param {Immutable.map} tower
 * @param {string} userId
 */
const isTowerOwner = (tower: any, userId: string) => {
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
