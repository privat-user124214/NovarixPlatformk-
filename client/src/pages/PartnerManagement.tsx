import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Globe, Mail, Image, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPartnerSchema, updatePartnerSchema, type Partner, type InsertPartner, type UpdatePartner } from "@shared/schema";

export default function PartnerManagement() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partners, isLoading, error } = useQuery<Partner[]>({
    queryKey: ["/api/admin/partners"],
  });

  const addPartnerMutation = useMutation({
    mutationFn: (data: InsertPartner) => apiRequest("POST", "/api/admin/partners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Partner hinzugefügt",
        description: "Der Partner wurde erfolgreich hinzugefügt.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Hinzufügen des Partners.",
        variant: "destructive",
      });
    },
  });

  const updatePartnerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePartner }) =>
      apiRequest("PATCH", `/api/admin/partners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      setIsEditDialogOpen(false);
      setSelectedPartner(null);
      toast({
        title: "Partner aktualisiert",
        description: "Die Partnerinformationen wurden erfolgreich aktualisiert.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Aktualisieren des Partners.",
        variant: "destructive",
      });
    },
  });

  const deletePartnerMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/partners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/partners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({
        title: "Partner gelöscht",
        description: "Der Partner wurde erfolgreich gelöscht.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Löschen des Partners.",
        variant: "destructive",
      });
    },
  });

  const addForm = useForm<InsertPartner>({
    resolver: zodResolver(insertPartnerSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo: "",
      contactEmail: "",
      isActive: true,
      isVerified: false,
    },
  });

  const editForm = useForm<UpdatePartner>({
    resolver: zodResolver(updatePartnerSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      logo: "",
      contactEmail: "",
      isActive: true,
      isVerified: false,
    },
  });

  const onAddSubmit = (data: InsertPartner) => {
    const cleanData = {
      ...data,
      website: data.website || undefined,
      contactEmail: data.contactEmail || undefined,
      description: data.description || undefined,
      logo: data.logo || undefined,
    };
    addPartnerMutation.mutate(cleanData);
  };

  const onEditSubmit = (data: UpdatePartner) => {
    if (!selectedPartner) return;
    const cleanData = {
      ...data,
      website: data.website || undefined,
      contactEmail: data.contactEmail || undefined,
      description: data.description || undefined,
      logo: data.logo || undefined,
    };
    updatePartnerMutation.mutate({ id: selectedPartner.id, data: cleanData });
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    editForm.reset({
      name: partner.name,
      description: partner.description || "",
      website: partner.website || "",
      logo: partner.logo || "",
      contactEmail: partner.contactEmail || "",
      isActive: partner.isActive,
      isVerified: partner.isVerified || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deletePartnerMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Partner-Verwaltung</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-novarix-secondary border-novarix animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-novarix-tertiary rounded mb-4"></div>
                <div className="h-4 bg-novarix-tertiary rounded mb-2"></div>
                <div className="h-4 bg-novarix-tertiary rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Partner-Verwaltung</h1>
        <p className="text-red-400">Fehler beim Laden der Partner</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Partner-Verwaltung</h1>
          <p className="text-novarix-text mt-1">
            Verwalten Sie alle Partner und deren Informationen
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-novarix-accent hover:bg-novarix-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Partner hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-novarix-secondary border-novarix">
            <DialogHeader>
              <DialogTitle className="text-white">Neuen Partner hinzufügen</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-novarix-tertiary border-novarix text-white"
                          placeholder="Partnername"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Beschreibung</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="bg-novarix-tertiary border-novarix text-white"
                          placeholder="Beschreibung des Partners..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-novarix-tertiary border-novarix text-white"
                          placeholder="https://example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-novarix-tertiary border-novarix text-white"
                          placeholder="https://example.com/logo.png"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Kontakt E-Mail</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-novarix-tertiary border-novarix text-white"
                          placeholder="contact@partner.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-white">Aktiv</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="isVerified"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-white">Verifiziert</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-novarix text-white hover:bg-novarix-tertiary"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    disabled={addPartnerMutation.isPending}
                    className="bg-novarix-accent hover:bg-novarix-accent/90"
                  >
                    {addPartnerMutation.isPending ? "Wird hinzugefügt..." : "Hinzufügen"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Partners List */}
      {!partners || partners.length === 0 ? (
        <Card className="bg-novarix-secondary border-novarix">
          <CardContent className="p-8 text-center">
            <p className="text-novarix-text">Noch keine Partner vorhanden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card key={partner.id} className="bg-novarix-secondary border-novarix">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{partner.name}</CardTitle>
                    <Badge 
                      variant={partner.isActive ? "secondary" : "outline"}
                      className={partner.isActive ? 
                        "bg-green-500/20 text-green-400 border-green-500/30" : 
                        "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {partner.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>
                  {partner.logo && (
                    <div className="ml-4 flex-shrink-0">
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} Logo`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {partner.description && (
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {partner.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  {partner.website && (
                    <div className="flex items-center text-sm text-novarix-muted">
                      <Globe className="h-4 w-4 mr-2" />
                      <span className="truncate">{partner.website}</span>
                    </div>
                  )}
                  {partner.contactEmail && (
                    <div className="flex items-center text-sm text-novarix-muted">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate">{partner.contactEmail}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(partner)}
                    className="border-novarix-accent text-novarix-accent hover:bg-novarix-accent hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-novarix-secondary border-novarix">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Partner löschen
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-novarix-text">
                          Sind Sie sicher, dass Sie "{partner.name}" löschen möchten? 
                          Diese Aktion kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-novarix text-white hover:bg-novarix-tertiary">
                          Abbrechen
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(partner.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-novarix-secondary border-novarix">
          <DialogHeader>
            <DialogTitle className="text-white">Partner bearbeiten</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-novarix-tertiary border-novarix text-white"
                        placeholder="Partnername"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Beschreibung</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-novarix-tertiary border-novarix text-white"
                        placeholder="Beschreibung des Partners..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Website</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-novarix-tertiary border-novarix text-white"
                        placeholder="https://example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-novarix-tertiary border-novarix text-white"
                        placeholder="https://example.com/logo.png"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Kontakt E-Mail</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-novarix-tertiary border-novarix text-white"
                        placeholder="contact@partner.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-white">Aktiv</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-white">Verifiziert</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-novarix text-white hover:bg-novarix-tertiary"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  disabled={updatePartnerMutation.isPending}
                  className="bg-novarix-accent hover:bg-novarix-accent/90"
                >
                  {updatePartnerMutation.isPending ? "Wird gespeichert..." : "Speichern"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}