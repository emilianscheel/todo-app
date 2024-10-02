import { Copy, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";


export type QRCodeGeneratorProps = {
    text: string
    fileName?: string
}


export const QrCodeGenerator = ({
    text,
    fileName = "qrcode.png"
}: QRCodeGeneratorProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [includeUrl, setIncludeUrl] = useState<boolean>(false)

    const data = useMemo(() => includeUrl ? window.location.href : text, [includeUrl, text])

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
                        alert("QR code copied to clipboard!")
                    }).catch(() => {
                        alert("Failed to copy QR code.")
                    });
                }
            });
        }
    }

    return (
        <div className="flex flex-col items-center">
            <QRCodeCanvas
                value={data}
                size={256}
                ref={canvasRef}
                className="m-10"
            />
            <div className="flex flex-col justify-center items-center space-y-4">

                <div className="flex items-center space-x-2">
                    <Switch id="include-url" checked={includeUrl} onCheckedChange={() => setIncludeUrl(!includeUrl)} />
                    <Label htmlFor="include-url">
                        {includeUrl ? "Include URL, CSV Data and Timer" : "Only CSV Data"}
                    </Label>
                </div>

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
