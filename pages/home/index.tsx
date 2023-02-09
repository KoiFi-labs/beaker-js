import { Container, Spacer, Text } from '@nextui-org/react'


export default function Home() {

    return (
        <Container 
            fluid 
            display="flex" 
            direction="column" 
            justify='center' 
            alignItems='center' 
            css={{
                minHeight: "92vh",
                position: "relative"
            }}>

            <Text h1 css={{color: "$kondorPrimary"}}> Where TradFi meets DeFi</Text>

            <Text> KONDOR FINANCE</Text>
        </Container>
    )
}
