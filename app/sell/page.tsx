"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  X,
  Check,
  Upload,
  Sparkles,
  Package,
  DollarSign,
  Tag,
  ImagePlus,
  Wand2,
  Truck,
  MapPin,
} from "lucide-react";
// Using Supabase API for product storage
import PhotoEnhanceModal from "@/components/PhotoEnhanceModal";

// =============================================
// TYPES
// =============================================
interface ListingData {
  photos: string[];
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  brand: string;
  color: string;
  price: string;
  shippingWeight: string;
  // Shipping settings
  allowPickup: boolean;
  allowDelivery: boolean;
  shippingIncluded: boolean; // Whether price includes shipping
  pickupLocation: string;
}

// =============================================
// CONSTANTS
// =============================================
const CATEGORIES = [
  { value: "gowns", label: "Gowns", icon: "👗" },
  { value: "dresses", label: "Dresses", icon: "✨" },
  { value: "suits", label: "Suits & Tailoring", icon: "🎩" },
  { value: "outerwear", label: "Outerwear", icon: "🧥" },
  { value: "bags", label: "Handbags", icon: "👜" },
  { value: "shoes", label: "Shoes", icon: "👠" },
  { value: "jewelry", label: "Fine Jewelry", icon: "💎" },
  { value: "watches", label: "Watches", icon: "⌚" },
  { value: "accessories", label: "Accessories", icon: "🧣" },
  { value: "tops", label: "Tops & Blouses", icon: "👚" },
];

const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];

const CONDITIONS = [
  {
    value: "new_with_tags",
    label: "New with Tags",
    description: "Unworn, original tags and packaging intact",
    emoji: "✨",
  },
  {
    value: "like_new",
    label: "Pristine",
    description: "Worn once or twice for special occasions, flawless condition",
    emoji: "💎",
  },
  {
    value: "good",
    label: "Excellent",
    description: "Gently worn, professionally maintained, minimal signs of wear",
    emoji: "🌟",
  },
  {
    value: "fair",
    label: "Good",
    description: "Visible wear consistent with age, well-preserved",
    emoji: "👌",
  },
];

const DESIGNERS = [
  "Chanel",
  "Dior",
  "Hermès",
  "Valentino",
  "Christian Louboutin",
  "Gucci",
  "Balmain",
  "Givenchy",
  "Saint Laurent",
  "Oscar de la Renta",
  "Prada",
  "Versace",
];

const COLORS = [
  { value: "black", label: "Black", hex: "#1a1a1a" },
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "gray", label: "Gray", hex: "#6b7280" },
  { value: "navy", label: "Navy", hex: "#1e3a5f" },
  { value: "blue", label: "Blue", hex: "#3b82f6" },
  { value: "red", label: "Red", hex: "#ef4444" },
  { value: "pink", label: "Pink", hex: "#ec4899" },
  { value: "green", label: "Green", hex: "#22c55e" },
  { value: "yellow", label: "Yellow", hex: "#eab308" },
  { value: "orange", label: "Orange", hex: "#f97316" },
  { value: "purple", label: "Purple", hex: "#a855f7" },
  { value: "brown", label: "Brown", hex: "#92400e" },
  { value: "beige", label: "Beige", hex: "#d4c4a8" },
  { value: "multi", label: "Multi", hex: "linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6)" },
];

const SHIPPING_WEIGHTS = [
  { value: "small", label: "Small", description: "Light items (t-shirts, accessories)", price: "$4.99" },
  { value: "medium", label: "Medium", description: "Regular items (jeans, dresses)", price: "$7.99" },
  { value: "large", label: "Large", description: "Heavy items (coats, boots)", price: "$12.99" },
];

const STEPS = [
  { id: 1, title: "Photos", icon: Camera },
  { id: 2, title: "Details", icon: Tag },
  { id: 3, title: "Condition", icon: Sparkles },
  { id: 4, title: "Pricing", icon: DollarSign },
  { id: 5, title: "Shipping", icon: Truck },
  { id: 6, title: "Review", icon: Check },
];


