export type OnlineData = {
    api_key: string;
    block_reward: string;
    block_time: number;
    capacity: number;
    coin: string;
    deposit_mortgage_balance: string;
    deposit_mortgage_effective_balance: string;
    deposit_mortgage_free_balance: string;
    deposit_rate: string;
    fee: number;
    loan_mortgage_balance: string;
    mortgage: string;
    name: string;
    offline: number;
    online: number;
    payment_time: string;
    point_deposit_balance: string;
    pool_address: string;
    pool_income: string;
    pool_type: string;
    previous_income_pb: string;
    theory_mortgage_balance: string;
    type: string;
    undistributed_income: string;
  };
  
  interface HpoolOnline {
    code: number;
    data: OnlineData;
    message: string;
  }
  
  export { HpoolOnline };
  