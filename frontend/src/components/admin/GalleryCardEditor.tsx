// frontend/src/components/admin/GalleryCardEditor.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { EditableImage } from './EditableImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GalleryCard {
  id: number;
  image?: string;
}

interface GalleryCardEditorProps {
  cards: GalleryCard[];
  onAddCard: () => void;
  onDeleteCard: (cardId: number) => Promise<void>;
  onUploadImage: (cardId: number, file: File) => Promise<void>;
  onDeleteImage: (cardId: number) => Promise<void>;
}

export const GalleryCardEditor = ({
  cards,
  onAddCard,
  onDeleteCard,
  onUploadImage,
  onDeleteImage,
}: GalleryCardEditorProps) => {
  const [uploadingCardId, setUploadingCardId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Existing Cards */}
      {cards.map((card) => (
        <Card key={card.id} className="relative group">
          <CardContent className="p-4">
            {card.image ? (
              <EditableImage
                src={card.image}
                alt={`Gallery ${card.id}`}
                className="w-full h-64 object-cover rounded-md"
                onReplace={async (file) => {
                  await onUploadImage(card.id, file);
                }}
                onDelete={async () => {
                  await onDeleteImage(card.id);
                }}
              />
            ) : (
              <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={() => setUploadingCardId(card.id)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            )}

            {/* Delete Card Button */}
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDeleteCard(card.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Add New Card Button */}
      <Card
        className="border-2 border-dashed cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        onClick={onAddCard}
      >
        <CardContent className="p-4 h-full min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Add New Card</p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadingCardId !== null}
        onOpenChange={(open) => !open && setUploadingCardId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Upload an image for this gallery card
            </DialogDescription>
          </DialogHeader>
          <ImageUploader
            maxFiles={1}
            onUpload={async (files) => {
              if (uploadingCardId !== null && files[0]) {
                await onUploadImage(uploadingCardId, files[0]);
                setUploadingCardId(null);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
