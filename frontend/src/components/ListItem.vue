<!-- components/BoardList.vue -->
<template>
  <div class="list">
    <div class="list-header">
      <h3 v-if="!isEditing" @dblclick="startEditing">{{ list.title }}</h3>
      <input v-else v-model="editedTitle" @blur="saveTitle" @keyup.enter="saveTitle" @keyup.esc="cancelEditing"
        ref="titleInput" :disabled="!canEdit" class="title-input" />

      <div class="list-actions" v-if="canEdit">
        <button @click="deleteList" class="delete-btn">×</button>
      </div>
    </div>

    <draggable v-model="cards" group="cards" :disabled="!canEditCards" @change="onCardMove" class="cards-wrapper"
      ghost-class="ghost-card" drag-class="dragging-card" item-key="id">
      <template #item="{ element }">
        <div class="card">
          <CardItem :card="element" :can-edit="canEditCards" @update="updateCard" @delete="deleteCard"
            @click="openCard(element)" />
        </div>
      </template>
    </draggable>

    <div class="add-card" v-if="canEditCards">
      <button v-if="!isAddingCard" @click="startAddingCard" class="add-card-btn">
        + Add a card
      </button>
      <div v-else class="add-card-form">
        <textarea v-model="newCardTitle" placeholder="Enter a title for this card..." @keyup.enter.prevent="saveNewCard"
          @keyup.esc="cancelAddingCard" ref="newCardInput" class="new-card-input"></textarea>
        <div class="add-card-actions">
          <button @click="saveNewCard" class="add-btn">Add Card</button>
          <button @click="cancelAddingCard" class="cancel-btn">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import draggable from 'vuedraggable';
import CardItem from './CardItem.vue';

export default {
  name: 'ListItem',

  components: {
    draggable,
    CardItem
  },

  props: {
    list: {
      type: Object,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    canEditCards: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const store = useStore();
    const isEditing = ref(false);
    const editedTitle = ref(props.list.title);
    const isAddingCard = ref(false);
    const newCardTitle = ref('');
    const cards = ref(props.list.cards || []);
    const titleInput = ref(null);
    const newCardInput = ref(null);

    // Watch for changes in props.list.cards
    watch(() => props.list.cards, (newCards) => {
      cards.value = newCards;
    });

    // Title editing
    const startEditing = () => {
      if (!props.canEdit) return;
      isEditing.value = true;
      editedTitle.value = props.list.title;
      setTimeout(() => {
        titleInput.value?.focus();
      });
    };

    const saveTitle = async () => {
      if (!editedTitle.value.trim() || editedTitle.value === props.list.title) {
        return cancelEditing();
      }

      try {
        await store.dispatch('updateList', {
          listId: props.list._id,
          title: editedTitle.value.trim()
        });
        emit('update', { ...props.list, title: editedTitle.value.trim() });
        cancelEditing();
      } catch (error) {
        store.dispatch('showError', 'Failed to update list title');
      }
    };

    const cancelEditing = () => {
      isEditing.value = false;
      editedTitle.value = props.list.title;
    };

    // Card management
    const startAddingCard = () => {
      isAddingCard.value = true;
      newCardTitle.value = '';
      setTimeout(() => {
        newCardInput.value?.focus();
      });
    };

    const saveNewCard = async () => {
      if (!newCardTitle.value.trim()) {
        return cancelAddingCard();
      }

      try {
        const newCard = await store.dispatch('createCard', {
          listId: props.list._id,
          title: newCardTitle.value.trim()
        });
        emit('card-added', newCard);
        cancelAddingCard();
      } catch (error) {
        store.dispatch('showError', 'Failed to create card');
      }
    };

    const cancelAddingCard = () => {
      isAddingCard.value = false;
      newCardTitle.value = '';
    };

    const updateCard = async (updatedCard) => {
      try {
        await store.dispatch('updateCard', {
          cardId: updatedCard._id,
          updates: {
            title: updatedCard.title,
            description: updatedCard.description
          }
        });
        emit('card-updated', updatedCard);
      } catch (error) {
        store.dispatch('showError', 'Failed to update card');
      }
    };

    const deleteCard = async (cardId) => {
      if (!confirm('Are you sure you want to delete this card?')) return;

      try {
        await store.dispatch('deleteCard', cardId);
        emit('card-deleted', cardId);
      } catch (error) {
        store.dispatch('showError', 'Failed to delete card');
      }
    };

    const deleteList = async () => {
      if (!confirm('Are you sure you want to delete this list?')) return;

      try {
        await store.dispatch('deleteList', props.list._id);
        emit('delete', props.list._id);
      } catch (error) {
        store.dispatch('showError', 'Failed to delete list');
      }
    };

    const onCardMove = async (event) => {
      try {
        if (event.added) {
          emit('card-added-to-list', {
            card: event.added.element,
            newIndex: event.added.newIndex
          });
        } else if (event.moved) {
          emit('card-reordered', {
            cardId: event.moved.element._id,
            newIndex: event.moved.newIndex
          });
        }
      } catch (error) {
        store.dispatch('showError', 'Failed to move card');
      }
    };

    const openCard = (card) => {
      store.commit('SET_ACTIVE_CARD', card);
    };

    return {
      isEditing,
      editedTitle,
      isAddingCard,
      newCardTitle,
      cards,
      titleInput,
      newCardInput,
      startEditing,
      saveTitle,
      cancelEditing,
      startAddingCard,
      saveNewCard,
      cancelAddingCard,
      updateCard,
      deleteCard,
      deleteList,
      onCardMove,
      openCard
    };
  }
};
</script>

<style scoped>
.list {
  background: #ebecf0;
  border-radius: 3px;
  width: 280px;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  min-height: 40px;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.title-input {
  width: calc(100% - 40px);
  padding: 4px 8px;
  border: 2px solid #0079bf;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 600;
}

.cards-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 10px;
  padding: 0 4px;
}

.ghost-card {
  opacity: 0.4;
  background: #c1c7d0;
}

.dragging-card {
  transform: rotate(3deg);
  cursor: grabbing;
}

.add-card {
  margin-top: 8px;
  padding: 4px;
}

.add-card-btn {
  width: 100%;
  padding: 8px;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 3px;
  color: #5e6c84;
  cursor: pointer;
}

.add-card-btn:hover {
  background: rgba(9, 30, 66, 0.08);
  color: #172b4d;
}

.add-card-form {
  background: white;
  border-radius: 3px;
  padding: 8px;
}

.new-card-input {
  width: 100%;
  min-height: 54px;
  padding: 8px;
  border: 2px solid #0079bf;
  border-radius: 3px;
  resize: vertical;
  margin-bottom: 8px;
}

.add-card-actions {
  display: flex;
  gap: 8px;
}

.add-btn {
  padding: 6px 12px;
  background: #0079bf;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.add-btn:hover {
  background: #026aa7;
}

.cancel-btn {
  padding: 6px 12px;
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
}

.cancel-btn:hover {
  color: #172b4d;
}

.delete-btn {
  padding: 4px 8px;
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
  font-size: 18px;
}

.delete-btn:hover {
  color: #dc3545;
}

/* Scrollbar styling */
.cards-wrapper::-webkit-scrollbar {
  width: 8px;
}

.cards-wrapper::-webkit-scrollbar-track {
  background: rgba(9, 30, 66, 0.08);
  border-radius: 4px;
}

.cards-wrapper::-webkit-scrollbar-thumb {
  background: rgba(9, 30, 66, 0.2);
  border-radius: 4px;
}

.cards-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(9, 30, 66, 0.3);
}
</style>

