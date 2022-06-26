module.exports = {
  atomSharedMap: {
    FormPageLayout: {
      value: 'appShared/SLLayout/FormPageLayout',
      default: true
    },
    isFeatureKey: {
      value: 'appShared/utils/featureKey',
      default: false
    },
    TRootState: {
      value: 'appShared/types',
      default: false
    },
    'Utils.Language': {
      value: 'appShared/i18n/utils',
      default: false,
      module: true
    },
    'Hooks.useAppSelector': {
      value: 'appShared/hooks/app',
      default: false
    }
  },
  sharedSource: 'appShell/shared'
}
