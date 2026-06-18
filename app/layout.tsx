'use client'

import "./globals.css";
import { nanumGothicCoding, nanumGothicCodingBold } from "./lib/fonts";
import { useGamepadInputManager } from "./lib/gamepad/useGamepadNavigator";
import ExhibitionWrapper from "./components/ExhibitionWrapper";
import ScreenSizeBlocker from "./components/util/ScreenSizeBlocker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useGamepadInputManager();
  
  return (
    <html lang="en">
      <body
        className={`${nanumGothicCodingBold.className} ${nanumGothicCoding.className} antialiased font-mono flex items-center justify-center w-screen h-screen`}
      >
        <ScreenSizeBlocker />
        <ExhibitionWrapper>
          {children}
        </ExhibitionWrapper>
      </body>
    </html>
  );
}
