import { Copy, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { Button } from "./ui/button";


export type QRCodeGeneratorProps = {
    text: string
    fileName?: string
}


export const QrCodeGenerator = ({
    text,
    fileName = "qrcode.png"
}: QRCodeGeneratorProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const downloadQRCode = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.click()
        }
    }

    const copyQRCode = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]).then(() => {
                        alert("QR code copied to clipboard!");
                    }).catch(() => {
                        alert("Failed to copy QR code.");
                    });
                }
            });
        }
    }

    return (
        <div className="flex flex-col items-center">
            <QRCodeCanvas
                value={text}
                size={256}
                ref={canvasRef}
                className="m-10"
            />
            <div className="flex flex-col justify-center items-center space-y-4">
                <Button onClick={downloadQRCode}>
                    <Download className="mr-2 w-4" />
                    Download QR Code
                </Button>

                <Button onClick={copyQRCode}>
                    <Copy className="mr-2 w-4" />
                    Copy QR Code
                </Button>
            </div>
        </div>
    );
};
