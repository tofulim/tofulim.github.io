---
categories:
  - server
tags:
  - amqp
  - zeromq
  - rabbitmq
mermaid: true
image:
---
> temp
---

## 사용 후보군: RabbitMQ와 ZeroMQ
- 둘 다 AMQP를 구현한 오픈소스 메시지큐 관련 소프트웨어이다. 둘 제외하고도 많지만 무엇을 써야하나 고민이 될 수 있으니 천천히 알아보자.
- 하지만 위키백과에서 찾아보면 둘의 차이점은 **메시지 지향 미들웨어** , **메시지 브로커** 에 있다.
	- 메시지 브로커를 중심으로 메시지를 주고받는 RabbitMQ와 달리 zeromq는 메시지 브로커가 없고 분산/동시성 애플리케이션을 타게팅한 메시지큐이다.
- 위키피디아에 기술된 메시지 지향 미들웨어의 단점
	![](https://i.imgur.com/JZJXigd.png)
#### RabbitMQ
- producer/publisher가 consumer에게 메시지를 전달(요청)할 때 중간에서 브로커 역할을 한다.