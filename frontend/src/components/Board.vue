<template>
  <div class="board" :style="{ backgroundColor: board?.background }">
    <div class="board-header">
      <h2>{{ board?.title }}</h2>
    </div>
    
    <div class="lists-container">
      <div class="lists-wrapper">
        <List v-for="list in board?.lists" 
              :key="list._id" 
              :list="list"
              :can-edit="true"
              :can-edit-cards="true"
              @update="updateList"
              @delete="deleteList"
              @card-added="onCardAdded"
              @card-updated="onCardUpdated"
              @card-deleted="onCardDeleted"
              @card-moved="onCardMoved" />
        
        <div class="add-list" v-if="!isAddingList" @click="startAddingList">
          <span>+ Add another list</span>
        </div>
        
        <div v-else class="add-list-form">
          <input v-model="newListTitle" 
                 ref="newListInput"
                 placeholder="Enter list title..."
                 @keyup.enter="saveNewList"
                 @keyup.esc="cancelAddingList" />
          <div class="add-list-actions">
            <button @click="saveNewList">Add List</button>
            <button @click="cancelAddingList">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import List from './ListItem.vue';

export default {
  name: 'BoardItem',
  
  components: {
    List
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const board = ref(null);
    const isAddingList = ref(false);
    const newListTitle = ref('');
    const newListInput = ref(null);

    const fetchBoardData = async () => {
      try {
        const boardId = route.params.id;
        const data = await store.dispatch('fetchBoard', boardId);
        board.value = data;
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };

    onMounted(fetchBoardData);

    const startAddingList = () => {
      isAddingList.value = true;
      newListTitle.value = '';
      setTimeout(() => newListInput.value?.focus(), 0);
    };

    const saveNewList = async () => {
      if (!newListTitle.value.trim()) {
        return cancelAddingList();
      }

      try {
        await store.dispatch('createList', {
          boardId: route.params.id,
          title: newListTitle.value.trim()
        });
        cancelAddingList();
      } catch (error) {
        console.error('Error creating list:', error);
      }
    };

    const cancelAddingList = () => {
      isAddingList.value = false;
      newListTitle.value = '';
    };

    return {
      board,
      isAddingList,
      newListTitle,
      newListInput,
      startAddingList,
      saveNewList,
      cancelAddingList
    };
  }
};
</script>

<style scoped>
.board {
  height: 100vh;
  padding: 20px;
  overflow-x: auto;
}

.board-header {
  margin-bottom: 20px;
}

.board-header h2 {
  color: white;
  margin: 0;
}

.lists-container {
  height: calc(100vh - 100px);
  overflow-x: auto;
}

.lists-wrapper {
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
  height: 100%;
}

.add-list {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  min-width: 280px;
  padding: 10px;
  color: white;
  cursor: pointer;
  height: fit-content;
}

.add-list:hover {
  background: rgba(255, 255, 255, 0.3);
}

.add-list-form {
  background: #ebecf0;
  border-radius: 3px;
  min-width: 280px;
  padding: 10px;
  height: fit-content;
}

.add-list-form input {
  width: 100%;
  padding: 8px;
  border: 2px solid #0079bf;
  border-radius: 3px;
  margin-bottom: 8px;
}

.add-list-actions {
  display: flex;
  gap: 8px;
}

.add-list-actions button:first-child {
  padding: 6px 12px;
  background: #0079bf;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.add-list-actions button:last-child {
  padding: 6px 12px;
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
  font-size: 18px;
}
</style> 