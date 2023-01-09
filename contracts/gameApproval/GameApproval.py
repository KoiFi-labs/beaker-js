from pyteal import *
from beaker import *
from typing import Final

class GameApproval(Application):

    monsterHealth: Final[ApplicationStateValue] = ApplicationStateValue(
        stack_type=TealType.uint64,
        descr="initial moster health",
        key=Bytes("monsterHealth")
    )

    mvp: Final[ApplicationStateValue] = ApplicationStateValue(
        stack_type=TealType.bytes,
        descr="player who did the most damage",
        key=Bytes("mvp")
    )

    playerDamage: Final[ApplicationStateValue] = ApplicationStateValue(
        stack_type=TealType.uint64,
        descr="Random number representing the damage each player will deal",
        key=Bytes("playerDamage"),
        static=True,
        default=Int(2)
    )

    maxDamage: Final[ApplicationStateValue] = ApplicationStateValue(
        stack_type=TealType.uint64,
        descr="highest amount of damage dealt to monster",
        key=Bytes("maxDamage"),
        default=Int(0)
    )

    damage: Final[AccountStateValue] = AccountStateValue(
        stack_type=TealType.uint64, 
        descr="damage that will be apply to monster",
        default=Int(0)
    )
    
    @create
    def create(self):
        return self.initialize_application_state()
    
    @opt_in
    def opt_in(self):
        return self.initialize_account_state()

    
    @external(authorize=Authorize.only(Global.creator_address()))
    def initialize_health(self, health: abi.Uint64):
        return self.monsterHealth.set(health.get())

    # Attack the monster
    @external
    def attacks_the_monster(self):
        return Seq([
            Assert(self.monsterHealth.get() > Int(0)),
            self.update_monster_health(),
            self.update_mvp(),
            self.update_player_total_damage(),
            Approve()
        ])

    @internal
    def update_monster_health(self): 
        return If(self.playerDamage.get() > self.monsterHealth.get(), # test-expr 
            self.monsterHealth.set(Int(0)),                           # then-expr: monster is dead
            self.monsterHealth.set(self.monsterHealth.get() - self.playerDamage.get()) # else-expr: reduce monster health
        )

    @internal
    def update_mvp(self):
        return If(self.get_total_player_damage() > self.maxDamage.get() , #test-expr
        Seq([                                                       #then-expr
            self.mvp.set(Txn.sender()),
            self.maxDamage.set(self.get_total_player_damage())
            ])
        )

    @internal
    def update_player_total_damage(self): 
        return App.localPut(Txn.sender(), Bytes("damage"), self.get_total_player_damage())

    @internal
    def get_total_player_damage(self):
        return App.localGet(Txn.sender(), Bytes("damage")) + self.playerDamage.get()


    @external(authorize=Authorize.only(Global.creator_address()))
    def reward_player(self):
        return Seq([
            Assert(self.monsterHealth.get() <= Int(0)),
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: self.mvp.get(),
                TxnField.amount: Int(100000),
            }),
            InnerTxnBuilder.Submit(),
            Approve()
    ])


    
def demo():
    # Create an Application client
    app_client = client.ApplicationClient(
        # Get sandbox algod client
        client=sandbox.get_algod_client(),
        # Instantiate app with the program version (default is MAX_TEAL_VERSION)
        app=GameApproval(version=6),
        # Get acct from sandbox and pass the signer
        signer=sandbox.get_accounts().pop().signer,
    )
    

    # Deploy the app on-chain
    app_id, app_addr, txid = app_client.create()

    print(
        f"""Deployed app in txid {txid}
        App ID: {app_id} 
        Address: {app_addr} 
        """
    )

    # initializing app
    app_client.call(GameApproval.initialize_health, health=5)
    state = app_client.get_application_state()
    print(state)

    # initializing client account
    app_client.opt_in()
    
    # attacking the monster
    app_client.call(GameApproval.attacks_the_monster)
    state = app_client.get_application_state()
    print(state)  

    app_client.call(GameApproval.attacks_the_monster)
    state = app_client.get_application_state()
    print(state)  

    app_client.call(GameApproval.attacks_the_monster)
    state = app_client.get_application_state()
    print(state)  


if __name__ == "__main__":
    demo()
    GameApproval().dump("./artifacts")