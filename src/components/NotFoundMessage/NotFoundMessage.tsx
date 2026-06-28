import css from "./NotFoundMessage.module.css";

function NotFoundMessage() {
  return <p className={css.text}>No movies found for your request.</p>;
}
export default NotFoundMessage;
