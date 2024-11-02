---
categories:
  - server
tags:
  - amqp
mermaid: true
image: assets/img/240924_githubmodel.png
---
> github에서 Models라는 신규 서비스를 런칭하는 것 같기에 신청했는데 시간이 좀 지난 후 승인이 되어 사용해 보았다.
---

#### 초대장
메일로 날아온 초대
![](https://i.imgur.com/x3ILUQ4.png)

#### 다양한 모델을 사용해 볼 수 있는 환경
마켓플레이스에 Copilot과 함께 있는 모습인데 유명한 모델들이 있다.

![](https://i.imgur.com/WVLWDM2.png)

#### 모델
위의 models 페이지에서 원하는 모델을 클릭해 들어가면 디테일들이 나온다.

예시, README, 평가한 성능 등등
그리고 오른쪽 위에 실제 사용해볼 수 있는 playground와 본격적으로 API로 사용하기 위한 설명 페이지 버튼이 있다.

![](https://i.imgur.com/k36qgRu.png)

#### 데모 playground
git 페이지 안에 playground가 있다 ㅋㅋ
진도 아리랑을 요청했으나 safety 정책에 걸렸나보다. 
뭔가 다른걸 뽑으라는 줄 알았던 듯..

![](https://i.imgur.com/Op6NqXm.png)

근데 4o mini는 정말 정말 빠르다.. 마지막 문장은 토큰이 그래도 30개는 넘을거같은데 순식간에 나온다.

#### Get started
SDK로 사용할 수 있고 이 모든 LLM 모델들을 github token으로 인가받아 사용할 수 있고 모델 각각의 사용법에 대해 다루는 페이지이다.

![](https://i.imgur.com/TfRXnbo.png)

내가 선택한 OpenAI GPT-4o mini의 경우는 다음과 같은 옵션들이 있었다.

Language
- Python
- JavaScript
- C#
- REST
SDK
- OpenAI SDK
- Azure AI Inference SDK

#### 한글 번역 설명서

링크: https://docs.github.com/ko/github-models/prototyping-with-ai-models
![](https://i.imgur.com/m8QMNg3.png)

#### 트래픽 제한
- 무료 사용자는 하루 150개까지 이용 가능하다
![](https://i.imgur.com/zhe8bcF.png)

### 내 생각
- 다양한 모델을 묶어 하나의 playground로 끌고온 점은 좋다. 
- 각 기업 페이지에 들어가 회원가입하고.. 로그인하고... 토큰 발급받고 하는 과정들을 github가 중간에서 해주니 편하다.
- 요즘 많이 광고하는 SKT AiDot처럼 플랫폼 통합의 개념으로 출범한 것 같다. 
	- GitHub Models는 통합 엔진을 제공하는데 AiDot이 여러 LLM을 채팅 형태로 서비스화했다는 점을 빼면 메리트가 무엇일지 궁금하다.

---
+이스라엘 NLP 기업의 모델, 잠바를 테스트해보았다
마음 한 구석이 답답-해진다
![](https://i.imgur.com/k2tvcHU.png)