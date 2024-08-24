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

  function formatPrice(price) {
    let formattedPrice = "";
    let remainder = price;

    // 만 단위 처리
    if (remainder >= 10000) {
      const tenThousands = Math.floor(remainder / 10000);
      formattedPrice += tenThousands + "만 ";
      remainder %= 10000;
    }

    // 천 단위 처리
    if (remainder >= 1000) {
      const thousands = Math.floor(remainder / 1000);
      if (thousands > 1) {
        formattedPrice += thousands + "천 ";
      } else if (thousands === 1) {
        formattedPrice += "천 ";
      }
      remainder %= 1000;
    }

    // 백 단위 처리
    if (remainder >= 100) {
      const hundreds = Math.floor(remainder / 100);
      if (hundreds > 1) {
        formattedPrice += hundreds + "백 ";
      } else if (hundreds === 1) {
        formattedPrice += "백 ";
      }
      remainder %= 100;
    }

    // 10원 미만 처리
    if (remainder > 0) {
      formattedPrice += remainder;
    }

    // 마지막에 '원' 추가
    formattedPrice += "원";

    return formattedPrice;
  }

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
            {item.departTime.slice(0, 2)}시 {item.departTime.slice(2, 4)}분 출발
          </div>
          <div>
            {item.arrivalTime.slice(0, 2)}시 {item.arrivalTime.slice(2, 4)}분
            도착
          </div>
          <div>{formatPrice(item.price)}</div>

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
