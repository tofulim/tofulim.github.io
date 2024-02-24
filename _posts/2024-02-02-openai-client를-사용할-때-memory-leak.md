---
categories:
  - server
tags:
  - openai
  - chatgpt
  - gpt4
mermaid: true
image: assets/img/openai-thumbnail.png
---
> openai 버젼을 업데이트하면서 메모리 누수가 발생했다면?
---

0.xx 대 버젼에서 1.xx 대 버젼으로 업그레이드하였다. gpt4와 turbo의 다양한 것들을 사용하기 위함이다.

나의 경우에는 api key가 다양했고request마다 engine model을 달리하는 과정에서 

client를 매번 초기화해주는데 이 과정에서 GC가 잘 닫아주지 않는지 메모리 누수가 있었다.

openai 이슈에 있을 거 같아서 찾아보니 나같은 사람들 있었다 ㅋㅋ

https://github.com/openai/openai-python/issues/820

이 포스팅은 위 해결법을 이용해 내가 일을 처리한 방법을 다루고 있다.

## 1.  요청 방식의 변화

---

### 기존 요청 방식
- openai 모듈 자체를 이용한 요청
- 0.xx 대 버젼에서 아래와 같이 사용했었다.
	```python
	import openai 
	
	openai.ChatCompletion.create(**request_payload)

	# 키가 바뀌는 경우에는 모듈 attribute에 접근해 수정
	openai
	
	```

- 엔진을 수정하고 싶을 때는 다음과 같이 했다.
	```python
	engine2setting = {  
	    "gpt3.5": {  
	        "model_name": os.getenv("CHAT_GPT_API_MODEL_NAME"),  
	        "api_key": os.getenv("CHAT_GPT_API_KEY"),  
	        "api_base": os.getenv("CHAT_GPT_API_BASE"),  
	        "version": os.getenv("CHAT_GPT_API_VERSION"),  
	        "api_type": "azure",  
	    },  
	    "gpt4": {  
	        "model_name": os.getenv("CHAT_GPT4_API_MODEL_NAME"),  
	        "api_key": os.getenv("CHAT_GPT4_API_KEY"),  
	        "api_base": os.getenv("CHAT_GPT4_API_BASE"),  
	        "version": os.getenv("CHAT_GPT_API_VERSION"),  
	        "api_type": "azure",  
	    },  
	    "gpt3": {  
	        "model_name": os.getenv("GPT3_API_MODEL_NAME"),  
	        "api_key": os.getenv("CHAT_GPT_API_KEY"),  
	        "api_base": os.getenv("CHAT_GPT_API_BASE"),  
	        "version": os.getenv("GPT3_API_VERSION"),  
	        "api_type": "azure",  
	    },  
	    "gpt4-turbo": {  
	        "model_name": os.getenv("CHAT_GPT4_TURBO_API_MODEL_NAME"),  
	        "api_key": os.getenv("CHAT_GPT4_TURBO_API_KEY"),  
	        "api_base": None,  
	        "version": None,  
	        "api_type": "openai",  
	    },  
	}


	def _set_openai_api(self, engine: str):
		openai.api_base = engine2setting[engine]["api_base"]
		openai.api_key = engine2setting[engine]["api_key"]
		openai.api_version = engine2setting[engine]["version"]
		self.model_name = engine2setting[engine]["model_name"]
	```

내부 값만 조금 바꿔 요청을 수행하므로 별도의 객체를 생성하지 않아도 됐었다.

import openai 에서 openai를 타고 들어가보면 다음처럼 정의돼있어 가능했다.

