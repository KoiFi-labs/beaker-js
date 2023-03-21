export type PoolType = {
    id: string,
    pool: string,
    volume: number,
    total: number,
    icon?: string,
    apr: number,
    myStake?: number
  };

const pools: PoolType[] = [
  {
    id: '1',
    pool: 'USDC',
    volume: 475504,
    total: 451154177,
    apr: 20.4,
    icon: 'https://cdn.vectorstock.com/i/1000x1000/12/51/algorand-algo-coin-icon-vector-39911251.webp'
  },
  {
    id: '2',
    pool: 'USDT',
    volume: 269740,
    total: 3520000,
    apr: 10.70,
    myStake: 4854
  },
  {
    id: '3',
    pool: 'PLANET',
    volume: 102037,
    total: 1430451,
    apr: 7.30,
    myStake: 740955
  },
  {
    id: '4',
    pool: 'ALGO',
    volume: 237441,
    total: 1237332,
    apr: 16.02
  },
  {
    id: '5',
    pool: 'OPUL',
    volume: 1500451,
    total: 900420,
    apr: 3.23
  },
  {
    id: '6',
    pool: 'XET',
    volume: 150000,
    total: 9500047,
    apr: 6.55
  },
  {
    id: '7',
    pool: 'ARCC',
    volume: 15000,
    total: 7844266,
    apr: 9.53
  },
  {
    id: '8',
    pool: 'OBA',
    volume: 174100,
    total: 8555620,
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
