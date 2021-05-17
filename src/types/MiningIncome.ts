export type MiningIncomeData = {
    coin: string;
    name: string;
    total_income: string;
    type: string;
    undistributed_income: string;
    yesterday_income: string;
};

interface MiningIncome {
    code: number;
    data: {
        list: [MiningIncomeData];
        total: number;
    };
    message: string;
}

export { MiningIncome };
