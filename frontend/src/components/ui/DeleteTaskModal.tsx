import { Modal } from "../ui";
import { Button } from "../ui";

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteTaskModal = ({ onConfirm, onClose }: Props) => {
  return (
    <Modal title="Delete Task" onClose={onClose}>

      <p className="text-gray-600 text-sm">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Yes, Delete
        </Button>

      </div>

    </Modal>
  );
};

export default DeleteTaskModal;