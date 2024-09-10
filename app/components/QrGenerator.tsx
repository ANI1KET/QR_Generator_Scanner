"use client";

import { Dispatch, SetStateAction } from "react";
import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import QrCode from "qrcode";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/app/components/button";
import { Form, FormField, FormItem, FormMessage } from "@/app/components/form";
import { Input } from "@/app/components/input";
import { cn } from "@/app/lib/utils";

const formSchema = z.object({
  url: z.string().url(),
});

const QrGeneratorComponent = ({
  size,
  setSize,
}: {
  size: number;
  setSize: Dispatch<SetStateAction<number>>;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.url) {
      const { url } = values;
      const qrCodeDataUrl = await QrCode.toDataURL(url, {
        width: size,
      });
      setQrCodeData(qrCodeDataUrl);
    }
  };

  const handleCopyImage = () => {
    if (imageRef.current) {
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(imageRef.current, 0, 0, size, size);

        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([
              new ClipboardItem({
                "image/png": blob,
              }),
            ]);
          }
        }, "image/png");
      }
    }
  };

  return (
    <section
      className={cn(
        "flex flex-col bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-lg"
      )}
    >
      <h2 className={cn("text-3xl font-bold text-gray-800 mb-4")}>
        QR Code Generator
      </h2>
      <Form {...form}>
        <form
          className={cn("flex flex-col gap-6")}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className={cn("flex flex-col md:flex-row gap-6 items-center")}>
            <FormField
              name="url"
              control={form.control}
              render={({ field }) => (
                <FormItem className={cn("flex-1")}>
                  <Input
                    {...field}
                    placeholder="Enter URL"
                    type="url"
                    className={cn(
                      "border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition w-full"
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={cn("flex-shrink-0")}>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className={cn(
                  "border-gray-300 rounded-lg shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 transition w-full"
                )}
              >
                <option value={250}>250px</option>
                <option value={300}>300px</option>
                <option value={350}>350px</option>
              </select>
            </div>
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition"
            )}
          >
            Generate QR Code
          </Button>
        </form>
      </Form>
      {qrCodeData && (
        <div className={cn("text-center mt-6 flex justify-center")}>
          <div className={cn("flex flex-col items-center")}>
            <Image
              ref={imageRef}
              src={qrCodeData}
              alt="Generated QR Code"
              width={size}
              height={size}
              className={cn("border border-gray-300 rounded-lg shadow-lg")}
            />
            <div className={cn("flex justify-center gap-4 mt-4")}>
              <a
                download
                href={qrCodeData}
                className={cn(
                  "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition"
                )}
              >
                Download
              </a>
              <button
                onClick={handleCopyImage}
                className={cn(
                  "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition"
                )}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QrGeneratorComponent;
