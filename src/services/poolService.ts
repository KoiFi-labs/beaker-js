export type PoolType = {
    id: string,
    pool: string,
    volume: string,
    total: string,
    icon?: string,
    apr: number,
    myStake?: number
  };

const pools: PoolType[] = [
  {
    id: '1',
    pool: 'USDC',
    volume: '475.65K',
    total: '4.23M',
    apr: 20.4,
    icon: 'https://cdn.vectorstock.com/i/1000x1000/12/51/algorand-algo-coin-icon-vector-39911251.webp'
  },
  {
    id: '2',
    pool: 'USDT',
    volume: '269.74K',
    total: '3.52M',
    apr: 10.70,
    myStake: 4854
  },
  {
    id: '3',
    pool: 'PLANET',
    volume: '102.03K',
    total: '1.43M',
    apr: 7.30,
    myStake: 740955
  },
  {
    id: '4',
    pool: 'ALGO',
    volume: '23.74M',
    total: '1.23M',
    apr: 16.02
  },
  {
    id: '5',
    pool: 'OPUL',
    volume: '1500K',
    total: '0.9M',
    apr: 3.23
  },
  {
    id: '6',
    pool: 'XET',
    volume: '1500K',
    total: '0.9M',
    apr: 6.55
  },
  {
    id: '7',
    pool: 'ARCC',
    volume: '1500K',
    total: '0.9M',
    apr: 9.53
  },
  {
    id: '8',
    pool: 'OBA',
    volume: '1500K',
    total: '0.9M',
    apr: 7.96
  }
]

export const getPools = () => {
  return pools
}

export const getPoolById = (id: string) => {
  return pools.find(pool => pool.id === id)
}

export const getPoolBySymbol = (symbol: string) => {
  return pools.find(pool => pool.pool === symbol)
}
