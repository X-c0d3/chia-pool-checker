/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import * as dotenv from 'dotenv';
dotenv.config();

import { AppConfig } from './constants/Constants';
import { getHpoolOnline, getRevenue, getMiner, getAssets } from './util/Hpool';
import { sendLineNotify } from './util/LineNotify';
import { getPriceMarketCap } from './util/MarketCap'


// Market price from https://coinmarketcap.com/currencies/chia-network/
const run = async () => {
  var pricevalue = await getPriceMarketCap('chia-network');
  pricevalue = pricevalue.replace(/[฿]/g, m => '');
  pricevalue = pricevalue.replace(/[$]/g, m => '');
  pricevalue = pricevalue.replace(/[,]/g, m => '');
  let marketPrice  = parseFloat(pricevalue);
  
  var poolOnline = await getHpoolOnline(marketPrice);
  var revenue = await getRevenue(marketPrice);
  var workers = await getMiner();
  await getAssets();

  if (AppConfig.ENABLE_LINE_NOTIFY === 'true')
    sendLineNotify(`${poolOnline} ${revenue} ${workers}`);
};

run();



