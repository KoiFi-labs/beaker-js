export type PoolType = {
    id: string,
    pool: string,
    volume: string,
    total: string,
    icon?: string
  };

export type MyPoolType = {
    id: string,
    pool: string,
    volume: number,
    total: number,
    myStake: number,
    icosn?: string
    };

const pools: PoolType[] = [
  {
    id: '1',
    pool: 'USDC',
    volume: '475.65K',
    total: '4.23M',
    icon: 'https://cdn.vectorstock.com/i/1000x1000/12/51/algorand-algo-coin-icon-vector-39911251.webp'
  },
  {
    id: '2',
    pool: 'USDT',
    volume: '269.74K',
    total: '3.52M'
  },
  {
    id: '3',
    pool: 'PLANET',
    volume: '102.03K',
    total: '1.43M'
  },
  {
    id: '4',
    pool: 'ALGO',
    volume: '23.74M',
    total: '1.23M'
  },
  {
    id: '5',
    pool: 'OPUL',
    volume: '1500K',
    total: '0.9M'
  },
  {
    id: '5',
    pool: 'XET',
    volume: '1500K',
    total: '0.9M'
  },
  {
    id: '5',
    pool: 'ARCC',
    volume: '1500K',
    total: '0.9M'
  },
  {
    id: '5',
    pool: 'OBA',
    volume: '1500K',
    total: '0.9M'
  }
]

const myPools: MyPoolType[] = [
  {
    id: '1',
    pool: 'USDC',
    volume: 475650,
    total: 4230000,
    myStake: 1500
  },
  {
    id: '2',
    pool: 'ALGO',
    volume: 269740,
    total: 3520000,
    myStake: 40500
  }
]

export const getPools = () => {
  return pools
}

export const getPoolById = (id: string) => {
  return pools.find(pool => pool.id === id)
}

export const getMyPools = () => {
  return myPools
}
