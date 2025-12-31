---
categories:
  - etc
tags:
  - 
mermaid: true
image: assets/img/251231_remote_container.png
---
> 원격 장비에서 구동하는 Docker 컨테이너를 로컬 vscode에서 붙어 디버깅할 수 있다.
---

## 불편하게 사용하는 예시
- local terminal에서 ssh로 remote에 접근해 디버깅하는 방식 
	- `docker build image:latest`
	- `docker run -v ./:/app -it image:latest /bin/bash`(접속)
		- 로컬에서 수행한 작업을 마운트 해놓은 원격 디렉토리에 파일을 옮겨(전송) 작업
		- 혹은 remote-ssh로 직접 원격에 붙어 작업

## 원격 container에 local VSCode를 붙이는(attach) 방법
- 준비사항
	- vscode extension 설치
		- remote-ssh
			- ![](https://i.imgur.com/ygw4Wse.png)

		- Dev Containers
			- ![](https://i.imgur.com/TcxOrJz.png)

- Dev Containers를 설치하고 좌측 탭에서 Dev Containers를 선택하면 로컬의 컨테이너들을 확인할 수 있다.
	- 나의 경우, docker desktop에 표시되듯 producer:latest가 running중이고 이 컨테이너에 붙을 수 있음이 표시된다.
	- ![](https://i.imgur.com/OXNfjKW.png)

- 원격에서 이렇게 붙으려면 remote-ssh와 dev containers를 함께 사용하면 된다.
- 테스트를 위해 원격 ec2에 python이 설치된 이미지로 컨테이너를 띄워두었다.
	- ![](https://i.imgur.com/QUTh3rK.png)

- VSCode 좌상단 탭에서 remote-ssh로 변경하고 나의 EC2 인스턴스를 `auto-trade-ec2` 로 원격 연결한다.
	- ![](https://i.imgur.com/CFQspN4.png)
	- ![](https://i.imgur.com/f6Vr11N.png)

	 - 물론 그 전에 remote-ssh config에 설정해 두어야 한다.

- vscode 현재 창으로 원격 인스턴스에 접속하고 이렇게 원격에 접속한 상태에서 Dev Containers를 사용한다.
	- 아까 터미널에서 실행시킨 python 컨테이너(`naughty_diffie`)가 보인다!
	- ![](https://i.imgur.com/hv3DgjD.png)

	- 화살표 버튼을 눌러 컨테이너에 직접 붙는다.
		- 내 로컬 vscode의 환경이 remote container와 동기화되었다.
		- 이제 왼쪽 탭에서 디버그 모양을 누르고 두 가지 python & python debugger를 다운받는다.
		- ![](https://i.imgur.com/qgo4OVP.png)

- 터미널, 파일, 디버그 환경 모두 로컬에 있지만 remote container와 동기화된 상태이므로 자유롭게 디버그한다.

---


