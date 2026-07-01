import { useState } from 'react';

interface Props {
  language: string;
}

export default function StockScanner({ language }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<boolean>(false);
  const isHi = language === 'hi';

  const triggerScan = () => {
    setScanning(true);
    setScanResult(false);
    setTimeout(() => {
      setScanning(false);
      setScanResult(true);
    }, 2000);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2 text-primary font-headline-sm text-base border-b border-outline-variant pb-3">
        <span className="material-symbols-outlined text-xl">photo_camera</span>
        <h3>{isHi ? 'कंप्यूटर विजन स्टॉक स्कैनर' : 'Computer Vision Stock Scanner'}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Interface */}
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center space-y-4 bg-surface-container-low min-h-48 text-center relative overflow-hidden">
          {scanning ? (
            <div className="flex flex-col items-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
              <span className="text-xs font-bold text-on-surface-variant">{isHi ? 'शेल्फ विश्लेषण हो रहा है...' : 'Analyzing shelf image...'}</span>
            </div>
          ) : scanResult ? (
            <div className="relative w-full h-full flex items-center justify-center min-h-[160px]">
              {/* Simulated Image with Bounding Boxes */}
              <div className="absolute inset-0 bg-slate-900/10 rounded-lg flex flex-col justify-between p-2 border border-primary/40">
                <div className="border border-error bg-error/10 text-error text-[8px] font-bold px-1 py-0.5 rounded w-max select-none">
                  Empty Slot [Confidence: 94%]
                </div>
                <div className="border border-green-600 bg-green-600/10 text-green-700 text-[8px] font-bold px-1 py-0.5 rounded w-max select-none self-end">
                  Paracetamol [Count: 45, Conf: 98%]
                </div>
              </div>
              <span className="text-xs font-bold text-primary">{isHi ? 'विज़ुअल विश्लेषण पूर्ण' : 'Visual Overlay Active'}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-secondary">cloud_upload</span>
              <p className="text-xs text-on-surface-variant font-bold">
                {isHi ? 'विश्लेषण के लिए चिकित्सा शेल्फ फ़ोटो अपलोड करें' : 'Upload medical shelf photo for vision analysis'}
              </p>
              <button
                onClick={triggerScan}
                className="mt-2 px-4 py-2 bg-primary text-white font-extrabold text-xs rounded-xl shadow cursor-pointer hover:opacity-90 transition-all"
              >
                {isHi ? 'फ़ोटो स्कैन शुरू करें' : 'Simulate Camera Scan'}
              </button>
            </div>
          )}
        </div>

        {/* Scan Results Analysis */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant flex flex-col justify-between">
          {scanResult ? (
            <div className="space-y-4 text-xs">
              <div className="text-xs font-bold text-primary border-b border-outline-variant pb-2">
                Scan Findings (Gemini Vision 1.5)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Detected Medicines:</span>
                  <span className="font-bold">Paracetamol 500mg, ORS Sachets</span>
                </div>
                <div className="flex justify-between">
                  <span>Empty Shelves/Spaces:</span>
                  <span className="font-extrabold text-error">3 Slots Detected</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Stock Status:</span>
                  <span className="font-bold text-amber-600">Amoxicillin Shelf Depleted</span>
                </div>
              </div>

              <div className="p-3 bg-error-container/20 border border-error-container/40 rounded-lg">
                <span className="font-extrabold text-error block">Restocking Recommendation:</span>
                <p className="text-on-surface-variant font-medium mt-1">
                  AI flags early depletion of antibiotics. Transfer 40 boxes of Amoxicillin to restore full layout buffer.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-xs text-on-surface-variant font-bold">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2 animate-bounce">browse_gallery</span>
              Scanner output will display bounding boxes, empty slots estimation, and reorder alerts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
