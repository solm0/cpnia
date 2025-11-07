'use client'

import "./globals.css";
import { nanumGothicCoding, nanumGothicCodingBold } from "./lib/fonts";
import { useGamepadInputManager } from "./lib/gamepad/useGamepadNavigator";
import ExhibitionWrapper from "./components/ExhibitionWrapper";

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
        <ExhibitionWrapper>
          {children}
        </ExhibitionWrapper>
      </body>
    </html>
  );
}