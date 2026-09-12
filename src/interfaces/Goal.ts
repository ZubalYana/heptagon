export const GOAL_UNITS = [
  "times",
  "reps",
  "sessions",
  "hours",
  "minutes",
  "days",
  "pages",
  "chapters",
  "words",
  "km",
  "kg",
] as const;

export type GoalUnit = (typeof GOAL_UNITS)[number];

export const GOAL_UNIT_OPTIONS = GOAL_UNITS.map((value) => ({
  value,
  label:
    value === "km"
      ? "km"
      : value === "kg"
        ? "kg"
        : value.charAt(0).toUpperCase() + value.slice(1),
}));

export default interface Goal {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit?: GoalUnit;
  deadline: string;
  createdAt: string;
  completedAt?: string | null;
}

export type GoalPayload = {
  name: string;
  description?: string;
  targetValue: number;
  unit?: GoalUnit | "";
  deadline: string;
};
