import type {
  EAffix,
  EAlert,
  EAnchor,
  EAnchorItem,
  EAvatar,
  EAvatarGroup,
  EAvatarItem,
  EBackTop,
  EBadge,
  EBadgeCount,
  EBreadcrumb,
  EBreadcrumbItem,
  EButton,
  ECalendar,
  ECard,
  ECardImage,
  ECascader,
  ECboxOption,
  EChangeMarker,
  ECheckbox,
  ECheckboxGroup,
  EChip,
  ECollapse,
  ECollapsePanel,
  EDatePicker,
  EDescItem,
  EDescriptionList,
  EDialog,
  EDiff,
  EDivider,
  EDropdown,
  EDropdownItem,
  EEmpty,
  EFabItem,
  EFlex,
  EFloatButton,
  EFloatButtonGroup,
  EForm,
  EFormItem,
  EGrid,
  EGridItem,
  EIcon,
  EImage,
  EInput,
  EInputNumber,
  EKaleido,
  ELastUpdated,
  ELayout,
  ELayoutContent,
  ELayoutFooter,
  ELayoutHeader,
  ELayoutSider,
  ELink,
  EList,
  EListItem,
  EMasonry,
  EMenu,
  EMenuItem,
  EMeter,
  EOption,
  EPagination,
  EPopconfirm,
  EPopover,
  EProgress,
  EQrcode,
  ERadio,
  ERadioGroup,
  EResult,
  ERibbon,
  ESegment,
  ESegmented,
  ESelect,
  ESkeleton,
  ESpace,
  ESparkline,
  ESplitter,
  EStatistic,
  EStatusBoard,
  EStep,
  ESteps,
  ETab,
  ETable,
  ETabs,
  ETag,
  EText,
  ETextarea,
  ETimeline,
  ETimelineItem,
  ETimePicker,
  ETitle,
  EToggle,
  ETree,
  ETreeSelect,
  EUpload,
  EWatermark,
  type IconName,
} from "@marcomattes/epaper-components";

type Props<E> = React.DetailedHTMLProps<React.HTMLAttributes<E>, E>;

type ETextProps = Props<EText> & {
  kind?: "body" | "prose" | "small" | "mono" | "label";
  as?: "p" | "span" | "div";
};

type ETitleProps = Props<ETitle> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | "1" | "2" | "3" | "4" | "5" | "6";
};

type EButtonProps = Props<EButton> & {
  variant?: "primary" | "secondary" | "destructive";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  autofocus?: boolean;
};

type EIconProps = Omit<Props<EIcon>, "name"> & {
  name: IconName;
  size?: number | string;
  label?: string;
};

type ECardProps = Props<ECard> & {
  title?: string;
  eyebrow?: string;
};

type EProgressProps = Props<EProgress> & {
  value?: string;
  max?: string;
  variant?: "linear" | "steps";
  steps?: string;
  label?: string;
  "hide-label"?: boolean | string;
};

type EInputProps = Props<EInput> & {
  label?: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  "default-value"?: string;
  name?: string;
  error?: boolean | string;
  "error-message"?: string;
  disabled?: boolean | string;
  readonly?: boolean | string;
  required?: boolean | string;
  "required-message"?: string;
  pattern?: string;
  minlength?: number;
  maxlength?: number;
  min?: string;
  max?: string;
  step?: string;
  autocomplete?: string;
  inputmode?: string;
  enterkeyhint?: string;
  spellcheck?: string;
};

type ETextareaProps = Props<ETextarea> & {
  value?: string;
  placeholder?: string;
  name?: string;
  error?: boolean | string;
  "error-message"?: string;
  disabled?: boolean | string;
  readonly?: boolean | string;
  required?: boolean | string;
  "required-message"?: string;
  minlength?: number;
  maxlength?: number;
  autocomplete?: string;
  inputmode?: string;
  enterkeyhint?: string;
  spellcheck?: string;
};

type ESegmentedProps = Props<ESegmented> & {
  value?: string;
};

