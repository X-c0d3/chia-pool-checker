/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import * as dotenv from 'dotenv';
dotenv.config();

import { AppConfig } from './constants/Constants';
import { getHpoolOnline, getRevenue, getMiner, getAssets, getMiningIncome } from './util/Hpool';
import { sendLineNotify } from './util/LineNotify';
import { getPriceMarketCap } from './util/MarketCap'


// Market price from https://coinmarketcap.com/currencies/chia-network/
const run = async () => {
  var pricevalue = await getPriceMarketCap('chia-network');
  let marketPrice  = parseFloat(pricevalue.replace(/[฿]/g, m => '').replace(/[$]/g, m => '').replace(/[,]/g, m => ''));
  
  var poolOnline = await getHpoolOnline(marketPrice);
  var revenue = await getRevenue(marketPrice);
  var workers = await getMiner();
  await getAssets();
  await getMiningIncome(marketPrice);
  if (AppConfig.ENABLE_LINE_NOTIFY === 'true')
    sendLineNotify(`${poolOnline} ${revenue} ${workers}`);
};

run();



