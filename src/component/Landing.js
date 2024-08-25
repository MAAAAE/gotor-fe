import styles from "./Landing.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [isCenter, setIsCenter] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [focus, setFocus] = useState(false);
  const [initLoad, setInitLoad] = useState(true);

  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const stopRecording = () => {
    chunks.current = []; // 청크 리셋
    setIsRecording(false);
  };

  const handleClick = async () => {
    setInitLoad(false);
    if (isRecording) {
      // 녹음 중이면 녹음 중지
      setFocus(true);
      await mediaRecorderRef.current.stop();
      stopRecording();
    } else {
      // 녹음 중이 아니면 녹음 시작
      setIsRecording(true);
      setIsCenter(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("voice", blob, "recording.wav");

        try {
          const response = await fetch("/api/bus/available", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          const result = await response.json();
          chunks.current = []; // 다음 기록을 위한 청크 리셋
          setTimeout(() => {
            navigate("/chat", { state: { result: result } });
          }, 750);
        } catch (error) {
          console.error("Error uploading audio:", error);
        }
      };

      mediaRecorder.start();
    }
  };

  const cancleRec = () => {
    if (isRecording) {
      stopRecording();
      setIsCenter(false);
    }
  };

  return (
    <div className={styles.baseContainer}>
      <div className={styles.container}>
        <div className={styles.title}>
          <span className={styles.hightlight}>고</span>속 
          <span className={styles.hightlight}>터</span>미널
          <br /> 버스 매표소
        </div>
        <div className={styles.title}>
          마이크 사용을 <br /> 허가해주세요
        </div>
      </div>
      <div
        className={`${styles.enter} ${
          initLoad ? "" : isCenter ? styles.centered : styles.down
        } ${focus ? styles.focus : ""}`}
        onClick={handleClick}
      >
        {focus ? (
          <div className={styles.noFocus}>
            <div>버스 찾는 중</div>
          </div>
        ) : (
          <div>
            {isRecording ? (
              <div className={`${styles.notification} ${styles.show}`}>
                출발지, 목적지, 날짜, 갯수
              </div>
            ) : (
              <div className={styles.notification}></div>
            )}
            <div className={styles.title}>
              {isCenter ? "다 말하면 누르기" : "버스 찾기"}
            </div>
          </div>
        )}
      </div>
      {isRecording ? (
        <div
          className={`${styles.notification} ${styles.show} ${styles.background}`}
        >
          <div>다시 말하기</div>
        </div>
      ) : (
        <div className={styles.notification}></div>
      )}
      {isRecording ? (
        <div
          className={styles.blankArea}
          onClick={() => {
            cancleRec();
          }}
        ></div>
      ) : (
        <span></span>
      )}
    </div>
  );
}
