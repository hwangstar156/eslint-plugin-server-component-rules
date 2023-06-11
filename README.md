# eslint-plugin-server-component

Nextjs13의 server component, client component에 존재하는 룰을 eslint로 강제하기 위해서 만든 패키지입니다.

## 어떤 문제를 해결했는지?

기존 server component에서는 다양한 룰이 존재합니다.

- 내부에서 useState, useEffect나 custom hook을 사용할 수 없는것.
- browser api(window, document)등을 이용할 수 없는것
- jsx 내부에서 event handler를 이용할 수 없는것
- client component에서 server component를 이용할 수 없는것

이 룰들을 어기면  `client component에서 server component를 이용할 수 없는것`을 제외하고 빌드타임에 에러가 발생하게 되는데요. 

이것을 개발하게 된 계기가 개발할떄 `에디터` 단위에서 바로 에러를 경고할 수 있도록 추가하여 server component 개발의 생산성을 올리기 위함이였습니다.

또한 `client component에서 server component를 이용할 수 없는것` 부분을 lint 단위에서 처리하기 위해 서버 컴포넌트에는 `index.server.tsx` 같은 file name convention을 강제하도록 설정하였습니다.

# 사용하는법

```bash
npm install -D eslint-plugin-server-component
```

### eslintrc.js
```jsx
module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['server-component'],
  rules: {
    'server-component/no-import-use-client': ['error', { middle: 'server' }],
    'server-component/file-name': ['error', { middle: 'server' }],
    'server-component/no-use-react-hook': ['error'],
    'server-component/no-use-browser-api': ['error'],
    'server-component/no-use-event-handler': ['error'],
  },
};
```

plugins에 `server-component` 추가후 `rules`추가


## server-component/file-name

파일네임 컨벤션을 지정하기 위한 rule입니다. middle이라는 변수에 `server`를 하면 서버 컴포넌트에서는 `*.server.tsx|jsx` 처럼 컨벤션이 지정됩니다.


## server-component/no-import-use-client

client component에서 server component를 import할떄 빌드타임에서 유일하게 에러를 잡지못하는 부분입니다. 이부분은 위의 `file-name`과 같이 이용하며 `middle` 변수를 동일하게 설정하면 됩니다.

## server-component/no-use-react-hook

server component에서 react hook (useState, useEffect...)등을 이용하지 못하도록 막는 룰입니다.

## server-component/no-use-browser-api

server component에서 document, window등을 참조하지 못하도록 막는 룰입니다.

## server-component/no-use-event-handler

server component에서 jsx에 event handler를 추가하지 못하도록 막는 룰입니다.
