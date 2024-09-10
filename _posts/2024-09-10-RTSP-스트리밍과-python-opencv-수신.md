---
categories:
  - python
  - vision
tags:
  - rtsp
mermaid: true
image:
---
> 로컬에서 mp4 파일을 RTSP로 스트리밍하고 같은 네트워크 내에서 rtsp 수신하고 싶었다.
---

### RTSP 스트리밍 송신
### rtsp-simple-server로 스트리밍 환경 구축
- 다운로드
	- git released zip file [link](https://github.com/aler9/rtsp-simple-server/releases/download/v0.21.0/rtsp-simple-server_v0.21.0_linux_amd64.tar.gz)
- 압축 풀기
	```bash  
	tar -xvzf rtsp-simple-server_v0.21.0_linux_amd64.tar.gz  
	```
 
- 실행 파일 권한 설정 및 실행
   ```bash  
   chmod +x rtsp-simple-server  
   ./rtsp-simple-server  
   ```

-> rtsp로 스트리밍할 준비가 되었다.

#### ffmpeg로 스트리밍 시작
- 다운로드
	- apt-get install ffmpeg
- 실행
	```bash  
	ffmpeg -stream_loop -1 -re -i test_video.mp4 -c copy -f rtsp [rtsp://localhost:8554/mystream](rtsp://localhost:8554/mystream)  
	```

	- 무한히 반복(`-stream_loop -1`)하고, 입력 파일을 실시간 재생 (`-re`)하며, RTSP 프로토콜을 통해 비디오 스트리밍을 수행한다.

### RTSP 스트리밍 수신
- python opencv를 통해 rtsp를 수신하고자 한다.
	- VLC를 이용한 스트리밍은 cv2.VideoCapture에서 에러가 발생한다.(원인 미상)
		- 참고자료
			- https://post.naver.com/viewer/postView.nhn?volumeNo=29553682&memberNo=2534901
			- https://www.clien.net/service/board/kin/15958011
			- 나 또한 안됐다
```python3
import cv2

source = "rtsp://192.168.133.23:8554/mystream"
capture = cv2.VideoCapture(source)
status, frame = capture.read()

status
# True
```

---
+vlc로 안돼서 삽질하다 ffmpeg를 통해 해결