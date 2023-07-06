export const swapper = {
  name: 'Swapper',
  methods: [
    {
      name: 'create',
      args: [],
      returns: {
        type: 'void'
      }
    },
    {
      name: 'set_governor',
      args: [
        {
          type: 'account',
          name: 'new_governor'
        }
      ],
      returns: {
        type: 'void'
      },
      desc: 'sets the governor of the contract, may only be called by the current\ngovernor'
    },
    {
      name: 'bootstrap',
      args: [
        {
          type: 'pay',
          name: 'seed'
        },
        {
          type: 'asset',
          name: 'asset_1'
        },
        {
          type: 'asset',
          name: 'asset_2'
        },
        {
          type: 'asset',
          name: 'asset_3'
        },
        {
          type: 'asset',
          name: 'asset_4'
        },
        {
          type: 'asset',
          name: 'asset_5'
        }
      ],
      returns: {
        type: 'void'
      }
    },
    {
      name: 'swap_s_ns',
      args: [
        {
          type: 'pay',
          name: 'payment_xfer'
        },
        {
          type: 'axfer',
          name: 'swap_xfer'
        },
        {
          type: 'uint64',
          name: 'in_pool_asset_a'
        },
        {
          type: 'uint64',
          name: 'in_pool_asset_b'
        },
        {
          type: 'application',
          name: 'in_pool'
        },
        {
          type: 'address',
          name: 'in_pool_addr'
        },
        {
          type: 'uint64',
          name: 'pool_asset_lp'
        },
        {
          type: 'asset',
          name: 'out_asset'
        },
        {
          type: 'application',
          name: 'out_pool'
        },
        {
          type: 'address',
          name: 'out_pool_addr'
        }
      ],
      returns: {
        type: 'uint64'
      },
      desc: 'Swap some amount of different assets located in different pools,\nthere are 3 types of swaps: STABLE - NO STABLE (i.e: USDC - goBTC) NO STABLE - NO STABLE (i.e: ALGO - goBTC) NO STABLE - STABLE (i.e: ALGO - USDC)'
    },
    {
      name: 'swap_ns_s',
      args: [
        {
          type: 'pay',
          name: 'payment_xfer'
        },
        {
          type: 'axfer',
          name: 'swap_xfer'
        },
        {
          type: 'application',
          name: 'ns_pool'
        },
        {
          type: 'address',
          name: 'ns_pool_addr'
        },
        {
          type: 'uint64',
          name: 'expected_asset'
        },
        {
          type: 'uint64',
          name: 's_pool_asset_a'
        },
        {
          type: 'uint64',
          name: 's_pool_asset_b'
        },
        {
          type: 'uint64',
          name: 's_pool_asset_lp'
        },
        {
          type: 'application',
          name: 's_pool'
        },
        {
          type: 'address',
          name: 's_pool_addr'
        }
      ],
      returns: {
        type: 'uint64'
      }
    },
    {
      name: 'swap_ns_ns',
      args: [
        {
          type: 'pay',
          name: 'payment_xfer'
        },
        {
          type: 'axfer',
          name: 'swap_xfer'
        },
        {
          type: 'application',
          name: 'in_pool'
        },
        {
          type: 'address',
          name: 'in_pool_addr'
        },
        {
          type: 'uint64',
          name: 's_pool_asset_lp'
        },
        {
          type: 'uint64',
          name: 'out_asset'
        },
        {
          type: 'application',
          name: 'out_pool'
        },
        {
          type: 'address',
          name: 'out_pool_addr'
        }
      ],
      returns: {
        type: 'uint64'
      }
    }
  ],
  networks: {}
}
