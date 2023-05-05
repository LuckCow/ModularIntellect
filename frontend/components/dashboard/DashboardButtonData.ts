export interface DashboardButtonData {
  id: string;
  title: string;
  description: string;
  widget: () => React.ReactNode;
  page: () => React.ReactNode;
}
