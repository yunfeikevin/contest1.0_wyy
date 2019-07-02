# 贵金属销售系统需求
## 简述
方鼎银行是一家中型城市商业银行，现在委托你开发一套贵金属销售系统，需求如下：

* 根据客户购买的贵金属计算金额
* 客户可以使用账户余额购买贵金属，按客户等级计算积分，如果达到升级积分，则提升客户等级。
* 客户支付时，可以使用打折券，对参与打折的商品享受折扣。
* 根据促销规则，计算优惠金额。
* 打印销售凭证。

## 客户等级说明
客户分为多个等级，并且享受积分。当累计积分达标时自动升级。每实际支付1元对应的基准积分为1分，1元以下不积分。

客户等级：

* `普卡`：1倍基准积分，累计积分1万以下
* `金卡`：1.5倍基准积分，累计积分1万（含）-5万（不含）
* `白金卡`：1.8倍基准积分，累计积分5万（含）-10万（不含）
* `钻石卡`：2倍基准积分，累计积分10万以上

## 打折券：
客户支付时如果使用打折券，对订单中的 **所有** 可打折贵金属将享受优惠：

* `95折券`：如果商品参与95折，则应收金额为95折
* `9折券`：如果商品参与9折，则应收金额为9折

## 开门红活动
为了提升贵金属销售业绩和市场份额，该商业银行制定了开门红促销活动。

* 满减（仅对满减商品使用）
    * `每满3000元减350`
    * `每满2000元减30`
    * `每满1000元减10`
    * `第3件半价`（买3件及以上，其中1件半价）
    * `满3送1`（买4件及以上，其中1件免费）

注：贵金属如果同时满足打折、满减，则只使用优惠力度最大的，不能同时使用。

## 在售贵金属信息

```
	* 世园会五十国钱币册
		* 编号：001001
		* 单位：册
		* 价格：998.00元
	* 2019北京世园会纪念银章大全40g
		* 编号：001002
		* 单位：盒
		* 价格：1380.00
		* 可使用9折打折券
	* 招财进宝
		* 编号：003001
		* 单位：条
		* 价格：1580.00
		* 可使用95折打折券
	* 水晶之恋
		* 编号：003002
		* 单位：条
		* 价格：980.00
		* 参与满减：第3件半价，满3送1
	* 中国经典钱币套装
		* 编号：002002
		* 单位：套
		* 价格：998.00
		* 参与满减：每满2000减30，每满1000减10

	* 守扩之羽比翼双飞4.8g
		* 编号：002001
		* 单位：条
		* 价格：1080.00
		* 参与满减：第3件半价，满3送1
		* 可使用95折打折券
	* 中国银象棋12g
		* 编号：002003
		* 单位：套
		* 价格：698.00
		* 参与满减：每满3000元减350, 每满2000减30，每满1000减10
		* 可使用9折打折券
```

## 现有会员信息

```
姓名,等级,卡号,积分
马丁,普卡,6236609999,9860
王立,金卡,6630009999,48860
李想,白金卡,8230009999,98860
张三,钻石卡,9230009999,198860
```

## 示例
马丁是我们的普卡客户，卡号:6236609999, 当前积分9860，他购买了如下商品：

* (001001)世园会五十国钱币册 x 2
* (001002)2019北京世园会纪念银章大全40g x 3
* (002002)中国经典钱币套装x 1
* (002003)中国银象棋12g x 5

马丁在付款时使用了：

* 1张9折券
* 其它采用账户余额支付

客户凭证打印如下：（#号之后的内容为说明，不打印，同时打印的客户等级、积分等均为该交易后的实时信息）

```
方鼎银行贵金属购买凭证

销售单号：0000001 日期：2019-07-02 15:00:00
客户卡号：6236609999 会员姓名：马丁 客户等级：金卡 累计积分：19720

商品及数量           单价         金额
(001001)世园会五十国钱币册x2, 998.00, 1996.00
(001002)2019北京世园会纪念银章大全40gx3, 1380.00, 4140.00
(002002)中国经典钱币套装x1, 998.00, 998.00
(002003)中国银象棋12gx5, 698.00, 3490.00
合计：10624.00

优惠清单：
(001002)2019北京世园会纪念银章大全40g: -414.00
(002003)中国银象棋12g: -350.00
优惠合计：764.00

应收合计：9860.00
收款：
 9折券
 余额支付：9860.00

客户等级与积分：
 新增积分：9860
 恭喜您升级为金卡客户！
```

## 程序要求
**请编写一个程序用于打印销售凭证，输入为JSON文件，输出为上述格式的待打印销售凭证。**

![](https://mxs-1256616343.cos.ap-chengdu.myqcloud.com/1562031733.96clipboardimage.jpg)

实线部分是已经提供的代码，你需要实现虚线部分内容，并按需修改实线部分。程序的入口为OrderApp类。

API如下：

```
String checkout(String orderCommand):
    * 输出：返回待打印的字符串
    * 输入：OrderCommand是一个JSON字符串，内容如下：

{
  "orderId": "0000001",
  "memberId": "6236609999",
  "createTime": "2019-07-02 15:00:00",
  "items": [
    {
      "product": "001001",
      "amount": 2
    },
    {
      "product": "001002",
      "amount": 3
    },
    {
      "product": "002002",
      "amount": 1
    },
    {
      "product": "002003",
      "amount": 5
    }
  ],
  "payments": [
    {
      "type": "余额支付",
      "amount": 9860.00
    }
  ],
  "discountCards": [
    "9折券"
  ]
}
```

程序已经给出了一个上例的测试代码，你可以运行测试，以验证程序的正确性。请注意，本项目只提供了一个简单的冒烟测试。如有必要，请补充其它测试用例。

请注意，本程序只需要打印销售凭证，因此假设：

* 库存无限大
* 账户余额充足
* 不使用数据库
* 不考虑并发



## 项目安装

项目需要 nodejs v8.0 及以上版本运行，添加了 [Babeljs](https://babeljs.io) ，所以可以使用 `class`、`arrow function`、`async` 等高级语法。测试使用了 [Mochajs](https://mochajs.org) 作为测试库，为不增加复杂性，使用 nodejs 自带的断言 [assert](https://nodejs.org/dist/latest-v10.x/docs/api/assert.html)，可根据开发者自己喜好更换。

进入目录后安装项目依赖：

```shell
npm install
# 或者
yarn
```

运行测试：

```shell
npm test
# 或者
yarn test
```
