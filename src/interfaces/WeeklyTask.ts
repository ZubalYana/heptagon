export type WeeklyPriority = "crucial" | "important" | "optional";

export default interface WeeklyTask {
  _id: string;
  userId: string;
  year: number;
  week: number;
  title: string;
  priority: WeeklyPriority;
  targetCount: number;
  completedCount: number;
}
