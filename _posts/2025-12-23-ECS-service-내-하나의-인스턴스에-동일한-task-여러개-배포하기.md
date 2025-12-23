---
categories:
  - AWS
  - infra
tags:
  - aws
mermaid: true
image: assets/img/251223_dynamic_port.png
---
>  자원을 더 효율적으로 활용하기 위해 하나의 인스턴스에 같은 작업을 여러번 구겨넣고 싶을 때가 있다.
>  이 때를 위해 Dynamic port를 활용해 동일 인스턴스 내에서 scale-out과 같은 효과를 낼 수 있다.
---

## 상황
자원효율을 위해 메모리 30%만 소모하는 컨테이너를 3개 띄워 자원 90% 이상을 사용하기 위함.

![](https://i.imgur.com/qxKbjdi.png)

그렇다면 Container port는 동일할테고 Instance의 포트 하나로 세 컨테이너가 나눠 쓸 수 없을 것이다.
EC2의 각기 다른 host 포트를 각 컨테이너의 포트에 연결해 주어야 한다.
- 컨테이너1 - "80:8080" (host:container)
- 컨테이너2 - "81:8080" (host:container)
- 컨테이너3- "82:8080" (host:container)

그러나 만약 컨테이너가 10개 혹은 100개라면? 이걸 일일이 지정할 수 없는 없는 노릇이다.

## 해결 방법
#### Dynamic port
![](https://i.imgur.com/tYu8ySW.png)

- 작업 구성에서 해당 컨테이너의 Host port를 0으로 구성해주면 dynamic port로 인식돼 사용된다.
	- 단, ALB와 함께 사용할 때 지원되며 컨테이너 인스턴스에 여러 작업 복사본을 운용할 수 있다고 쓰여있다.

![](https://i.imgur.com/3jerc5O.png)

- 위 이미지처럼 하나의 인스턴스에 여러 Port로 붙은 것을 볼 수 있다.
	- k8s의 nodeport처럼 해당 그룹(ECS service) 밖으로 잡아 보내주는 기능을 하며. 이를 위해 ALB가 필요하다

![](https://i.imgur.com/0i67cVy.png)

- alb가 동적으로 포트 매핑을 해줘 유저의 요청을 Task에게 라우팅해준다.
