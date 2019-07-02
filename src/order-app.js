import OrderRepresentation from './output/order-representation';
import DiscountItem from './output/discount-item';
import OrderItem from './output/order-item';
import {discountRules, products, getMaxFree} from './products'
import { setMemberPoints, users} from './user-info'


export default class OrderApp {

  checkout(orderCommand) {
    let orderCommandObj = JSON.parse(orderCommand)
    // TODO: 请完成需求指定的功能
    // 优惠价格
    let useDiscount = orderCommandObj.discountCards || []
    let freePrice01 = useDiscount.length > 0 ? this.getDiscountPrice(orderCommandObj.items || [], useDiscount[0]) : 0
    let isDiscount = freePrice01.isDiscount 
   
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
    
    console.log('isDiscount', isDiscount)
    let currentUsr = users[orderCommandObj.memberId]
    let totalDiscountPrice = freePrice01.disAllPrice
    let receivables = (parseFloat(totalPrice) - parseFloat(totalDiscountPrice))
    // 用户增加积分
    let userChangeinfo = setMemberPoints(receivables, orderCommandObj.memberId)
    // 拼装打印对象
    let representObj = {
      orderId: orderCommandObj.orderId, 
      createTime: new Date(orderCommandObj.createTime),
      memberNo: orderCommandObj.memberId, 
      memberName: currentUsr.name, 
      oldMemberType: userChangeinfo.oldLevel, 
      newMemberType: currentUsr.level, 
      memberPointsIncreased: userChangeinfo.increaseP, 
      memberPoints: currentUsr.memberPoints,
      orderItems: newItems, 
      totalPrice: totalPrice, 
      discounts: freePrice01.disArr, 
      totalDiscountPrice: totalDiscountPrice, 
      receivables: receivables, 
      payments: orderCommandObj.payments, 
      discountCards: isDiscount ? orderCommandObj.discountCards : []
    }
    return (new OrderRepresentation(representObj)).toString();
  }

  // 使用优惠券优惠的价格
  getDiscountPrice (prds, discount) {
    let disAllPrice = 0
    let disArr = []
    let isDiscount = false
    for (let i = 0, len = prds.length; i < len; i++) {
      let prdID = prds[i].product
      if (products[prdID].discountRules === discount) {
        let discountPercent = discountRules(discount)
        let disPrice = (discountPercent * products[prdID].price * prds[i].amount).toFixed(2)
        let freePrice = getMaxFree(prds[i])
        let maxPrice = parseFloat(disPrice) > parseFloat(freePrice) ?  parseFloat(disPrice) : parseFloat(freePrice)
        if (!isDiscount && parseFloat(disPrice) > parseFloat(freePrice)) {
          isDiscount = true
        }
        disAllPrice = parseFloat(disAllPrice) + maxPrice
        if (maxPrice > 0) {
          disArr.push(new DiscountItem(
            {
              productNo: prdID,
              productName: products[prdID].name,
              discount: parseFloat(0 - maxPrice)
            }
          ))
        }
      }   
    }
    return {
      disAllPrice: disAllPrice,
      disArr: disArr,
      isDiscount: isDiscount
    }
  }

}
