/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from 'axios';
import { JSDOM } from 'jsdom';
import { AppConfig } from '../constants/Constants';
const HEADER = {
    timeout: 8000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `currency=${AppConfig.CURRENCY}`,
    },
};
const getPriceMarketCap = async (currency: string) => {
    var priceValue: string | null = '';
    await axios.get(`https://coinmarketcap.com/currencies/${currency}/`, HEADER).then((res) => {
        const dom = new JSDOM(res.data);
        dom.window.document.querySelectorAll('div').forEach(d => {
            if (d.className.includes('priceValue')) {
                priceValue = d?.textContent;
                //console.log('XCH Market Price:', d?.textContent);
                return;
            }
        });
    }).catch((err) => console.log(err));
    return priceValue;
}


export { getPriceMarketCap }
