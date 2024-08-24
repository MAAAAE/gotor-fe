import styles from "./Ticket.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketImg = location.state?.url;

  const handleDownloadClick = () => {
    // 다운로드를 위한 임시 링크 생성
    const link = document.createElement("a");
    link.href = ticketImg;
    link.download = "ticket.png";
    link.style.display = "none"; // 링크를 화면에서 보이지 않도록 설정
    document.body.appendChild(link);
    link.click(); // 링크 클릭 트리거
    document.body.removeChild(link); // 링크 제거

    // 페이지 이동
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>구매 완료</div>
      <div className={styles.egg} onClick={handleDownloadClick}>
        <div className={styles.title}>눌러서 저장</div>
      </div>

      {ticketImg && (
        <>
          <img
            className={styles.img}
            src={ticketImg}
            alt="티켓 이미지"
            style={{ maxWidth: "100%", height: "auto", marginTop: "20vh" }}
          />
        </>
      )}
      <div className={styles.title}>좋은 여행 되세요!</div>
    </div>
  );
}
