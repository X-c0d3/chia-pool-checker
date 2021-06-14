export type OnlinePlotData = {
    capacity: number;
    public_key: string;
    size: number;
    status: string;
    updated_at: number;
    uuid: string;
  };
  
  interface OnlinePlot {
    code: number;
    data: {
      list: [OnlinePlotData];
      total: number;
    };
    message: string;
    
  }
  
  export { OnlinePlot };
  