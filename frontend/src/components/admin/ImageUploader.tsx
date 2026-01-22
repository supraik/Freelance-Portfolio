// frontend/src/components/admin/ImageUploader.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

export const ImageUploader = ({
  onUpload,
  maxFiles = 10,
  maxSize = 10,
  accept = 'image/*',
  className,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');

    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => f.errors[0].message).join(', ');
      setError(errors);
      return;
    }

    // Create previews
    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));
  }, [maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    multiple: maxFiles > 1,
  });

  const removePreview = (index: number) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const files = previews.map(p => p.file);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(files);

      clearInterval(interval);
      setProgress(100);

      // Clear previews after successful upload
      setTimeout(() => {
        previews.forEach(p => URL.revokeObjectURL(p.preview));
        setPreviews([]);
        setProgress(0);
        setUploading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setProgress(0);
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to select files (max {maxFiles} files, {maxSize}MB each)
            </p>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <img
                    src={preview.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </Card>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePreview(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Upload Button */}
          {!uploading && (
            <Button onClick={handleUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload {previews.length} {previews.length === 1 ? 'Image' : 'Images'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
