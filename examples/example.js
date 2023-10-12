const { config } = require('dotenv');
const { FiveSim } = require('../dist/index');

config();

(async () => {
  const fiveSim = new FiveSim({ 'token': process.env.TOKEN })
  const { balance } = await fiveSim.getUserProfile()

  console.log(`My balance is ${balance}`)
  const services = await fiveSim.getPricesByCountryAndProduct('colombia', 'aliexpress')

  const servicesArray = Object.entries(services['brazil']['microsoft'])

  const cheapestService = servicesArray.reduce((prev, current) => {
    return prev ? ((((current[1].cost < prev[1].cost) && current[1].count) || !prev[1].count) ? current : prev) : current;
  });

  console.log(cheapestService)
  const [serviceName, serviceData] = cheapestService

  if (serviceData.cost >= 10) {
    console.log(`I can't buy ${serviceName} because it's too expensive`)
    return;
  }

  console.log(`Buying ${serviceName} for ${serviceData.cost}`)

  const order = await fiveSim.purchase('brazil', 'microsoft', serviceName)
  const expires = (new Date(order.expires) - new Date(order.created_at)) / (60 * 1000);

  console.log(`Bought the number ${order.phone} for ${order.price}P. Will expire in ${expires} minutes`)

  try {
    const code = await fiveSim.waitForCode(order.id)

    console.log('Received the code: ' + code)
    // if (code) {
    //   fiveSim.finishOrder(order.id)
    // }

  } catch (e) {
    console.log('Failed to receive the code, reason: ' + e.message)
    console.log('Cancelling the order')
    await fiveSim.cancelOrder(order.id)
  }


})()
