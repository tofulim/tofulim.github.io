---
categories:
  - python
tags:
  - coroutine
  - async
  - 비동기
mermaid: true
image: assets/img/20240121.png
---
> 코루틴은 무엇일까? 파이썬의 동시성 관리(비동기 작업)에 등장하는 코루틴에 대해 알아보자(python3.12.1 버젼 기준)
---

# 코루틴과 태스크

![](https://i.imgur.com/dKZBYpy.png)

(출처: https://docs.python.org/ko/3/library/asyncio-task.html)


공식 docs에 보면 카테고리의 depth가 다음과 같다
네트워킹과 IPC > asyncio > 비동기 I/O > 코루틴과 태스크

코루틴과 태스트가 python의 비동기 수행 라이브러리 asyncio에 활용된다는 사실을 짐작할 수 있다.
- 그렇다면 asyncio는 자세히 뭘 하는 녀석일까?
	- ![](https://i.imgur.com/rzjsCiL.png)
	- 파이썬 코루틴들을 실행하고 제어하는 코루틴과 태스크를 이용하는 주체란다. 
	- 자식 프로세스를 제어하고 작업을 분산해야하니 싱글 스레드 기반인 파이썬은 당연히 프로세스간 통신을 해야할 것이다. 그래서 IPC 수행한다고 써있는 듯 하다.

코루틴과 태스크 각각을 먼저 알아보자

## 1. 코루틴이란?
### 공식 docs  설명
- 뭐라는지 잘 이해가 안된다. 진입과 탈출은 메소드 호출과 반환을 말하는걸까? 더 좋은 설명을 찾아보자
![](https://i.imgur.com/BnKdnNl.png)
- 위키피디아에서는 다음처럼 설명한다.
![](https://i.imgur.com/9ahFLrD.png)
	- 아하! 협력하는 루틴(Co + Routine)으로서 프로그램의 흐름에서 함수 내부에서 함수를 호출하는 형태의 서브루틴이 있지만 코루틴으로 이뤄질 경우 계층이 없고 동등한 관계이구나!
### 코드를 통한 설명
- 다음은 코루틴이 아닌 일반적으로 종속적인 함수 관계 예시이다. 

```python
# sub routine
def add(a, b):
	c = a + b
    print(c)
    print("add 함수")

# main routine
def calc():
	add(1, 2) # 메인이 서브루틴을 호출하고 서브루틴은 할일을 마친 뒤 종료된다. (동기-블로킹)
    print("calc 함수")
    
calc()
```
- 그렇다는 것은 코루틴은 위와 달리 대칭적인(대등한) 관계라는 것이다. 다음 코드를 보자

```python
import asyncio
import time

async def say_after(delay, what):
	await asyncio.sleep(delay)
    print(what)

async def main():
    print(f"started at {time.strftime('%X')}")
	# await을 통한 호출하면 비동기 작업이지만 실행하고 끝날 때까지 대기하고 반환한다..
    await say_after(1, 'hello') # (비동기-블로킹) 
    await say_after(2, 'world') # (비동기-블로킹)

    print(f"finished at {time.strftime('%X')}")

asyncio.run(main())
```
- 하지만 이 코드의 수행 시간은 3초이다. 제대로 코루틴을 동시에 수행하도록 하지 않고 하나씩 수행하고 기다렸기 때문이다.
- 그럼 동시에 실행해야 코루틴을 통한 동시성을 구현하여 시간적인 cost의 이득을 보는 것일텐데 어캐하는걸까?
	=> 이 때 태스크를 활용한다.

## 2. 태스크란?
![](https://i.imgur.com/8aZ8LZY.png)
- Future는 thread-safe 하지 않은 비동기 연산의 최종 결과라고 한다.
	-  result, set_result, done, cancelled 등의 메소드를 갖고 결과에 관한 수정작업이 이뤄진다.
- 태스크를 만들어 이벤트 루프에서 코루틴을 실행해야 하나 보다.
	- 코루틴을 asyncio task로 동시에 실행하는 asyncio.create_task() 를 이용해 동시에 돌려보자. 이 함수는 python3.7부터 추가되었다고 한다.
		- ![](https://i.imgur.com/YiafO6R.png)

```python
import asyncio  
import time  
  
async def say_after(delay, what):  
    print(f"delay {delay}s method started at at {time.strftime('%X')}")  
    await asyncio.sleep(delay) # sleep은 항상 현재 태스크를 일시 중단해서 다른 태스크를 실행할 수 있게 한다.
    print(what)

async def main(): # main 코루틴 또한 이벤트루프 큐에 있는 것과 같다.
    task1 = asyncio.create_task( # 코루틴을 Task로 감싸고 실행을 예약하며 
        say_after(1, 'hello'))   # 이벤트루프 큐에 task1 추가

    task2 = asyncio.create_task( # 이벤트루프 큐에 task2 추가
        say_after(2, 'world'))

    print(f"started at {time.strftime('%X')}")

    # Wait until both tasks are completed (should take
    # around 2 seconds.)
    await task1 # 메인 코루틴 중지, task1 실행. sleep을 만나 i/o처리 할동안 메인 루틴의 task2로 넘어감
    await task2 # 메인 코루틴 중지, task2 실행. sleep을 만나 메인 루틴으로 다시 오거나 task1이 끝나면 되돌아감

    print(f"finished at {time.strftime('%X')}")
```
- 2개의 태스크 task1, task2를 이벤트루프 큐에 예약한다. 
- await으로 Task를 trigger 시킨다. 
	- 마치 더블배럴 샷건에 총알 2발을 장전하고 쏘는 것이 생각났다. task를 준비시키고 거의 동시에 병렬처럼(사실은 아님) 실행하는 것이다.
	- ![](https://i.imgur.com/e8LMgzQ.png)
	- 물론 이는 i/o작업일 때 해당한다.

- 결과는 다음과 같다
```python
started at 14:46:06
delay 1s method started at at 14:46:06 # create_task() 호출 시 await 전까지 진행
delay 2s method started at at 14:46:06 # create_task() 호출 시 await 전까지 진행
hello # task 1 print
world # task 2 print
finished at 14:46:08 # 2초 소요
```

+create_task() 관련 **주의사항**
실행 중간에 Task 객체가 사라질 수도 있기 때문에 create_task() 함수의 결과의 참조를 어딘가에 저장해놓으라고 한다. 이벤트 루프는 태스크에 대한 약한 참조만을 가지기에 참조되지 않는 태스크는 GC에 의해 언제든 사라질 수 있다(심지어 일이 끝나기도 전에). 안심하고 "fire-and-forget" (저지르고 잊어버리기) 위해서는 태스크들을 collection 객체에 모아놓아라.
```python
background_tasks = set()

for i in range(10):
    task = asyncio.create_task(some_coro(param=i))

    # Add task to the set. This creates a strong reference.
    background_tasks.add(task)

    # To prevent keeping references to finished tasks forever,
    # make each task remove its own reference from the set after
    # completion:
    task.add_done_callback(background_tasks.discard)
```

## 3. 어웨이터블(Awaitable)
### docs 설명
- await 표현식에서 사용될 수 있을 때 어웨이터블 객체라고 한다.
- awaitable 객체의 주요 유형
	- 코루틴(coroutine)
		- 코루틴 함수: async def 함수
		- 코루틴 객체: 코루틴 함수를 호출해 반환된 객체
	- 태스크(task)
		- 코루틴을 동시에 예약하는데 사용되는 것
	- 퓨쳐(future)
		- 비동기 연산의 최종 결과를 나타내는 low-level awaitable object

## 참고
- https://dev.gmarket.com/82
- https://docs.python.org/ko/3/library/asyncio-task.html
- https://velog.io/@jaebig/python-%EB%8F%99%EC%8B%9C%EC%84%B1-%EA%B4%80%EB%A6%AC-3-%EC%BD%94%EB%A3%A8%ED%8B%B4Coroutine

---

+yield와 asyncio.coroutine 데코레이터를 이용한 제너레이터 방식은 3.4버전까지 유지되고 이후에는 네이티브 코루틴 방식인 async await으로 넘어왔다고 한다. 