---
categories:
  - infra
tags:
  - k8s
mermaid: true
image: assets/img/250121_dockerimage.png
---
> docker image를 빌드하고 그 이미지로 pod을 띄우려하면..? ImagePullErr, ImagePullBackOff 혹은 ErrImageNeverPull 이 발생한다. 왜 못가져올까?
---

## k8s의 Image Pull 출처
k8s는 기본적으로 dockerhub에서  image를 끌어온다

k8s 공식문서의 "이미지" 파트를 보면 다음과 같이 설명하고 있다

**일반적으로 [파드](https://kubernetes.io/ko/docs/concepts/workloads/pods/)에서 참조하기 전에 애플리케이션의 컨테이너 이미지를 생성해서 레지스트리로 푸시한다.**

"이미지 이름"은 다음처럼 설명한다

**컨테이너 이미지는 일반적으로 `pause`, `example/mycontainer` 또는 `kube-apiserver` 와 같은 이름을 부여한다. 이미지는 또한 레지스트리 호스트 이름을 포함할 수 있다. 예를 들어 `fictional.registry.example/imagename` 와 같다. 그리고 `fictional.registry.example:10443/imagename` 와 같이 포트 번호도 포함할 수 있다.**

**레지스트리 호스트 이름을 지정하지 않으면, 쿠버네티스는 도커 퍼블릭 레지스트리를 의미한다고 가정한다.**

그렇다 기본적으로 외부 레지스트리에서 이미지를 가져오는 것을 전제로 한다.
dockerhub, AWS ECR 등에서 가져오는 것이리라 생각할 수 있다.

따라서 내가 빌드한 이미지 "test_image:latest"는 단순히 이렇게 기입할 경우 dockerhub에서 test_image 그리고 latest 태그를 찾게 되는 것이다.

## k8s의 Image Pull 정책 수정
dockerhub나 퍼블릭 레지스트리 말고 로컬에 이미지가 존재하는지 먼저 확인할 수 있다.
ImagePullPolicy를 수정하면 가능하다.

#### ImagePullPolicy 종류
- IfNotPresent
	- 이미지가 로컬에 없는 경우에만 내려받는다
- Always
	- kubelet이 컨테이너를 기동할 때마다, kubelet이 컨테이너 이미지 레지스트리에 이름과 이미지의 [다이제스트](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)가 있는지 질의한다. 일치하는 다이제스트를 가진 컨테이너 이미지가 로컬에 있는 경우, kubelet은 캐시된 이미지를 사용한다. 이외의 경우, kubelet은 검색된 다이제스트를 가진 이미지를 내려받아서 컨테이너를 기동할 때 사용한다.
- Never
	- kubelet은 이미지를 가져오려고 시도하지 않는다. 이미지가 어쨌든 이미 로컬에 존재하는 경우, kubelet은 컨테이너 기동을 시도한다. 이외의 경우 기동은 실패한다. 보다 자세한 내용은 [미리 내려받은 이미지](https://kubernetes.io/ko/docs/concepts/containers/images/#pre-pulled-images)를 참조한다.

하지만 이렇게 정책을 Never나 IfNotPresent로 수정해도 내가 원하는대로 동작하지는 않는다.
내가 로컬에서 빌드한 이미지를 로컬 k8s pod에서 불러와 사용할 수 없다.

## k8s가 cri로 사용하는 containerd
k8s는 docker image를 쓰지만 container runtime interface라는 CRI로는 containerd를 사용한다.

원래 docker 단일체제였으나 시간이 지나면서 공식 cri에서 물러나고 containerd를 비롯한 다른 몇 cri들로 굳어졌다.

(k8s는 CRI를 통해 어떤 공급업체든 OCI(Open Container Initiative)를 만족하는 이상 컨테이너 런타임으로 작업하게 해준다. 자세한 사항은 [CKA-정리1](https://tofulim.github.io/posts/CKA-%EC%A0%95%EB%A6%AC1/) 참조)

그래서 내가 docker 명령어로 이미지를 만들고 
`$ docker images`

위 cli 명령어로 빌드한 이미지를 확인할 수 있다고 해도 이는 k8s의 cri가 이미지를 확인할 수 있는 것과 별개의 이야기이다.

즉, k8s의 cri인 containerd가 이미지를 인식할 수 있게 해주어야 한다.

## 이미지 변환 및 로드
docker image를 tar 로 export하고 k8s cri인 containerd로 tar image를 import하자

#### 이미지를 tar 파일로 저장
`$ docker save -o test_image-latest.tar test_image:latest`

#### containerd의 cli인 ctr로 이미지 불러오기 및 확인
![](https://i.imgur.com/FMrfbE3.png)

#### 불러오기
`$ ctr image import test_image-latest.tar`
(필요하다면 namespace를 지정해 불러온다. --namespace k8s.io)

#### 확인
`$ ctr image ls`

----
+위 작업을 하지 않으면 멀쩡한 이미지가 대체 왜 load되지 않는지 고민하며 오래 삽질하게 된다..
