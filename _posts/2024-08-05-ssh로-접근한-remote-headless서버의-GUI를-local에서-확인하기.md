---
categories:
  - server
tags:
  - remote-ssh
  - gui
  - x11
mermaid: true
image:
---
> cv2.imshow를 비롯한 그래픽 이미지 결과창을 보고싶다. 일반적으로 원격 서버는 모니터 장비 없이 구성된 단순 서버이다. 내 로컬 컴퓨터에서 원격으로 접속한 장비의 그래픽 인터랙션 결과를 받아볼 수는 없을까?
---

## 발단
remote ssh로 접근한 장비에서 

```python
cv2.imshow 
```

혹은

```python
YOLO("yolov8n.pt").track(input_img, show=True)
```

등의 명령어로 GUI를 요청해 내 컴퓨터에서 원격 서버의 출력을 보고 싶을 때가 있다.

보고 싶을 때가 있다기보다는 로컬에서 수행하면 수행 결과를 시각적으로 확인하는 것처럼 당연히 원격에서의 결과 또한 시각적으로 확인하고 싶다.

그렇지만 당연하게도 원격 서버는 대체로 headless라서 모니터가 연결돼있지 않아 해당 결과를 띄울 장치가 연결돼있지 않은 상태이다. 그러므로 원격 결과를 출력하는 프로세스를 로컬로 연결하거나 통신으로 받아와서 띄워야 할 것이다.

그 방법이 당연히 있을 것이라 생각했고 찾아본 뒤 포스트를 작성한다.

## 방법
기본적으로는 linux GUI 화면을 띄우기 위해서는 X11 forwarding이라는 걸 해야한다.

#### X11 포워딩이란?
- 원격 서버에서 실행되는 GUI 애플리케이션을 로컬 컴퓨터의 화면에 표시할 수 있게 해주는 기술로 X Window System(또는 X11)을 기반으로 하며, 특히 Unix 계열 운영체제(예: Linux)에서 자주 사용된다.
- X11은 client-server 방식으로 동작하며 클라이언트(애플리케이션)가 그래픽을 요청하면 X 서버가 이를 처리해 화면에 표시한다고 한다.
- 포워딩을 해야하는건 remote의 X11 애플리케이션의 그래픽 데이터를 ssh를 통해 로컬 컴퓨터로 전송해 결국 로컬 컴퓨터에서 이 데이터를 화면에 표시하게 하는 것이다.

나는 Mac os이고 m1에서 테스트해보았다. (윈도우와 우분투는 또 다르니 다른 곳을 참조하여라.)
- 윈도우: [link](https://blog.naver.com/chunsan89/221465317759)
- 우분투: [link](https://blog.naver.com/n_cloudplatform/221483526320)

### 1. XQuartz 다운로드
- macOS에서 X Window System을 가동하기 위한 XQuartz를 다운로드한다.
- https://www.xquartz.org/

### 2. 로그아웃 - 로그인
- XQuartz의 환경들과 세팅을 위해 로그아웃 후 재접속을 권장한다.

### 3. 실행
- 런치패드에서 XQuartz를 찾아 실행한다.
- 서버에 -X 옵션을 붙여 원격접속한다.
	- ssh -X user@host -p 22

### 4. 수행
- 원하는 GUI를 호출하는 부분을 수행한다.
- 예시
```python
import cv2
import numpy as np
  
# 0~1 범위의 float64 값을 가지는 랜덤 배열을 생성하고 0~255 범위의 uint8로 변환
img = np.random.randn(640, 640, 3) # 생성된 랜덤 값은 float64형이며 범위는 임의로 클 수 있음
img = ((img - img.min()) / (img.max() - img.min()) * 255).astype(np.uint8) # 0~255 범위로 스케일링 후 uint8로 변환

cv2.imshow('test_numpy_img', img)
cv2.waitKey(0)
```



로컬에서 별도의 XQuartz 창이 뜨면서 remote에서 수행한 GUI 요청 정보가 넘어온다.

---
+참고
https://blog.naver.com/asa4209/222219869485
