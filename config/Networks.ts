export const networks = {
    sandbox:{
        token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        server: "http://127.0.0.1",
        port: "4001",
    },
    testnet:{
        token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        server: "https://node.testnet.algoexplorerapi.io",
        port: "",
    },
    mainnet:{
        token: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        server: "https://mainnet-api.algonode.cloud",
        port: "",
    }
}

export enum NETWORK {
    sandbox = "sandbox",
    testnet = "testnet",
    mainnet = "mainnet",
}