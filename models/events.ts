export interface Event {
    id: number | string;
    active: boolean;
    device_id: number | string;
    description: string;
    message: any;
    name: string;
    priority: number;
    process_time: number;
    public: boolean;
    retention_days: number;
    version: number;
    type_id: number;
    scenePreview: string;
  }
  