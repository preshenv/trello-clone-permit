<template>
  <div class="boards-container">
    <h2>Your Boards</h2>
    <div class="boards-grid">
      <div v-for="board in boards" 
           :key="board._id" 
           class="board-card"
           :style="{ backgroundColor: board.background }"
           @click="openBoard(board._id)">
        <h3>{{ board.title }}</h3>
        <p v-if="board.description">{{ board.description }}</p>
      </div>
      <div class="board-card create-board" @click="showCreateBoardModal">
        <h3>Create new board</h3>
        <span class="plus-icon">+</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BoardsList',

  computed: {
    ...mapState(['boards'])
  },

  methods: {
    ...mapActions(['fetchBoards']),

    openBoard(boardId) {
      this.$router.push(`/board/${boardId}`);
    },

    showCreateBoardModal() {
      // Implement board creation modal
    }
  },

  async created() {
    try {
      await this.fetchBoards();
    } catch (error) {
      console.error('Error fetching boards:', error);
      // Handle error (show notification, etc.)
    }
  }
};
</script>

<style scoped>
.boards-container {
  padding: 20px;
}

.boards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.board-card {
  background-color: #0079bf;
  border-radius: 3px;
  padding: 16px;
  color: white;
  cursor: pointer;
  min-height: 100px;
  transition: transform 0.2s ease;
}

.board-card:hover {
  transform: translateY(-4px);
}

.create-board {
  background-color: #f0f2f5;
  border: 2px dashed #dfe3e6;
  color: #172b4d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plus-icon {
  font-size: 24px;
  margin-top: 8px;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}
</style> 