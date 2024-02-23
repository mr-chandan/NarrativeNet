import styles from "../localcomponents/Create.module.css";
import { formatDistanceToNow } from "date-fns";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
// import { Input } from "../ui/input";

interface Story {
  id: number;
  title: string;
  author: string;
  type_of_tone: string;
  published_date: string;
  starting_line: string;
  author_name: string;
}

const Create: React.FC = () => {
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    // logout,
    user,
  } = useAuth0();
  const [trendingstory, settrendingstory] = useState<Story[]>([]);
  const [userstory, setuserstory] = useState<Story[]>([]);
  const [trendloading, setIstrendloading] = useState(true);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        Protocal();
      } catch (e) {
        console.log("error in signup");
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getstory/gettrendstories");
        const data = await response.json();
        settrendingstory(data);
        setIstrendloading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  async function Protocal() {
    try {
      if (user) {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "apple",
            scope: "openid profile email",
          },
        });

        await fetch("/api/user/setuserdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then(async () => {
            await fetch("/api/getstory/getuserstory", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ authorId: user.sub }),
            })
              .then((response) => response.json())
              .then((dataofuser) => {
                setuserstory(dataofuser);
                console.log(dataofuser);
              });
          });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.create}>
        <div className={styles.name}>Discover trending stories</div>
      </div>

      {trendloading && trendingstory.length === 0 ? (
        <div className={styles.grid}>
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
        </div>
      ) : (
        // Show actual trending stories
        <div className={styles.grid}>
          {trendingstory.map((story, index) => (
            <Link to={`/viewer/${story.id}`} key={index}>
              <div className={styles.card} key={index}>
                <div className={styles.storyname}>
                  <div className={styles.cardname}>
                    {story.title.length > 15
                      ? `${story.title.substring(0, 12)}...`
                      : story.title}
                  </div>
                  <div>
                    {formatDistanceToNow(new Date(story.published_date), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className={styles.author}>{story.author_name}</div>
                <div className={styles.bio}>
                  {story.starting_line.length > 70
                    ? `${story.starting_line.substring(0, 70)}...`
                    : story.starting_line}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className={styles.create}>
        <div className={styles.name}>Created Stories</div>
      </div>

      {isLoading && (
        <div className={styles.grid}>
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
          <Skeleton className="h-[8rem] w-full" />
        </div>
      )}

      {!isLoading && (
        <div>
          {isAuthenticated ? (
            <div>
              {userstory.length === 0 ? (
                <div className="flex flex-col items-center space-y-4 text-center mt-10">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl lg:text-4xl/none">
                     No stories Created 
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Craft beautiful narratives storytelling now.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.grid}>
                  {userstory.map((story, index) => (
                    <Link to={`/viewer/${story.id}`} key={index}>
                      <div className={styles.card} key={index}>
                        <div className={styles.storyname}>
                          <div className={styles.cardname}>
                            {story.title.length > 15
                              ? `${story.title.substring(0, 12)}...`
                              : story.title}
                          </div>
                          <div>
                            {formatDistanceToNow(
                              new Date(story.published_date),
                              {
                                addSuffix: true,
                              }
                            )}
                          </div>
                        </div>
                        <div className={styles.author}>{story.author_name}</div>
                        <div className={styles.bio}>
                          {story.starting_line.length > 70
                            ? `${story.starting_line.substring(0, 70)}...`
                            : story.starting_line}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <section className="w-full py-8 md:py-8 lg:py-8 xl:py-8">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl lg:text-4xl/none">
                      The Art of Storytelling
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Craft beautiful narratives with our intuitive storytelling
                      platform. No code required. Just your creativity.
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <Button
                      type="submit"
                      className="flex w-full"
                      onClick={() => loginWithRedirect()}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Create;
