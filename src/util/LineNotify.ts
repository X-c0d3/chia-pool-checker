
/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from 'axios';
import { AppConfig } from '../constants/Constants';

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
    }).catch(err => console.log(err));
  };

  export {  sendLineNotify } 