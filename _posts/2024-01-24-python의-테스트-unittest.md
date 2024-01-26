---
categories:
  - python
tags:
  - test
  - junit
  - TDD
  - BDD
mermaid: true
---
> 서비스가 종 혹은 횡으로 늘어남에 따라 모듈 단위 혹은 그 이상의 묶음에 대한 테스트가 필요할 때가 있다. 혹은 코드의 지속적 통합(CI)를 위해서도 자동 통합 시 수행할 테스트가 필요한데 이 때 unittest 라이브러리를 이용할 수 있다.
---

## 1. 테스트의 필요성
### 코어 서비스의 클래스를 공유하는 경우에 대한 점검
- 서비스를 진행하다 점점 비슷한 모듈들이 많이 생기고 묶다보니 코어 클래스가 생겼다고 가정해보자.
- 해당 클래스에서 파생한 자식 클래스 중 일부분만 다르게 구현한 상황이 있을 수 있다.
	```python
	class Parent:  
    def __init__(self, own_value: str):  
        self.own_value = own_value  
  
    def print(self, input_string: str):  
        print(f"{self.own_value} speaking : {input_string}")  
  
  
	class Child(Parent):  
	    def print(self, input_string: str):  
	        print(f"{self.own_value} speaking : {input_string}")  
	  
	  
	if __name__ == "__main__":  
	    parent = Parent(own_value="PaPa")  
	    child = Child(own_value="Son")  
	  
	    child.print("hi dad!")
	
	### output
	### Son speaking : hi dad!
	```

---

## 2. 

---

## 3. 

---

## 참고 

---
## +
