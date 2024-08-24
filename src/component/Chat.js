import styles from "./Chat.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [searchResult, setSearchResult] = useState([]);
  const [chatBubble, setChatBubble] = useState([]);
  const containerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 가져온 검색 결과 설정
    setSearchResult(location.state.result || []);
  }, [location.state.result]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatBubble]);

  const selectBus = async (index, item) => {
    setChatBubble((prev) => [
      ...prev,
      { user: true, content: `${index + 1}번째 버스를 선택합니다.` },
    ]);

    setTimeout(() => {
      setChatBubble((prev) => [
        ...prev,
        {
          user: false,
          content: "결제정보를 요청합니다. 카드를 삽입해 주십시오.",
        },
      ]);
    }, 400);

    setTimeout(async () => {
      setChatBubble((prev) => [...prev, { user: false, isLoading: true }]);

      const imgurl = await purchase(index, item);
      if (imgurl) {
        setTimeout(() => {
          navigate("/ticket", { state: { url: imgurl } });
        }, 1000);
      }
    }, 800);
  };

  const purchase = async (index, purchaseData) => {
    // 서버로 index 날림.
    const requestData = {
      id: index,
      // purchaseData: purchaseData,
    };

    try {
      const response = await fetch("/api/bus/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      // 이미지 URL 반환
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error sending id:", error);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.firstBalloon}>
        <div>{searchResult.length}개의 버스가 있습니다.</div>
      </div>
      {searchResult.map((item, index) => (
        <div
          key={index}
          className={styles.firstBalloon}
          style={{ animationDelay: `${(index + 1) * 0.2}s` }}
        >
          <div>
            출발 : {item.departTime} ~ 도착 : {item.arrivalTime}
          </div>
          <div>{item.price}원</div>

          <button
            className={`${styles.btn} ${chatBubble[0] ? styles.disappear : ""}`}
            onClick={() => {
              selectBus(index, item);
            }}
          >
            선택
          </button>
        </div>
      ))}
      {chatBubble.map((item, index) => (
        <div
          key={index}
          className={item.user ? styles.secondBalloon : styles.firstBalloon}
        >
          {item.isLoading ? (
            <div className={styles.loader}></div>
          ) : (
            item.content
          )}
        </div>
      ))}
    </div>
  );
}
