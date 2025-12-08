<script setup lang="ts">
import { ref } from "vue";
import { useMenu } from "@/composables/useMenu";
import type { MenuItem } from "@/types/menu";

const {
  allItems,
  addItem,
  updateItem,
  deleteItem,
  toggleVisibility,
  resetToDefault,
} = useMenu();

// ダイアログの状態
const dialog = ref(false);
const editMode = ref(false);
const editingItem = ref<MenuItem | null>(null);

// フォームデータ
const form = ref({
  label: "",
  icon: "mdi-link",
  url: "",
  target: "_self" as "_self" | "_blank",
  type: "internal" as "internal" | "external",
  order: 0,
  visible: true,
});

// アイコン一覧
const iconOptions = [
  "mdi-home",
  "mdi-view-dashboard",
  "mdi-post",
  "mdi-briefcase",
  "mdi-account",
  "mdi-lock-reset",
  "mdi-cog",
  "mdi-github",
  "mdi-file-document",
  "mdi-link",
  "mdi-web",
  "mdi-email",
  "mdi-calendar",
  "mdi-chart-line",
  "mdi-folder",
];

// 新規追加ダイアログを開く
const openAddDialog = () => {
  editMode.value = false;
  form.value = {
    label: "",
    icon: "mdi-link",
    url: "",
    target: "_self",
    type: "internal",
    order: allItems.value.length + 1,
    visible: true,
  };
  dialog.value = true;
};

// 編集ダイアログを開く
const openEditDialog = (item: MenuItem) => {
  editMode.value = true;
  editingItem.value = item;
  form.value = {
    label: item.label,
    icon: item.icon,
    url: item.url,
    target: item.target,
    type: item.type,
    order: item.order,
    visible: item.visible,
  };
  dialog.value = true;
};

// 保存
const save = () => {
  if (editMode.value && editingItem.value) {
    updateItem(editingItem.value.id, form.value);
  } else {
    addItem(form.value);
  }
  dialog.value = false;
};

// 削除
const handleDelete = (id: string) => {
  if (confirm("このメニューアイテムを削除してもよろしいですか？")) {
    deleteItem(id);
  }
};

// デフォルトに戻す
const handleReset = async () => {
  if (confirm("メニューをデフォルト設定に戻してもよろしいですか？")) {
    await resetToDefault();
  }
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-menu-open</v-icon>
            メニュー設定
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              @click="handleReset"
              variant="outlined"
              class="mr-2"
            >
              <v-icon start>mdi-restore</v-icon>
              デフォルトに戻す
            </v-btn>
            <v-btn color="primary" @click="openAddDialog">
              <v-icon start>mdi-plus</v-icon>
              メニューを追加
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="item in allItems"
                :key="item.id"
                :class="{ 'bg-grey-lighten-4': !item.visible }"
              >
                <template #prepend>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>

                <v-list-item-title>
                  {{ item.label }}
                  <v-chip
                    size="x-small"
                    class="ml-2"
                    v-if="item.type === 'external'"
                  >
                    外部リンク
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ item.url }}
                  <v-chip size="x-small" class="ml-2">
                    {{ item.target === "_blank" ? "新しいタブ" : "同じ画面" }}
                  </v-chip>
                </v-list-item-subtitle>

                <template #append>
                  <v-btn
                    icon
                    size="small"
                    @click="toggleVisibility(item.id)"
                    :color="item.visible ? 'success' : 'grey'"
                  >
                    <v-icon>{{
                      item.visible ? "mdi-eye" : "mdi-eye-off"
                    }}</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    @click="openEditDialog(item)"
                    class="ml-2"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    color="error"
                    @click="handleDelete(item.id)"
                    class="ml-2"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 追加/編集ダイアログ -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ editMode ? "メニューを編集" : "メニューを追加" }}
        </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              v-model="form.label"
              label="ラベル"
              variant="outlined"
              required
            ></v-text-field>

            <v-select
              v-model="form.icon"
              label="アイコン"
              :items="iconOptions"
              variant="outlined"
            >
              <template #selection="{ item }">
                <v-icon class="mr-2">{{ item.value }}</v-icon>
                {{ item.value }}
              </template>
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-icon>{{ item.value }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-text-field
              v-model="form.url"
              label="URL"
              variant="outlined"
              hint="内部リンク: /dashboard、外部リンク: https://example.com"
              required
            ></v-text-field>

            <v-radio-group v-model="form.type" inline>
              <v-radio label="内部リンク" value="internal"></v-radio>
              <v-radio label="外部リンク" value="external"></v-radio>
            </v-radio-group>

            <v-radio-group v-model="form.target" inline>
              <v-radio label="同じ画面で開く" value="_self"></v-radio>
              <v-radio label="新しいタブで開く" value="_blank"></v-radio>
            </v-radio-group>

            <v-text-field
              v-model.number="form.order"
              label="表示順序"
              type="number"
              variant="outlined"
            ></v-text-field>

            <v-switch
              v-model="form.visible"
              label="表示する"
              color="primary"
            ></v-switch>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">キャンセル</v-btn>
          <v-btn color="primary" @click="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
