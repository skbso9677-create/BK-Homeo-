import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Database, 
  CreditCard, 
  ShieldCheck, 
  Terminal, 
  Download, 
  Key, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers,
  ArrowRight,
  FileArchive,
  CloudUpload,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';
import { downloadProjectZip } from '../utils/projectZipGenerator';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'mobile_apk' | 'github_workflow' | 'database' | 'pwa'>('mobile_apk');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    setDownloadMsg('प्रोजेक्ट ZIP तैयार हो रही है...');
    try {
      const result = await downloadProjectZip((status) => setDownloadMsg(status));
      setDownloadSuccess(true);
      setDownloadMsg(`सफलता! असली ZIP डाउनलोड हो गई (${Math.round(result.size / 1024)} KB)`);
      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadMsg('');
      }, 5000);
    } catch (err) {
      setDownloadMsg('ZIP डाउनलोड करने में समस्या आई। नीचे दिए गए सीधे लिंक का उपयोग करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Initial commit for BK Homeo Store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bk-homeo.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-200 border border-white/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {language === 'en' ? 'Android APK & Project Source Code' : 'एंड्रॉइड APK और प्रोजेक्ट सोर्स कोड'}
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                {STORE_DETAILS.storeName} • {STORE_DETAILS.owner}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Direct Download ZIP Ribbon */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-emerald-950 text-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                bk-homeo-project.zip (असली 100% वैध प्रोजेक्ट ज़िप)
              </span>
              <p className="text-[11px] text-slate-600">
                इसमें React + Vite, Capacitor Config, और GitHub Actions Workflow शामिल हैं।
              </p>
              {downloadMsg && (
                <p className={`text-[11px] font-bold mt-0.5 ${downloadSuccess ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {downloadMsg}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <span>जांच व डाउनलोड जारी...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Project ZIP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('mobile_apk')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'mobile_apk' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>मोबाइल से APK गाइड (हिंदी)</span>
          </button>
          <button
            onClick={() => setActiveTab('github_workflow')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'github_workflow' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CloudUpload className="w-4 h-4" />
            <span>GitHub Actions Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'database' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database & Payments</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'pwa' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>तुरंत होम स्क्रीन पर लगाएं</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* TAB 1: MOBILE APK GUIDE IN HINDI */}
          {activeTab === 'mobile_apk' && (
            <div className="space-y-4">
              {/* Important Transparency Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-950 flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong className="block font-bold mb-0.5 text-amber-900">
                    स्पष्ट जानकारी (APK निर्माण प्रक्रिया):
                  </strong>
                  एंड्रॉइड APK फाइल का निर्माण GitHub के क्लाउड सर्वर पर होता है। नीचे दिए गए 4 आसान चरणों का पालन करके आप बिना कंप्यूटर के, केवल अपने फोन से असली इंस्टॉल होने वाली APK पा सकते हैं।
                </div>
              </div>

              {/* 4 Simple Steps */}
              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>प्रोजेक्ट ZIP डाउनलोड करें और GitHub पर नया रिपॉजिटरी बनाएं</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                    ऊपर दिए गए हरे बटन <strong>"Download Project ZIP"</strong> पर क्लिक करके फाइल अपने फोन में सेव करें। फिर मोबाइल ब्राउज़र में <strong>github.com</strong> खोलें और नया रिपॉजिटरी (उदा. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">bk-homeo</code>) बनाएं।
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>कोड को GitHub पर अपलोड करें</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                    GitHub में <strong>"uploading an existing file"</strong> पर टैप करके डाउनलोड की गई फाइलें अपलोड करें, या फोन के Termux ऐप से पुश करें:
                  </p>
                  <div className="pl-7 pt-1">
                    <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded-xl font-mono text-[10px] overflow-x-auto">
                      {gitCommands}
                    </pre>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>GitHub Actions अपने आप क्लाउड में APK बनाएगा (2 मिनट)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                    कोड अपलोड होते ही GitHub की <strong>Actions</strong> टैब अपने आप चालू हो जाएगी। GitHub का क्लाउड सर्वर <code className="font-mono text-emerald-800">.github/workflows/build-apk.yml</code> चलाकर Android Gradle से असली <strong>`app-debug.apk`</strong> तैयार करेगा।
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1.5">
                  <div className="flex items-center space-x-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>APK डाउनलोड करें और मोबाइल में इंस्टॉल करें</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-7">
                    Actions में बिल्ड पूरा होने पर (हरा सही का निशान) नीचे <strong>Artifacts</strong> में <strong>"BK-Homeo-Android-v1.0-debug"</strong> पर टैप करके APK डाउनलोड करें और अपने फोन में सीधे इंस्टॉल करें।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB WORKFLOW DETAILS */}
          {activeTab === 'github_workflow' && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-700 text-[11px]">
                <strong className="text-slate-900 block mb-1">Workflow File Path:</strong>
                <code className="font-mono bg-white border px-1.5 py-0.5 rounded text-emerald-800 font-bold">
                  .github/workflows/build-apk.yml
                </code>
                <p className="mt-1 text-slate-600">
                  यह फाइल आपके प्रोजेक्ट ZIP में पहले से शामिल कर दी गई है। यह Ubuntu 22.04 वर्चुअल मशीन पर Java 17, Node.js 20, Capacitor Android, और Gradle assembleDebug चलाती है।
                </p>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>build-apk.yml (Included in ZIP)</span>
                  <button
                    onClick={() => copyCode(`.github/workflows/build-apk.yml`, 99)}
                    className="hover:text-white flex items-center space-x-1"
                  >
                    {copiedIndex === 99 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Path</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-emerald-300 bg-slate-950 p-2.5 rounded-xl overflow-x-auto max-h-56">
{`name: Build Android APK (BK Homeo)
on:
  push:
    branches: [ "main", "master" ]
jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - run: npx cap add android && npx cap sync android
      - run: chmod +x android/gradlew
      - run: cd android && ./gradlew assembleDebug --no-daemon
      - uses: actions/upload-artifact@v4
        with:
          name: BK-Homeo-Android-v1.0-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: DATABASE & PAYMENTS */}
          {activeTab === 'database' && (
            <div className="space-y-3 text-[11px] text-slate-700">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
                <strong className="text-slate-900 text-xs block">1. डेटाबेस व ग्राहक लॉगिन (Firebase Setup):</strong>
                <p>
                  सहारनपुर के ग्राहकों के ऑर्डर और डॉक्टरों के पर्चे स्थायी रूप से सेव करने के लिए Firebase Firestore का उपयोग किया जा सकता है। इसमें भारतीय मोबाइल नंबरों (OTP) से सुरक्षित लॉगिन उपलब्ध होता है।
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
                <strong className="text-slate-900 text-xs block">2. ऑनलाइन UPI व कार्ड भुगतान (Razorpay / PhonePe):</strong>
                <p>
                  असली भुगतान के लिए Razorpay या PhonePe का मर्चेंट अकाउंट जोड़ें। सुरक्षा नियम के अनुसार, अपनी API सीक्रेट कीज़ को कभी भी फ्रंटएंड कोड में न रखें; हमेशा बैकएंड सर्वर के जरिए ऑर्डर बनाएं।
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-1">
                <strong className="text-slate-900 text-xs block">3. स्टोर UPI QR कोड:</strong>
                <p>
                  वर्तमान में ग्राहक सीधे डॉ. सोनू कुमार के UPI <code className="font-bold text-emerald-800">6395352618@upi</code> पर या कैश ऑन डिलीवरी (COD) से भुगतान कर सकते हैं।
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PWA HOME SCREEN */}
          {activeTab === 'pwa' && (
            <div className="space-y-3 text-[11px] text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-emerald-950">
                <strong className="block text-xs font-bold text-emerald-900 mb-0.5">
                  APK बनाए बिना तुरंत ऐप की तरह चलाएं (PWA):
                </strong>
                इस वेब ऐप में PWA मैनिफेस्ट और आइकॉन पहले से लगे हैं।
              </div>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>अपने एंड्रॉइड फोन के <strong>Google Chrome</strong> में यह लिंक खोलें।</li>
                <li>ऊपर दाएँ कोने में <strong>तीन बिंदु (⋮)</strong> पर टैप करें।</li>
                <li><strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें।</li>
                <li>आपके फोन की स्क्रीन पर <strong>BK Homeo</strong> का लोगो बन जाएगा और यह पूरे स्क्रीन पर एक नेटिव ऐप की तरह खुलेगा।</li>
              </ol>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Downloading...' : 'Download ZIP (Verified Binary)'}</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            समझ गया (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
