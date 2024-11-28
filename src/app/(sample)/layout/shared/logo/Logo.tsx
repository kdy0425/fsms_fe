import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from '@mui/material/styles'
import { AppState } from "@/store/store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  return (
    <LinkStyled href="/">
        <Image
          src="/images/logos/logo.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
        />
    </LinkStyled>
  );
};

export default Logo;