type ESegmentProps = Props<ESegment> & {
  value?: string;
  label?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "e-affix": Props<EAffix>;
      "e-alert": Props<EAlert>;
      "e-anchor": Props<EAnchor>;
      "e-anchor-item": Props<EAnchorItem>;
      "e-avatar": Props<EAvatar>;
      "e-avatar-group": Props<EAvatarGroup>;
      "e-avatar-item": Props<EAvatarItem>;
      "e-back-top": Props<EBackTop>;
      "e-badge": Props<EBadge>;
      "e-badge-count": Props<EBadgeCount>;
      "e-breadcrumb": Props<EBreadcrumb>;
      "e-breadcrumb-item": Props<EBreadcrumbItem>;
      "e-button": EButtonProps;
      "e-calendar": Props<ECalendar>;
      "e-card": ECardProps;
      "e-card-image": Props<ECardImage>;
      "e-cascader": Props<ECascader>;
      "e-cbox-option": Props<ECboxOption>;
      "e-change-marker": Props<EChangeMarker>;
      "e-checkbox": Props<ECheckbox>;
      "e-checkbox-group": Props<ECheckboxGroup>;
      "e-chip": Props<EChip>;
      "e-collapse": Props<ECollapse>;
      "e-collapse-panel": Props<ECollapsePanel>;
      "e-date-picker": Props<EDatePicker>;
      "e-desc-item": Props<EDescItem>;
      "e-description-list": Props<EDescriptionList>;
      "e-dialog": Props<EDialog>;
      "e-diff": Props<EDiff>;
      "e-divider": Props<EDivider>;
      "e-dropdown": Props<EDropdown>;
      "e-dropdown-item": Props<EDropdownItem>;
      "e-empty": Props<EEmpty>;
      "e-fab-item": Props<EFabItem>;
      "e-flex": Props<EFlex>;
      "e-float-button": Props<EFloatButton>;
      "e-float-button-group": Props<EFloatButtonGroup>;
      "e-form": Props<EForm>;
      "e-form-item": Props<EFormItem>;
      "e-grid": Props<EGrid>;
      "e-grid-item": Props<EGridItem>;
      "e-icon": EIconProps;
      "e-image": Props<EImage>;
      "e-input": EInputProps;
      "e-input-number": Props<EInputNumber>;
      "e-kaleido": Props<EKaleido>;
      "e-last-updated": Props<ELastUpdated>;
      "e-layout": Props<ELayout>;
      "e-layout-content": Props<ELayoutContent>;
      "e-layout-footer": Props<ELayoutFooter>;
      "e-layout-header": Props<ELayoutHeader>;
      "e-layout-sider": Props<ELayoutSider>;
      "e-link": Props<ELink>;
      "e-list": Props<EList>;
      "e-list-item": Props<EListItem>;
      "e-masonry": Props<EMasonry>;
      "e-menu": Props<EMenu>;
      "e-menu-item": Props<EMenuItem>;
      "e-meter": Props<EMeter>;
      "e-option": Props<EOption>;
      "e-pagination": Props<EPagination>;
      "e-popconfirm": Props<EPopconfirm>;
      "e-popover": Props<EPopover>;
      "e-progress": EProgressProps;
      "e-qrcode": Props<EQrcode>;
      "e-radio": Props<ERadio>;
      "e-radio-group": Props<ERadioGroup>;
      "e-result": Props<EResult>;
      "e-ribbon": Props<ERibbon>;
      "e-segment": ESegmentProps;
      "e-segmented": ESegmentedProps;
      "e-select": Props<ESelect>;
      "e-skeleton": Props<ESkeleton>;
      "e-space": Props<ESpace>;
      "e-sparkline": Props<ESparkline>;
      "e-splitter": Props<ESplitter>;
      "e-statistic": Props<EStatistic>;
      "e-status-board": Props<EStatusBoard>;
      "e-step": Props<EStep>;
      "e-steps": Props<ESteps>;
      "e-tab": Props<ETab>;
      "e-table": Props<ETable>;
      "e-tabs": Props<ETabs>;
      "e-tag": Props<ETag>;
      "e-text": ETextProps;
      "e-textarea": ETextareaProps;
      "e-time-picker": Props<ETimePicker>;
      "e-timeline": Props<ETimeline>;
      "e-timeline-item": Props<ETimelineItem>;
      "e-title": ETitleProps;
      "e-toggle": Props<EToggle>;
      "e-tree": Props<ETree>;
      "e-tree-select": Props<ETreeSelect>;
      "e-upload": Props<EUpload>;
      "e-watermark": Props<EWatermark>;
    }
  }
}
