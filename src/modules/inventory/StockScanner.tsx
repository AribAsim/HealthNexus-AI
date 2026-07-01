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
    <div className="w-full pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="material-symbols-outlined text-primary text-[32px]">photo_camera</span>
            <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-on-surface">
              {isHi ? 'एआई कंप्यूटर विजन स्टॉक स्कैनर' : 'AI Computer Vision Stock Scanner'}
            </h1>
          </div>
          <p className="text-[14px] leading-[20px] text-on-surface-variant">
            {isHi ? 'शेल्फ फोटो अपलोड करें - एआई दवाओं का पता लगाता है, स्टॉक का अनुमान लगाता है, खाली जगह को फ्लैग करता है' : 'Upload a shelf photo — AI detects medicines, estimates stock, flags empties'}
          </p>
        </div>
        {!scanning && !scanResult && (
          <button 
            onClick={triggerScan}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">upload</span>
            <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold uppercase tracking-wider">
              {isHi ? 'शेल्फ स्कैन करें' : 'Scan Shelf'}
            </span>
          </button>
        )}
      </div>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side: Scanner Interface (60%) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div 
            onClick={!scanning && !scanResult ? triggerScan : undefined}
            className={`relative group h-[480px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors ${
              scanning 
                ? 'border-primary bg-primary/5' 
                : scanResult 
                  ? 'border-primary/30 bg-surface-container-lowest' 
                  : 'border-outline-variant bg-surface-container-low cursor-pointer hover:border-primary'
            }`}
          >
            {scanning ? (
              <div className="flex flex-col items-center space-y-4 z-10">
                <span className="material-symbols-outlined text-[48px] text-primary animate-spin">sync</span>
                <span className="text-[14px] leading-[20px] font-semibold text-primary">{isHi ? 'शेल्फ छवि का विश्लेषण हो रहा है...' : 'Analyzing shelf image...'}</span>
              </div>
            ) : scanResult ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900/5">
                {/* Simulated Image with Bounding Boxes */}
                <div className="absolute inset-4 bg-white/50 border border-primary/20 rounded-lg flex flex-col justify-between p-4 shadow-inner">
                  <div className="border-2 border-error bg-error/10 text-error text-[10px] font-bold px-2 py-1 rounded w-max select-none shadow-sm">
                    Empty Slot [Conf: 91%]
                  </div>
                  <div className="border-2 border-green-600 bg-green-600/10 text-green-700 text-[10px] font-bold px-2 py-1 rounded w-max select-none self-end shadow-sm">
                    ORS [Count: 45, Conf: 87%]
                  </div>
                  <div className="border-2 border-amber-500 bg-amber-500/10 text-amber-700 text-[10px] font-bold px-2 py-1 rounded w-max select-none self-start shadow-sm mt-auto mb-8">
                    Amoxicillin [Count: 12, Conf: 94%]
                  </div>
                </div>
              </div>
            ) : (
              <div className="z-10 text-center p-8">
                <span className="material-symbols-outlined text-[64px] text-outline mb-4 group-hover:text-primary transition-colors">add_a_photo</span>
                <p className="text-[20px] leading-[28px] font-semibold text-on-surface mb-2">
                  {isHi ? 'शेल्फ फोटो अपलोड करें या खींचें और छोड़ें' : 'Upload shelf photo or drag & drop'}
                </p>
                <p className="text-[13px] leading-[18px] text-on-surface-variant">
                  {isHi ? '10MB तक JPG, PNG का समर्थन करता है। AI ~2s में प्रोसेस करता है।' : 'Supports JPG, PNG up to 10MB. AI processes in ~2s.'}
                </p>
              </div>
            )}
          </div>

          {/* Detection Chips */}
          {scanResult && (
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border-2 border-error/30 shadow-sm">
                <span className="w-3 h-3 bg-error rounded-sm"></span>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface">Amoxicillin 500mg ■ 12 boxes — LOW STOCK</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border-2 border-primary/30 shadow-sm">
                <span className="w-3 h-3 bg-[#10b981] rounded-sm"></span>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface">ORS Packets ■ 45 units — OK</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border-2 border-tertiary-container/30 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-tertiary">warning</span>
                <span className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface">Empty Shelf Zone — ⚠ Restock Needed</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Scan Results (40%) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6 flex flex-col h-full transition-all">
            <h2 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">analytics</span>
              {isHi ? 'स्कैन परिणाम' : 'Scan Results'}
            </h2>
            
            {scanResult ? (
              <div className="flex flex-col h-full animate-fade-in">
                {/* Results Table */}
                <div className="overflow-hidden border border-outline-variant rounded-lg mb-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-high">
                        <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant border-b border-outline-variant">Item</th>
                        <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant border-b border-outline-variant">Count</th>
                        <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant border-b border-outline-variant">Conf.</th>
                        <th className="p-3 text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant border-b border-outline-variant">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface text-[13px] leading-[18px]">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 border-b border-outline-variant font-medium">Amoxicillin 500mg</td>
                        <td className="p-3 border-b border-outline-variant font-mono">12</td>
                        <td className="p-3 border-b border-outline-variant">
                          <span className="bg-secondary-container text-on-secondary-container px-1 py-[2px] rounded font-mono">94%</span>
                        </td>
                        <td className="p-3 border-b border-outline-variant">
                          <span className="text-error text-[12px] leading-[16px] tracking-[0.05em] font-semibold">Critical</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 border-b border-outline-variant font-medium">ORS Packets</td>
                        <td className="p-3 border-b border-outline-variant font-mono">45</td>
                        <td className="p-3 border-b border-outline-variant">
                          <span className="bg-secondary-container text-on-secondary-container px-1 py-[2px] rounded font-mono">87%</span>
                        </td>
                        <td className="p-3 border-b border-outline-variant">
                          <span className="text-[#059669] text-[12px] leading-[16px] tracking-[0.05em] font-semibold">Stable</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium">Empty Space (B-4)</td>
                        <td className="p-3 font-mono">0</td>
                        <td className="p-3">
                          <span className="bg-secondary-container text-on-secondary-container px-1 py-[2px] rounded font-mono">91%</span>
                        </td>
                        <td className="p-3">
                          <span className="text-tertiary text-[12px] leading-[16px] tracking-[0.05em] font-semibold">Void</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI Recommendation */}
                <div className="bg-secondary-container/50 border border-secondary-container p-4 rounded-lg mb-6 flex gap-4 mt-auto">
                  <span className="material-symbols-outlined text-primary-container">psychology</span>
                  <div>
                    <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-secondary-fixed-variant uppercase mb-1">
                      {isHi ? 'पुनर्भरण अनुशंसा' : 'Restocking Recommendation'}
                    </p>
                    <p className="text-[14px] leading-[20px] text-on-secondary-container">
                      {isHi 
                        ? <>AI ने पिछले सप्ताह की तुलना में Amoxicillin में 40% की कमी का पता लगाया। स्टॉकआउट से बचने के लिए तुरंत <span className="font-bold">50 इकाइयां</span> ऑर्डर करने की अनुशंसा करें। खाली क्षेत्र B-4 सामान्य पेरासिटामोल प्लेसमेंट से मेल खाता है।</> 
                        : <>AI detected a 40% reduction in Amoxicillin vs. last week. Recommend ordering <span className="font-bold">50 units</span> immediately to avoid stockout. Empty Zone B-4 matches typical Paracetamol placement.</>
                      }
                    </p>
                  </div>
                </div>

                {/* Final Action */}
                <button className="w-full bg-primary py-4 rounded-lg text-white text-[20px] leading-[28px] font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all active:scale-[0.98]">
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  {isHi ? 'पुनर्भरण आदेश उत्पन्न करें' : 'Generate Restock Order'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] text-outline mb-4">image_search</span>
                <p className="text-[14px] leading-[20px] font-medium">
                  {isHi ? 'विश्लेषण शुरू करने के लिए चित्र अपलोड करें' : 'Upload an image to start analysis'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Analytics Bottom Row */}
      {scanResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in">
          <div className="bg-surface rounded-xl p-6 border border-outline-variant">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase mb-2">
              {isHi ? 'स्कैन सटीकता' : 'Scan Accuracy'}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-primary">92.4%</span>
              <span className="text-[#059669] text-[12px] leading-[16px] tracking-[0.05em] font-semibold mb-1">↑ 1.2%</span>
            </div>
            <p className="text-[13px] leading-[18px] text-on-surface-variant mt-1">Model: Clinical-Vision v4.2</p>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-outline-variant">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase mb-2">
              {isHi ? 'स्टॉक अलर्ट' : 'Stock Alerts'}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-error">03</span>
              <span className="text-on-surface-variant text-[12px] leading-[16px] tracking-[0.05em] font-semibold mb-1">Urgent items</span>
            </div>
            <p className="text-[13px] leading-[18px] text-on-surface-variant mt-1">Average response time: 14m</p>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-outline-variant">
            <p className="text-[12px] leading-[16px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase mb-2">
              {isHi ? 'इन्वेंटरी वेग' : 'Inventory Velocity'}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold text-secondary">High</span>
              <span className="material-symbols-outlined text-secondary mb-1">trending_up</span>
            </div>
            <p className="text-[13px] leading-[18px] text-on-surface-variant mt-1">Based on last 48h dispensing</p>
          </div>
        </div>
      )}
    </div>
  );
}
