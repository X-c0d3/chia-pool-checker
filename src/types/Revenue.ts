export type RevenueData = {
  block_reward: string;
  coin: string;
  height: string;
  huge_reward: string;
  mortgage_rate_k: number;
  name: string;
  record_time: number;
  status: number;
  status_str: string;
  type: string;
};

interface Revenue {
  code: number;
  data: {
    list: [RevenueData];
    total: number;
  };
  message: string;
  
}

export { Revenue };
