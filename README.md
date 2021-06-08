### Chia Hpool Checker

![Hpool Checker](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot3.png)

วิธีการหา Auth Token ของ Hpool

- หลังจาก Login เข้า Hpool กด F12 (Developer Mode) แล้วกด Link ไหนก็ได้ เพื่อให้มีการ call api ของ Hpool
  จากนั้น เราสามารถเอา auth_token ที่อยู่ใน Request Header มาใส่ใน .env ได้เลย
  ![วิธีเอา Token จาก Hpool](https://raw.githubusercontent.com/X-c0d3/chia-pool-checker/main/ScreenShot4.png)

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
