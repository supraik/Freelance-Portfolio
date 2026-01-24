import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import Lightbox from "../gallery/Lightbox";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface AdminGalleryImage {
  id?: number;
  src: string;
  alt: string;
  aspectRatio: "portrait" | "landscape" | "square";
}

interface AdminImageGridProps {
  images: AdminGalleryImage[];
  categoryId: number;
  onImageUpdate: (imageId: number, file: File) => Promise<void>;
  onImageDelete: (imageId: number) => Promise<void>;
  onImageAdd: (file: File) => Promise<void>;
}

const AdminImageGrid = ({
  images,
  categoryId,
  onImageUpdate,
  onImageDelete,
  onImageAdd,
}: AdminImageGridProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleDeleteClick = (imageId: number) => {
    setDeleteIndex(imageId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return;

    setIsDeleting(true);
    try {
      await onImageDelete(deleteIndex);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      setShowDeleteDialog(false);
      setDeleteIndex(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = async (imageId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUpdatingIndex(imageId);
    try {
      await onImageUpdate(imageId, file);
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    } finally {
      setUpdatingIndex(null);
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAdding(true);
    try {
      await onImageAdd(file);
      toast({
        title: "Success",
        description: "Image added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const getGridClass = (aspectRatio: AdminGalleryImage["aspectRatio"], index: number) => {
    const isLarge = index % 5 === 0;
    
    if (aspectRatio === "landscape") {
      return isLarge ? "col-span-2 row-span-1" : "col-span-2 row-span-1 md:col-span-1";
    }
    if (aspectRatio === "square") {
      return "col-span-1 row-span-1";
    }
    return isLarge ? "col-span-1 row-span-2" : "col-span-1 row-span-1 md:row-span-2";
  };

  const getAspectClass = (aspectRatio: AdminGalleryImage["aspectRatio"]) => {
    switch (aspectRatio) {
      case "landscape":
        return "aspect-[4/3]";
      case "square":
        return "aspect-square";
      case "portrait":
      default:
        return "aspect-[3/4]";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {images.map((image, index) => {
          const imageId = image.id || index; // Fallback to index if no ID
          return (
            <motion.div
              key={imageId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={getGridClass(image.aspectRatio, index)}
            >
              <div
                className="relative group w-full h-full"
                onMouseEnter={() => setActiveImageIndex(imageId)}
                onMouseLeave={() => setActiveImageIndex(null)}
                onClick={() => setActiveImageIndex(activeImageIndex === imageId ? null : imageId)}
              >
                <button
                  onClick={() => openLightbox(index)}
                  className="image-editorial w-full h-full block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`View ${image.alt} in fullscreen`}
                >
                  <div className={`relative overflow-hidden ${getAspectClass(image.aspectRatio)} bg-muted`}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </button>

                {/* Admin Controls Overlay - Desktop: hover, Mobile: tap */}
                <div 
                  className={`absolute inset-0 bg-black/60 transition-opacity flex items-center justify-center gap-2 ${
                    activeImageIndex === imageId ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
                  }`}
                >
                  {/* Replace Button */}
                  {image.id && (
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(image.id!, e)}
                        disabled={updatingIndex === imageId}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={updatingIndex === imageId}
                        asChild
                      >
                        <span className="cursor-pointer">
                          {updatingIndex === imageId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">Replace</span>
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  )}

                  {/* Delete Button */}
                  {image.id && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(image.id!);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  )}
                </div>

                {/* Loading Overlay */}
                {updatingIndex === imageId && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Add Image Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: images.length * 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          viewport={{ once: true, margin: "-50px" }}
          className="col-span-1 row-span-1"
        >
          <label className="block w-full h-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImage}
              disabled={isAdding}
            />
            <div className="relative aspect-[3/4] bg-muted/50 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex items-center justify-center group">
              {isAdding ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    Add Photo
                  </p>
                </div>
              )}
            </div>
          </label>
        </motion.div>
      </div>

      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The image will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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

export default AdminImageGrid;
