---
categories:
  - python
tags:
  - test
mermaid: true
image: assets/img/240709_unittest.png
---
> 파이썬에서 java JUnit을 본딴 유닛 테스트 도구인 unittest를 알아보자
---

![](https://i.imgur.com/Zj0jvBR.png)

(출처 [docs](https://docs.python.org/ko/3/library/unittest.html) )

### Unittest가 필요한 이유
- 자바를 배울 때 intellij에서 spring을 다룰 때 단위 테스트를 손쉽게 진행할 수 있고 단축키를 통해 빠르게 테스트 코드를 짤 수 있다고 했었던가.
- 파이썬 코드를 개발하면서도 물론 당연히 요구사항을 점검하는 테스트 코드는 필요하다. (잘 안하게 될 뿐..)
	- 잘 안지켜지는건 동적 타이핑 언어의 특성이라고도 생각한다.
- 다만 CI를 위해 테스트는 꼭 필요하다.
	- github 협업을 위해서는 CI(Code Integration)를 잘 마련해 놓아야 코드 베이스 관리에 에너지를 덜 사용한다!
	- 여러 케이스에 대한 테스트 코드가 잘 준비된 레포지토리는 어떤 랜덤 유저의 pull request에도 강경하다. (이게 좋은 오픈소스 프로젝트를 판가름하는 요소같기도 하다.)

---

### Unittest의 사용 방법과 주요 시나리오
#### 테스트를 하는 이유 
- 클라이언트의 요구사항 점검 ex. 영문자는 항상 대문자로 나오게 해주세요.
- 만든 코드가 예상 시나리오들에서 잘 작동하는지 점검
- 프로젝트가 확장되고 커짐에 따라 이식성 및 기존 코드의 안정성을 테스트 코드로 보장하기 위함 (개인적 생각..)

#### unittest 사용 방법
- 기본적인 틀은 다음과 같다.
	- 시험하고자 하는 모듈 load
	- 모듈 내 혹은 바깥에 외부 변수 혹은 외부 모듈이 있다면 상수로 고정하거나 Mock을 통해 고정한다.
	- input/output을 정의하고 예상하는 결과 predict와 비교하는 assert 문 제작
- 예시 코드
	- 테스트 대상 class method (RandomAlphabet.get_upper_alpha_string)
		- 길이 n의 대문자 문자열을 반환한다.
	- 테스트 클래스 (TestAlpha)
		- target 길이 n을 주고 반환받은 문자열이 대문자인지 검사한다.

```python3
# target module
import random  
import string  
  
  
class RandomAlphabet:  
    @staticmethod  
    def select_random_alpha():  
        letters = string.ascii_letters  
        return random.choice(letters)  
  
    @staticmethod  
    def to_uppercase(input_string: str):  
        return input_string.upper()  
  
    def get_upper_alpha_string(self, n: int):  
        result_str = ""  
        for _ in range(n):  
            result_str += self.select_random_alpha()  
  
        return self.to_uppercase(result_str)  
  
  
if __name__ == "__main__":  
    ra = RandomAlphabet()  
  
    res = ra.get_upper_alpha_string(5)  
    print(res)
```

- 테스트 코드
```python3
import unittest  
  
from rand_alpha_module import RandomAlphabet  
  
  
class TestAlpha(unittest.TestCase):  
    @classmethod  
    def setUpClass(cls):  
        cls.rand_alpha_instance = RandomAlphabet()  
  
    def test_upper(self):  
        target_length = 10  
  
        upper_alpha_string = self.rand_alpha_instance.get_upper_alpha_string(  
            n=target_length  
        )  
  
        print(f"given upper_alpha_string is {upper_alpha_string}")  
  
        assert upper_alpha_string == upper_alpha_string.upper(), "given string is not perfect upper string."  
  
  
if __name__ == "__main__":  
    unittest.main()

# output
given upper_alpha_string is OHZTHTDMLI
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

#### 시나리오1: 클라이언트 요구사항 점검
- 모듈을 설계하면서 수행해야하는 요구사항들을 제대로 수행하는지 테스트한다.
- 예시 - 길이 5의 경우가 가장 많으니 길이가 5인 10문장을 추출하는 데 문제가 없어야 한다.

```python3
def test_10_upper(self):  
    target_length, num_iter = 5, 10  
  
    for i in range(num_iter):  
        upper_alpha_string = self.rand_alpha_instance.get_upper_alpha_string(  
            n=target_length  
        )  
        print(f"idx:{i} {upper_alpha_string}")  
  
        assert upper_alpha_string == upper_alpha_string.upper(), "given string is not perfect upper string."

# output
idx:0 CPWEA
idx:1 WHSMP
idx:2 BHBQJ
idx:3 TUNDD
idx:4 AXSQR
idx:5 WBSLX
idx:6 CLXHK
idx:7 NPFOL
idx:8 JYVAD
idx:9 TWYBC
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

#### 시나리오2: 예상 시나리오들에서의 동작 점검
- 특정 연속성이 있는 흐름에서 제대로 작동하는지를 점검한다.
	- A 모듈 -> B 모듈 -> C 모듈을 각각 테스트하고 일련의 흐름 또한 테스트하고 싶은 경우
		(이 예시에서는 중간 모듈인 select_random_alpha를 고정해보자)

```python3
def test_fixed_alpha_string(self):  
    target_length = 5  
    target_alpha_string = "AAAAA"  
  
    # RandomAlphabet 클래스의 'select_random_alpha' method를 Mocking하여 항상 알파벳 'a'를 리턴하게 만든다.  
    self.rand_alpha_instance.select_random_alpha = Mock()  
    self.rand_alpha_instance.select_random_alpha.return_value = "a"  
  
    upper_alpha_string = self.rand_alpha_instance.get_upper_alpha_string(  
        n=target_length  
    )  
    print(f"given upper_alpha_string is {upper_alpha_string}")  
  
    assert upper_alpha_string == target_alpha_string, "given string is not perfect upper string."

# output
given upper_alpha_string is AAAAA
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK

```

#### 시나리오3: 확장 대비 이식성을 위한 성능 보존/기록용
- 어느 코드를 재활용할 때 이 코드가 보장해야 하는 활용처가 있을 것이다. 이 테스트 코드들을 보고, 또 돌려보며 내가 활용하고자 하는 코드인지 혹여 기능이 모자라지는 않을지 추가해야할지 등을 가늠할 수 있다. 


---

### github의 CI 도구로 unittest를 활용하는 법
#### git action 활용
- git action을 통해 test code들을 실행하는 shell script를 짤 수 있다.
- 예시

```python3
# This workflow will install Python dependencies, run tests and lint with a variety of Python versions
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-python-with-github-actions

name: ci-python-unittest

on:
  pull_request:
    branches: [dev, master]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.7]
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v1
        with:
          python-version: ${{ matrix.python-version }}
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r ./request_handler/requirements.txt
          pip install boto3
      - name: Test with unittest
        run: |
          cd request_handler
          python -m unittest discover -s ./test  -p 'test_*.py'
# 코드 출처 https://github.com/philschmid/github-actions/blob/master/python/run-unittest-on-pr-open.yaml
```


- 위 git action은 dev, master 브랜치에 pull request가 발생했을 때
- 현재 코드 베이스 기반으로 unittest를 진행한다.
-> 이를 통해 궁극적으로 코드가 병합될 때 최소한의 방어막을 구축할 수 있다.

---

### 추가 정보
- Mock처럼 특정 모듈을 모킹하는 기능이 있을 뿐만 아니라 side_effect 옵션을 이용해 좀더 유연한 값 혹은 예외를 의도적으로 발생시킬 수 있다.