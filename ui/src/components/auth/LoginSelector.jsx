import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CandidateLogin from "./CandidateLogin";
import AdminLogin from "./AdminLogin";

export default function LoginSelector() {
  const [loginType, setLoginType] = useState('candidate'); // 'candidate' or 'admin'
  const { language, setLanguage, t } = useLanguage();

  if (loginType === 'admin') {
    return <AdminLogin />;
  }

  if (loginType === 'candidate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A7E6FF] via-[#3ABEF9] to-[#3572EF]">
        {/* Header */}
        <header className="bg-[#050C9C] text-white shadow-lg">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              {/* Logo and College Info */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 order-1 sm:order-none">
                <img
                  src="/src/Assets/upescc.jpeg"
                  alt="College Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-lg bg-white/10 p-1"
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    {t('header.collegeName')}
                  </h1>
                  <p className="text-xs sm:text-sm opacity-90 mt-1">
                    {t('header.subtitle')}
                  </p>
                </div>
              </div>

              {/* Login Type Selector and Language Toggle */}
              <div className="flex gap-2 order-2 sm:order-none">
                {/* Login Type Selector */}
                {/* <div className="flex bg-[#050C9C]/80 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${loginType === 'candidate'
                      ? 'bg-white text-[#050C9C]'
                      : 'text-white hover:bg-white/20'
                      }`}
                    onClick={() => setLoginType('candidate')}
                  >
                    Candidate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${loginType === 'admin'
                      ? 'bg-white text-[#050C9C]'
                      : 'text-white hover:bg-white/20'
                      }`}
                    onClick={() => setLoginType('admin')}
                  >
                    Admin
                  </Button>
                </div> */}

                {/* Language Toggle */}
                <div className="flex bg-[#050C9C]/80 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${language === 'en'
                      ? 'bg-white text-[#050C9C]'
                      : 'text-white hover:bg-white/20'
                      }`}
                    onClick={() => setLanguage('en')}
                  >
                    EN
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium ${language === 'hi'
                      ? 'bg-white text-[#050C9C]'
                      : 'text-white hover:bg-white/20'
                      }`}
                    onClick={() => setLanguage('hi')}
                  >
                    हिं
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-2 sm:px-4 py-8 sm:py-12 lg:py-16 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center h-full max-w-7xl mx-auto">
            {/* Left Side - Full Image */}
            <div className="flex items-center justify-center px-2 sm:px-4 lg:pl-8 order-1">
              <img
                src="/src/Assets/up.png"
                alt="University Portal"
                className="w-full h-auto max-w-full object-contain"
              />
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end items-center px-2 sm:px-4 lg:pr-8 order-2">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <CandidateLogin />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}