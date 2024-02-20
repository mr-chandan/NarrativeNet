import styles from "../localcomponents/Create.module.css";
import { formatDistanceToNow } from "date-fns";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <div className={styles.create}>
        <div className={styles.name}>Created Stories</div>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && (
        <div>
          {isAuthenticated ? (
            <div className={styles.grid}>
              {userstory.length === 0 ? (
                <div className={styles.logindiv}>Create your first story!</div>
              ) : (
                userstory.map((story, index) => (
                  <Link to={`/viewer/${story.id}`} key={index}>
                    <div className={styles.card}>
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
                ))
              )}
            </div>
          ) : (
            <div className={styles.logindiv}>
              <Button
                onClick={() => loginWithRedirect()}
                className={styles.login}
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Create;
