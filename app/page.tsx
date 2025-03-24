"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react" // useSession ekledik
import { BarChart3, Eye, EyeOff, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ModeToggle } from "@/components/ui/alperen"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Eğer kullanıcı zaten giriş yapmışsa, otomatik olarak dashboard'a yönlendir
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetStep, setResetStep] = useState(1) // 1: Telefon numarası, 2: Doğrulama kodu, 3: Yeni şifre
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError, setResetError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // NextAuth signIn fonksiyonunu credentials sağlayıcısı ile kullanıyoruz.
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setErrorMessage(res.error)
    } else {
      router.push("/dashboard")
    }
  }

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true)
    setResetStep(1)
    setPhoneNumber("")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
    setResetError("")
    setResetSuccess(false)
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.length < 10) {
      setResetError("Lütfen geçerli bir telefon numarası girin")
      return
    }
    setResetError("")
    setResetStep(2)
    setTimeout(() => {
      alert(`${phoneNumber} numarasına doğrulama kodu gönderildi. (Fake: Kod 123456)`)
    }, 500)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode !== "123456") {
      setResetError("Doğrulama kodu hatalı")
      return
    }
    setResetError("")
    setResetStep(3)
  }

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setResetError("Şifre en az 6 karakter olmalıdır")
      return
    }
    if (newPassword !== confirmPassword) {
      setResetError("Şifreler eşleşmiyor")
      return
    }
    setResetError("")
    setResetSuccess(true)
    setTimeout(() => {
      setForgotPasswordOpen(false)
      setResetStep(1)
    }, 3000)
  }

  const handleBackStep = () => {
    if (resetStep > 1) {
      setResetStep(resetStep - 1)
      setResetError("")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">IOTECH</CardTitle>
          <CardDescription>Çalışan yönetim sistemine giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-posta
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@iotech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Şifre
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            <button onClick={handleForgotPassword} className="underline underline-offset-4 hover:text-primary">
              Şifremi unuttum
            </button>
          </div>
        </CardFooter>
      </Card>

      {/* Şifremi Unuttum Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {resetSuccess
                ? "Şifre Sıfırlama Başarılı"
                : resetStep === 1
                  ? "Şifremi Unuttum"
                  : resetStep === 2
                    ? "Doğrulama Kodu"
                    : "Yeni Şifre Belirle"}
            </DialogTitle>
            <DialogDescription>
              {resetSuccess
                ? "Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz."
                : resetStep === 1
                  ? "Hesabınıza bağlı telefon numaranızı girin"
                  : resetStep === 2
                    ? "Telefonunuza gönderilen doğrulama kodunu girin"
                    : "Lütfen yeni şifrenizi belirleyin"}
            </DialogDescription>
          </DialogHeader>

          {resetError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}

          {resetSuccess ? (
            <div className="flex items-center justify-center py-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : resetStep === 1 ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Telefon Numarası
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="5XX XXX XX XX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button type="button" variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">Doğrulama Kodu Gönder</Button>
              </DialogFooter>
            </form>
          ) : resetStep === 2 ? (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Doğrulama Kodu
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {phoneNumber} numarasına gönderilen 6 haneli kodu girin
                </p>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                <Button type="button" variant="outline" onClick={handleBackStep} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Geri
                </Button>
                <Button type="submit">Doğrula</Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Şifreyi Tekrarla
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                <Button type="button" variant="outline" onClick={handleBackStep} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Geri
                </Button>
                <Button type="submit">Şifreyi Sıfırla</Button>
                <ModeToggle />
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
