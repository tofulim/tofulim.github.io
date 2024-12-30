---
categories:
  - network
tags:
  - bug
mermaid: true
image: assets/img/241230_firewall.jpeg
---
> 원격 접속을 위해 장비의 포트를 개방해야할 때가 있다. 열어도 안되길래 포트 문제가 아닌 줄 알았건만... 포트 문제였다.
---

## 발단
서버에 postgres 디비를 깔고 원격으로 dbeaver를 통해 접속하려 하였다.
localhost만 연결될 수 있는 설정을 해제하고 포트 열고 이것저것 했는데 아무리 해도 안됐다.
3시간정도 날린 것 같다.

ufw 말고 firewalld를 사용하니 해결됐다. 포트가 안열린 것이었다.

...

ufw도 무언가를 할텐데... 어느 레벨까지 연 것인지 firewalld와의 차이가 궁금했다

## 비교
### ufw란?
ufw는 Uncomplicated Firewall이란다.

즉, 안복잡한 방화벽이다. 왜 안복잡한 방화벽일까?

ufw는 우분투를 위한 default 방화벽 구성 도구이고 iptables를 활용한 방화벽 구성을 쉽게 하기 위해 개발됐다고 한다.

기존 방화벽 설정은 어떻게 하는거길래, 얼마나 복잡하길래 그럴까?

#### 기존 방화벽 설정 (iptables)
iptables는 시스템에 오가는 트래픽 유형들을 정의하고 이에 따른 규칙을 정한다.

규칙들은 특정 IP 주소의 트래픽 차단, 특정 포트 차단, 특정 소스 트래픽 허용 등이다.
또한, 내부 IP 주소를 외부 주소에 매핑하는 목적으로도 사용하여 NAT(Network Address Translation)을 비롯한 고급 기능도 지원한다.

##### chain
네트워크 트래픽 처리 방법을 정의한 규칙이다.
패킷의 처리방법을 결정한다.
##### table
chain들의 모음이다. 
- filter table
	- 패킷 필터링에 사용한다.
	- 시스템 기준 INPUT/OUTPUT 패킷이 있고 통과하는 FORWARD가 있다.
- nat table
	- 내부 IP 주소를 외부 주소에 매핑하는 데 사용한다.
- mangle table
	- 네트워크 조작 목적으로 사용한다. 
- raw table
	- 다른 테이블에서 처리되기 전에 패킷에 영향을 주기 위함

+순서가 존재한다. 모든 패킷을 거부하는 규칙이 먼저 적용된다면 이후 허용하는 규칙을 수행해도 의미가 없다.

##### 예시
```shell
# ssh 포트 허용
$ iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# http 포트 허용
$ iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# https 포트 차단
$ iptables -A INPUT -p tcp --dport 443 -j DROP

# 그 외는 버린다.
$ iptables -P INPUT DROP
```

복잡하긴 하다. 다시 ufw로 넘어가보자

### 그럼 ufw는 얼마나 간단한가
ufw는 일반 유저들에게는 기본적인 규칙들로도 충분하다고 한다.
예를 들면 모든 INPUT을 막는다거나 일부만 예외를 준다거나..

##### 예시
```shell

# ssh 포트 허용 (tcp/udp 둘 다)
$ sudo ufw allow 22

# https 포트 차단
$ sudo ufw deny 443
```

아.. 확실히 간단하다.

### 왜 ufw는 포트 개방을 하지 못했나
내 장비의 OS는 Rocky Linux였다. 
그리고 Rocky Linux의 기본 방화벽은 firewalld이다..

firewalld가 기본적으로 iptables 규칙을 직접 덮어쓰기 때문에 ufw로 설정한 규칙은 **우선** 적용되지 않는단다.
위에서 보았든 iptables의 table의 규칙들은 **순서**가 있기때문에.. ufw는 힘이 없었나보다.
firewalld의 DENY 정책이 먼저 적용돼 걸러져버리고 ufw의 ACCEPT가 적용됐나보다.

### firewalld를 사용한 경우

```shell
# postgre의 5432 tcp 포트를 열고 리로드한다.
sudo firewall-cmd --add-port=5432/tcp --permanent
sudo firewall-cmd --reload
```


+참조한 글
https://mebadong.tistory.com/85#google_vignette