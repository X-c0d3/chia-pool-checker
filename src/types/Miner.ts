export type Miner = {
  capacity: number;
  id: string;
  miner_name: string;
  online: true;
  update_time: number;
};

interface OnlineMiner {
  code: number;
  data: {
    list: [Miner];
  };
  message: string;
}

export { OnlineMiner };
