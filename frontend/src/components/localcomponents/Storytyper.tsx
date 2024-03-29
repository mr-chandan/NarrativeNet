"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "../ui/use-toast";
import { useState } from "react";

const FormSchema = z.object({
  bio: z
    .string()
    .min(25, {
      message: "contrubtion must be at least 25 characters.",
    })
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    }),
});

interface StorytyperProps {
  tone: string | undefined;
  refetch: () => void;
}

const Storytyper: React.FC<StorytyperProps> = ({ tone, refetch }) => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { storyid } = useParams();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bio: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (!isSubmitting && user) {
        // Check submission status
        setIsSubmitting(true); // Set submitting to true
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "apple",
            scope: "openid profile email",
          },
        });

        const response = await fetch("/api/story/putcontrubtion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user, data, storyid }),
        });
        const message = await response.json();
        console.log(message);
        toast({
          title: "Story sent",
          description: "Your story has been successfully submitted.",
        });
        setIsSubmitting(false); // Reset submitting status
      }
      form.reset();
      refetch();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Continue the story With the user specified tone
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write the next part of the story..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Tone specfied is {tone}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default Storytyper;
