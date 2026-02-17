---
categories:
  - ml
tags:
  - Clawdbot
  - OpenClaw
  - moltbot
mermaid: true
image: assets/img/250217_openclaw_docker.png
---
> ## OpenClaw가 낳는 여러 보안사고 등이 무섭다. Docker로 가둬놓고 쓰자
---

## 발단
- 링크드인이나 유튜브를 보면 OpenClaw의 위대함을 칭송하는 글이나 영상들이 쏟아져 나오는 한편 보안 위험으로 절대 사용하면 안된다는 부정적 인식 또한 공존한다.
- 안전하게 docker container로 가두고 volume mount해서 내 로컬 디렉토리에 OpenClaw의 집게발이 닿는 공간을 제한하자.

## 세팅
- 이미 readme에도 docker와 sandbox 세팅으로 보안을 챙기라는 가이드가 존재한다.
	- ![](https://i.imgur.com/BptkZ3d.png)

- Docker Compose를 활용한 설치는 다음과 같다. (공식 docs 참조 [link](https://docs.openclaw.ai/install/docker))

##### cli
```shell
# 공식 repo에서 clone
git clone https://github.com/openclaw/openclaw.git

# 레포 안에 미리 준비된 setup script 실행
bash ./docker-setup.sh

# 이후 환경변수(.env)와 script의 분기 그리고 docker-compose.yml이 실행되며 gateway와 cli가 실행되며 세팅 tui가 나타난다.
```

![](https://i.imgur.com/8vtQKzr.png)

## 구성
- `docker-setup.sh`  script를 실행하면 `.env`에 준비된 환경변수들로 `docker-compose.yml`가 실행되고 하나의 openclaw 도커 이미지에서 두 개의 서비스 (openclaw-gateway & openclaw-cli)를 실행한다.
### docker-setup.sh
![](https://i.imgur.com/UtBE8bR.png)

- `docker-compose.yml` 파일에 대한 경로를 잡고있다.
- OpenClaw의 설정과 에이전트들이 사용하는 경로를 잡고있다.
	- config는 `openclaw.json`의 위치로 이 파일이 webUI와 연동되며 agent, channel 등을 설정하는 데 사용하게 된다.
	- worspace dir는 차후 docker compose yml에서 openclaw docker 컨테이너에 마운트할 경로로 권한 제한을 위해 필요하다.

### .env
![](https://i.imgur.com/3KlxRu5.png)

- 위처럼 기본적인 경로들과 포트, gateway와 연결할 때 사용하는 토큰이 있다.
- 추가로 내가 설정한 `OBSIDIAN_PATH` 가 있는데 나는 내 개인 비서가 내가 작성한 obsidian 메모들을 활용해주길 바라므로 예외적으로 해당 부분만 제공하였다.
### docker-compose.yml
![](https://i.imgur.com/GuPs94I.png)

- 위에 `.env`에서 설정했던 경로들을 OpenClaw Gateway 컨테이너에 마운트해 사용한다.
	- 로컬에서 설정파일 openclaw.json 을 변경하면 openclaw-gateway에 hotload가 일어나 자동으로 업데이트된다.
	- 내가 별도로 제어 권한을 주고 싶은 디렉토리(`OBSIDIAN_PATH`)을 마운트해 openclaw가 대화하는 데 읽거나 쓸 수 있게 한다.

## 추가 세팅
- openclaw-cli에 network_mode를 추가해주어 cli가 gateway 서비스와 연동되게 하였다.
	- 이렇게 설정해야 openclaw-cli로 내 mac device에 있는 gateway 서비스를 인식할 수 있고 그래야 permission을 허용해 줄 수 있다.

#### 명령어 사용
- docker compose로 openclaw를 설치했으므로 당연히 내 shell에는 openclaw-cli가 없고 docker compose의 openclaw-cli svc를 다시 불러 컨테이너로 띄워 사용해야한다. (사용한 후에는 제거)

```shell
# gateway 명령
docker compose restart openclaw-gateway
docker compose status openclaw-gateway
docker compose start openclaw-gateway

# openclaw-cli를 이용해 `obsidian`이라는 이름의 agent 추가
docker compose run --rm openclaw-cli agents add obsidian

# openclaw-cli를 이용해 현재 pending 상태인 장비 리스트 출력
docker compose run --rm openclaw-cli devices list

# 목록을 보고 내 장비 request_id를 입력해 허용(approve)
docker compose run --rm openclaw-cli devices approve ac2b44dd-f32d-4...

# telegram을 channel로 이용했을 경우 pairing(default)한 사용자 확인 및 추가
docker compose run --rm openclaw-cli pairing list telegram

docker compose run --rm openclaw-cli pairing approve telegram NT2K...

# 다시 obsidian의 초기 온보딩 설정을 하고 싶은 경우
docker compose run --rm openclaw-cli onboard

```

- device approve를 하지 않으면 webUI에 접속했을 때 1008 에러같은게 발생하고 별다른 설정권한이 없는 막힌 상태가 된다.
	- ![](https://i.imgur.com/Ar2FPxr.png)

## 추가 명령
```shell
# .env 혹은 docker compose yml, docker-setup.sh 를 변경하였을 경우 당연하게도 
# openclaw-cli로 restart를 할 게 아니라 setup 자체를 다시 해야 한다.

bash docker-setup.sh
```

![](https://i.imgur.com/BWMkmkq.png)

---
+참조한 블로그
https://contents.premium.naver.com/codetree/funcoding/contents/260208003733025lb
https://blog.leenit.kr/install-openclaw-with-docker/
