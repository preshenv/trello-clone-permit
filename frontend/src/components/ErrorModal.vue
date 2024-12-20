<!-- components/ErrorModal.vue -->
<template>
  <Transition name="modal">
    <div v-if="error" class="modal-overlay">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-icon">
              <svg class="error-icon" viewBox="0 0 24 24">
                <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 class="modal-title">Unauthorized Action</h3>
          </div>

          <div class="modal-body">
            <p>{{ error }}</p>
          </div>

          <div class="modal-footer">
            <button @click="closeError" class="modal-button">Close</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ErrorModal',
  setup() {
    const store = useStore()
    const error = computed(() => store.state.error)

    const closeError = () => {
      store.commit('CLEAR_ERROR')
    }

    return {
      error,
      closeError
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  min-width: 320px;
  max-width: 480px;
  margin: 0 20px;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  padding: 20px;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.modal-icon {
  background-color: #fee2e2;
  border-radius: 50%;
  padding: 10px;
  margin-right: 15px;
}

.error-icon {
  width: 24px;
  height: 24px;
  stroke: #dc2626;
  stroke-width: 1.5;
  fill: none;
}

.modal-title {
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-body p {
  color: #4b5563;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.modal-button {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-button:hover {
  background-color: #b91c1c;
}

/* Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>