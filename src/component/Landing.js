import "./Landing.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const handleClick = async () => {
    if (isRecording) {
      // 녹음 중이면 녹음 중지
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      navigate("/chat");
    } else {
      // 녹음 중이 아니면 녹음 시작
      setIsRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.wav");

        try {
          const response = await fetch(
            "https://your-server-endpoint.com/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }

          const result = await response.json();
          console.log("Server response:", result);
          // 서버 반응 로그

          chunks.current = []; // 다음 기록을 위한 청크 리셋
        } catch (error) {
          console.error("Error uploading audio:", error);
        }
      };

      mediaRecorder.start();
    }
  };

  return (
    <div className="baseContainer">
      <div className="container">
        <div className="title">버스 매표소</div>
      </div>
      <div
        className={`enter ${isRecording ? "centered" : ""}`}
        onClick={handleClick}
      >
        <div className="title">
          {isRecording ? "녹음 중입니다" : "버스 찾기"}
        </div>
      </div>
      {isRecording ? (
        <div className="notification show">
          출발지, 목적지, 날짜, 좌석을 말씀해주세요
        </div>
      ) : (
        <div className="notification"></div>
      )}
    </div>
  );
}
