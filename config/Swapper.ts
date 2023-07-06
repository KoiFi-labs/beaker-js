import { NETWORK } from './Networks'

export type SwapperConfig = {
    appId: number;
    appAddress: string;
    fee: number;
}

export type SwappersConfig = {
//  eslint-disable-next-line
  [key in NETWORK]: SwapperConfig
}

export const swappersConfig: SwappersConfig = {
  sandbox: {
    appId: 210171059,
    appAddress: 'NC54JHX6ABAKAQMCTT5XIHDGLSZRU34IVWNJB2S6OPF76JGEPY2UZUDR7I',
    fee: 5
  },
  testnet: {
    appId: 253927029,
    appAddress: 'TOTHJYG6CS6IYUF2CYFCBCPOAMUJ26V2EQ5NGQWCPJ4GQ3G3U755G3NZVI',
    fee: 5
  },
  mainnet: {
    appId: 210171059,
    appAddress: 'IID5QRQJM67CYN363FV26SQLG3MGJWEIR7VLT2CPSJ6Z7O6NHQV5I5GQVA',
    fee: 5
  }
}
