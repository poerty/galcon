export const START_ATTACK = 'START_ATTACK';
export function startAttack(selected) {
  return {
    type: START_ATTACK,
    from: selected.get('from'),
    to: selected.get('to'),
    amount: selected.get('amount'),
    at: selected.get('at'),
  };
}

export const END_ATTACK = 'END_ATTACK';
export function endAttack(attackId) {
  return {
    type: END_ATTACK,
    attackId,
  };
}
