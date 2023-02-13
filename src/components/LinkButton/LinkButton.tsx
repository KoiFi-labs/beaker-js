import { styled } from "@nextui-org/react";

export const LinkButton = styled("button", {
  dflex: "center",
  border: "none",
  outline: "none",
  cursor: "pointer",
  borderRadius: "12px",
  height: "40px",
  width: "100%",
  minWidth: "140px",
  padding: "0",
  margin: "4px",
  bg: "$kondorPrimary",
  transition: "$default",
  "&:hover": {
    opacity: "0.8"
  },
  "&:active": {
    opacity: "0.6"
  }
});
