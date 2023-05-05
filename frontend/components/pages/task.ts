export default interface Task {
  id: string;
  description: string;
  justification?: string;
  source: string;
  order: number;
  isCompleted: boolean;
}

