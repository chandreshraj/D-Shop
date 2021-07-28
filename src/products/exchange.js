import config from '../config/config.json'

const getExchangeAPI = () => {
  const {api} = config.exchange
  return `${api}/${process.env.REACT_APP_EXCHANGE_API_KEY}`
}

const getExchangeRate = async (from, to) => {
  const {convert} = config.exchange
  const url = `${getExchangeAPI()}/${convert}/${from}/${to}`
  const result = await fetch(url)
  const data = await result.json()
  return data.conversion_rate
}

const getCurrencies = (items) => {
  const currencies = new Set()
  items.forEach(item => currencies.add(item.currency))
  return currencies
}

const getExchangeRates = async (currencies, convert) => {
  const rates = await Promise.all(currencies.map(currency => {
    console.log(currency)
    return getExchangeRate(currency, convert)
  }))
  const exchange = {}
  rates.forEach((rate, index) => exchange[currencies[index]] = rate)
  const failed = rates.some(rate => rate === undefined)
  return failed ? null : exchange
}

export const getItemsByCurrency = async (items, currency) => {
  const itemCurrencies = getCurrencies(items)
  const filteredCurrencies = [...itemCurrencies].filter(c => c !== currency)
  const exchangeRates = await getExchangeRates(filteredCurrencies, currency)
  if (exchangeRates === null) {
    return items.map(item => {
      return {
        ...item,
        displayPrice: item.price,
        displayCurrency: item.currency
      }
    })
  }
  return items.map(item => {
    item.displayCurrency = currency
    item.displayPrice = item.price
    if (item.currency !== currency) {
      item.displayPrice = (item.price * exchangeRates[item.currency]).toFixed(2)
    }
    return item
  })
}

