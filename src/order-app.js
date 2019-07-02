import OrderRepresentation from './output/order-representation';
import OrderItem from './output/order-item';
import {discountRules, products, getMaxFree} from './products'
import { setMemberPoints, users} from './user-info'


export default class OrderApp {

  checkout(orderCommand) {
    let orderCommandObj = JSON.parse(orderCommand)
    // TODO: 请完成需求指定的功能
    // 优惠券优惠价格
    let useDiscount = orderCommandObj.discountCards || []
    let freePrice01 = useDiscount.length > 0 ? this.getDiscountPrice(orderCommandObj.items || [], useDiscount[0]) : 0
    // 满减优惠价格
    let freePrice02 = this.getFreePrice(orderCommandObj.items || [])
    // 判断哪种优惠更大
    let isDiscount = false 
    if (freePrice01.disAllPrice >  freePrice02.disAllPrice) {
      isDiscount = true
    } else {
      isDiscount = false
    }
    

    // 封装order对象
    let totalPrice = 0
    let newItems = []
    for (let i = 0, len = orderCommandObj.items.length; i < len; i++) {
      let prdID = orderCommandObj.items[i].product
      let singelTotalPrice = parseFloat(products[prdID].price * orderCommandObj.items[i].amount).toFixed(2)
      newItems.push(new OrderItem(
        {
          productNo: prdID, 
          productName: products[prdID].name, 
          price: products[prdID].price, 
          amount: orderCommandObj.items[i].amount, 
          subTotal: Number(singelTotalPrice) 
        }
      ))
      totalPrice += parseFloat(singelTotalPrice)
    }
    
    
    let currentUsr = users[orderCommandObj.memberId]
    let totalDiscountPrice = isDiscount ? freePrice01.disAllPrice : freePrice02.disAllPrice
    let receivables = (parseFloat(totalPrice) - parseFloat(totalDiscountPrice))
    // 用户增加积分
    let userChangeinfo = setMemberPoints(receivables, orderCommandObj.memberId)
    // 拼装打印对象
    let representObj = {
      orderId: orderCommandObj.orderId, 
      createTime: new Date(orderCommandObj.createTime,'YYYY-MM-dd HH:mm:ss'),
      memberNo: orderCommandObj.memberId, 
      memberName: currentUsr.name, 
      oldMemberType: userChangeinfo.oldLevel, 
      newMemberType: currentUsr.level, 
      memberPointsIncreased: userChangeinfo.increaseP, 
      memberPoints: currentUsr.memberPoints,
      orderItems: newItems, 
      totalPrice: totalPrice, 
      discounts: isDiscount ? freePrice01.disArr : freePrice02.disArr, 
      totalDiscountPrice: totalDiscountPrice, 
      receivables: receivables, 
      payments: orderCommandObj.payments, 
      discountCards: isDiscount ? orderCommandObj.discountCards : []
    }
    console.log('representObj', representObj)
    return (new OrderRepresentation(representObj)).toString();
  }

  // 使用优惠券优惠的价格
  getDiscountPrice (prds, discount) {
    let disAllPrice = 0
    let disArr = []
    for (let i = 0, len = prds.length; i < len; i++) {
      let prdID = prds[i].product
      if (products[prdID].discountRules === discount) {
        let discountPercent = discountRules(discount)
        let disPrice = (discountPercent * products[prdID].price * prds[i].amount).toFixed(2)
        disAllPrice = parseFloat(disPrice) + parseFloat(disAllPrice)
        if (disPrice > 0) {
          let disObj = {
            product: prdID,
            discountPrice: disPrice
          }
          disArr.push(disObj)
        }
      }   
    }
    return {
      disAllPrice: disAllPrice,
      disArr: disArr
    }
  }
  
  // 满减优惠价格
  getFreePrice (prds) {
    let disAllPrice = 0
    let disArr = []
    for (let i = 0, len = prds.length; i < len; i++) {
      let disPrice = getMaxFree(prds[i])
      disAllPrice = parseFloat(disPrice)  + parseFloat(disAllPrice)
      if (disPrice > 0) {
        let disObj = {
          product: prdID,
          discountPrice: disPrice
        }
        disArr.push(disObj)
      }
    }
    return {
      disAllPrice: disAllPrice,
      disArr: disArr
    }
  }

}
