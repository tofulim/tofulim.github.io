---
categories:
  - server
tags:
  - linux
  - permission
mermaid: true
image: assets/img/240925_linux_group.png
---
> 파일 혹은 폴더의 권한 중 group 설정을 했는데 계속 permission denied가 발생했다.
---

### User 만들기
- 테스트할 신규 유저를 만들어보자
![](https://i.imgur.com/6FKPUyj.png)

- 잘 생성됐는지 확인
![](https://i.imgur.com/iTXxpzL.png)

### Group 만들기
- 생성한 신규 유저로 switch 한 뒤 소속을 확인해보자
![](https://i.imgur.com/c7ZCdRO.png){: .align-left}

- 기본적으로 현재 로그인한 유저는 현재 유저명 이름의 그룹에 포함돼있다.

![](https://i.imgur.com/U60GItd.png){: .align-left}
- test_user는 그룹을 생성할 권한이 없으므로 sudo 사용가능한 권한이 있는 ubuntu 유저로 test_group 그룹을 만든다.

### Group에 유저 추가
- 신규 그룹 test_group에 신규 유저 test_user를 추가한다
![](https://i.imgur.com/i2GTP1X.png){: .align-left}

### 접근할 수 없는 디렉토리

![](https://i.imgur.com/28z6Itt.png){: .align-left}
- ubuntu 소유의 명의이고 ubuntu 그룹일 때 접근할 수 있는 디렉토리를 만든다.
- 현재는 ubuntu 본인과 ubuntu group일때 read / write / run 모두 할 수 있으며 그 외 유저의 경우 실행만 할 수 있는 상태이다.

![](https://i.imgur.com/LrJ4HOk.png){: .align-left}
- test_user는 test_sub_dir를 제대로 인식할 수 없고 안에 파일을 만들 수도 없다.

### 디렉토리에 그룹 권한 주고 접근
![](https://i.imgur.com/eedMTca.png){: .align-left}
- test_group에 속하는 test_user가 그룹 권한이 있는 폴더 test_sub_dir 안에 1이라는 파일을 만들었다.

---

+유저 그룹 등 권한 관련 명령어를 진행한 뒤 su를 통해 log in/out을 다시 해줘야 동작하는 케이스가 있음을 명심하자.
예시)
![](https://i.imgur.com/EDpIvoy.png){: .align-left}
- 신규 폴더 root 소유의 test_sub_master_dir 생성

![](https://i.imgur.com/cMwE5Zv.png){: .align-left}
- ubuntu 유저에 root 그룹에 가입시키고 접근하는데 Permission denied 발생

![](https://i.imgur.com/i4MYFds.png){: .align-left}
- ubuntu는 default user라 비번이 없음 그냥 세션 재시작 (ssh 재접)하면 되는 모습
- 다른 user라면 su {user_name}을 통해 re-login하면 된다.

