import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Captcha } from "@/components/ui/captcha";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({ onSuccess }) {
    const [step, setStep] = useState(1); // 1: Roll Number + Captcha, 2: OTP Verification
    const [formData, setFormData] = useState({
        rollNumber: "",
        otp: ""
    });
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const { toast } = useToast();

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

        if (formData.rollNumber.length !== 10) {
            toast({
                title: "Invalid Roll Number",
                description: "Roll number must be exactly 10 digits.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rollNumber: formData.rollNumber }),
            });

            const data = await response.json();

            if (data.success) {
                setOtpSent(true);
                setStep(2);
                toast({
                    title: "OTP Sent",
                    description: "Please check your email/SMS for the verification code.",
                });
            } else {
                toast({
                    title: "Failed to Send OTP",
                    description: data.message || "Roll number not found or invalid.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (formData.otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "OTP must be exactly 6 digits.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rollNumber: formData.rollNumber,
                    otp: formData.otp
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store auth data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                localStorage.setItem('isAuthenticated', 'true');

                toast({
                    title: "Login Successful",
                    description: "Welcome to your portal!",
                });

                onSuccess(data.data);
            } else {
                toast({
                    title: "Verification Failed",
                    description: data.message || "Invalid or expired OTP.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            toast({
                title: "Verification Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToStep1 = () => {
        setStep(1);
        setOtpSent(false);
        setFormData({ ...formData, otp: "" });
    };

    return (
        <Card className="w-full max-w-md mx-auto min-h-[450px] shadow-2xl bg-white">
            <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center text-[#050C9C] font-bold">
                    {step === 1 ? "Student Login" : "Verify OTP"}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-8">
                        <div className="space-y-4">
                            <Label htmlFor="rollNumber" className="text-lg font-medium">Roll Number *</Label>
                            <Input
                                id="rollNumber"
                                name="rollNumber"
                                type="text"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter your 10-digit roll number"
                                maxLength={10}
                                pattern="[0-9]{10}"
                                className="h-14 text-lg px-4"
                            />
                        </div>

                        <div className="py-4">
                            <Captcha onVerify={handleCaptchaVerify} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90 h-14 text-lg text-white font-semibold"
                            disabled={isLoading || !captchaVerified || formData.rollNumber.length !== 10}
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
                            <Label htmlFor="otp" className="text-lg font-medium">Verification Code</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                className="h-14 text-lg px-4"
                            />
                        </div>

                        <div className="text-lg text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
                            OTP sent to your registered email/mobile for roll number: <strong>{formData.rollNumber}</strong>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90 h-14 text-lg font-semibold"
                            disabled={isLoading || formData.otp.length !== 6}
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
    );
}