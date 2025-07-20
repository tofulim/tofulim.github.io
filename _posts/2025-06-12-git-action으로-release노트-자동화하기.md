---
categories:
  - etc
tags:
  - ci/cd
  - git
mermaid: true
image: assets/img/250612_release_note.png
---
> 배포된 변경사항을 release note에 직접 작성하지 않고 자동으로 할 수는 없을까?
> git action을 활용한 release note 자동 작성을 해보자
---

## Release note
github 돋보기로 다른 사람들의 업데이트를 보면 한땀한땀 작성한 것들도 많지만

뭔가 자동화된 양식에 맞춰 배포간 개발사항을 추적해놓은 release note 들을 볼 수 있다

![](https://i.imgur.com/X3cREQx.png)

오픈소스처럼 여럿이 참여하는 레포의 경우라면 더욱 더 누가 기여하였든 반영돼야하기 때문이다.

![](https://i.imgur.com/8GCJLDi.png)

release note를 draft하러 들어가보면 **Generate release notes**가 있는데 읽어보면 유효한 태그를 입력하면

자동으로 Markdown 양식으로 모든 merge된 pull request들로 인한 코드 차이점과 기여자를 추가해준다고 한다.

근데 물론 저렇게 하면 다음처럼 밋밋하게 나온다.

![](https://i.imgur.com/eLoiN9t.png)

잦은 배포가 발생하면 귀찮고 까먹을 이슈가 있는데...

이쁜 템플릿과 함께 이를 자동화할 수는 없을까?

## 자동화
### workflow
Git Action을 통해 main branch에 push가 발생했을 때 자동으로 기존 대비 변경점을 작성해주게 해보자
단, 나는 git flow를 이용하고 있으므로 release branch가 tag와 함께 push되고 이것이 main/develop branch로 통합될 때 git action이 작동해 release note 작성이 이뤄지게 하였다.

![](https://i.imgur.com/mgn4Sit.png)

### 활용한 git action - "release-drafter"

1. drafter 파일

```yaml
# .github/workflows/drafter.yaml

name: Draft new release
on:
  push:
    branches:
      - main
jobs:
  build:
    permissions:
      contents: write
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
    - name: Release
      # reference : https://github.com/release-drafter/release-drafter
      uses: release-drafter/release-drafter@v6
      with:
        config-name: drafter-config.yaml
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

2. drafter 파일의 설정 파일인 drafter-config 파일

```yaml
commitish: main
categories:
  - title: '🚀 Features'
    labels:
      - 'feature'
      - 'enhancement'
  - title: '🐛 Bug Fixes'
    labels:
      - 'fix'
      - 'bugfix'
      - 'bug'
  - title: '🧰 Maintenance'
    label: 'chore'
change-template: '- $TITLE @$AUTHOR (#$NUMBER)'
change-title-escapes: '\<*_&' # You can add # and @ to disable  mentions, and add ` to disable code blocks.
version-resolver:
  major:
    labels:
      - 'major'
  minor:
    labels:
      - 'minor'
  patch:
    labels:
      - 'patch'
  default: patch
template: |
  ## Changes

  $CHANGES

```

나는 기본 설정으로 동작하는 tag 들을 빼버렸다. 안그럼 자동으로 drafter 기준에 따라 version이 정해지기 때문

##  적용 이후
main branch에 push가 일어나면 release에 임시저장 상태인 **draft** 상태로 올라가게 된다.
![](https://i.imgur.com/b1vgbhB.png)


이는 의도하지 않은 실수로 release note 작성까지 연결되지 않게 하기 위함이다.

연필 버튼을 눌러 편집 창으로 들어가 tag를 넣고 **Publish Release**로 publish를 해야 실제로 release note가 올라간다.


