import type { Task } from "../../types/models";
import { TASK_STATUS } from "../../constants/app.constants";
import { Badge, Button } from "../ui";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  showOwner?: boolean;
}

const TaskCard = ({ task, onEdit, onDelete, showOwner = false }: Props) => {
  const isCompleted = task.status === TASK_STATUS.COMPLETED;

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-3">

      <div className="flex justify-between">
        <h3 className={`font-semibold ${isCompleted ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </h3>

        <Badge color={isCompleted ? "green" : "yellow"}>
          {task.status}
        </Badge>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500">{task.description}</p>
      )}

      {showOwner && task.user && (
        <div className="text-xs text-gray-400">
          {task.user.name} • {task.user.email}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <Button onClick={() => onEdit(task)} variant="secondary">
          <FiEdit2 /> Edit
        </Button>

        <Button onClick={() => onDelete(task.id)} variant="danger">
          <FiTrash2 /> Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;