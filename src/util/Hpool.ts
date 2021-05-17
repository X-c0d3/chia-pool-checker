/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from 'axios';
import { AppConfig } from '../constants/Constants';
import { Revenue, RevenueData } from '../types/Revenue';
import { HpoolOnline } from '../types/HpoolOnline';
import { OnlineMiner, Miner } from '../types/Miner';
import { Assets, AssetData } from '../types/Assets';
import { MiningIncome, MiningIncomeData } from '../types/MiningIncome';

const AUTH_HEADER = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Cookie: `auth_token=${AppConfig.AUTH_TOKEN}`,
  },
};

const getRevenue = async (marketPrice: number) => {
  var res: any = [];
  for (var pageNum = 1; pageNum <= 3; pageNum++) {
    var isSettlemented = await axios
      .get<Revenue>(
        `${AppConfig.API_URL}/pool/miningdetail?language=en&type=chia&count=${AppConfig.PAGESIZE}&page=${pageNum}`,
        AUTH_HEADER
      )
      .then((response) => {
        if (response.data.code == 200) {
          const { data } = response.data;
          return data.list;
        } else console.log('ERROR:', response.data.message);
      })
      .then((bb) => {
        //console.log('[+] page: ' + pageNum + ' ====> ' + bb?.length + ' rows');
        res.push.apply(res, bb);

        var settlements = bb?.filter((v) => v.status_str === 'SETTLEMENT');
        return settlements && settlements.length > 0;
      });

    if (isSettlemented) break;
  }

  var unsettlements: any = res?.filter(
    (v: RevenueData) => v.status_str === 'UNSETTLEMENT'
  );
  let msg = '';
  if (unsettlements && unsettlements.length > 0) {
    const { record_time, height, block_reward } = unsettlements[0];
    const milliseconds = record_time * 1000;
    const humanDateFormat = new Date(milliseconds).toLocaleString();
    console.log('Latest Height :', height);
    console.log('Latest Update :', humanDateFormat);
    console.log(
      `Latest Block reward : ${block_reward} XCH (${(marketPrice * parseFloat(block_reward)).toFixed(2)} ${AppConfig.CURRENCY}) `
    );

    msg = `
  Latest Height : ${height}
  Latest Update : ${humanDateFormat}
  Latest Block reward : ${block_reward} XCH (${(marketPrice * parseFloat(block_reward)).toFixed(2)} ${AppConfig.CURRENCY})
      `;

    console.log(' ');
  }

  const totalBlockReward = unsettlements.reduce(
    (prev: number, cur: RevenueData) => prev + Number(cur.block_reward),
    0
  );
  console.log(' --- Daily Revenue (Unsettlement) --- ');
  console.log('Block reward Attemps :', unsettlements.length);
  console.log(
    `Total Block reward : ${totalBlockReward.toFixed(8)} XCH (${(
      totalBlockReward * marketPrice
    ).toFixed(2)} ${AppConfig.CURRENCY})`
  );

  return (`
        ${msg}
    --- Daily Revenue  (Unsettlement)--- 
  Block reward attemps: ${unsettlements.length}
  Total Block reward: ${totalBlockReward.toFixed(8)} XCH 
  (${(totalBlockReward * marketPrice).toFixed(2)} ${AppConfig.CURRENCY})
        `
  );
};

const getHpoolOnline = async (marketPrice: number) => {
  return await axios
    .get<HpoolOnline>(
      `${AppConfig.API_URL}/pool/detail?language=en&type=chia`,
      AUTH_HEADER
    )
    .then((response) => {
      if (response.data.code == 200) {
        const {
          online,
          offline,
          name,
          payment_time,
          block_time,
          capacity,
          pool_income,
          undistributed_income,
          previous_income_pb,
        } = response.data.data;
        console.log('--- CHIA HPOOL CHECKER --')
        console.log(`Type: ${name}`);
        console.log(`Market Price: ${marketPrice} ${AppConfig.CURRENCY}`);
        console.log(
          `Total Icome: ${pool_income} XCH (${(marketPrice * parseFloat(pool_income)
          ).toFixed(2)} ${AppConfig.CURRENCY})`
        );
        console.log(`Previous Income_pb: ${previous_income_pb} XCH`);
        console.log(`Undistributed Income: ${undistributed_income} XCH`);
        console.log(`Payment time: ${payment_time}`);
        console.log(`Online / Offline Miners: ${online}/${offline}`);
        console.log(`Capacity: ${(capacity / 1024).toFixed(2)} TB`);
        console.log(`Block time: ${block_time}`);
        console.log(' ');

        return `
    --- CHIA HPOOL CHECKER ---
  Market Price: ${marketPrice} ${AppConfig.CURRENCY}
  Total Icome: (ThaiBath) ${(marketPrice * parseFloat(pool_income)).toFixed(2)} ${AppConfig.CURRENCY}
  Total Icome: ${pool_income} XCH
  Previous Income_pb: ${previous_income_pb} XCH
  Undistributed Income: ${undistributed_income} XCH
  Payment time: ${payment_time}
  Capacity: ${(capacity / 1024).toFixed(2)} TB
  Online / Offline Miners: ${online}/${offline}`;
      } else {
        console.log('ERROR:', response.data.message);
        return response.data.message;
      }
    });
};

