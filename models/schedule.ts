export interface Schedule {
    id: number | string;
    active: boolean;
    task_id: number | string;
    description: string;
    cron: string;
    delay: number;
    start: null | Date;
    end: null | Date;
  }
  