let shouldQuitFlag = false;

export function markShouldQuit(): void {
  shouldQuitFlag = true;
}

export function shouldQuit(): boolean {
  return shouldQuitFlag;
}
