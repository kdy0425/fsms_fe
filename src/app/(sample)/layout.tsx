"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import Header from "./layout/vertical/header/Header";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

const BodyContainerWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const BodyContainerInner = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  // paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}));

const BodyContent = styled("div")(() => ({
  
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  return (
    <BodyContainerWrapper className="body-container-wrapper">
      
      {/* ------------------------------------------- */}
      {/* Body Wrapper */}
      {/* ------------------------------------------- */}
      <BodyContainerInner className="body-container-inner">
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header />

        <BodyContent className="body-content">
          {/* ------------------------------------------- */}
          {/* Sidebar */}
          {/* ------------------------------------------- */}
          <Sidebar />
          {/* PageContent */}
          <Container className="page-content-wrapper">
            {/* ------------------------------------------- */}
            {/* PageContent */}
            {/* ------------------------------------------- */}

            <Box className="page-content-inner">
              {/* <Outlet /> */}
              {children}
              {/* <Index /> */}
            </Box>

            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Container>
        </BodyContent>
      </BodyContainerInner>
    </BodyContainerWrapper>
  );
}
