import { ethers } from 'ethers'
import { memoize } from 'decko'

class EthereumClient {
  ethersProvider: ethers.providers.BaseProvider
  mockResponse: boolean
  ethereumPrice!: number

  constructor(mockResponse = false) {
    this.ethersProvider = new ethers.providers.JsonRpcProvider(
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    )
    this.mockResponse = mockResponse
    this.ethersProvider
      .getEtherPrice()
      .then((response) => (this.ethereumPrice = response))
      .catch(() => (this.ethereumPrice = 2500))
  }

  /**
   * Returns Ethereum balance for the given Ethereum address or ENS domain
   * @param addressOrDomain Ethereum address or ENS Domain
   * @returns Ethereum balance
   */
  @memoize
  async getBalance(addressOrDomain: string) {
    if (!addressOrDomain) return ''
    if (this.mockResponse)
      return Promise.resolve((Math.random() * 50000).toString())

    return await this.ethersProvider
      .getBalance(addressOrDomain)
      .then((balance) => ethers.utils.formatEther(balance))
      .catch((err) => {
        //eslint-disable-next-line no-console
        console.log(
          'Balance for address/ENS domain not found :>> ',
          addressOrDomain,
          err,
        )
        return ''
      })
  }
}

const ethereumClient = new EthereumClient()

export default ethereumClient
