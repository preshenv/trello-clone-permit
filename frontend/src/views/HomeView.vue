<template>
  <div class="home">
    <BoardList 
      :list="defaultList"
      :can-edit="true"
      :can-edit-cards="true"
      @update="handleListUpdate"
      @card-added="handleCardAdded"
      @card-updated="handleCardUpdated"
      @card-deleted="handleCardDeleted"
    />
  </div>
</template>

<script>
import BoardList from '@/components/ListItem.vue'

export default {
  name: 'HomeView',
  components: {
    BoardList
  },
  data() {
    return {
      defaultList: {
        id: 1,
        title: 'Backlog',
        cards: []
      }
    }
  },
  methods: {
    handleListUpdate(updatedList) {
      // Handle list updates
      this.defaultList = { ...updatedList }
    },
    handleCardAdded(newCard) {
      // Handle new card
      this.defaultList.cards.push(newCard)
    },
    handleCardUpdated(updatedCard) {
      // Handle card updates
      const index = this.defaultList.cards.findIndex(card => card.id === updatedCard.id)
      if (index !== -1) {
        this.defaultList.cards.splice(index, 1, updatedCard)
      }
    },
    handleCardDeleted(cardId) {
      // Handle card deletion
      this.defaultList.cards = this.defaultList.cards.filter(card => card.id !== cardId)
    }
  }
}
</script>
