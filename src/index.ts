/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppConfig } from './constants/Constants'
import { Revenue, RevenueData } from './types/Revenue';
import { HpoolOnline } from './types/HpoolOnline';
import { OnlineMiner, Miner } from './types/Miner';

const AUTH_HEADER = {
  headers: {
    'Content-Type': 'application/json',
    Cookie: `auth_token=${AppConfig.AUTH_TOKEN}`,
  },
};

const getRevenue = async () => {
  var res: any = [];
  for (var pageNum = 1; pageNum <= 3; pageNum++) {
    var isSettlemented = await axios.get<Revenue>(
      `${AppConfig.API_URL}/miningdetail?language=en&type=chia&count=${AppConfig.PAGESIZE}&page=${pageNum}`, AUTH_HEADER).then((response) => {
        if (response.data.code == 200) {
          const { data } = response.data;
          return data.list;
        } else console.log('ERROR:', response.data.message);
      }).then(bb => {
        //console.log('[+] page: ' + pageNum + ' ====> ' + bb?.length + ' rows');
        res.push.apply(res, bb);

        var settlements = bb?.filter(v => v.status_str === 'SETTLEMENT');
        return (settlements && settlements.length > 0);
      });

    if (isSettlemented)
      break;
  }

  var unsettlements: any = res?.filter((v: RevenueData) => v.status_str === 'UNSETTLEMENT');
  if (unsettlements && unsettlements.length > 0) {
    const { record_time, height, block_reward } = unsettlements[0];
    const milliseconds = record_time * 1000;
    const humanDateFormat = new Date(milliseconds).toLocaleString();
    console.log('Latest Height :', height);
    console.log('Latest Update :', humanDateFormat);
    console.log(`Latest Block reward : ${block_reward} XCH (${(parseFloat(AppConfig.XCH_MARKET_PRICE?? '') * parseFloat(block_reward)).toFixed(2)} THB / per plot) `);
    console.log(' ');
  }

  const totalBlockReward = unsettlements.reduce((prev: number, cur: RevenueData) => prev + Number(cur.block_reward), 0);
  console.log(' --- Daily Revenue --- ');
  console.log('Current Block reward :', unsettlements.length);
  console.log(
    `Current Total : ${totalBlockReward.toFixed(8)} XCH (${(
      totalBlockReward * parseFloat(AppConfig.XCH_MARKET_PRICE ?? '')
    ).toFixed(2)} THB)`
  );
};

const getHpoolOnline = async() => {
  await axios
    .get<HpoolOnline>(`${AppConfig.API_URL}/detail?language=en&type=chia`, AUTH_HEADER)
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
        console.log(`Type: ${name}`);
        console.log(`Market Price: ${AppConfig.XCH_MARKET_PRICE} THB`);
        console.log(`Pool Icome: ${pool_income } XCH (${(parseFloat(AppConfig.XCH_MARKET_PRICE?? '') * parseFloat(pool_income)).toFixed(2)} THB)`);
        console.log(`Previous Income_pb: ${previous_income_pb} XCH`);
        console.log(`Undistributed Income: ${undistributed_income} XCH`);
        console.log(`Payment time: ${payment_time}`);
        console.log(`Worker Online: ${online}`);
        console.log(`Worker Offline: ${offline}`);
        console.log(`Capacity: ${(capacity / 1024).toFixed(2)} TB`);
        console.log(`Block time: ${block_time}`);

        if(offline > 0){
          //Send Notify
        }

      } else console.log('ERROR:', response.data.message);
    });
    console.log(' ');
};

const getMiner = async() => {
  await axios
    .get<OnlineMiner>(
      `${AppConfig.API_URL}/miner?language=en&status=all&type=chia&count=20&page=1`, AUTH_HEADER).then((response) => {
        if (response.data.code == 200) {
          console.log('############# WORKER ################');
          response.data.data.list.forEach((miner: Miner) => {
            const { id, capacity, miner_name, online, update_time } = miner;
            const humanDateFormat = new Date(update_time * 1000).toLocaleString();

            console.log(`[+] ${id} Power: ${(capacity / 1024).toFixed(2)} TB ${(online ? '<<Online>>' : '<<Offline>>')} LastUpdate :${humanDateFormat}  [${miner_name}]`);
          });
          console.log('###################################');
          console.log(' ');
        } else console.log('ERROR:', response.data.message);
      });
};


getHpoolOnline();
getRevenue();
getMiner();
