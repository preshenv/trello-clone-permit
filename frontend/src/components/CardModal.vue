<!-- components/CardModal.vue -->
<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="card-title">{{ card.title }}</h2>
        <button @click="close" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <div class="card-section">
          <h3>Description</h3>
          <div v-if="!isEditingDescription && canEdit" class="description-display" @click="startEditingDescription">
            <p v-if="card.description">{{ card.description }}</p>
            <p v-else class="placeholder">Add a description...</p>
          </div>
          <div v-if="isEditingDescription" class="description-edit">
            <textarea v-model="editedDescription" @keyup.ctrl.enter="saveDescription" ref="descriptionInput"
              placeholder="Add a detailed description..." class="description-input"></textarea>
            <div class="edit-actions">
              <button @click="saveDescription" class="save-btn">Save</button>
              <button @click="cancelEditDescription" class="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div v-if="canEdit" class="card-actions">
          <button @click="moveCard" class="action-btn">Move Card</button>
          <button @click="deleteCard" class="action-btn delete">
            Delete Card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

export default {
  name: "CardModal",

  props: {
    card: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const store = useStore();
    const isEditingDescription = ref(false);
    const editedDescription = ref(props.card.description || "");
    const descriptionInput = ref(null);

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };

    onMounted(() => {
      document.addEventListener("keydown", handleEscape);
    });

    onBeforeUnmount(() => {
      document.removeEventListener("keydown", handleEscape);
    });

    const close = () => {
      emit("close");
    };

    const startEditingDescription = () => {
      if (!props.canEdit) return;
      isEditingDescription.value = true;
      editedDescription.value = props.card.description || "";
      setTimeout(() => {
        descriptionInput.value?.focus();
      });
    };

    const saveDescription = async () => {
      try {
        await store.dispatch("updateCard", {
          cardId: props.card.id,
          updates: { description: editedDescription.value.trim() },
        });
        isEditingDescription.value = false;
      } catch (error) {
        store.dispatch("showError", "Failed to update description");
      }
    };

    const cancelEditDescription = () => {
      isEditingDescription.value = false;
      editedDescription.value = props.card.description || "";
    };

    const moveCard = () => {
      // Implement move card functionality
      // This could open a new modal or dropdown for list selection
    };

    const deleteCard = async () => {
      if (!confirm("Are you sure you want to delete this card?")) return;

      try {
        await store.dispatch("deleteCard", props.card.id);
        close();
      } catch (error) {
        store.dispatch("showError", "Failed to delete card");
      }
    };

    return {
      isEditingDescription,
      editedDescription,
      descriptionInput,
      close,
      startEditingDescription,
      saveDescription,
      cancelEditDescription,
      moveCard,
      deleteCard,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 48px;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 3px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 768px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
}

.modal-body {
  padding: 20px;
}

.card-section {
  margin-bottom: 24px;
}

.description-display {
  min-height: 60px;
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
}

.description-display:hover {
  background: #f4f5f7;
}

.placeholder {
  color: #6b778c;
  font-style: italic;
}

.description-edit {
  margin-top: 8px;
}

.description-input {
  width: 100%;
  min-height: 108px;
  padding: 8px;
  border: 2px solid #0079bf;
  border-radius: 3px;
  resize: vertical;
  margin-bottom: 8px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.save-btn {
  padding: 6px 12px;
  background: #0079bf;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.cancel-btn {
  padding: 6px 12px;
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 6px 12px;
  background: #ebecf0;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.action-btn:hover {
  background: #dfe1e6;
}

.action-btn.delete {
  color: #dc3545;
}

.action-btn.delete:hover {
  background: #ffe3e3;
}
</style>
