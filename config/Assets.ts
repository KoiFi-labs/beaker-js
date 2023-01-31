import { NETWORK } from "./Networks";

export type Asset = {
    id: number;
    name: string;
    symbol: string;
    icon: string
}

export type AssetsConfig = {
    [key in NETWORK]: Asset[]
}

export const assetsConfig: AssetsConfig = {
    testnet: [
        {
            id: 312769, 
            name: "Theter USDt",
            symbol: 'USDT',
            icon: "https://www.creativefabrica.com/wp-content/uploads/2021/06/14/Cryptocurrency-Tether-Usdt-Logo-Graphics-13393983-1-1-580x435.jpg",
        },
        {
            id: 10458941,
            name: "USD Coin",
            symbol: "USDC",
            icon: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        },
        {
            id: 0,
            name: "Algorand",
            symbol: "ALGO",
            icon: "https://seeklogo.com/images/A/algorand-algo-logo-267E891DCB-seeklogo.com.png",
        },
        {   
            id: 465818555,
            name: "bgoETH",
            symbol: "bgoETH",
            icon: "https://assets.algoexplorer.io/asset-logo-465818547.image",
        },
        {
            id: 465818554,
            name: "bgoBTC",
            symbol: "bgoBTC",
            icon: "https://assets.algoexplorer.io/asset-logo-465818547.image"
        }
    ],
    mainnet: [
        {
            id: 312769, 
            name: "Theter USDt",
            symbol: 'USDT',
            icon: "https://www.creativefabrica.com/wp-content/uploads/2021/06/14/Cryptocurrency-Tether-Usdt-Logo-Graphics-13393983-1-1-580x435.jpg",
        },
        {
            id: 31566704,
            name: "USD Coin",
            symbol: "USDC",
            icon: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        },
        {
            id: 0,
            name: "Algorand",
            symbol: "ALGO",
            icon: "https://seeklogo.com/images/A/algorand-algo-logo-267E891DCB-seeklogo.com.png",
        },
        {   
            id: 465818555,
            name: "bgoETH",
            symbol: "bgoETH",
            icon: "https://assets.algoexplorer.io/asset-logo-465818547.image",
        },
        {
            id: 465818554,
            name: "bgoBTC",
            symbol: "bgoBTC",
            icon: "https://assets.algoexplorer.io/asset-logo-465818547.image"
        }
    ],
    sandbox: [
        {
            id: 17, 
            name: "Theter USDt",
            symbol: 'USDT',
            icon: "https://www.creativefabrica.com/wp-content/uploads/2021/06/14/Cryptocurrency-Tether-Usdt-Logo-Graphics-13393983-1-1-580x435.jpg",
        },
        {
            id: 18,
            name: "USD Coin",
            symbol: "USDC",
            icon: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        },
        {
            id: 0,
            name: "Algorand",
            symbol: "ALGO",
            icon: "https://seeklogo.com/images/A/algorand-algo-logo-267E891DCB-seeklogo.com.png",
        },
        {   
            id: 465818555,
            name: "bgoETH",
            symbol: "bgoETH",
            icon: "https://assets.algoexplorer.io/asset-logo-465818547.image",
        },
        {
            id: 465818554,
            name: "bgoBTC",
            symbol: "bgoBTC",
            icon: "https://assets.algoexplorer.io/asset-logo-465818547.image"
        }
    ]
}