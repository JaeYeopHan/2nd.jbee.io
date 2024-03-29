---
title: '[Testing] 1. 프론트엔드, 무엇을 테스트 할 것인가'
date: 2020-01-02 10:12:69
category: react
thumbnail: './images/react-testing-logo.png'
---

![react-testing-logo](./images/react-testing-logo.png)

## 이 앱, 지금 제대로 동작하니?

아마 이 질문에 대한 피드백을 받기 위해 테스트 코드를 작성할 것이다. React Application을 예로 들어보면 다음과 같은 테스트 대상들을 쉽게 생각할 수 있다.

- 액션이 원하는 대로 잘 생성되는지
- 순수 함수인 리듀서가 내가 정의한대로 상태를 변경하는지
- props에 따라서 컴포넌트가 제대로 렌더링되는지

하지만 아쉽게도 이런 테스트만 가지고는 ‘이 앱이 제대로 동작하고 있는가?’ 라는 가장 기초적이고 우리가 필요로 하는 질문에 답을 할 수가 없다.

프론트엔드 개발자라면 모두가 공감할테고 이 부분에 많이 실망을 한다. 들어가는 비용 대비 돌아오는 효과가 적다고 생각하여 테스트를 대부분 작성하지 않는다.

방금 말한 내용을 좀 더 실체화시키기 위해 버튼 컴포넌트를 살펴보자.

```ts
// import statement 생략
export const Button = (props: IButtonProps) => {
  const { isDisabled, children, onClick } = props
  const buttonClassName = classnames('btn-default', {
    disabled: isDisabled,
  })
  const onClickButton = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      return
    }
    return onClick
  }

  return (
    <button type="button" className={buttonClassName} onClick={onClickButton}>
      {children}
    </button>
  )
}
```

이 버튼 컴포넌트가 제대로 **렌더링**이 되어 **동작**한다는 것을 **브라우저에서 확인한다면** 어떠한 것들을 확인해야할까.

1. `button` element가 제대로 mount 되는가?
2. `props`에 따라 className이 제대로 변경되는가?
3. `props`으로 전달한 값이 button element에 제대로 반영되는가?
4. 버튼을 클릭했을 때, `click` event가 제대로 동작하는가?

이러한 것들을 확인하게 된다. 그렇다면 이러한 것들을 테스트 코드로 작성했을 때, 브라우저에서 **확인하지 않고도** 우리는 확신을 얻을 수 있을까?

## 무언가 잘못되었다

가장 비용이 적게 든다는 단위 테스트를 열심히 작성한다. 하나의 컴포넌트에 필요한 테스트 케이스가 10개를 넘어갈 때도 있지만 옆에서 테스트는 필요하다고 한다. 아직 하나의 화면도 제대로 렌더링되고 있지 않지만 괜찮다. 테스트 커버리지가 높으니 나중에 큰 도움이 될 것이다.

작업이 남은 컴포넌트가 수십개는 되는 상황인데 갑자기 디자인이 변경되었다. 컴포넌트의 계층 구조가 변경되면서 내 컴포넌트 테스트 코드는 하나 둘씩 **빨간 피를 토하기 시작했다.**

> 아 잠깐만...

## UI 검증을 위한 테스트

컴포넌트는 브라우저에 렌더링이 될 때, 부모 컴포넌트의 영향을 많이 받는다. 그리고 다른 컴포넌트에 영향을 준다. 애초에 그럴 수 밖에 없다. children에 또다른 컴포넌트가 들어온다면 CSS Style 속성에 의해 애써 만든 버튼 컴포넌트의 UI가 깨질 수 있다.

여기에서 핵심은 UI가 언제든 **깨질 수 있다**는 것이다. 위에서 언급한 1~4번에 모두 제대로 테스트를 통과함에도 불구하고 UI는 언제든지 브라우저에서 깨질 수 있다.

즉 HTML Tree 상 제대로 된 위치에 렌더링이 되었더라도 부모 컴포넌트에 의해 UI가 망가질 수 있다. className이 제대로 변경되었다고 하더라도 스타일이 제대로 안 들어갔을 수도 있다.

