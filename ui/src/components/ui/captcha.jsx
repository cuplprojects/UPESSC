import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

export function Captcha({ onVerify, className = "" }) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Generate random captcha text
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    const verified = userInput.toLowerCase() === captchaText.toLowerCase();
    setIsVerified(verified);
    onVerify(verified);
    
    if (!verified) {
      generateCaptcha();
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (isVerified) {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>Verification Captcha</Label>
      
      {/* Captcha Display */}
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 px-4 py-2 rounded-md select-none">
          <span 
            style={{
              backgroundImage: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
              fontStyle: 'italic',
              fontSize: '28px',
              lineHeight: '1.1',
              letterSpacing: '0.06em',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {captchaText}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateCaptcha}
          className="p-2"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Input Field */}
      <div className="flex space-x-2">
        <Input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter the captcha text"
          className={isVerified ? "border-green-500" : ""}
        />
        <Button
          type="button"
          onClick={handleVerify}
          disabled={!userInput.trim()}
          className={isVerified ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isVerified ? "Verified ✓" : "Verify"}
        </Button>
      </div>

      {isVerified && (
        <p className="text-sm text-green-600">✓ Captcha verified successfully</p>
      )}
    </div>
  );
}