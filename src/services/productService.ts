export type MyProductType = {
    id: string,
    pools: {
        pool: string,
        namePool: string,
        amount: number
        }[]
    ,
    total: number
  };



const myProducts: MyProductType[] = [
    {
        "id": "1",
        "pools": [
            {
                pool: "USDC",
                namePool: "USDC",
                amount: 1500
            },
            {
                "pool": "ALGO",
                "namePool": "ALGO",
                "amount": 40500
            },
        ],
        "total": 42000
    },
    {
        "id": "2",
        "pools": [
            {
                pool: "USDT",
                namePool: "USDT",
                amount: 700
            },
            {
                "pool": "ALGO",
                "namePool": "ALGO",
                "amount": 50000
            },
            {
                "pool": "PLANET",
                "namePool": "PLANET",
                "amount": 4000
            },
        ],
        "total": 8004512
    }
]




export const getMyProducts = () => {
    return myProducts;
}

export const getMyProductById = (id: string) => {
    return myProducts.find(product => product.id === id);
}
