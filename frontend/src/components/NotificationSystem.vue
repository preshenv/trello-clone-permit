<!-- components/NotificationSystem.vue -->
<template>
  <div class="notifications" v-if="notification">
    <div :class="['notification', notification.type]">
      {{ notification.message }}
      <button class="close" @click="clearNotification">×</button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const notification = computed(() => store.state.notification);

    const clearNotification = () => {
      store.commit("SET_NOTIFICATION", null);
    };

    return {
      notification,
      clearNotification,
    };
  },
};
</script>

<style scoped>
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  padding: 12px 24px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification.error {
  background-color: #ffe3e3;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.notification.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #155724;
}

.close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
}
</style>