![](https://i.imgur.com/x6HemYA.png)


### 새로운 요청 방식
- 요청시에 client 객체를 생성해 chat completion을 create하는 방식
```python
	if api_type == "azure":
		client = AzureOpenAI(
			api_key=api_key,
			api_version=api_version,
			azure_endpoint=api_base,
		)
	else:
		client = OpenAI(
			api_key=api_key,
		)

	client.chat.completions.create(**request_payload)
```
- 인스턴스를 매번 만들어 사용하는 것이 부담스러웠지만 우선은 내부 값을 계속 바꿔야하므로 위처럼 이용했다.

## 2.  메모리 누수

---

아니나 다를까 불안한 예감을 대체로 항상 맞다.

메모리가 줄줄 새기 시작했다. 1.31을 기점으로 서버 메모리 사용률 올라간 것을 볼 수 있는데

4~50% 대를 유지하던 것이 70%대를 넘어서기 시작했다.

![](https://i.imgur.com/Y7WK5WD.png)

나는 이와 같은 현상이 요청마다 client 인스턴스를 생성하기 때문일거라 확신했다 ㅋㅋ


## 3.  해결 방법

---

openai 이슈에 있는 방법은 with_options를 이용하는 것이었다.

이를 이용하면 client를 다시 초기화(init)할 필요 없고 내부 값들만 바꿔준다고 한다.

물론 이는 공식 API 문서에 없다. 있었으면 애초에 그 방법을 썼을텐데...

이슈에서도 파라미터를 어떻게 넣어줘야하는지 잘 일러주지 않기 때문에 코드 내 해당 함수를 찾았다.

openai 내 코드 
https://github.com/openai/openai-python/blob/0c1e58d511bd60c4dd47ea8a8c0820dc2d013d1d/src/openai/_client.py#L357

코드는 copy method이다. 왜이렇게 했는지는 모르겠으나 copy method를 with_options에 끼워넣는다..

이유는 더 좋은 별칭으로 인라인함수처럼 쓰겠다는데.. 사연이 있어보인다.

![](https://i.imgur.com/JHGBsOV.png)

아무튼 이를 이용하여 client attribute 중 변경이 필요한 부분만 갈아끼워주면 된다.

나는 아래처럼 미리 client들을 선언해 저장해두었다

```python
client_map = {  
    "azure": AzureOpenAI(  
        api_key=os.getenv("CHAT_GPT4_API_KEY"),  
        api_version=os.getenv("CHAT_GPT_API_VERSION"),  
        azure_endpoint=os.getenv("CHAT_GPT4_API_BASE"),  
    ),  
    "openai": OpenAI(api_key=os.getenv("CHAT_GPT4_TURBO_API_KEY")),  
}
```

호출이 있을 때 불러다가 클라이언트 세부 사항을 변경해 반환하도록 함수를 만들어보자

```python
def _get_openai_api_client(self, engine: str):
	api_type = engine2setting[engine]["api_type"]  
    api_key = engine2setting[engine]["api_key"]  
    api_version = engine2setting[engine]["version"]  
    api_base = engine2setting[engine]["api_base"]  
  
    options = {}  
    if api_type == "azure":  
        options["api_key"] = api_key  
        options["api_version"] = api_version  
        # copy method에는 azure_endpoint가 없고 base_url만 있어서 뒷부분을 더해줘야한다.
        options["base_url"] = f"{api_base}/openai"  
    else:  
        options["api_key"] = api_key  
  
    return client_map[api_type].with_options(**options)
```


## 3.  누수 해소 확인 - 메모리 점검

---

확인은 내장 모듈 tracemalloc을 이용했다

```python
import tracemalloc

# 추적 시작
tracemalloc.start()

# 메모리 사용량을 측정하고 싶은 코드 
n = 30
for _ in range(n):
	# client를 생성해 초기화한다.
	client = _get_openai_api_client(engine)
	response = client.chat.completions.create(**request_payload)

# 추적 중단
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

for stat in top_stats[:30]:
    print(stat)

```

가운데 코드부분에 openai 호출 라인을 넣고 실험했다.

요청을 거듭 수행하면서 메모리가 쌓이는 지 확인해야하므로 반복문 형태로 넣어주었다.

### 메모리 추적 결과
openai/response가 사용한 메모리를 확인했다.

- 기존 (메모리 누수 o)
	- 10번 요청: openai/_legacy_response **15.3kib** / openai/_response: **14.3kib**
	- 30번 요청: openai/_legacy_response **25.6kib** / openai/_response: **23.3kib**
		-> 요청 수에 비례해 메모리가 커지는 것을 알 수 있다.
- 변경 (메모리 누수 x)
	- 10번 요청: openai/_legacy_response **11kib** / openai/_response: **10024B**
	- 30번 요청: openai/_legacy_response **10.7kib** / openai/_response: **10.4kib** 
		-> 요청과 관계없이 메모리 균일하다.

## 참고 
https://github.com/openai/openai-python/issues/820
https://github.com/openai/openai-python/blob/0c1e58d511bd60c4dd47ea8a8c0820dc2d013d1d/src/openai/_client.py#L357

---