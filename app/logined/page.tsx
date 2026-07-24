"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- SHARED UI COMPONENTS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );
    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}

const labelVariants = cva(
  "text-sm font-medium leading-none text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-700 text-white hover:bg-blue/90",
        outline: "border border-gray-300 bg-white text-black hover:bg-gray-50",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-black shadow-sm transition-shadow placeholder:text-gray-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            className={cn("pe-10", className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-gray-400 transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
// --- END SHARED UI COMPONENTS ---

export default function Login() {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("UI: Sign In form submitted");
  };

  return (
    <div className="w-full min-h-screen bg-white text-black md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* LEFT SIDE: Form */}
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <form
            onSubmit={handleSignIn}
            autoComplete="on"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-black">
                Masuk ke Akun Anda
              </h1>
              <p className="text-balance text-sm text-gray-500">
                Masukkan email Anda di bawah ini untuk masuk
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  required
                  autoComplete="email"
                />
              </div>
              <PasswordInput
                name="password"
                label="Kata Sandi"
                required
                autoComplete="current-password"
                placeholder="Kata Sandi"
              />
              <Button type="submit" variant="default" className="mt-2">
                Masuk
              </Button>
            </div>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-500">Belum punya akun? </span>
            <a
              href="/register"
              className="font-medium text-black underline underline-offset-4 hover:text-gray-700"
            >
              Daftar di sini
            </a>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
            <span className="relative z-10 bg-white px-2 text-gray-500">
              Atau lanjutkan dengan
            </span>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={() => console.log("UI: Google button clicked")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google icon"
              className="mr-2 h-4 w-4"
            />
            Lanjutkan dengan Google
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE: Image & Quote */}
      <div
        className="hidden md:block relative bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(/ganteng.jpeg)` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-white to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 pb-6">
          <blockquote className="space-y-2 text-center text-white">
            <p className="text-lg font-medium">
              “
              <Typewriter
                text="Selamat Datang Kembali! Perjalanan berlanjut."
                speed={60}
              />
              ”
            </p>
            <cite className="block text-sm font-light text-gray-500 not-italic">
              — Tim Kami
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
