const { FiveSim } = require('../dist/index');

const youAsyncFunction = async (country, product) => {
  const fiveSim = new FiveSim({ token: 'YOUR_TOKEN' })

  // auto select cheapest and purchase
  const order = fiveSim.purchaseCheapest(country, product)

  // wait code
  const sms = await fiveSim.waitForCode(order.id)
  console.log('Received the code: ' + sms.code)

  // finish order
  fiveSim.finishOrder(order.id)
}

youAsyncFunction('russia', 'microsoft')