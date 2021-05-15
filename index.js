"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const TOKEN = 'auth_token=eyJldCI6MTYyMTc4MzY4MSwiZ2lkIjo2NCwidWlkIjo5OTA2MDh9.TPA2ixcOWQnGroP4h/6J+CG9pIor/daSrvTuGqOdgfJCEB3/WF8p8hHCiV4AODDANvaZGlDZrjPg9JW02hDBrldvmFcdRcIwW/MjsvAIxTXNSTxuQ/3F8612PO54BwLND9UH+uUkSno4mAeNo8BYtH5c0WkuWXnF9NuzFCF45ypjnzxmbKciJSkz/Zr//C2san/PAYSLUXYKHU45f7DeUbJm0SnkVvDjV6R7zym/dHrGlyWO8IOQO7tHG2ETBZXlJgAk7D2AuR+sVk1NbfGmxYRkqjinuDuLYkNXEDo3Y101hUig/TD+tNrBPRdJYcyuWqVmbTCl48d/yrIBC/RZ3w==';
const API_URL = 'https://www.hpool.com/api/pool';
const XCH_PRICE = 32000;
const AUTH_HEADER = {
    headers: {
        'Content-Type': 'application/json',
        Cookie: TOKEN,
    },
};
const sendGetRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield axios_1.default.get('https://jsonplaceholder.typicode.com/posts');
        console.log(resp.data);
    }
    catch (err) {
        // Handle Error Here
        console.error(err);
    }
});
const getRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    let res = [];
    const pageSize = 100;
    let a = 1;
    for (var pageNum = 1; pageNum <= 5; pageNum++) {
        console.log('send ' + pageNum);
        var response = yield axios_1.default.get(`${API_URL}/miningdetail?language=en&type=chia&count=${pageSize}&page=${pageNum}`, AUTH_HEADER).then((response) => {
            if (response.data.code == 200) {
                const { data } = response.data;
                return data.list;
            }
            else
                console.log('ERROR:', response.data.message);
        });
        response.then(bb => {
            console.log('[+] page: ' + a + ' ====> ' + (bb === null || bb === void 0 ? void 0 : bb.length) + ' rows');
            var unsettlements = bb === null || bb === void 0 ? void 0 : bb.filter((v) => v.status_str === 'UNSETTLEMENT');
            if (unsettlements && unsettlements.length > 0 && a === 1) {
                const { record_time, height, block_reward } = unsettlements[0];
                const milliseconds = record_time * 1000;
                const humanDateFormat = new Date(milliseconds).toLocaleString();
                console.log('Latest Height :', height);
                console.log('Latest Update :', humanDateFormat);
                console.log('Latest Block reward :', block_reward + ' XCH');
            }
            var settlements = bb === null || bb === void 0 ? void 0 : bb.filter(v => v.status_str === 'SETTLEMENT');
            if (settlements && settlements.length > 0) {
                //console.log('Hacked:' + a)
                //return;
            }
            console.log(`${a} - ${unsettlements.length}`);
            a++;
        });
    }
    console.log('Total:' + res.length);
    // const totalBlockReward = unsettlements.reduce(
    //   (prev: number, cur) => prev + Number(cur.block_reward),
    //   0
    // );
    // console.log('Total Block reward :', unsettlements.length);
    // console.log(
    //   `Total : ${totalBlockReward.toFixed(8)} XCH (${(
    //     totalBlockReward * XCH_PRICE
    //   ).toFixed(2)} THB)`
    // );
});
const getHpoolOnline = () => {
    axios_1.default
        .get(`${API_URL}/detail?language=en&type=chia`, AUTH_HEADER)
        .then((response) => {
        if (response.data.code == 200) {
            const { online, offline, name, payment_time, block_time, capacity, pool_income, undistributed_income, previous_income_pb, } = response.data.data;
            console.log('####################################');
            console.log('Type: ' + name);
            console.log('Pool Icome: ' + pool_income);
            console.log('Previous Income_pb: ' + previous_income_pb);
            console.log('Undistributed Income: ' + undistributed_income);
            console.log('Payment time: ' + payment_time);
            console.log('Worker Online: ' + online);
            console.log('Worker Offline: ' + offline);
            console.log('Capacity: ' + capacity);
            console.log('Block time: ' + block_time);
        }
        else
            console.log('ERROR:', response.data.message);
    });
};
const getMiner = () => {
    axios_1.default
        .get(`${API_URL}/miner?language=en&status=all&type=chia&count=20&page=1`, AUTH_HEADER).then((response) => {
        if (response.data.code == 200) {
            console.log('############# WORKER ################');
            response.data.data.list.forEach((miner) => {
                const { capacity, miner_name, online, update_time } = miner;
                const milliseconds = update_time * 1000;
                const humanDateFormat = new Date(milliseconds).toLocaleString();
                console.log('[+] ' +
                    miner_name +
                    '   Power: ' +
                    capacity +
                    'TB  ' +
                    (online ? '<<Online>>' : '<<Offline>>') +
                    '  LastUpdate :' +
                    humanDateFormat);
            });
            console.log('####################################');
        }
        else
            console.log('ERROR:', response.data.message);
    });
};
//getHpoolOnline();
getRevenue();
//getMiner();
