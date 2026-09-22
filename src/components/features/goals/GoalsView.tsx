import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import apiClient from "../../../helpers/apiClient";
import type Goal from "../../../interfaces/Goal";
import type { GoalPayload } from "../../../interfaces/Goal";
import SecondaryButton from "../../ui/SecondaryButton";
import Button from "../../ui/PrimaryButton";
import Loader from "../../ui/Loader";
import GoalCreateForm from "./GoalCreateForm";
import GoalRow from "./GoalRow";

export default function GoalsView() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/goals")
      .then(({ data }) => setGoals(data))
      .finally(() => setLoading(false));
  }, []);

  function replaceGoal(updated: Goal) {
    setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
  }

  async function onCreate(payload: GoalPayload) {
    const { data } = await apiClient.post("/goals", {
      ...payload,
      unit: payload.unit || undefined,
    });
    setGoals((prev) => [...prev, data]);
  }

  async function onEditSave(payload: GoalPayload) {
    if (!editingGoal) return;
    const { data } = await apiClient.patch(`/goals/${editingGoal._id}`, {
      ...payload,
      unit: payload.unit || "",
    });
    replaceGoal(data);
  }

  async function onDelta(id: string, delta: 1 | -1) {
    const { data } = await apiClient.patch(`/goals/${id}/value`, { delta });
    replaceGoal(data);
  }

  async function onDelete(id: string) {
    await apiClient.delete(`/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g._id !== id));
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <Loader size="lg" label="Loading goals..." />
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mb-2">
          <h2 className="text-[18px]">Your goals</h2>
          <SecondaryButton onClick={() => setCreating(true)}>
            <Plus size={16} />
            Create new goal
          </SecondaryButton>
        </div>
        <div className="w-full flex flex-col bg-[#121212] p-4 rounded-lg">
          {goals.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <p className="mb-4 text-[#ccc] text-[16px]">No goals yet.</p>
              <Button onClick={() => setCreating(true)}>Create the first!</Button>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
              {goals.map((goal) => (
                <GoalRow
                  key={goal._id}
                  goal={goal}
                  onDelta={(delta) => onDelta(goal._id, delta)}
                  onEdit={() => setEditingGoal(goal)}
                  onDelete={() => onDelete(goal._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {creating && (
        <div
          className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setCreating(false)}
        >
          <GoalCreateForm
            onClose={() => setCreating(false)}
            onSave={onCreate}
          />
        </div>
      )}
      {editingGoal && (
        <div
          className="w-full h-full fixed inset-0 flex justify-center items-center backdrop-blur-lg z-[9999]"
          onClick={() => setEditingGoal(null)}
        >
          <GoalCreateForm
            goal={editingGoal}
            onClose={() => setEditingGoal(null)}
            onSave={onEditSave}
          />
        </div>
      )}
    </>
  );
}
