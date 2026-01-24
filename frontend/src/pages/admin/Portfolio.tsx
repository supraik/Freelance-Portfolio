import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function AdminPortfolio() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Portfolio Sections</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Portfolio section editor coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
