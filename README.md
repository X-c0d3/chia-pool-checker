### Chia Hpool Checker

![Hpool Checker](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot3.png)

# วิธีการหา Auth Token ของ Hpool

หลังจาก Login เข้า Hpool กด F12 (Developer Mode) แล้วกด Link ไหนก็ได้
เพื่อให้มีการ call api ของ Hpool
จากนั้น เราสามารถเอา auth_token ที่อยู่ใน Request Header มาใส่ใน .env ได้เลย

![วิธีเอา Token จาก Hpool](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot4.png)

เราสามารถกำหนดเวลา ให้โปรแกรม ส่ง Notify ไปตามช่วงเวลาที่เราต้องการได้
โดยการแก้ไขผ่าน Config ที่อยู่ใน index.ts (หลักการตั้งค่า เหมือน Cron Job บน Linux)
ศึกษาเพิ่มเติมที่ https://crontab.guru/
![schedule](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot5.png)

```
git clone https://github.com/X-c0d3/chia-pool-checker.git
cd chia-pool-checker
yarn install
yarn start
```

Required .env

```ruby
PAGESIZE = 100
API_URL = https://www.hpool.com/api
AUTH_TOKEN = <YOUR HPOOL TOKEN>
ENABLE_LINE_NOTIFY=true
LINE_TOKEN = <YOUR LINE TOKEN>
CURRENCY = THB
EXCHANGE_RATE_USD = 31.5
```

<br />
Happy Hacking!
