"use client";

import { useState } from "react";

import QrScannerComponent from "@/app/components/QrScanner";
import { cn } from "@/app/lib/utils";
import QrGeneratorComponent from "@/app/components/QrGenerator";

export default function Home() {
  const [size, setSize] = useState<number>(250);

  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-8",
        "bg-gradient-to-r from-blue-50 to-gray-100"
      )}
    >
      <div
        className={cn(
          "w-full max-w-4xl bg-white shadow-2xl rounded-lg p-8",
          "grid grid-cols-1 md:grid-cols-2 gap-8"
        )}
      >
        {/* QR Code Generator Section */}
        <QrGeneratorComponent size={size} setSize={setSize} />

        {/* QR Code Scanner Section */}
        <QrScannerComponent size={size} />
      </div>
    </main>
  );
}
