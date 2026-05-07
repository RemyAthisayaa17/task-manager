import { useState } from "react";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/models";
import { TASK_STATUS } from "../constants/app.constants";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import DeleteTaskModal from "../components/ui/DeleteTaskModal";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { Modal, Button, Spinner, EmptyState, Badge } from "../components/ui";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";

const DashboardPage = () => {
  const { isAdmin, user } = useAuth();

  const {
    tasks, loading, pagination,
    draftSearch, statusFilter, page,
    setDraftSearch, setPage,
    submitSearch, applyFilter, clearFilters,
    createTask, updateTask, deleteTask,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: CreateTaskInput | UpdateTaskInput) => {
    setFormLoading(true);
    const ok = await createTask(data as CreateTaskInput);
    setFormLoading(false);
    if (ok) setShowForm(false);
  };

  const handleUpdate = async (data: CreateTaskInput | UpdateTaskInput) => {
    if (!editingTask) return;
    setFormLoading(true);
    const ok = await updateTask(editingTask.id, data as UpdateTaskInput);
    setFormLoading(false);
    if (ok) {
      setEditingTask(null);
      setShowForm(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTaskId) return;
    const ok = await deleteTask(deleteTaskId);
    if (ok) setDeleteTaskId(null);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Safely resolve pagination values — pagination may be null when search/filter is active
  const totalPages = pagination?.totalPages ?? 0;
  const isFiltered = !!statusFilter || !!draftSearch;

  // Stats
  const pendingCount = tasks.filter(t => t.status === TASK_STATUS.PENDING).length;
  const completedCount = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isAdmin ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Welcome back, <span className="font-medium text-slate-700">{user?.name}</span>
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="flex items-center gap-1.5 flex-shrink-0">
            <FiPlus size={14} />
            New Task
          </Button>
        </div>

        {/* Summary cards */}
        {!loading && tasks.length > 0 && !isFiltered && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total", value: pagination?.total ?? tasks.length, color: "text-slate-700", bg: "bg-white" },
              { label: "Pending", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Completed", value: completedCount, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-200 text-center`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search & filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={draftSearch}
                  onChange={(e) => setDraftSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
                    placeholder-slate-400 bg-white"
                />
              </div>
              <Button onClick={submitSearch} size="sm" variant="secondary">
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => applyFilter(TASK_STATUS.PENDING)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border
                  ${statusFilter === TASK_STATUS.PENDING
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Pending
              </button>
              <button
                onClick={() => applyFilter(TASK_STATUS.COMPLETED)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border
                  ${statusFilter === TASK_STATUS.COMPLETED
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Completed
              </button>
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500
                    hover:bg-slate-100 transition-colors flex items-center gap-1 border border-slate-200"
                >
                  <FiX size={11} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Active filter indicator */}
          {isFiltered && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-slate-400">Filtered by:</span>
              {statusFilter && <Badge color={statusFilter === "pending" ? "yellow" : "green"}>{statusFilter}</Badge>}
              {draftSearch && !statusFilter && (
                <Badge color="indigo">"{draftSearch}"</Badge>
              )}
            </div>
          )}
        </div>

        {/* Tasks grid */}
        {loading ? (
          <Spinner text="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            subtitle={
              statusFilter
                ? `No ${statusFilter} tasks.`
                : draftSearch
                ? "No tasks match your search."
                : "Create your first task to get started."
            }
            action={<Button onClick={openCreate} size="sm"><FiPlus size={13} /> New Task</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={(id) => setDeleteTaskId(id)}
                showOwner={isAdmin}
              />
            ))}
          </div>
        )}

        {/* Pagination — shown only when backend provides pagination data (not filtered/searched)
            Null-safe: totalPages defaults to 0 so this block simply won't render when pagination is null */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-3 py-1.5 text-xs text-slate-500 font-medium bg-white border border-slate-200 rounded-lg">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          title={editingTask ? "Edit Task" : "New Task"}
          subtitle={editingTask ? "Update task details" : "Add a new task to your list"}
          onClose={() => setShowForm(false)}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => setShowForm(false)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteTaskId !== null && (
        <DeleteTaskModal
          onConfirm={confirmDelete}
          onClose={() => setDeleteTaskId(null)}
        />
      )}
    </Sidebar>
  );
};

export default DashboardPage;