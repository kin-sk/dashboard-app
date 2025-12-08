import { ref, computed } from "vue";
import type { MenuItem, MenuConfig } from "@/types/menu";

class MenuManager {
  private state = ref<MenuConfig>({
    items: [],
  });

  constructor() {
    this.loadMenu();
  }

  // メニューを読み込み
  async loadMenu(): Promise<void> {
    try {
      // LocalStorageから読み込み（カスタマイズされたメニュー）
      const savedMenu = localStorage.getItem("menu-config");
      if (savedMenu) {
        this.state.value = JSON.parse(savedMenu);
      } else {
        // デフォルトメニューを読み込み
        const response = await fetch("/menu-config.json");
        this.state.value = await response.json();
      }
    } catch (error) {
      console.error("メニューの読み込みに失敗しました:", error);
    }
  }

  // メニューを保存
  saveMenu(): void {
    localStorage.setItem("menu-config", JSON.stringify(this.state.value));
  }

  // 表示可能なメニューアイテムを取得（並び順でソート）
  get visibleItems(): MenuItem[] {
    return this.state.value.items
      .filter((item) => item.visible)
      .sort((a, b) => a.order - b.order);
  }

  // すべてのメニューアイテムを取得
  get allItems(): MenuItem[] {
    return this.state.value.items.sort((a, b) => a.order - b.order);
  }

  // メニューアイテムを追加
  addItem(item: Omit<MenuItem, "id">): void {
    const newItem: MenuItem = {
      ...item,
      id: this.generateId(),
    };
    this.state.value.items.push(newItem);
    this.saveMenu();
  }

  // メニューアイテムを更新
  updateItem(id: string, updates: Partial<MenuItem>): void {
    const index = this.state.value.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.state.value.items[index] = {
        ...this.state.value.items[index],
        ...updates,
      };
      this.saveMenu();
    }
  }

  // メニューアイテムを削除
  deleteItem(id: string): void {
    this.state.value.items = this.state.value.items.filter(
      (item) => item.id !== id
    );
    this.saveMenu();
  }

  // メニューアイテムの表示/非表示を切り替え
  toggleVisibility(id: string): void {
    const item = this.state.value.items.find((item) => item.id === id);
    if (item) {
      item.visible = !item.visible;
      this.saveMenu();
    }
  }

  // メニューをデフォルトに戻す
  async resetToDefault(): Promise<void> {
    localStorage.removeItem("menu-config");
    await this.loadMenu();
  }

  // ユニークなIDを生成
  private generateId(): string {
    return `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// シングルトンインスタンス
let menuManager: MenuManager | null = null;

export function useMenu() {
  if (!menuManager) {
    menuManager = new MenuManager();
  }

  return {
    visibleItems: computed(() => menuManager!.visibleItems),
    allItems: computed(() => menuManager!.allItems),
    addItem: (item: Omit<MenuItem, "id">) => menuManager!.addItem(item),
    updateItem: (id: string, updates: Partial<MenuItem>) =>
      menuManager!.updateItem(id, updates),
    deleteItem: (id: string) => menuManager!.deleteItem(id),
    toggleVisibility: (id: string) => menuManager!.toggleVisibility(id),
    resetToDefault: () => menuManager!.resetToDefault(),
  };
}
