### Chia Hpool Checker

![Hpool Checker](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot3.png)

```
need to install nodejs  
https://nodejs.org/en/download/

1. Download Source code ลงไว้ที่เครื่อง
git clone https://github.com/X-c0d3/chia-pool-checker.git
cd chia-pool-checker

2. ทำการ Install package module
yarn install

3. สร้างไฟล์ .env ดังตัวอย่างด้านล่าง
4. รันโปรแกรมด้วยคำสั่ง
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

# วิธีการหา Auth Token ของ Hpool

หลังจาก Login เข้า Hpool กด F12 (Developer Mode) แล้วกด Link ไหนก็ได้
เพื่อให้มีการ call api ของ Hpool
จากนั้น เราสามารถเอา auth_token ที่อยู่ใน Request Header มาใส่ใน .env ได้เลย

![วิธีเอา Token จาก Hpool](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot4.png)

เราสามารถกำหนดเวลา ให้โปรแกรม ส่ง Notify ไปตามช่วงเวลาที่เราต้องการได้
โดยการแก้ไขผ่าน Config ที่อยู่ใน index.ts (หลักการตั้งค่า เหมือน Cron Job บน Linux)
ศึกษาเพิ่มเติมที่ https://crontab.guru/
![schedule](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot5.png)

<br />
ขอให้สนุกกับการขุดครับ :)
