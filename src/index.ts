/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

import { AppConfig } from './constants/Constants';
import { Revenue, RevenueData } from './types/Revenue';
import { HpoolOnline } from './types/HpoolOnline';
import { OnlineMiner, Miner } from './types/Miner';

const AUTH_HEADER = {
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Cookie: `auth_token=${AppConfig.AUTH_TOKEN}`,
  },
};

// curl -X POST -H 'Authorization: Bearer 1L1nklQohhkBCQp3hEpBRrSEmllH3HlheUHtPNE8fLq' -F 'message=foobar'  https://notify-api.line.me/api/notify
const sendLineNotify = async (message: String) => {
  await axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${AppConfig.LINE_TOKEN}`,
    },
    data: `message=${message}`,
  }).catch((err) => {
    console.log(err);
  });
};

const getRevenue = async () => {
  var res: any = [];
  for (var pageNum = 1; pageNum <= 3; pageNum++) {
    var isSettlemented = await axios
      .get<Revenue>(
        `${AppConfig.API_URL}/miningdetail?language=en&type=chia&count=${AppConfig.PAGESIZE}&page=${pageNum}`,
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
      `Latest Block reward : ${block_reward} XCH (${(
        parseFloat(AppConfig.XCH_MARKET_PRICE ?? '') * parseFloat(block_reward)
      ).toFixed(2)} THB) `
    );

    msg = `
Latest Height : ${height}
Latest Update : ${humanDateFormat}
Latest Block reward : ${block_reward} XCH (${(parseFloat(AppConfig.XCH_MARKET_PRICE ?? '') * parseFloat(block_reward)).toFixed(2)} THB)
    `;

    console.log(' ');
  }

  const totalBlockReward = unsettlements.reduce(
    (prev: number, cur: RevenueData) => prev + Number(cur.block_reward),
    0
  );
  console.log(' --- Daily Revenue (Unsettlement) --- ');
  console.log('Current Block reward :', unsettlements.length);
  console.log(
    `Current Total : ${totalBlockReward.toFixed(8)} XCH (${(
      totalBlockReward * parseFloat(AppConfig.XCH_MARKET_PRICE ?? '')
    ).toFixed(2)} THB)`
  );

  return (`
      ${msg}
  --- Daily Revenue  (Unsettlement)--- 
Current Block reward : ${unsettlements.length}
Current Total : ${totalBlockReward.toFixed(8)} XCH 
(${(totalBlockReward * parseFloat(AppConfig.XCH_MARKET_PRICE ?? '')).toFixed(2)} THB)
      `
  );
};

const getHpoolOnline = async () => {
  return await axios
    .get<HpoolOnline>(
      `${AppConfig.API_URL}/detail?language=en&type=chia`,
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
        console.log(`Market Price: ${AppConfig.XCH_MARKET_PRICE} THB`);
        console.log(
          `Pool Icome: ${pool_income} XCH (${(
            parseFloat(AppConfig.XCH_MARKET_PRICE ?? '') *
            parseFloat(pool_income)
          ).toFixed(2)} THB)`
        );
        console.log(`Previous Income_pb: ${previous_income_pb} XCH`);
        console.log(`Undistributed Income: ${undistributed_income} XCH`);
        console.log(`Payment time: ${payment_time}`);
        console.log(`Worker Online: ${online}`);
        console.log(`Worker Offline: ${offline}`);
        console.log(`Capacity: ${(capacity / 1024).toFixed(2)} TB`);
        console.log(`Block time: ${block_time}`);
        console.log(' ');
        if (offline > 0) {
          //Send Notify
          sendLineNotify(`${offline} Worker as been Offline`);
        }

        return `
  --- CHIA HPOOL CHECKER ---
Pool Icome (ThaiBath) ${(parseFloat(AppConfig.XCH_MARKET_PRICE ?? '') * parseFloat(pool_income)).toFixed(2)} THB
Pool Icome ${pool_income} XCH
Previous Income_pb: ${previous_income_pb} XCH
Undistributed Income: ${undistributed_income} XCH
Payment time: ${payment_time}
Capacity: ${(capacity / 1024).toFixed(2)} TB
Worker Online: ${online}`;
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
      `${AppConfig.API_URL}/miner?language=en&status=all&type=chia&count=20&page=1`,
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

      } else console.log('ERROR:', response.data.message);
    });

  return `
 --- WORKER ---- 
${msg}`
};

//getMiner();

const run = async () => {
  var poolOnline = await getHpoolOnline();
  var revenue = await getRevenue();
  var workers = await getMiner();

  if(AppConfig.ENABLE_LINE_NOTIFY)
    sendLineNotify(`${poolOnline} ${revenue} ${workers}`);
};

run();