// =============================================
// COMPONENTS
// =============================================

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full">
      {/* Mobile: Simple dots */}
      <div className="flex sm:hidden items-center justify-center gap-2 mb-6">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              step.id === currentStep
                ? "w-8 bg-charcoal-900"
                : step.id < currentStep
                ? "bg-sage-500"
                : "bg-cream-300"
            }`}
          />
        ))}
      </div>

      {/* Desktop: Full progress bar */}
      <div className="hidden sm:flex items-center justify-between mb-10">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step.id === currentStep
                    ? "bg-charcoal-900 text-cream-50 scale-110"
                    : step.id < currentStep
                    ? "bg-sage-500 text-white"
                    : "bg-cream-200 text-charcoal-700/50"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.id === currentStep
                    ? "text-charcoal-900"
                    : step.id < currentStep
                    ? "text-sage-600"
                    : "text-charcoal-700/50"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  step.id < currentStep ? "bg-sage-500" : "bg-cream-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PhotoUploadStepProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

function PhotoUploadStep({ photos, onPhotosChange }: PhotoUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enhanceModalOpen, setEnhanceModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [enhancedPhotos, setEnhancedPhotos] = useState<Set<number>>(new Set());

  const handleAddPhoto = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Calculate how many more photos we can add
    const remainingSlots = 8 - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    // Convert all files to data URLs first, then update state once
    const readFileAsDataUrl = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    };

    const newPhotoUrls = await Promise.all(filesToProcess.map(readFileAsDataUrl));
    onPhotosChange([...photos, ...newPhotoUrls]);

    // Reset the input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
    // Update enhanced photos set
    setEnhancedPhotos((prev) => {
      const newSet = new Set<number>();
      prev.forEach((i) => {
        if (i < index) newSet.add(i);
        else if (i > index) newSet.add(i - 1);
      });
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return;

    const newPhotos = [...photos];
    const [draggedPhoto] = newPhotos.splice(dragIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);
    onPhotosChange(newPhotos);
  };

  // Handle file drop on the add button
  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const remainingSlots = 8 - photos.length;
    const filesToProcess = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots);

    const readFileAsDataUrl = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    };

    const newPhotoUrls = await Promise.all(filesToProcess.map(readFileAsDataUrl));
    onPhotosChange([...photos, ...newPhotoUrls]);
  };

  const handleEnhancePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex(index);
    setEnhanceModalOpen(true);
  };

  const handleAcceptEnhanced = (enhancedImage: string) => {
    if (selectedPhotoIndex !== null) {
      const newPhotos = [...photos];
      newPhotos[selectedPhotoIndex] = enhancedImage;
      onPhotosChange(newPhotos);
      setEnhancedPhotos((prev) => new Set([...prev, selectedPhotoIndex]));
    }
    setEnhanceModalOpen(false);
    setSelectedPhotoIndex(null);
  };

  const handleEnhanceAll = async () => {
    // Enhance photos one by one (simplified batch processing)
    for (let i = 0; i < photos.length; i++) {
      if (!enhancedPhotos.has(i)) {
        setSelectedPhotoIndex(i);
        setEnhanceModalOpen(true);
        break; // Open modal for first non-enhanced photo
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-terracotta-500/10 rounded-full flex items-center justify-center">
          <Camera className="w-8 h-8 text-terracotta-500" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          Add Photos
        </h2>
        <p className="mt-2 text-charcoal-700/70">
          Add up to 8 photos. The first photo will be your cover image.
        </p>
      </div>

      {/* AI Enhancement Banner */}
      {photos.length > 0 && (
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-charcoal-900">
                  ✨ AI Photo Enhancement
                </h4>
                <p className="text-sm text-charcoal-700/70">
                  Make your photos look professional with one click
                </p>
              </div>
            </div>
            {photos.length > 1 && enhancedPhotos.size < photos.length && (
              <button
                onClick={handleEnhanceAll}
                className="sm:ml-auto px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-full hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
              >
                Enhance All Photos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Existing Photos */}
        {photos.map((photo, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand-100 cursor-move group ${
              index === 0 ? "ring-2 ring-terracotta-500 ring-offset-2" : ""
            }`}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {index === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-terracotta-500 text-white text-xs font-medium rounded-full">
                Cover
              </div>
            )}
            
            {/* Enhanced badge */}
            {enhancedPhotos.has(index) && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Enhanced
              </div>
            )}
            
            {/* Action buttons overlay */}
            <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              {/* Enhance button */}
              {!enhancedPhotos.has(index) && (
                <button
                  onClick={(e) => handleEnhancePhoto(index, e)}
                  className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg transform hover:scale-110"
                  title="Enhance with AI"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Remove button */}
            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-2 right-2 w-8 h-8 bg-charcoal-900/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-charcoal-900"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Photo number */}
            <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/90 text-charcoal-800 text-xs font-medium rounded-full flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Add Photo Button */}
        {photos.length < 8 && (
          <button
            onClick={handleAddPhoto}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-cream-300 hover:border-charcoal-800 bg-sand-50 hover:bg-sand-100 flex flex-col items-center justify-center gap-3 transition-all group"
          >
            <div className="w-12 h-12 bg-cream-200 group-hover:bg-cream-300 rounded-full flex items-center justify-center transition-colors">
              <ImagePlus className="w-6 h-6 text-charcoal-700" />
            </div>
            <span className="text-sm font-medium text-charcoal-700">Add Photo</span>
            <span className="text-xs text-charcoal-700/50">or drag & drop</span>
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-sand-100 rounded-2xl p-4 sm:p-6">
        <h4 className="font-medium text-charcoal-800 mb-3">📸 Photo Tips</h4>
        <ul className="space-y-2 text-sm text-charcoal-700/70">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
            Use natural lighting for the best results
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
            Show the item from multiple angles
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
            Include close-ups of any flaws or unique details
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
            Drag photos to reorder them
          </li>
          <li className="flex items-start gap-2">
            <Wand2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
            <span>
              Use <strong className="text-violet-600">AI Enhancement</strong> to make photos professional
            </span>
          </li>
        </ul>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Enhancement Modal */}
      {selectedPhotoIndex !== null && (
        <PhotoEnhanceModal
          isOpen={enhanceModalOpen}
          onClose={() => {
            setEnhanceModalOpen(false);
            setSelectedPhotoIndex(null);
          }}
          originalImage={photos[selectedPhotoIndex]}
          onAccept={handleAcceptEnhanced}
        />
      )}
    </div>
  );
}

