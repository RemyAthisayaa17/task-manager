export interface CreateTaskInput {
  title: string;
  description?: string;
  userId: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
}