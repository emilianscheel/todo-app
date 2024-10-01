import { QrReader } from "react-qr-reader"

export type QrCodeScannerProps = {
    onScan: (data: string) => void
}

export const QrCodeScanner = ({
    onScan
}: QrCodeScannerProps) => {

    const handleScan = (result: string | null) => {
        if (result) {
            const parsedData = result.split('\n').map(row => row.split(','))
            onScan(result)
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="space-y-4">
                <div className="relative aspect-square w-full">
                    <QrReader
                        onResult={(result) => result && handleScan(result.getText())}
                        constraints={{ facingMode: 'environment' }}
                    />
                </div>
            </div>
        </div>
    )
}