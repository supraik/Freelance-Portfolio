// frontend/src/pages/admin/Contacts.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { contactAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Contacts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin_123');
      return;
    }
    fetchContacts();
  }, [isAuthenticated, navigate]);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data.contacts || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await contactAPI.markAsRead(id);
      setContacts(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'read' } : c)
      );
      toast({
        title: "Success",
        description: "Contact marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Contact Messages</h1>
              <p className="text-sm text-muted-foreground">
                {contacts.length} total messages
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : contacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No contact messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {contact.name}
                        {contact.status === 'pending' && (
                          <Badge variant="default">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {contact.subject}
                      </CardDescription>
                    </div>
                    {contact.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(contact.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Contacts;
