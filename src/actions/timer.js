export const INIT_TIMER = 'INIT_TIMER';
export function initTimer(timer) {
  return {
    type: INIT_TIMER,
    timer,
  };
}
