import dotenv from 'dotenv'
dotenv.config()

import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import '@semaphore-protocol/hardhat'

import 'solidity-coverage'
import './tasks'
// import "@nomicfoundation/hardhat-verify";

const { PRIVATE_KEY, HEDERA_OPERATOR_KEY, HEDERA_API_KEY, ALCHEMY_API_KEY, NETWORK, INFURA_API_KEY, PROVIDER } =
  process.env
const hasCustomNetwork = NETWORK && NETWORK !== 'hardhat'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
if (hasCustomNetwork) {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not set')
  }

  if (!ALCHEMY_API_KEY) {
    throw new Error('ALCHEMY_API_KEY not set')
  }
}

const API_TEMPLATE_ALCHEMY = 'https://{{network}}.g.alchemy.com/v2/{{key}}'
const API_TEMPLATE_INFURA = 'https://{{network}}.infura.io/v3/{{key}}'

let provider_url = ''

if (PROVIDER === 'alchemy') {
  provider_url = API_TEMPLATE_ALCHEMY.replace('{{network}}', NETWORK!).replace(
    '{{key}}',
    ALCHEMY_API_KEY!
  )
} else if (PROVIDER === 'infura') {
  provider_url = API_TEMPLATE_INFURA.replace('{{network}}', NETWORK!).replace(
    '{{key}}',
    INFURA_API_KEY!
  )
}
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      viaIR: false,
      optimizer: {
        enabled: true,
        runs: 500
      }
    }
  },
  mocha: {
    timeout: 3600000
  },
  defaultNetwork: NETWORK,
  networks: {
    hardhat: {},
    ...(hasCustomNetwork
      ? {
          [NETWORK]: {
            url: provider_url,
            // uncomment to make tx go faster
            // gasPrice: 450000000000,
            accounts: [PRIVATE_KEY]
          }
        }
      : {}),
    'oasis-sapphire-testnet': {
      url: "https://testnet.sapphire.oasis.io",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY]: [],
      chainId: 0x5aff,
    },
    'oasis-sapphire-mainnet': {
      url: "https://sapphire.oasis.io",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY]: [],
      chainId: 0x5afe,
    },
    'hedera-testnet': {
      url: "https://pool.arkhia.io/hedera/testnet/json-rpc/v1/" + HEDERA_API_KEY,
      accounts: HEDERA_OPERATOR_KEY ? [HEDERA_OPERATOR_KEY]: [],
    },
    'hedera-mainnet': {
      url: "https://pool.arkhia.io/hedera/mainnet/json-rpc/v1/" + HEDERA_API_KEY,
      accounts: HEDERA_OPERATOR_KEY ? [HEDERA_OPERATOR_KEY]: [],
    },
    'avalanche-mainnet': {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY]: [],
      chainId: 43114,
    },
    'avalanche-testnet': {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY]: [],
      chainId: 43113,
    },
    'opt-mainnet': {
      chainId: 10,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY]: [],
      url:  'https://mainnet.optimism.io/'
    },
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5'
  },
  etherscan: {
    apiKey: {
      linea_testnet: process.env.LINEASCAN_API_KEY || '',
      optimisticGoerli: process.env.ETHERSCAN_API_KEY!,
      optimisticEthereum: process.env.ETHERSCAN_API_KEY!,
      polygon: process.env.POLYGONSCAN_API_KEY!,
      arbitrumOne: process.env.ARBISCAN_API_KEY!,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
      'arbitrum-sepolia': process.env.ARBISCAN_API_KEY!,
      'base-mainnet': process.env.BASESCAN_API_KEY!,
      'polygon-amoy': process.env.POLYGONSCAN_API_KEY!,
      avalancheFujiTestnet : 'avascan',
      avalanche: 'avascan'
    },
    customChains: [
      {
        network: 'linea_testnet',
        chainId: 59140,
        urls: {
          apiURL: 'https://explorer.goerli.linea.build/api',
          browserURL: 'https://explorer.goerli.linea.build'
        }
      },
      {
        network: 'opt_goerli',
        chainId: 59140,
        urls: {
          apiURL: 'https://api-goerli-optimistic.etherscan.io/',
          browserURL: 'https://goerli-optimism.etherscan.io/'
        }
      },
      {
        network: 'arbitrum-sepolia',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io/'
        }
      },
      {
        network: 'base-mainnet',
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: 'https://basescan.org/'
        }
      },
      {
        network: 'polygon-amoy',
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: 'https://amoy.polygonscan.com/'
        }
      },
      {
        network: 'polygon',
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: 'https://polygonscan.com/'
        }
      }
    ]
  }
}

export default config
