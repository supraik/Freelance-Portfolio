import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';

export default function AdminGalleries() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Manage Galleries</h1>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Gallery
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Gallery management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
