# jscodeshift-examples

A collection examples of [jscodeshift](https://github.com/facebook/jscodeshift).

## examples

### 1.lodash-to-lodash-es

将 lodash 转换成 lodash-es。

#### 1-1. default import as 转换

input:

```js
import _sum from 'lodash/sum'
import _assign from 'lodash/assign'
```

transform 之后，output：

```js
import { sum as _sum, assign as _assign } from 'lodash-es'
```

#### 1-2. mixed import 转换

input:

```js
import _sum from 'lodash/sum'
import _assign from 'lodash/assign'
import { isObject } from 'lodash'
```

transform 之后，output：

```js
import { sum as _sum, assign as _assign, isObject } from 'lodash-es'
```

#### 1-3. specifier import 转换

input:

```js
import { sum, isObject } from 'lodash'
```

transform 之后，output：

```js
import { sum, isObject } from 'lodash-es'
```

### 2.appShell/shared import 路径替换

`appShell/shared` 引用方式替换。

#### 1-1.specifier import

input:

```js
import {
  FormPageLayout,
  isFeatureKey,
  TRootState,
  Hooks
} from 'appShell/shared'

Hooks.useAppSelector(
  (state) => state.SCLiveStore?.centerControlPage?.liveDetail.streamType
)
```

transform 后，output:

```js
import { useAppSelector } from 'appShared/hooks/app'
import { TRootState } from 'appShared/types'
import { isFeatureKey } from 'appShared/utils/featureKey'
import FormPageLayout from 'appShared/SLLayout/FormPageLayout'

useAppSelector(
  (state) => state.SCLiveStore?.centerControlPage?.liveDetail.streamType
)
```

#### 1-2. module import

input:

```js
import { Utils } from 'appShell/shared'

const i18nInstance = Utils.Language.getI18n(i18n.name)
```

transform 后，output:

```js
import * as Language from 'appShared/i18n/utils'

const i18nInstance = Language.getI18n(i18n.name)
```
