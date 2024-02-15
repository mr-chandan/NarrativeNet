import { useEffect, useState } from "react";
import { Storytyper } from "../ui/Storytyper";
import Textmarker from "./Textmarker";
import styles from "./viewedit.module.css";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface Story {
  story_id: number;
  title: string;
  author_name: string;
  author_id: string;
  starting_line: string;
  type_of_tone: string;
  published_date: number;
}

interface Contribution {
  contributionid: number;
  story_id: number;
  contributing_user_id: string;
  contributing_user_name: string;
  content: string;
  contributiondate: number;
  upvotes: number;
  downvotes: number;
}

const Viewedit = () => {
  const { storyid } = useParams();

  const [storydata, setStorydata] = useState<Story | null>(null);
  const [votecount, setVoteCount] = useState<{
    trueVotes: number;
    falseVotes: number;
  }>({
    trueVotes: 0,
    falseVotes: 0,
  });

  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [story, setStory] = useState<Contribution[]>([]);
  const [selectedContribution, setSelectedContribution] =
    useState<Contribution | null>(null);
  useEffect(() => {
    const fetchStory = async () => {
      try {
        fetch("/api/getstory/getuserstorybyid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storyid }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to fetch story: " + response.status);
            }
          })
          .then((data) => {
            setStorydata(data.story);
            console.log(data);
            setStory(data.contributions);
            console.log(data.contributions);

            ///
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchStory();

    return () => {};
  }, []);

  async function vote(vote: number) {
    if (selectedContribution) {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "apple",
          scope: "openid profile email",
        },
      });

      const response = await fetch("/api/story/putvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedContribution, user, vote }),
      });
      const resdata = await response.json();
      console.log(resdata);
    } else {
      console.log("select first");
    }
  }
  const handleHideDownvoted = () => {
    setHideDownvoted(!hideDownvoted);
  };

  const handleContributionClick = (contribution: Contribution) => {
    setSelectedContribution(contribution);

    fetch("/api/getstory/getvote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contributionId: contribution.contributionid }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch votes: " + response.status);
        }
      })
      .then((data) => {
        console.log(data);
        setVoteCount(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const colors: string[] = ["pink", "green", "blue", "orange", "yellow"];

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledColors: string[] = shuffleArray(colors);

  const [showColors, setShowColors] = useState(true);
  const [hideDownvoted, setHideDownvoted] = useState(false);
  // Function to toggle the display of colors
  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const filteredContributions = hideDownvoted
    ? story.filter((contribution) => contribution.downvotes <= 5)
    : story;

  return (
    <div className={styles.container}>
      <div className={styles.create}>
        <div className={styles.name}>Story Bord</div>
      </div>
      <div className={styles.grid}>
        <div className={styles.grid1}>
          <div className={styles.bordname}>
            <div className={styles.sname}>{storydata?.title}</div>
            <div className={styles.aname}>{storydata?.author_name}</div>
          </div>
          <Separator />
          <div className={styles.main}>
            <span>{storydata?.starting_line} </span>
            {filteredContributions?.map((text, index) => (
              <div onClick={() => handleContributionClick(text)} key={index}>
                <Textmarker
                  text={text.content}
                  clr={
                    showColors
                      ? shuffledColors[index % shuffledColors.length]
                      : ""
                  }
                />
              </div>
            ))}
          </div>
          <div className={styles.switch}>
            <Switch checked={showColors} onCheckedChange={toggleColors} />
            Show Colors
          </div>
          <div className={styles.switch}>
            <Switch
              checked={hideDownvoted}
              onCheckedChange={handleHideDownvoted}
            />
            {hideDownvoted
              ? "Show All Contributions"
              : "Hide Downvoted Contributions"}
          </div>
          <Separator />
          <div className={styles.inpbar}>
            {!isAuthenticated && <div>Login to type a story</div>}
            {isAuthenticated && user?.sub === storydata?.author_id && (
              <div>You are the author and cannot submit a story</div>
            )}
            {isAuthenticated && user?.sub !== storydata?.author_id && (
              <>
                {story.some(
                  (contribution) =>
                    contribution.contributing_user_id === user?.sub
                ) ? (
                  <div>You have already submitted a contribution</div>
                ) : (
                  <Storytyper />
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.grid2}>
          <div className={styles.contibutename}>
            <div className={styles.cname}>
              {selectedContribution?.contributing_user_name}
            </div>
            <div className={styles.cdate}>
              {selectedContribution?.contributiondate}
            </div>
          </div>
          <div className={styles.ctext}>{selectedContribution?.content}</div>
          <div className={styles.votediv}>
            <div
              className={styles.vote}
              onClick={() => {
                vote(1);
              }}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 1C7.66148 1 7.81301 1.07798 7.90687 1.20938L12.9069 8.20938C13.0157 8.36179 13.0303 8.56226 12.9446 8.72879C12.8589 8.89533 12.6873 9 12.5 9H10V11.5C10 11.7761 9.77614 12 9.5 12H5.5C5.22386 12 5 11.7761 5 11.5V9H2.5C2.31271 9 2.14112 8.89533 2.05542 8.72879C1.96972 8.56226 1.98427 8.36179 2.09314 8.20938L7.09314 1.20938C7.18699 1.07798 7.33853 1 7.5 1ZM3.4716 8H5.5C5.77614 8 6 8.22386 6 8.5V11H9V8.5C9 8.22386 9.22386 8 9.5 8H11.5284L7.5 2.36023L3.4716 8Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>{" "}
              {votecount.trueVotes}&nbsp;upvotes
            </div>
            <div
              className={styles.vote}
              onClick={() => {
                vote(0);
              }}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3.5C5 3.22386 5.22386 3 5.5 3H9.5C9.77614 3 10 3.22386 10 3.5V6H12.5C12.6873 6 12.8589 6.10467 12.9446 6.27121C13.0303 6.43774 13.0157 6.63821 12.9069 6.79062L7.90687 13.7906C7.81301 13.922 7.66148 14 7.5 14C7.33853 14 7.18699 13.922 7.09314 13.7906L2.09314 6.79062C1.98427 6.63821 1.96972 6.43774 2.05542 6.27121C2.14112 6.10467 2.31271 6 2.5 6H5V3.5ZM6 4V6.5C6 6.77614 5.77614 7 5.5 7H3.4716L7.5 12.6398L11.5284 7H9.5C9.22386 7 9 6.77614 9 6.5V4H6Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>{" "}
              {votecount.falseVotes}&nbsp;downvotes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewedit;