그렇다면 우리는 이 버튼 컴포넌트의 테스트 코드를 작성함에 있어 변경에 자유로울 수 있을까? 버그가 없다고 확신할 수 있을까?

## 왜 테스트해야 하는지 명심하기

사용자가 우리가 만든 애플리케이션을 사용할 때, **의도한대로** 동작하는 것에 대해 확신을 갖기 위해 테스트를 작성한다. 우리가 의도한 것이 사용자의 **동작**에 의해 제대로 작동하는지를 테스트해야 한다. 다시 버튼 컴포넌트의 예시로 돌아가자. 1~4번 중, 사용자의 동작은 무엇일까?

사용자가 버튼을 클릭하는 행위. 4번 뿐이다. 우린 4번에 집중하면 된다.

### '동작'에 집중하자

정적인 UI는 잠시 미뤄두고 동적인 **동작**에 집중하자. 하지만 4번 그대로를 테스트 하지 않는다.

여기서 '그대로' 테스트 한다는 것은 이벤트에 클릭 이벤트가 제대로 트리거(trigger or dispatchEvent)되는지 테스트 하는 것을 의미하며 이것은 **플랫폼을 믿지 않는 것**이라고 생각한다.

`document.addEventListener` 를 통해 click 이벤트를 등록했다면 브라우저를 믿지 못하는 것이고 JSX의 `onClick`을 통해 이벤트를 등록했다면 React 라이브러리를 믿지 못하는 것이다.

> 클릭 이벤트는 발생하겠지.

사용자가 버튼을 클릭했을 때, 이벤트가 발생하여 어떠한 **부수 효과(side effect)를 가져오는가**를 테스트 한다. 버튼을 클릭하여 어떤 컴포넌트의 상태가 변경될 수 있고 다른 페이지로 이동할 수도 있고 상태에 따라 모달 컴포넌트가 보이게 될 수도 있다.

방금 언급한 것들이 애플리케이션의 **흐름(Flow)**이 되며 프론트엔드 환경에서 **비즈니스 로직**에 해당된다. 그리고 이것은 개발자가 애플리케이션 코드를 작성할 때 의도한 **동작**에 해당된다.

화면이 잘 그려질지, 내가 `onClick` props로 등록한 이벤트가 제대로 발생할지는 사용하고 있는 **플랫폼을 믿자**.(예를 들면 React) 믿고 이 부분에 대한 단위테스트는 작성하지 않는다.

## 그래서 무엇을 테스트하는가?

동작을 테스트할 것이고 동작이란 사용자로부터 발생한 이벤트의 부수효과를 의미한다.

그리고 이 부수 효과들이 발생하게 되는 조건들과 결과를 테스트 한다. 대부분의 테스트 코드가 커버(cover)하게 되는 영역은 뒤에서 설명할 Store의 `selector`, `reducer`, 그리고 `middleware 함수`가 될 것이다.

### 무엇을 테스트하지 않을 것인가?

무엇을 테스트 할 지 결정했다면 무엇을 테스트하지 않을지도 자연스럽게 결정이 될 것이다. 사실 프론트엔드 테스트 전략을 세울 때는 무엇을 테스트하지 않을 것인가를 고민하는 것이 더 중요하다고 생각한다. 테스트에 들어가는 비용이 많이 들어가기 때문이다.

1. 컴포넌트들이 제대로 합성되는가
2. 컴포넌트들이 화면에 제대로 렌더링 되는가
3. 컴포넌트에 어떠한 동작을 했을 때, 무엇인가 트리거가 되는가

믿거나 말거나 제대로 합성되겠지, 렌더링 되겠지 하고 넘어간다. (앞으로 작성될 내용에서 이 부분을 보완할 장치를 소개할 예정이다.)

다음 편에서는 테스트 관점에서 설계를 다시 바라보면서 어떻게 구체화할 수 있을지 이야기 할 예정이다.

|       |                                                                           |
| :---: | :-----------------------------------------------------------------------: |
| Next  | [2. 프론트엔드, 어떻게 테스트 할 것인가](https://jbee.io/articles/react/testing-2-react-testing/) |
| Intro |   [0. 시리즈를 들어가며](https://jbee.io/articles/react/testing-0-react-testing-intro/)    |
