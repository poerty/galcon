export const INIT_TIMER = 'INIT_TIMER';
export function initTimer(timer: any) {
  return {
    type: INIT_TIMER,
    timer,
  };
}
