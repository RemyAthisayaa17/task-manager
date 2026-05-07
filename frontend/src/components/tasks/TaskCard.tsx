import type { Task } from "../../types/models";
import { TASK_STATUS } from "../../constants/app.constants";
import { Badge, Button } from "../ui";
import { FiEdit2, FiTrash2, FiCalendar, FiUser } from "react-icons/fi";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  showOwner?: boolean;
}

const TaskCard = ({ task, onEdit, onDelete, showOwner = false }: Props) => {
  const isCompleted = task.status === TASK_STATUS.COMPLETED;

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-3.5
        hover:shadow-md hover:border-slate-300 transition-all duration-150
        ${isCompleted ? "border-slate-200 opacity-80" : "border-slate-200"}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold text-sm leading-snug flex-1 ${
            isCompleted ? "line-through text-slate-400" : "text-slate-800"
          }`}
        >
          {task.title}
        </h3>
        <Badge color={isCompleted ? "green" : "yellow"}>
          {task.status}
        </Badge>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <FiCalendar size={11} />
          {formattedDate}
        </span>
        {showOwner && task.user && (
          <span className="flex items-center gap-1.5">
            <FiUser size={11} />
            {task.user.name}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-0.5 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <FiEdit2 size={13} /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50"
        >
          <FiTrash2 size={13} /> Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
