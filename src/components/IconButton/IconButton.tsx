import React from "react";
import { Button } from "@nextui-org/react";

type Props = {
        children: JSX.Element | JSX.Element[];
        onPress: () => void;
    };

export const IconButton = ({ children, onPress }: Props) => {

    return (<>
         <Button onPress={() => onPress()} css={{background: "$gray100", minWidth:"35px", width:"35px", height:"35px", margin: "0px 5px"}}>
            {children}
         </Button>
        </>
    );
}