import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, Upload, X, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Upload failed");
  }
  const data = await res.json();
  return data.url;
}

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  testId?: string;
}

export function ImageUploadInput({
  value,
  onChange,
  label,
  placeholder = "https://...",
  testId,
}: ImageUploadInputProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
      toast({ title: "Image uploaded successfully" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-md w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          data-testid={testId ? `${testId}-mode-url` : undefined}
        >
          <Link className="w-3 h-3" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          data-testid={testId ? `${testId}-mode-upload` : undefined}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      {mode === "url" ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid={testId}
        />
      ) : (
        <div
          className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-zinc-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          data-testid={testId ? `${testId}-dropzone` : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-zinc-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-zinc-400 py-2">
              <Upload className="w-5 h-5" />
              <span className="text-sm">Click to choose an image</span>
              <span className="text-xs text-zinc-600">PNG, JPG, WebP up to 10MB</span>
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-20 h-20 rounded-md object-cover border border-zinc-700"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full p-0.5 hover:bg-red-700 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

interface MultiImageUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  testId?: string;
}

export function MultiImageUploadInput({
  value,
  onChange,
  label,
  testId,
}: MultiImageUploadInputProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const urls = value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map(uploadImageFile));
      const existing = value.trim();
      const next = existing
        ? existing + "\n" + uploaded.join("\n")
        : uploaded.join("\n");
      onChange(next);
      toast({ title: `${uploaded.length} image(s) uploaded` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeUrl = (idx: number) => {
    const next = urls.filter((_, i) => i !== idx);
    onChange(next.join("\n"));
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-md w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          data-testid={testId ? `${testId}-mode-url` : undefined}
        >
          <Link className="w-3 h-3" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-zinc-700 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          data-testid={testId ? `${testId}-mode-upload` : undefined}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      {mode === "url" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
          data-testid={testId}
        />
      ) : (
        <div
          className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-zinc-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          data-testid={testId ? `${testId}-dropzone` : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-zinc-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-zinc-400 py-2">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Click to add images (multiple allowed)</span>
              <span className="text-xs text-zinc-600">PNG, JPG, WebP up to 10MB each</span>
            </div>
          )}
        </div>
      )}

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {urls.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={url}
                alt={`Image ${idx + 1}`}
                className="w-16 h-16 rounded-md object-cover border border-zinc-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => removeUrl(idx)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full p-0.5 hover:bg-red-700 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
