/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import * as cronJob from 'node-cron'
import * as dotenv from 'dotenv';
dotenv.config();

import { AppConfig } from './constants/Constants';
import { getHpoolOnline, getRevenue, getMiner, getAssets, getMiningIncome } from './util/Hpool';
import { sendLineNotify } from './util/LineNotify';
import { getPriceMarketCap } from './util/MarketCap';


// Market price from https://coinmarketcap.com/currencies/chia-network/
const runTask = async () => {
  try {
    var pricevalue = await getPriceMarketCap('chia-network');
    let marketPrice = parseFloat(pricevalue.replace(/[฿]/g, m => '').replace(/[$]/g, m => '').replace(/[,]/g, m => ''));
  
    var poolOnline = await getHpoolOnline(marketPrice);
    var revenue = await getRevenue(marketPrice);
    var workers = await getMiner();
    var miningIncome = await getMiningIncome(marketPrice);
    var assests = await getAssets(marketPrice);
    
    if (AppConfig.ENABLE_LINE_NOTIFY === 'true')
      sendLineNotify(`${poolOnline} ${revenue} ${workers} ${miningIncome} ${assests}`);
  } catch (error) {
    console.log('Error:' + error.message)
  }
}

const jobs = [
  {
    pattern: '30 08 * * *',
    message: 'Recheck hpool 08:30'
  }, {
    pattern: '35 10 * * *',
    message: 'Recheck hpool in 10:35'
  }, {
    pattern: '0 12 * * *',
    message: 'Recheck hpool in 12:00'
  }, {
    pattern: '0 18 * * *',
    message: 'Recheck hpool 18:00'
  }, {
    pattern: '0 22 * * *',
    message: 'Recheck hpool 22:00'
  }
];

console.log('Add task');
jobs.forEach((job, index) => {
  console.log(`[+${index}] <<${job.pattern}>> - ${job.message}`)
  cronJob.schedule(job.pattern, () => {
    console.log(job.message);
    runTask();
  }).start();
});
console.log('Task Started')


//runTask();
