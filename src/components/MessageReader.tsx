
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Mail, MailOpen, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MessageReader = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.isAdmin,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          status: 'read',
          read_by: user?.id,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: "Message marked as read",
        description: "The message status has been updated.",
      });
    },
  });

  const filteredMessages = messages.filter(message => {
    if (statusFilter === 'all') return true;
    return message.status === statusFilter;
  });

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markAsReadMutation.mutate(message.id);
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Messages ({messages.filter(m => m.status === 'unread').length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:w-[800px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>Contact Messages</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
            {/* Messages List */}
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {isLoading ? (
                  <div>Loading messages...</div>
                ) : filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <Card 
                      key={message.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-muted' : ''
                      } ${message.status === 'unread' ? 'border-primary' : ''}`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {message.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            {message.status === 'unread' ? (
                              <Mail className="h-4 w-4 text-primary" />
                            ) : (
                              <MailOpen className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Badge variant={message.status === 'unread' ? 'default' : 'secondary'}>
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{message.email}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm line-clamp-2">{message.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No messages found
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Detail */}
            <div className="border rounded-lg p-4">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedMessage.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {selectedMessage.status === 'unread' && (
                    <Button 
                      onClick={() => markAsReadMutation.mutate(selectedMessage.id)}
                      disabled={markAsReadMutation.isPending}
                      size="sm"
                    >
                      Mark as Read
                    </Button>
                  )}

                  {selectedMessage.read_at && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Read on {new Date(selectedMessage.read_at).toLocaleString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
