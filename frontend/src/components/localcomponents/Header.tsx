import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import styles from "./Header.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Classname must be at least 1 characters.",
    })
    .max(50, {
      message: "Classname must be at most 50 characters.",
    }),
  Type_of_tone: z
    .string()
    .min(1, {
      message: "Subject must be at least 1 characters.",
    })
    .max(50, {
      message: "Subject must be at most 50 characters.",
    }),
  Startingline: z
    .string()
    .min(1, {
      message: "Section must be at least 1 characters.",
    })
    .max(500, {
      message: "Section must be at most 500 characters.",
    }),
});

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { getAccessTokenSilently, user } = useAuth0();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      Type_of_tone: "",
      Startingline: "",
    },
  });
  async function Createform(values: z.infer<typeof formSchema>) {
    console.log(values);

    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: "apple",
        scope: "openid profile email",
      },
    });

    const response = await fetch("/api/story/createstory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ values, user }),
    });
    console.log(await response.json());

    setOpen(false);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div>NarrativeNet</div>
        </div>
        <div className={styles.profile}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <div className={styles.creatbtn}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div className={styles.btnfnt}> Create story</div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a Story</DialogTitle>
                <DialogDescription>
                  Provide inital details to start a story
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(Createform)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: The kings stone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Type_of_tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of tone</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: funney" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Startingline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inital line</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: One fine day a king lived"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Avatar>
            <AvatarImage
              src={
                user?.picture
                  ? user.picture
                  : "https://ui.shadcn.com/avatars/04.png"
              }
              alt="profile"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
};

export default Header;
