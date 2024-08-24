import styles from "./Ticket.module.css";
import { useLocation } from "react-router-dom";

export default function Ticket() {
  const location = useLocation();
  const ticketImg = location.state?.url;

  return (
    <div className={styles.container}>
      <div className={styles.title}>구매 완료</div>
      <div className={styles.title}>눌러서 저장</div>
      {ticketImg && (
        <a href={ticketImg} download="ticket.png" className={styles.imgWrapper}>
          <img
            className={styles.img}
            src={ticketImg}
            alt="티켓 이미지"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </a>
      )}
      <div className={styles.title}>좋은 여행 되세요!</div>
    </div>
  );
}
