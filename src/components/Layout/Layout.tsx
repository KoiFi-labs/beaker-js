import { Box } from "../Box/Box";
import Nav from "../modules/Nav/Nav";
import Footer from "../modules/Footer/Footer";

type Props = {
        children: JSX.Element | JSX.Element[];
    };

export const Layout = ({ children }: Props) => {

    return (
        <Box css={{maxW: "100%"} }>
            <Nav />
            {children}
            <Footer/>
        </Box>
        );
}