---
categories:
  - AWS
  - infra
tags:
  - aws
  - docker
mermaid: true
image: assets/img/260223_container_depends_on.jpg
---
> 여러 컨테이너를 띄울 때 순서가 중요한 경우가 있다.
> 예를 들면 웹 서버가 뜨기 전에 db 서버가 떠야 한다던가.. 아니면 ML API 서버를 구동하기 전에 ML model 서버를 띄워야 한다던지
---

![](https://i.imgur.com/sZYGa2y.png)

- 위처럼 예를 들면 db 뜨고 중간 저장소 캐싱할 redis 뜨고 그 다음에 웹이 떠야 올바른 흐름인 케이스이다. (gpt가 만들어준 이미지)
	- db, redis가 준비안됐는데 웹이 먼저 뜨고 트래픽을 받게되면 당연히 db connection 오류 같은게 뜰 것이다. 


## 컨테이너들의 시작과 끝을 조절하는 구성
![](https://i.imgur.com/5URDhVf.png)

- 공식 문서에서는 다음과 같이 말하고 있다.
- docker compose의 각 서비스들의 시작과 종료를 `depends_on` 옵션을 통해 컨트롤할 수 있다.
	- 의존관계를 결정하는 옵션들
		- depends_on
		- links
		- volumes_from
		- 그리고 network_mode
	- 관계의 상태에 대한 옵션
		- service_started
		- service_healthy
		- service_complete_successfully
- https://docs.docker.com/compose/how-tos/startup-order/

제공하는 예시를 보자
```yaml
services:
  web:
    build: .
    depends_on:
      db:
        condition: service_healthy
        restart: true
      redis:
        condition: service_started
  redis:
    image: redis
  db:
    image: postgres:18
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      retries: 5
      start_period: 30s
      timeout: 10s
```

- web 서비스가 db가 healthy한 상태이고 redis는 started인 상태일 때 시작하게 돼있다.
- db 서비스의 healthcheck 옵션에 주목하자
	- db status를 주기적으로 체크해 healthy한 상황을 추적한다.
	- healthy한 상태가 돼야 web의 depends_on의 condition을 만족하게 되는 것.

### 할 수 있는 것
- health check 하는 별도의 script를 짜거나 서버라면 endpoint를 만들어놓고 check
- 컨테이너들이 순서없이 각자 떠서 엉키는 경우를 명시적으로 막을 수 있음.

## ECS에서의 활용
- ECS는 elastic container service이다. 마찬가지로 도커 컨테이너를 사용하기에 해당 옵션들을 쓸 수 있고 ECS도 docker compose의 명령어들을 사용한다.
- 다음은 하나의 작업에서 두 개의 컨테이너를 정의하고 사용하는 경우를 예시로 다루고 있다.

- 트리톤 모델 서버와 실제 비즈니스 로직을 수행하는 Consumer가 있다
	- consumer는 요청을 처리하기 위해 필요한 딥러닝 모델 추론을 위해 triton 컨테이너에 HTTP로 요청해 추론 결과를 받아 처리한다.
	- 즉, triton이 떠있어야 consumer가 제대로 요청을 처리할 수 있으니 의존관계가 있는 것이다.
	- +추가로 triton inference server는 기본적으로 health check endpoint를 제공한다.
- triton 컨테이너에서 자체적으로 health를 점검하기
	- ![](https://i.imgur.com/4iQE2UN.png)

- consumer 컨테이너에서는 triton 컨테이너의 상태를 지켜보다 healthy하게 되면 그제서야 작업을 시작한다.
	- ![](https://i.imgur.com/9TGNSnB.png)

