import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Captcha } from "@/components/ui/captcha";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/authStore";
import API from "@/services/api/API";
import notification from "@/services/notification/NotificationService";
import { decryptAES, getAESKey } from "@/utils/cryptoUtils";

export default function CandidateLogin() {
  const [step, setStep] = useState(1); // 1: Roll Number + Captcha, 2: OTP Verification
  const [formData, setFormData] = useState({
    rollNumber: "",
    otp: ""
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [encryptedOtpData, setEncryptedOtpData] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const notify = notification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaVerify = (verified) => {
    setCaptchaVerified(verified);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      toast({
        title: "Captcha Required",
        description: "Please verify the captcha first.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.rollNumber.trim()) {
      toast({
        title: "Invalid Roll Number",
        description: "Please enter your roll number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending OTP for roll number:', formData.rollNumber);
      
      const response = await API.post('/api/Candidates/Login', {
        rollNumber: formData.rollNumber
      });

      console.log('OTP response:', response.data);

      if (response.data) {
        // Store the encrypted OTP data for verification
        setEncryptedOtpData(response.data);
        
        // Try to decrypt to get candidate ID (optional, for validation)
        try {
          const aesKey = getAESKey();
          if (aesKey && aesKey !== 'YOUR_AES_KEY_HERE') {
            const decryptedData = await decryptAES(response.data, aesKey);
            const otpData = JSON.parse(decryptedData);
            setCandidateId(otpData.ID);
            console.log('Decrypted OTP data:', otpData);
          } else {
            console.warn('AES key not configured - OTP verification will be manual');
          }
        } catch (decryptError) {
          console.warn('Could not decrypt OTP data (this is okay for now):', decryptError);
        }

        setOtpSent(true);
        setStep(2);
        
        notify.success("OTP sent successfully! Check your email and SMS.");
        
        toast({
          title: "OTP Sent",
          description: "Please check your email and SMS for the verification code.",
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid roll number. Please check and try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Failed to Send OTP",
        description: errorMessage,
        variant: "destructive",
      });
      
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the OTP.",
        variant: "destructive",
      });
      return;
    }

    if (!encryptedOtpData) {
      toast({
        title: "Error",
        description: "No OTP data found. Please request OTP again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const aesKey = getAESKey();
      
      // Try to decrypt and verify OTP if key is available
      if (aesKey && aesKey !== 'YOUR_AES_KEY_HERE') {
        try {
          const decryptedData = await decryptAES(encryptedOtpData, aesKey);
          const otpData = JSON.parse(decryptedData);
          
          console.log('Verifying OTP:', {
            entered: formData.otp,
            expected: otpData.otp,
            expires: otpData.expires
          });

          // Check if OTP matches
          if (formData.otp !== otpData.otp) {
            toast({
              title: "Invalid OTP",
              description: "The OTP you entered is incorrect.",
              variant: "destructive",
            });
            return;
          }

          // Check if OTP is expired
          const now = new Date();
          const expiryTime = new Date(otpData.expires);
          if (now > expiryTime) {
            toast({
              title: "OTP Expired",
              description: "The OTP has expired. Please request a new one.",
              variant: "destructive",
            });
            return;
          }

          // OTP is valid, get token
          const tokenResponse = await API.post('/api/Candidates/GetToken', {
            UID: otpData.ID,
            IsVerified: true
          });

          if (tokenResponse.data) {
            // Create user data for candidate
            const candidateData = {
              uid: otpData.ID,
              rollNumber: formData.rollNumber,
              token: tokenResponse.data,
              admin: false, // Candidates are not admins
              userType: 'candidate'
            };

            // Store in Zustand store
            login(candidateData);
            
            notify.success("Login successful! Welcome to your portal.");
            
            toast({
              title: "Login Successful",
              description: "Welcome to your candidate portal!",
            });

            // Navigate to home page
            navigate('/');
          }
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          toast({
            title: "Configuration Error",
            description: "AES key configuration issue. Please contact support.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Fallback: For now, just show a message that manual verification is needed
        toast({
          title: "Manual Verification Required",
          description: "AES key not configured. Please contact administrator to complete login.",
          variant: "destructive",
        });
        
        // For development, you could temporarily allow login without OTP verification:
        // Uncomment the lines below ONLY for testing purposes
        /*
        const candidateData = {
          uid: candidateId || 1,
          rollNumber: formData.rollNumber,
          token: 'temp-token',
          admin: false,
          userType: 'candidate'
        };
        login(candidateData);
        navigate('/');
        */
        
        return;
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      
      let errorMessage = "OTP verification failed. Please try again.";
      
      if (error.message.includes('AES key')) {
        errorMessage = "Configuration error. Please contact support.";
      } else if (error.message.includes('decrypt')) {
        errorMessage = "Invalid OTP data. Please request a new OTP.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtpSent(false);
    setEncryptedOtpData(null);
    setCandidateId(null);
    setFormData({ ...formData, otp: "" });
  };

  return (
    <div className="min-h-screen">
   
      {/* Main Content */}
      <main className="px-2 sm:px-4 py-8 sm:py-12 lg:py-16 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-center h-full max-w-7xl mx-auto">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <Card className="w-full mx-auto min-h-[450px] shadow-2xl bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center text-[#050C9C] font-bold">
                  {step === 1 ? "Candidate Login" : "Verify OTP"}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {step === 1 ? (
                  <form onSubmit={handleSendOTP} className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="rollNumber" className="text-lg font-medium">
                        Roll Number *
                      </Label>
                      <Input
                        id="rollNumber"
                        name="rollNumber"
                        type="text"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter your roll number"
                        className="h-14 text-lg px-4"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="py-4">
                      <Captcha onVerify={handleCaptchaVerify} />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90 h-14 text-lg text-white font-semibold"
                      disabled={isLoading || !captchaVerified || !formData.rollNumber.trim()}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>

                    <div className="text-center">
                      <p className="text-lg text-gray-600 mt-6">
                        Enter your registered roll number to receive OTP
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="otp" className="text-lg font-medium">
                        Verification Code
                      </Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        placeholder="Enter OTP"
                        className="h-14 text-lg px-4"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="text-lg text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
                      OTP sent to your registered email/mobile for roll number: <strong>{formData.rollNumber}</strong>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90 h-14 text-lg font-semibold"
                      disabled={isLoading || !formData.otp.trim()}
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>

                    <div className="flex justify-between text-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBackToStep1}
                        disabled={isLoading}
                        className="text-lg"
                      >
                        ← Back
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="text-lg"
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}