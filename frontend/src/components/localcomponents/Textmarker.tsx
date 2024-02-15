import styles from "./Textmarker.module.css";

interface SnippetProps {
  text: string;
  clr: string;
}

const Textmarker: React.FC<SnippetProps> = ({ text, clr }) => {
  return (
      <span className={styles[clr]}>{text}</span>
  );
};

export default Textmarker;
