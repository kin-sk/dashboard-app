export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  url: string;
  target: "_self" | "_blank"; // _self: 同じ画面, _blank: 新しいタブ
  type: "internal" | "external"; // internal: アプリ内リンク, external: 外部リンク
  order: number;
  visible: boolean;
}

export interface MenuConfig {
  items: MenuItem[];
}
