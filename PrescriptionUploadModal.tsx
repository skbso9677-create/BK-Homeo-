import React, { useState } from 'react';
import { 
  X, 
  FileUp, 
  Camera, 
  CheckCircle, 
  MessageCircle, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Phone,
  FileText
} from 'lucide-react';
import { Language, PrescriptionSubmission } from '../types';
import { t } from '../data/translations';
import { STORE_DETAILS } from '../data/mockData';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onUploadSuccess: (submission: PrescriptionSubmission) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  language,
  onUploadSuccess,
}) => {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePrescription = () => {
    setFileName('sample_homeo_prescription.jpg');
    setFilePreview('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80');
    setPatientName('Amit Chauhan');
    setPatientAge('34');
    setPatientPhone('6395352618');
    setSymptoms('Recurrent sinus headache and dry throat in cold weather');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const submission: PrescriptionSubmission = {
      id: `presc-${Date.now()}`,
      patientName,
      patientAge,
      patientPhone,
      symptoms,
      imageUrl: filePreview || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    onUploadSuccess(submission);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const whatsappDirectUrl = `https://wa.me/91${STORE_DETAILS.phone}?text=${encodeURIComponent(
    `Hello Dr. Sonu Kumar, I want to send my doctor's prescription for homeopathic medicines.\nPatient: ${patientName || 'Patient'}\nPhone: ${patientPhone || '6395352618'}\nSymptoms: ${symptoms || 'General inquiry'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              {language === 'en' ? 'Upload Doctor Prescription' : 'डॉक्टर का पर्चा अपलोड करें'}
            </h3>
            <p className="text-xs text-teal-200">
              Direct verification by Dr. Sonu Kumar, Saharanpur
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-teal-700 text-teal-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Prescription Received Successfully!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Dr. Sonu Kumar will review your prescription at B K HOMEOPATHIC STORE and prepare your authentic sealed dilutions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
            {/* Quick WhatsApp option callout */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-emerald-950">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px] leading-tight">
                  Prefer WhatsApp? Send prescription photo directly to 6395352618.
                </span>
              </div>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl font-bold text-[10px] whitespace-nowrap shadow-xs"
              >
                Send WhatsApp
              </a>
            </div>

            {/* Patient Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="font-bold text-slate-700 block mb-1">
                  Patient Age
                </label>
                <input
                  type="text"
                  placeholder="e.g. 28"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Symptoms / Medical Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Allergy, Joint pain, Cough"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">
                Prescription Photo (JPG, PNG or PDF)
              </label>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-teal-500 transition-colors bg-slate-50/50 relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                
                {filePreview ? (
                  <div className="space-y-2">
                    <img
                      src={filePreview}
                      alt="Prescription preview"
                      className="max-h-36 mx-auto rounded-lg object-cover border border-slate-200"
                    />
                    <p className="text-[11px] font-bold text-teal-800 truncate">
                      {fileName || 'Prescription photo attached'}
                    </p>
                    <span className="text-[10px] text-slate-400">Click to change</span>
                  </div>
                ) : (
                  <div className="space-y-1 py-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-700 text-xs">
                      Take Photo or Upload from Gallery
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Ensure doctor's clinic header and medicine names are clearly visible
                    </p>
                  </div>
                )}
              </div>

              {/* Sample loader helper for testing */}
              <div className="mt-1.5 flex justify-end">
                <button
                  type="button"
                  onClick={handleUseSamplePrescription}
                  className="text-[10px] text-teal-700 font-bold hover:underline"
                >
                  ⚡ Load Demo Prescription for Testing
                </button>
              </div>
            </div>

            {/* Health Disclaimer Note */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] flex items-start space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {t(language, 'disclaimerText')}
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all flex items-center space-x-1.5"
              >
                <FileUp className="w-4 h-4" />
                <span>Submit Prescription</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
