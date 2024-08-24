import styles from "./Chat.module.css"; // CSS 모듈을 가져옵니다.
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Chat() {
  const [searchResult, setSearchResult] = useState([]);
  const [selectFinished, setSelectFinished] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const location = useLocation();

  useEffect(() => {
    // 가져온 검색 결과 설정
    setSearchResult(location.state.result || []);
  }, [location.state.result]);

  const selectBus = (index, item) => {
    const sumItem = { ...item, index: index };
    // 서버로 index 날림.
    setSelectItem(sumItem);
    setSelectFinished(true);
  };

  return (
    <div className={styles.container}>
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
            className={`${styles.btn} ${
              selectFinished ? styles.disappear : ""
            }`}
            onClick={() => {
              selectBus(index, item);
            }}
          >
            선택
          </button>
        </div>
      ))}
      {selectFinished ? (
        <div className={styles.secondBalloon}>
          <div>{selectItem.index + 1}번째 버스 선택</div>
        </div>
      ) : (
        <span></span>
      )}

      {selectFinished ? (
        <div className={styles.firstBalloon} style={{ animationDelay: "0.2s" }}>
          <div>결제정보를 요청합니다.</div>
        </div>
      ) : (
        <span></span>
      )}
    </div>
  );
}
