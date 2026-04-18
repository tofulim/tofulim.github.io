---
categories:
  - AWS
  - infra
tags:
  - aws
mermaid: true
image: assets/img/250310_aws_freetier.jpg
---
> 1년간 제공하던 AWS 프리티어 서비스의 정책이 변경되었다...
> 꿀같이 이용하던 내 AutoTrade 자동매매 서비스를 호스팅하던 ec2는 이제 사용하지 못하게 됐다.
---

# 발단
- 내가 저번 25년 3월에 만든 계정의 프리티어 이용 기간 1년이 26년 3월에 만료된다.
	- 하나의 구글 계정으로 여러 개의 AWS 프리티어 계정을 만드는 방법은 이전에 [link](https://tofulim.github.io/posts/%ED%95%98%EB%82%98%EC%9D%98-%EA%B5%AC%EA%B8%80-%EA%B3%84%EC%A0%95%EC%9C%BC%EB%A1%9C-%EC%97%AC%EB%9F%AC%EA%B0%9C%EC%9D%98-aws-%ED%94%84%EB%A6%AC%ED%8B%B0%EC%96%B4-%EA%B3%84%EC%A0%95-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0/) 이곳 내 블로그에서 기술한 적이 있다.
- 하지만 웬걸 정책이 변경되었다.

## 만료 메일

![](https://i.imgur.com/dDqX4Gq.png)

## 생성시도
- 루트 구글 계정인 zedaws2024로 신규 26년 계정을 만들려 하였다.
	- zedaws2024+260310@gmail.com 형식
	- 신규 계정 인식이 되는 듯 하였고 비밀번호를 입력하며 계정을 만들어갔다.
	- ![](https://i.imgur.com/QUsm9uP.png)


## 변경된 정책
![](https://i.imgur.com/WJtaxJr.png)

- 어라라.. 무료는 이제 6개월이고 유료로 전환하여도 일정 수준의 크레딧을 소모하는 방식으로 바뀐게 아닌가..
- 이러면 새로운 계정을 반기마다 만들어야하고 security group 설정이나 기타 귀찮은 세팅이 연 1회에서 연 2회로 느는 것이라 곤란했다.

## 무료 플랜 선택..
![](https://i.imgur.com/EBqStqe.png)

- 심지어 더 안좋은 것은 google의 계정 별칭 방식으로 우회해서 AWS 신규 계정을 만드는 방식 또한 막혔다는 것이다 ㅎㅎ..
	- zedaws2024@gmail.com 과 zedaws2024+alias@gmail.com 을 이제는 하나의 동일한 계정으로 인식하나보다..
- 꼼수이긴 하지만 막상 발각되어 이용하지 못하게 되니 섭섭하다.

# 앞으로의 행보
- 물론 ec2 micro 같은 작은 인스턴스들로 크래딧 200USD를 다쓰기는 어렵겠으나 어쨌든 소모하면 아예 다른 google 및 aws 계정을 만들어야 한다는 사실이 꽤나 장벽처럼 느껴진다.
- 나의 사이드 프로젝트를 호스팅할 다른 플랫폼을 찾아봐야겠다.

---
대학생때부터 꿀처럼 쓰던 ec2 free tier 안녕..
