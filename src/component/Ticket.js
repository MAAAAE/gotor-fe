import { useLocation } from "react-router-dom";

export default function Ticket() {
  const location = useLocation();

  const ticketImg = location.state?.url;

  return (
    <div>
      <div>티켓페이지</div>
      {ticketImg && (
        <img
          src={ticketImg}
          alt="티켓 이미지"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
    </div>
  );
}
