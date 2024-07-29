---
categories:
  - trouble_shooting
tags:
  - k8s
mermaid: true
image:
---
> root 디렉토리에 잡힌 파티션 크기가 너무 작았다. 크게 만들고 싶었지만 그만큼 다른곳을 줄여야 하는 상황.. 그냥 다른 곳을 대신 쓰게 하면 안될까 싶어 알아보게 되었다.
---

### 발단

[Evicted] & [Failed] 상태의 Event 발생
```python
Status: Failed 
Reason: Evicted 
Message: The node was low on resource: ephemeral-storage. Container notebook was using 1704Ki, which exceeds its request of 0.


Warning  Failed               5s                   kubelet            Error: ErrImagePull
```

내 상황은 다음 예시처럼 root가 빡빡하고 home은 널널한 상황이었다.

/dev/root   70G   54G   17G  76% /
/dev/home  345G   51G  294G  15% /home

하지만 k8s가 기본으로 사용하는 root directory가 / 경로로 되어있는지 큰 docker image의 경우 base image를 pull할 때 맨위처럼 pod가 도중에 evicted(적출)되는 현상이 지속적으로 발생하였다. 
k8s는 node 내 어떤 pod가 남은 공간의 일정 비율 이상 차지하게되면 해당 pod를 적출해버린다. 

### 방법
#### ~~1. root dir 파티션을 늘린다.
- 가장 단순한 방법으로 k8s가 사용하는 집이 좁다면 집을 넓히는 것이다.
- 하지만 vm 내 다른 파티션을 줄이고 늘리는 과정에서 파티션이 깨질수 있다는 말을 듣고 포기하였다. 2번 방법이 있을 것이기에...
#### 2. k8s의 pods가 이용하는 공간으로 큰 공간을 제공하자
- pod 정의 yaml에 애초에 volumn으로 mount를 하는 옵션을 명시하기
- containerd가 활용하는 공간으로 다른 디렉토리를 제공하기
- 예를 들면 다음과 같다.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gpu-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: cuda-container
          image: zed123123/repo:0.3
          volumeMounts:
          - mountPath: "/home/zed/k8s/mnt_path"
            name: myvolume
      volumes:
      - name: myvolume
        hostPath:
          path: "/home/zed/k8s/mnt_path"
```


+참조
https://my-grope-log.tistory.com/15