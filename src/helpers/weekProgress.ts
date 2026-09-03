export type WeekProgress = {
  completed: number;
  total: number;
};

export function progressPercent(progress: WeekProgress): number {
  if (progress.total === 0) return 0;
  return Math.round((progress.completed / progress.total) * 100);
}
