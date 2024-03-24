```ts
// gets langs
$i18nState.lang
// gets namespace
$i18nState.ns('home')
// get translation.
$i18nState.ns('home').version('0.0.1')
// gets translation with variables
$i18nState.ns('share').statusBar_posDesc('Row {|row|}, Col {|col|}', { row: 1, col: 2 })
$i18nState.ns('share').cmdDesc_help_withArg('Help for {|suggest|}', { suggest: 'some' })
```

```ts
// gets langs
$i18nState.lang
// gets namespace
$i18nState.home
// get translation.
$i18nState.home('version', '0.0.1')
// gets translation with variables
$i18nState.share('statusBar-posDesc', 'Row {|row|}, Col {|col|}', { row: 1, col: 2 })
$i18nState.share('cmdDesc-help-withArg', 'Help for {|suggest|}', { suggest: 'some' })
```

```ts
// gets langs
$i18nState.lang
// gets namespace
// ...
// get translation.
$i18nState.get('home', 'version', '0.0.1')
// gets translation with variables
$i18nState.get('share', 'statusBar-posDesc', 'Row {|row|}, Col {|col|}', { row: 1, col: 2 })
$i18nState.get('share', 'cmdDesc-help-withArg', 'Help for {|suggest|}', { suggest: 'some' })
```