const getMiner = async () => {
  let msg = '';
  await axios
    .get<OnlineMiner>(
      `${AppConfig.API_URL}/pool/miner?language=en&status=all&type=chia&count=20&page=1`,
      AUTH_HEADER
    )
    .then((response) => {
      if (response.data.code == 200) {
        console.log('\r\n############# WORKER ################');
        response.data.data.list.forEach((miner: Miner, index) => {
          const { id, capacity, miner_name, online, update_time } = miner;
          const humanDateFormat = new Date(update_time * 1000).toLocaleString();
          console.log(`[+] ${id} Power: ${(capacity / 1024).toFixed(2)} TB ${online ? '<<Online>>' : '<<Offline>>'} LastUpdate :${humanDateFormat}  [${miner_name}]`);
          msg += `[${miner_name}] ${(capacity / 1024).toFixed(2)}TB ${online ? ' (ON)' : '(OFF)'} \r\n`;
        });
        console.log(' ');
      } else console.log('ERROR:', response.data.message);
    });

  return `
   --- WORKER ---- 
${msg}`
};

const getAssets = async (name: string = 'CHIA') => {
  var assetPrice: AssetData | null = null;
  await axios
    .get<Assets>(
      `${AppConfig.API_URL}/assets/totalassets`,
      AUTH_HEADER
    )
    .then((response) => {
      if (response.data.code == 200) {
        var { usdt } = response.data.data.currency;
        let objAss = response.data.data.list.find(v => v.name === name)
        if (objAss) {
          objAss.usdt = usdt;
          assetPrice = objAss;
        }

        var udstToThb =  objAss?.usdt ? objAss?.usdt * 32 : 0;

        console.log(' --- Assets --- ');
        console.log(`USDT : $${objAss?.usdt} (${udstToThb.toFixed(2)} THB)`);
        console.log('Total assets :', objAss?.total_assets);
        console.log('Balance :', objAss?.balance);
        console.log('Withdraw :', objAss?.withdraw_amount);
        console.log(' ');
      } else console.log('ERROR:', response.data.message);
    });
  return assetPrice;
};


const getMiningIncome = async (marketPrice : number) => {
  var miningIncom: MiningIncomeData | any = {};
  await axios
    .get<MiningIncome>(
      `${AppConfig.API_URL}/assets/miningincome`,
      AUTH_HEADER
    )
    .then((response) => {
      if (response.data.code == 200) {
        var obj = response.data.data.list?.find(v => v.name === 'CHIA');
        miningIncom = obj || null;

        console.log(' --- Mining Income --- ');
        console.log(`Total Income : ${miningIncom?.total_income} XCH (${(marketPrice * parseFloat(miningIncom?.total_income)).toFixed(2)} ${AppConfig.CURRENCY})`);
        console.log(`Undistributed Income : ${miningIncom?.undistributed_income} XCH (${(marketPrice * parseFloat(miningIncom?.undistributed_income)).toFixed(2)} ${AppConfig.CURRENCY})`);
        console.log(`Yesterday Income : ${miningIncom?.yesterday_income} XCH (${(marketPrice * parseFloat(miningIncom?.yesterday_income)).toFixed(2)} ${AppConfig.CURRENCY})`);

      } else console.log('ERROR:', response.data.message);
    });
  return miningIncom;
};

export {
  getRevenue,
  getHpoolOnline,
  getMiner,
  getAssets,
  getMiningIncome
}