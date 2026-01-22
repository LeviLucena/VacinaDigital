import { useCallback, useState } from "react";
import { Upload, ImageIcon, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onImageUpload: (file: File, preview: string) => void;
  currentImage: string | null;
  onClear: () => void;
  isProcessing: boolean;
}

export function UploadArea({ onImageUpload, currentImage, onClear, isProcessing }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (currentImage) {
    return (
      <div className="relative rounded-lg overflow-hidden border-2 border-border bg-card shadow-card">
        <img 
          src={currentImage} 
          alt="Caderneta de vacinação" 
          className="w-full h-auto max-h-96 object-contain bg-muted"
        />
        {!isProcessing && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 shadow-elevated"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isProcessing && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <div className="w-12 h-12 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-medium">Processando imagem...</p>
              <p className="text-sm opacity-80">Extraindo dados da caderneta</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-all duration-200 p-8",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        capture="environment"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Envie a foto da caderneta
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Arraste a imagem ou clique para selecionar
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <label>
              <ImageIcon className="h-4 w-4" />
              Galeria
              <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
            </label>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <label>
              <Camera className="h-4 w-4" />
              Câmera
              <input type="file" accept="image/*" capture="environment" onChange={handleInputChange} className="hidden" />
            </label>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Formatos: JPG, PNG, HEIC • Máximo: 20MB
        </p>
      </div>
    </div>
  );
}