interface DetailsStepProps {
  data: ListingData;
  onUpdate: (updates: Partial<ListingData>) => void;
}

function DetailsStep({ data, onUpdate }: DetailsStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-sage-500/10 rounded-full flex items-center justify-center">
          <Tag className="w-8 h-8 text-sage-600" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          Item Details
        </h2>
        <p className="mt-2 text-charcoal-700/70">
          Tell buyers about your item
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-2">
          Title <span className="text-terracotta-500">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., Chanel Classic Flap Bag Medium Caviar"
          maxLength={150}
          className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 focus:bg-white transition-all"
        />
        <p className="mt-1.5 text-xs text-charcoal-700/50 text-right">
          {data.title.length}/150
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-2">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe your item: measurements, fit, fabric, any flaws..."
          rows={4}
          className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 focus:bg-white transition-all resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-3">
          Category <span className="text-terracotta-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onUpdate({ category: cat.value })}
              className={`p-3 rounded-xl border text-center transition-all ${
                data.category === cat.value
                  ? "border-charcoal-900 bg-charcoal-900 text-cream-50"
                  : "border-cream-300 hover:border-charcoal-800 text-charcoal-700"
              }`}
            >
              <span className="text-xl block mb-1">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Designer */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-2">
          Designer <span className="text-terracotta-500">*</span>
        </label>
        <select
          value={data.brand}
          onChange={(e) => onUpdate({ brand: e.target.value })}
          className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-charcoal-800 focus:bg-white transition-all appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
          }}
        >
          <option value="">Select a designer</option>
          {DESIGNERS.map((designer) => (
            <option key={designer} value={designer}>
              {designer}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-3">
          Size <span className="text-terracotta-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onUpdate({ size })}
              className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                data.size === size
                  ? "border-charcoal-900 bg-charcoal-900 text-cream-50"
                  : "border-cream-300 hover:border-charcoal-800 text-charcoal-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-3">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate({ color: color.value })}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                data.color === color.value
                  ? "border-charcoal-900 bg-charcoal-900/5"
                  : "border-cream-300 hover:border-charcoal-800"
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-cream-300"
                style={{
                  background: color.hex,
                }}
              />
              <span className="text-charcoal-700">{color.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConditionStep({ data, onUpdate }: DetailsStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          Item Condition
        </h2>
        <p className="mt-2 text-charcoal-700/70">
          Be honest about wear - buyers appreciate transparency
        </p>
      </div>

      {/* Condition Options */}
      <div className="space-y-3">
        {CONDITIONS.map((condition) => (
          <button
            key={condition.value}
            onClick={() => onUpdate({ condition: condition.value })}
            className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all ${
              data.condition === condition.value
                ? "border-charcoal-900 bg-charcoal-900 text-cream-50"
                : "border-cream-300 hover:border-charcoal-800 bg-sand-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{condition.emoji}</span>
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    data.condition === condition.value
                      ? "text-cream-50"
                      : "text-charcoal-800"
                  }`}
                >
                  {condition.label}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    data.condition === condition.value
                      ? "text-cream-200"
                      : "text-charcoal-700/60"
                  }`}
                >
                  {condition.description}
                </p>
              </div>
              {data.condition === condition.value && (
                <div className="w-6 h-6 bg-cream-50 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-charcoal-900" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PricingStep({ data, onUpdate }: DetailsStepProps) {
  const suggestedPrice = 2500; // In a real app, this would be calculated based on item details

  return (
    <div className="space-y-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-sage-500/10 rounded-full flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-sage-600" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          Set Your Price
        </h2>
        <p className="mt-2 text-charcoal-700/70">
          Price competitively to sell faster
        </p>
      </div>

      {/* Price Input */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-2">
          Price <span className="text-terracotta-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-charcoal-700">
            $
          </span>
          <input
            type="number"
            value={data.price}
            onChange={(e) => onUpdate({ price: e.target.value })}
            placeholder="0"
            min="1"
            step="1"
            className="w-full pl-12 pr-4 py-4 bg-sand-50 border border-cream-300 rounded-xl text-3xl font-semibold text-charcoal-800 placeholder:text-charcoal-700/30 focus:outline-none focus:border-charcoal-800 focus:bg-white transition-all"
          />
        </div>
        {data.price && (
          <div className="mt-4 p-4 bg-sand-100 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-charcoal-700/70">Your earnings (after 10% fee)</span>
              <span className="font-semibold text-charcoal-800">
                ${(parseFloat(data.price) * 0.9).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Price */}
      <div className="p-4 bg-sage-500/10 border border-sage-300 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal-800">
              Suggested price: ${suggestedPrice}
            </p>
            <p className="text-xs text-charcoal-700/60">
              Based on similar items sold recently
            </p>
          </div>
          <button
            onClick={() => onUpdate({ price: suggestedPrice.toString() })}
            className="px-4 py-2 bg-sage-500 text-white text-sm font-medium rounded-full hover:bg-sage-600 transition-colors"
          >
            Use
          </button>
        </div>
      </div>

      {/* Shipping Weight */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-3">
          Shipping Size <span className="text-terracotta-500">*</span>
        </label>
        <div className="space-y-2">
          {SHIPPING_WEIGHTS.map((weight) => (
            <button
              key={weight.value}
              onClick={() => onUpdate({ shippingWeight: weight.value })}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                data.shippingWeight === weight.value
                  ? "border-charcoal-900 bg-charcoal-900/5"
                  : "border-cream-300 hover:border-charcoal-800 bg-sand-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package
                  className={`w-5 h-5 ${
                    data.shippingWeight === weight.value
                      ? "text-charcoal-900"
                      : "text-charcoal-700/50"
                  }`}
                />
                <div>
                  <span className="font-medium text-charcoal-800">{weight.label}</span>
                  <p className="text-xs text-charcoal-700/60">{weight.description}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-charcoal-800">{weight.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShippingStep({ data, onUpdate }: DetailsStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
          <Truck className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          Shipping Options
        </h2>
        <p className="mt-2 text-charcoal-700/70">
          How would you like buyers to receive this item?
        </p>
      </div>

      {/* Delivery Options */}
      <div>
        <label className="block text-sm font-medium text-charcoal-800 mb-3">
          Fulfillment Methods <span className="text-terracotta-500">*</span>
        </label>
        <p className="text-sm text-charcoal-700/60 mb-4">
          Select at least one option
        </p>

        <div className="space-y-3">
          {/* Pickup Option */}
          <button
            onClick={() => onUpdate({ allowPickup: !data.allowPickup })}
            className={`w-full p-5 rounded-2xl border text-left transition-all ${
              data.allowPickup
                ? "border-charcoal-900 bg-charcoal-900/5"
                : "border-cream-300 hover:border-charcoal-800 bg-sand-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  data.allowPickup
                    ? "bg-charcoal-900 text-white"
                    : "bg-cream-200 text-charcoal-700"
                }`}
              >
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-charcoal-800">Local Pickup</h3>
                  {data.allowPickup && (
                    <span className="px-2 py-0.5 bg-sage-500 text-white text-xs font-medium rounded-full">
                      Enabled
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-charcoal-700/60">
                  Buyer can pick up the item in person at your location
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  data.allowPickup
                    ? "border-charcoal-900 bg-charcoal-900"
                    : "border-cream-400"
                }`}
              >
                {data.allowPickup && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </button>

          {/* Delivery Option */}
          <button
            onClick={() => onUpdate({ allowDelivery: !data.allowDelivery })}
            className={`w-full p-5 rounded-2xl border text-left transition-all ${
              data.allowDelivery
                ? "border-charcoal-900 bg-charcoal-900/5"
                : "border-cream-300 hover:border-charcoal-800 bg-sand-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  data.allowDelivery
                    ? "bg-charcoal-900 text-white"
                    : "bg-cream-200 text-charcoal-700"
                }`}
              >
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-charcoal-800">Shipping/Delivery</h3>
                  {data.allowDelivery && (
                    <span className="px-2 py-0.5 bg-sage-500 text-white text-xs font-medium rounded-full">
                      Enabled
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-charcoal-700/60">
                  Item will be shipped to the buyer via courier
                </p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  data.allowDelivery
                    ? "border-charcoal-900 bg-charcoal-900"
                    : "border-cream-400"
                }`}
              >
                {data.allowDelivery && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Pickup Location - Show when pickup is enabled */}
      {data.allowPickup && (
        <div className="animate-fade-up">
          <label className="block text-sm font-medium text-charcoal-800 mb-2">
            Pickup Location
          </label>
          <input
            type="text"
            value={data.pickupLocation}
            onChange={(e) => onUpdate({ pickupLocation: e.target.value })}
            placeholder="e.g., Manhattan, NY or Specific neighborhood"
            className="w-full px-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 focus:bg-white transition-all"
          />
          <p className="mt-1.5 text-xs text-charcoal-700/50">
            Enter a general area - exact address will be shared after purchase
          </p>
        </div>
      )}

      {/* Shipping Cost - Show when delivery is enabled */}
      {data.allowDelivery && (
        <div className="animate-fade-up">
          <label className="block text-sm font-medium text-charcoal-800 mb-3">
            Shipping Cost
          </label>
          <div className="space-y-3">
            <button
              onClick={() => onUpdate({ shippingIncluded: true })}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                data.shippingIncluded
                  ? "border-charcoal-900 bg-charcoal-900/5"
                  : "border-cream-300 hover:border-charcoal-800 bg-sand-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    data.shippingIncluded
                      ? "border-charcoal-900 bg-charcoal-900"
                      : "border-cream-400"
                  }`}
                >
                  {data.shippingIncluded && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-charcoal-800">Free Shipping</h4>
                  <p className="text-sm text-charcoal-700/60">
                    Shipping cost is included in your price (${data.price || "0"})
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onUpdate({ shippingIncluded: false })}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                !data.shippingIncluded && data.allowDelivery
                  ? "border-charcoal-900 bg-charcoal-900/5"
                  : "border-cream-300 hover:border-charcoal-800 bg-sand-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !data.shippingIncluded
                      ? "border-charcoal-900 bg-charcoal-900"
                      : "border-cream-400"
                  }`}
                >
                  {!data.shippingIncluded && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-charcoal-800">Buyer Pays Shipping</h4>
                  <p className="text-sm text-charcoal-700/60">
                    Shipping cost ({SHIPPING_WEIGHTS.find(w => w.value === data.shippingWeight)?.price || "varies"}) will be added at checkout
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Shipping Tips
        </h4>
        <ul className="space-y-1.5 text-sm text-blue-800/80">
          <li>• Offering both pickup and delivery attracts more buyers</li>
          <li>• Free shipping can increase sales by up to 30%</li>
          <li>• Secure packaging is essential for haute couture items</li>
        </ul>
      </div>
    </div>
  );
}

function ReviewStep({ data }: { data: ListingData }) {
  const shippingWeight = SHIPPING_WEIGHTS.find((w) => w.value === data.shippingWeight);
  const condition = CONDITIONS.find((c) => c.value === data.condition);
  const category = CATEGORIES.find((c) => c.value === data.category);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-terracotta-500/10 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-terracotta-500" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">
          Review Your Listing
        </h2>
        <p className="mt-2 text-charcoal-700/70">
          Make sure everything looks good before publishing
        </p>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-3xl border border-cream-300 overflow-hidden shadow-lg">
        {/* Photo Preview */}
        <div className="aspect-[4/3] bg-sand-100 relative overflow-hidden">
          {data.photos.length > 0 ? (
            <img
              src={data.photos[0]}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-charcoal-700/30" />
            </div>
          )}
          {data.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-charcoal-900/70 text-white text-xs font-medium rounded-full">
              +{data.photos.length - 1} more
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-display text-xl font-semibold text-charcoal-900 line-clamp-2">
              {data.title || "Untitled Item"}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-charcoal-700/70">
              {data.brand && <span>{data.brand}</span>}
              {data.brand && data.size && <span>•</span>}
              {data.size && <span>Size {data.size}</span>}
              {(data.brand || data.size) && category && <span>•</span>}
              {category && <span>{category.label}</span>}
            </div>
          </div>

          {data.description && (
            <p className="text-sm text-charcoal-700/70 line-clamp-3">{data.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {condition && (
              <span className="px-3 py-1 bg-sand-100 text-charcoal-700 text-xs font-medium rounded-full">
                {condition.emoji} {condition.label}
              </span>
            )}
            {data.color && (
              <span className="px-3 py-1 bg-sand-100 text-charcoal-700 text-xs font-medium rounded-full capitalize">
                {data.color}
              </span>
            )}
          </div>

          <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
            <span className="text-2xl font-semibold text-charcoal-900">
              ${data.price || "0"}
            </span>
            {data.allowDelivery && shippingWeight && (
              <span className="text-sm text-charcoal-700/70">
                {data.shippingIncluded ? "Free shipping" : `+ ${shippingWeight.price} shipping`}
              </span>
            )}
          </div>

          {/* Shipping Options Preview */}
          <div className="pt-3 border-t border-cream-200">
            <p className="text-xs font-medium text-charcoal-700/60 mb-2">Fulfillment Options</p>
            <div className="flex flex-wrap gap-2">
              {data.allowPickup && (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Pickup Available
                  {data.pickupLocation && <span className="opacity-70">• {data.pickupLocation}</span>}
                </span>
              )}
              {data.allowDelivery && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1.5">
                  <Truck className="w-3 h-3" />
                  {data.shippingIncluded ? "Free Shipping" : "Delivery Available"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-sand-100 rounded-2xl p-5">
        <h4 className="font-medium text-charcoal-800 mb-4">Checklist</h4>
        <div className="space-y-3">
          {[
            { label: "Photos added", done: data.photos.length > 0 },
            { label: "Title added", done: data.title.length > 0 },
            { label: "Designer selected", done: data.brand.length > 0 },
            { label: "Category selected", done: data.category.length > 0 },
            { label: "Size selected", done: data.size.length > 0 },
            { label: "Condition selected", done: data.condition.length > 0 },
            { label: "Price set", done: parseFloat(data.price) > 0 },
            { label: "Shipping size selected", done: data.shippingWeight.length > 0 },
            { label: "Fulfillment method selected", done: data.allowPickup || data.allowDelivery },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.done ? "bg-sage-500" : "bg-cream-300"
                }`}
              >
                {item.done && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-sm ${
                  item.done ? "text-charcoal-800" : "text-charcoal-700/50"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================
// MAIN SELL PAGE
// =============================================
export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [listingData, setListingData] = useState<ListingData>({
    photos: [],
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    brand: "",
    color: "",
    price: "",
    shippingWeight: "",
    allowPickup: false,
    allowDelivery: true,
    shippingIncluded: false,
    pickupLocation: "",
  });

  const updateListingData = (updates: Partial<ListingData>) => {
    setListingData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return listingData.photos.length > 0;
      case 2:
        return listingData.title && listingData.category && listingData.size && listingData.brand;
      case 3:
        return listingData.condition;
      case 4:
        return parseFloat(listingData.price) > 0 && listingData.shippingWeight;
      case 5:
        // At least one fulfillment method must be selected
        return listingData.allowPickup || listingData.allowDelivery;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    
    // Save listing to Supabase via API
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: listingData.title,
          description: listingData.description,
          category: listingData.category,
          size: listingData.size,
          condition: listingData.condition,
          brand: listingData.brand,
          color: listingData.color,
          price: listingData.price,
          shippingWeight: listingData.shippingWeight,
          photos: listingData.photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      console.log("Product created successfully:", data.product);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error saving listing:", error);
      alert(error instanceof Error ? error.message : "Failed to create listing. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-sage-500 rounded-full flex items-center justify-center animate-fade-up">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-charcoal-900 animate-fade-up stagger-1">
            Listed Successfully! 🎉
          </h1>
          <p className="mt-3 text-charcoal-700/70 animate-fade-up stagger-2">
            Your item is now live and visible to buyers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up stagger-3">
            <Link
              href="/"
              className="px-6 py-3 bg-charcoal-900 text-cream-50 font-medium rounded-full hover:bg-charcoal-800 transition-colors"
            >
              View Listing
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setCurrentStep(1);
                setListingData({
                  photos: [],
                  title: "",
                  description: "",
                  category: "",
                  size: "",
                  condition: "",
                  brand: "",
                  color: "",
                  price: "",
                  shippingWeight: "",
                  allowPickup: false,
                  allowDelivery: true,
                  shippingIncluded: false,
                  pickupLocation: "",
                });
              }}
              className="px-6 py-3 border-2 border-charcoal-900 text-charcoal-900 font-medium rounded-full hover:bg-charcoal-900 hover:text-cream-50 transition-colors"
            >
              List Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-lg border-b border-cream-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Back</span>
            </Link>
            <span className="font-display text-xl font-semibold text-charcoal-900">
              Consign Your Piece
            </span>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <PhotoUploadStep
              photos={listingData.photos}
              onPhotosChange={(photos) => updateListingData({ photos })}
            />
          )}
          {currentStep === 2 && (
            <DetailsStep data={listingData} onUpdate={updateListingData} />
          )}
          {currentStep === 3 && (
            <ConditionStep data={listingData} onUpdate={updateListingData} />
          )}
          {currentStep === 4 && (
            <PricingStep data={listingData} onUpdate={updateListingData} />
          )}
          {currentStep === 5 && (
            <ShippingStep data={listingData} onUpdate={updateListingData} />
          )}
          {currentStep === 6 && <ReviewStep data={listingData} />}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-charcoal-700 font-medium hover:text-charcoal-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
                canProceed()
                  ? "bg-charcoal-900 text-cream-50 hover:bg-charcoal-800"
                  : "bg-cream-300 text-charcoal-700/50 cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-terracotta-500 text-white rounded-full font-medium hover:bg-terracotta-600 transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Publish Listing
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

