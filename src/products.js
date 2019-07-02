// 使用打折券优惠的金额
export const discountRules = (rule) => {
    if (rule === '95折券') {
        return 0.05
    }else if (rule === '9折券') {
        return 0.1
    }else {
        return 0
    }
}

// 使用满减活动规则优惠的金额
export const freeRules = (rule, amount, total, singleP) => {
    if (rule === '每满3000元减350') {        
        return parseFloat(Math.floor(total/3000) * 350)
    }else if (rule === '每满2000元减30') {
        return parseFloat(Math.floor(total/2000) * 30)
    }else if (rule === '每满1000元减10') {
        return parseFloat(Math.floor(total/1000) * 10)
    }else if (rule === '第3件半价') {
        if (amount >= 3) {
            return parseFloat(singleP) * 0.5
        }
    }else if (rule === '满3送1') {
        if (amount >= 4) {
            return parseFloat(singleP)
        }
    }else {
        return 0
    }
}


// 计算单个商品的最大优惠
export const getMaxFree = (item) => {
    let prdInfo = products[item.product]
    let singleDisPrice = 0
    for(let i = 0, len = prdInfo.freeRule.length; i < len; i++) {
        let amount = item.amount
        let singleP = prdInfo.price
        let total = parseFloat(amount) * parseFloat(singleP)
        let tempDisPrice = freeRules(prdInfo.freeRule[i], amount, total, singleP)
        console.log('tempDisPrice', tempDisPrice)
        if (tempDisPrice > singleDisPrice) {
            singleDisPrice = tempDisPrice
        }
    }
    return singleDisPrice
}

// 产品信息
export const products = {
    '001001' : {
        name: '世园会五十国钱币册',
        unit: 'ce',
        price: 998,
        discountRules: '',
        freeRule: []
    },
    '001002' :{
        name: '2019北京世园会纪念银章大全40g',
        unit: 'box',
        price: 1380,
        discountRules: '9折券',
        freeRule: []
    },
    '003001' : {
        name: '招财进宝',
        unit: 'tiao',
        price: 1580,
        discountRules: '95折券',
        freeRule: []
    },
    '003002' : {
        name: '水晶之恋',
        unit: 'tiao',
        price: 980,
        discountRules: '',
        freeRule: ['第3件半价', '满3送1']
    },
    '002002' : {
        name: '中国经典钱币套装',
        unit: 'tao',
        price: 998,
        discountRules: '',
        freeRule: ['每满2000减30', '每满1000减10']
    },
    '002001' : {
        name: '守扩之羽比翼双飞4.8g',
        unit: 'tiao',
        price: 1080,
        discountRules: '95折券',
        freeRule: ['第3件半价', '满3送1']
    },
    '002003' : {
        name: '中国银象棋12g',
        unit: 'tao',
        price: 698,
        discountRules: '9折券',
        freeRule: ['每满3000元减350', '每满2000减30', '每满1000减10']
    }
}