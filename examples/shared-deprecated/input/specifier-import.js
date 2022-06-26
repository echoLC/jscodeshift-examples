import {
  FormPageLayout,
  isFeatureKey,
  TRootState,
  Hooks
} from 'appShell/shared'

Hooks.useAppSelector(
  (state) => state.SCLiveStore?.centerControlPage?.liveDetail.streamType
)
