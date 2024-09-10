"use client";

import { useState, useRef } from "react";
import QrScanner from "qr-scanner";

import { cn } from "@/app/lib/utils";

const QrScannerComponent = ({ size }: { size: number }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [qrdata, setQrdata] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const responseQrdata = await QrScanner.scanImage(e.target.files[0], {
        returnDetailedScanResult: true,
      });
      setQrdata(responseQrdata.data);
    }
  };

  const copyToClipboard = () => {
    if (qrdata) {
      navigator.clipboard.writeText(qrdata);
    }
  };

  const startCamera = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        };

        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            setQrdata(result.data);
            qrScanner.stop();
            setIsCameraActive(false);
          },
          {
            returnDetailedScanResult: true,
          }
        );

        qrScanner.start();
        setIsCameraActive(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  return (
    <section
      className={cn(
        "flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-lg"
      )}
    >
      <h2 className={cn("text-3xl font-bold text-gray-800 mb-4")}>
        QR Code Scanner
      </h2>
      <div className={cn("space-y-6")}>
        <button
          onClick={() => fileRef.current?.click()}
          className={cn(
            "w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-md transition"
          )}
        >
          Upload QR Code
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          className={cn("hidden")}
        />

        <button
          onClick={isCameraActive ? stopCamera : startCamera}
          className={cn(
            "w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg shadow-md transition"
          )}
        >
          {isCameraActive ? "QR Code" : "Scan QR Code"}
        </button>
        <video
          ref={videoRef}
          className={cn(
            `mx-auto rounded-lg border border-gray-300 shadow-lg mt-4`
          )}
          width={isCameraActive ? size : "0px"}
          height={isCameraActive ? size : "0px"}
        />
      </div>
      {qrdata && (
        <div
          className={cn(
            "relative mt-6 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md"
          )}
        >
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-800 transition"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn("h-6 w-6")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16h8M8 12h8M8 8h8m-4-4v4M4 16v4h4M4 8v4M4 4h4v4M16 4h4v4m0 8v4h-4m4 0h-4m-8 4h8m4-4v4m0-8v4M4 16v4"
              />
            </svg>
          </button>
          <h3 className={cn("text-xl font-semibold text-gray-800 text-center")}>
            Scanned QR Data
          </h3>
          <p className={cn("mt-2 text-gray-700 break-words")}>{qrdata}</p>
        </div>
      )}
    </section>
  );
};

export default QrScannerComponent;
