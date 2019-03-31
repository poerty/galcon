export const INIT_TIMER = 'INIT_TIMER';
export function initTimer(timer: number) {
  return {
    type: INIT_TIMER,
    timer,
  };
}
