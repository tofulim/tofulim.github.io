---
categories:
  - python
tags:
  - assert
  - raise
mermaid: true
image: assets/img/250611_raise_assert.png
---
> 예외를 발생시키는 Assert & Raise 무엇이 다른걸까?
---

### 발단

큰 고민없이 사용하던 둘.. github Copilot이 제대로 알고 쓰라고 일침(?)을 가해줘서 블로그를 포스팅한다..

pull request review에서 훈수를 두는 코사장님의 모습..에 좀 더 자세히 알아보게 됐다.
![](https://i.imgur.com/w7En0Ji.png)


### Raise

공식문서 목차 중 Errors and Exceptions 항목에 존재한다.

개발자가 특정해 명시한 예외를 발생시키는 데 사용할 수 있다.
별도로 명시한 "HiThere"라는 에러문을 출력할 수 있다.

![](https://i.imgur.com/yp6YXrk.png)


### Assert

공식문서 목차 중 Simple statements 항목에 존재한다.

while문처럼 조건을 만족하지 않으면 다음을 수행한다.

```python3
condition = False

assert condition == True, "Condition is not True!!!"
```

간단하게 검정할 수 있지만 주의사항이 한 가지 있다.

python 명령어를 실행할 때 `__debug__` 상수가 False라면 동작하지 않는다. (default True)
![](https://i.imgur.com/kB8tsF1.png)

- -O 옵션을 주고 실행하지 않는 이상 True이다. (`__debug__` 에 직접 값 할당하는건 비권장)

![](https://i.imgur.com/eVhRyU9.png)

- 위처럼 raise로도 만들 수 있고 같은 표현이라고 한다. 단, debug 상수가 true라는 가정이 있어야 한다.


### 사용처
둘 다 에러 발생을 알리고 프로세스를 종료시키지만 assert는 `__debug__` flag에 의존하므로 debug나 test의 성격을 명확히 띄고 있다.

Product level의 서비스코드에서 사용하기에 부적절함을 알 수 있다. unittest module에서 assert를 쓰고 pandas test module에서 assert를 차용하는건 다 이유가 있다.

실 서비스에서 에러 상태를 알리고 싶다면 raise를 쓰자

---

+ps
copilot이 pr review 해주는 기능은 꽤 쓸만한 것 같다.

