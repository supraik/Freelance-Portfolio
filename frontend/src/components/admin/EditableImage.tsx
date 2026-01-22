// frontend/src/components/admin/EditableImage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EditableImageProps {
  src: string;
  alt?: string;
  className?: string;
  onReplace?: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  canDelete?: boolean;
}

export const EditableImage = ({
  src,
  alt = 'Image',
  className = '',
  onReplace,
  onDelete,
  canDelete = true,
}: EditableImageProps) => {
  const [isReplacing, setIsReplacing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onReplace) return;

    setIsReplacing(true);
    try {
      await onReplace(file);
    } catch (error) {
      console.error('Failed to replace image:', error);
    } finally {
      setIsReplacing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <img src={src} alt={alt} className={className} />
        
        {/* Edit Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onReplace && (
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isReplacing}
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={isReplacing}
                asChild
              >
                <span className="cursor-pointer">
                  {isReplacing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      Replace
                    </>
                  )}
                </span>
              </Button>
            </label>
          )}

          {onDelete && canDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The image will be permanently deleted from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
