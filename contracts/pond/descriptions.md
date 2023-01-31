## boostrap

validaciones: 

+ La cantindad de transacciones en la app call debe ser 2.

+ El destinatario de la tx seed debe ser la address del contrato.

+ Los assets 'a' y 'b' no deben ser iguales.


1. Seteamos los assets 'a' y 'b' como estados locales (estáticos)

2. Creamos un pond token, para esto creamos una tx de tipo 'assetConfig'.

3. Hacemos un opt in del asset 'a' y del asset 'b'

4. retornamos el pond token


## mint

validaciones:

+ El asset que el param 'asset_a' sea el mismo que tenemos en el estado global como asset_a

+ El sender que hace la app_call debe ser el mismo sender que hace las transferencias del asset.

+ Los assets de las txs deben des los mismos que tenemos en el estado global como asset_b

+ El destinatario de las txs debe ser la address del contrato.

+ La cantidad de assets a transferir debe ser mayor a 0


1. Verificamos que tenemos los balances (a, b, pond) de la address de quien llama al contrato. 

2. Calculamos la cantidad a mintear dependiendo e la cantidad de 'a' y de 'b'.
    Si es la primera vez que se realiza el minteo se sigue la formula token_to_mint_initial().
Si no es el caso se usa la formula tokens_to_mint()

3. Verificamos que la cantidad a minter sea mayor a 0. Si no es el caso, se arroja un error (sendAmountTooLow)

4. Realizamos una transaccion axfer para mintear los pond tokens


