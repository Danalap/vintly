"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Check, RotateCcw, Wand2, Loader2 } from "lucide-react";

interface PhotoEnhanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  onAccept: (enhancedImage: string) => void;
}

interface EnhancementResult {
  enhancedImage: string | null;
  demoMode: boolean;
  transformations?: {
    brightness: number;
    contrast: number;
    saturation: number;
    shadow: boolean;
    background: string;
  };
}

export default function PhotoEnhanceModal({
  isOpen,
  onClose,
  originalImage,
  onAccept,
}: PhotoEnhanceModalProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementResult, setEnhancementResult] =
    useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    if (isOpen && !enhancementResult && !isEnhancing) {
      handleEnhance();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setEnhancementResult(null);
      setError(null);
      setIsEnhancing(false);
    }
  }, [isOpen]);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalImage }),
      });

      if (!response.ok) {
        throw new Error("Enhancement failed");
      }

      const data = await response.json();

      if (data.success) {
        setEnhancementResult({
          enhancedImage: data.enhancedImage,
          demoMode: data.demoMode || false,
          transformations: data.transformations,
        });
      } else {
        throw new Error(data.error || "Enhancement failed");
      }
    } catch (err) {
      console.error("Enhancement error:", err);
      setError("Failed to enhance photo. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAccept = () => {
    if (enhancementResult) {
      // If we have a real enhanced image, use it
      if (enhancementResult.enhancedImage) {
        onAccept(enhancementResult.enhancedImage);
      } else {
        // Demo mode: Apply transformations client-side using canvas
        applyDemoEnhancements();
      }
    }
  };

  const applyDemoEnhancements = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Add padding for shadow effect
      const padding = 40;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      if (ctx) {
        // Create professional gradient background
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(0, "#f8f6f4");
        gradient.addColorStop(0.5, "#fafaf9");
        gradient.addColorStop(1, "#f5f3f1");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;

        // Draw the image with enhancements
        ctx.filter = "brightness(1.08) contrast(1.05) saturate(1.08)";
        ctx.drawImage(img, padding, padding);

        // Convert to data URL
        const enhancedDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        onAccept(enhancedDataUrl);
      }
    };

    img.src = originalImage;
  };

  if (!isOpen) return null;

  const getEnhancedPreviewStyle = () => {
    if (enhancementResult?.transformations) {
      const t = enhancementResult.transformations;
      return {
        filter: `brightness(${t.brightness}) contrast(${t.contrast}) saturate(${t.saturation})`,
        boxShadow: t.shadow
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          : undefined,
      };
    }
    return {};
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-charcoal-900">
                AI Photo Enhancement
              </h2>
              <p className="text-sm text-charcoal-700/60">
                Professional studio-quality results
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-cream-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-charcoal-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEnhancing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-violet-300 border-t-violet-600 animate-spin" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-charcoal-900">
                Enhancing your photo...
              </h3>
              <p className="mt-2 text-sm text-charcoal-700/60 text-center max-w-sm">
                Our AI is removing the background, adjusting lighting, and
                adding professional touches
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-charcoal-700/60">
                <Loader2 className="w-4 h-4 animate-spin" />
                This may take a few seconds
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal-900">
                Enhancement Failed
              </h3>
              <p className="mt-2 text-sm text-charcoal-700/60">{error}</p>
              <button
                onClick={handleEnhance}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-charcoal-900 text-white rounded-full font-medium hover:bg-charcoal-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : enhancementResult ? (
            <>
              {/* Comparison View */}
              <div className="relative aspect-[4/3] bg-cream-100 rounded-2xl overflow-hidden">
                {showComparison ? (
                  <div className="relative w-full h-full">
                    {/* Original Image */}
                    <div className="absolute inset-0">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-charcoal-900/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                        Before
                      </div>
                    </div>

                    {/* Enhanced Image (clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                        <img
                          src={
                            enhancementResult.enhancedImage || originalImage
                          }
                          alt="Enhanced"
                          className="max-w-full max-h-full object-contain"
                          style={getEnhancedPreviewStyle()}
                        />
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium rounded-full">
                        ✨ Enhanced
                      </div>
                    </div>

                    {/* Slider */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                        <div className="flex items-center gap-0.5">
                          <div className="w-0.5 h-4 bg-charcoal-400 rounded-full" />
                          <div className="w-0.5 h-4 bg-charcoal-400 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Invisible slider input */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) =>
                        setSliderPosition(parseInt(e.target.value))
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                    <img
                      src={enhancementResult.enhancedImage || originalImage}
                      alt="Enhanced"
                      className="max-w-full max-h-full object-contain"
                      style={getEnhancedPreviewStyle()}
                    />
                  </div>
                )}
              </div>

              {/* Enhancement Details */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Background removed
                </span>
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  ✦ Lighting optimized
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  🎨 Colors enhanced
                </span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  ⬇️ Professional shadow
                </span>
              </div>

              {enhancementResult.demoMode && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-700">
                    <strong>Demo Mode:</strong> For full AI-powered background
                    removal, add your Replicate API token to{" "}
                    <code className="px-1 py-0.5 bg-amber-100 rounded">
                      .env.local
                    </code>
                  </p>
                </div>
              )}

              {/* Toggle Comparison */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-charcoal-700/60 hover:text-charcoal-900 transition-colors"
                >
                  {showComparison
                    ? "View enhanced only"
                    : "Show before/after comparison"}
                </button>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        {enhancementResult && !isEnhancing && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-cream-200 bg-cream-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-charcoal-700 font-medium hover:text-charcoal-900 transition-colors"
            >
              Keep Original
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-full hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
            >
              <Check className="w-4 h-4" />
              Use Enhanced Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

