export var users = {
    '6236609999' : {
        name: '马丁',
        level: '普卡',
        memberPoints: 9860
    },
    '6630009999' : {
        name: '王立',
        level: '金卡',
        memberPoints: 48860
    },
    '8230009999' : {
        name: '李想',
        level: '白金卡',
        memberPoints: 98860
    },
    '9230009999' : {
        name: '张三',
        level: '钻石卡',
        memberPoints: 198860
    }
}

export const setMemberPoints = (total, memberNo) => {
    // 先算增长的积分，再判断是否升级
    let rate = 1
    let memberType = users[memberNo].level
    if (memberType === '普卡') {
        rate = 1
    } 
    if (memberType === '金卡'){
        rate = 1.5
    }
    if (memberType === '白金卡'){
        rate = 1.8
    }
    if (memberType === '钻石卡'){
        rate = 2
    }
    let increaseP = Math.floor(Math.floor(total) * rate)
    users[memberNo].memberPoints = parseFloat(users[memberNo].memberPoints) + increaseP
    
    // 判断是否升级
    if (users[memberNo].memberPoints < 10000) {
        users[memberNo].level = '普卡'
    }
    if (users[memberNo].memberPoints >= 10000 && users[memberNo].memberPoints < 50000) {
        users[memberNo].level = '金卡'
    }
    if (users[memberNo].memberPoints >= 50000 && users[memberNo].memberPoints < 100000) {
        users[memberNo].level = '白金卡'
    }
    if (users[memberNo].memberPoints >= 100000) {
        users[memberNo].level = '钻石卡'
    }

    // 积分只增不减
    let levelUp = false
    if (users[memberNo].memberType !== memberType) {
        levelUp = true
    }

    return {
        oldLevel: memberType,
        levelUp: levelUp,
        increaseP: increaseP
    }

}