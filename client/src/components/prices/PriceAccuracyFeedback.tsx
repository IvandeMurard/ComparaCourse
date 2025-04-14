import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Price } from '@shared/schema';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PriceAccuracyFeedbackProps {
  price: Price;
  productName: string;
  storeName: string;
}

const formSchema = z.object({
  isAccurate: z.boolean(),
  actualPrice: z.number().min(0).optional().nullable(),
  comment: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PriceAccuracyFeedback({ price, productName, storeName }: PriceAccuracyFeedbackProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAccurate: true,
      actualPrice: null,
      comment: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      // Dans une implémentation réelle, nous appellerions l'API
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prices'] });
      toast({
        title: 'Merci pour votre retour !',
        description: 'Votre évaluation nous aide à améliorer la précision des prix.',
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Une erreur est survenue',
        description: 'Impossible d'enregistrer votre évaluation. Veuillez réessayer.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate({
      ...values,
      actualPrice: values.isAccurate ? null : values.actualPrice,
    });
  };

  const isAccurate = form.watch('isAccurate');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          Signaler un prix
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Évaluer la précision du prix</DialogTitle>
          <DialogDescription>
            {productName} chez {storeName} est affiché à {price.price.toFixed(2)} €. Ce prix est-il correct ?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isAccurate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0">
                    <FormLabel>Le prix est-il correct ?</FormLabel>
                  </div>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {field.value ? 
                        <ThumbsUp className="h-4 w-4 text-green-500" /> : 
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                      }
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {!isAccurate && (
              <FormField
                control={form.control}
                name="actualPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix réel (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Ajoutez des détails supplémentaires ici..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Envoi en cours...' : 'Envoyer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}