import { useState } from "react";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/models";
import { TASK_STATUS } from "../constants/app.constants";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { Modal, Alert, Button, Spinner, EmptyState } from "../components/ui";

const DashboardPage = () => {
  const { isAdmin, user } = useAuth();

  const {
    tasks, loading, error, success, pagination,
    searchQuery, draftSearch, statusFilter, page,
    setDraftSearch, setPage,
    submitSearch, applyFilter, clearFilters,
    createTask, updateTask, deleteTask,
  } = useTasks();

  // ── Modals state ─────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // ── CREATE / UPDATE ──────────────────────────
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

  // ── DELETE FLOW ──────────────────────────────
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

  const totalPages = pagination?.totalPages ?? 1;

  const pendingCount = tasks.filter(t => t.status === TASK_STATUS.PENDING).length;
  const completedCount = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
  const totalTasks = pagination?.total ?? tasks.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? "All Tasks" : "My Tasks"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user?.name}
            </p>
          </div>

          <Button onClick={openCreate}>
            + New Task
          </Button>
        </div>

        {/* ALERTS */}
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        {/* TASKS */}
        {loading ? (
          <Spinner text="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </Button>

            <span className="px-3 py-2 text-sm">
              Page {page}
            </span>

            <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <Modal
          title={editingTask ? "Edit Task" : "Create Task"}
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

      {/* DELETE MODAL */}
      {deleteTaskId !== null && (
        <DeleteTaskModal
          onConfirm={confirmDelete}
          onClose={() => setDeleteTaskId(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;