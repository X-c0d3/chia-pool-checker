export type AssetData = {
  balance: string;
  cooperation_amount: string;
  deposit_amount: string;
  freeze_balance: string;
  name: string;
  total_assets: string;
  type: string;
  withdraw_amount: string;
  usdt: number;
};

export type AssetCurrency = {
  cny: number;
  usdt: number;
};

interface Assets {
  code: number;
  data: {
    currency: AssetCurrency;
    list: [AssetData];
    total: number;
  };
  message: string;
}

export { Assets };
