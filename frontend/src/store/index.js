// store/index.js
import { createStore } from "vuex";
import axios from "axios";

let store;

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.commit(
        "SET_ERROR",
        "You do not have permission to perform this action"
      );
    }
    return Promise.reject(error);
  }
);

store = createStore({
  state: {
    user: null,
    boards: [],
    activeBoard: null,
    lists: [],
    activeCard: null,
    notification: null,
    error: null,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_BOARDS(state, boards) {
      state.boards = boards;
    },
    SET_ACTIVE_BOARD(state, board) {
      state.activeBoard = board;
    },
    SET_LISTS(state, lists) {
      state.lists = lists;
    },
    SET_ACTIVE_CARD(state, card) {
      state.activeCard = card;
    },
    SET_NOTIFICATION(state, notification) {
      state.notification = notification;
    },
    UPDATE_LIST(state, updatedList) {
      const index = state.lists.findIndex((l) => l.id === updatedList.id);
      if (index !== -1) {
        state.lists[index] = updatedList;
      }
    },
    REMOVE_LIST(state, listId) {
      state.lists = state.lists.filter((l) => l.id !== listId);
    },
    ADD_CARD(state, { listId, card }) {
      const list = state.lists.find((l) => l.id === listId);
      if (list) {
        list.cards.push(card);
      }
    },
    UPDATE_CARD(state, updatedCard) {
      state.lists?.forEach((list) => {
        const cardIndex = list.cards?.findIndex(
          (c) => c._id === updatedCard._id
        );
        if (cardIndex !== -1) {
          list.cards.splice(cardIndex, 1, updatedCard);
        }
      });
    },
    REMOVE_CARD(state, cardId) {
      state.lists.forEach((list) => {
        list.cards = list.cards.filter((card) => card._id !== cardId);
      });
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    ADD_LIST(state, list) {
      if (state.currentBoard) {
        state.currentBoard.lists.push(list);
      }
    },
  },

  actions: {
    async fetchBoards({ commit }) {
      try {
        const { data } = await api.get("/boards");
        commit("SET_BOARDS", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch boards:", error);
        throw error;
      }
    },
    async fetchBoard({ commit }, boardId) {
      try {
        const { data } = await api.get(`/boards/${boardId}`);
        commit("SET_ACTIVE_BOARD", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch board:", error);
        throw error;
      }
    },

    async fetchLists({ commit }, boardId) {
      try {
        const { data } = await api.get(`/boards/${boardId}/lists`);
        commit("SET_LISTS", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch lists:", error);
        throw error;
      }
    },

    async createList({ commit }, { boardId, title }) {
      try {
        const { data } = await api.post(`/boards/${boardId}/lists`, { title });
        commit("ADD_LIST", data);
        return data;
      } catch (error) {
        console.error("Create list error:", error);
        throw error;
      }
    },

    async updateList({ commit }, { listId, title }) {
      try {
        const { data } = await api.put(`/lists/${listId}`, { title });
        commit("UPDATE_LIST", data);
        return data;
      } catch (error) {
        console.error("Failed to update list:", error);
        throw error;
      }
    },

    async deleteList({ commit }, listId) {
      try {
        await api.delete(`/lists/${listId}`);
        commit("REMOVE_LIST", listId);
      } catch (error) {
        console.error("Failed to delete list:", error);
        throw error;
      }
    },

    async createCard({ commit }, { listId, title }) {
      console.log("createCard", listId, title);
      try {
        const { data } = await api.post(`/lists/${listId}/cards`, { title });
        commit("ADD_CARD", { listId, card: data });
        return data;
      } catch (error) {
        console.error("Failed to create card:", error);
        throw error;
      }
    },

    async moveCard(
      { commit },
      { cardId, sourceListId, targetListId, position }
    ) {
      try {
        const { data } = await api.put(`/cards/${cardId}/move`, {
          sourceListId,
          targetListId,
          position,
        });

        // Remove card from source list and add to target list
        commit("REMOVE_CARD", { listId: sourceListId, cardId });
        commit("ADD_CARD", { listId: targetListId, card: data });

        return data;
      } catch (error) {
        console.error("Failed to move card:", error);
        throw error;
      }
    },

    async reorderLists({ commit }, { boardId, lists }) {
      try {
        const { data } = await api.put(`/boards/${boardId}/lists/reorder`, {
          lists: lists.map((list, index) => ({
            id: list.id,
            position: index,
          })),
        });
        commit("SET_LISTS", data);
        return data;
      } catch (error) {
        console.error("Failed to reorder lists:", error);
        throw error;
      }
    },

    async fetchBoardPermissions(boardId) {
      try {
        const { data } = await api.get(`/boards/${boardId}/permissions`);
        return data;
      } catch (error) {
        console.error("Failed to fetch board permissions:", error);
        throw error;
      }
    },

    async inviteBoardMember({ boardId, email }) {
      try {
        const { data } = await api.post(`/boards/${boardId}/members`, {
          email,
        });
        return data;
      } catch (error) {
        console.error("Failed to invite board member:", error);
        throw error;
      }
    },

    async deleteBoard(boardId) {
      try {
        await api.delete(`/boards/${boardId}`);
        return true;
      } catch (error) {
        console.error("Failed to delete board:", error);
        throw error;
      }
    },

    showError({ commit }, message) {
      commit("SET_NOTIFICATION", {
        type: "error",
        message,
      });
      setTimeout(() => {
        commit("SET_NOTIFICATION", null);
      }, 3000);
    },

    showSuccess({ commit }, message) {
      commit("SET_NOTIFICATION", {
        type: "success",
        message,
      });
      setTimeout(() => {
        commit("SET_NOTIFICATION", null);
      }, 3000);
    },

    async updateCard({ commit }, { cardId, updates }) {
      try {
        if (!cardId) {
          throw new Error("Card ID is required");
        }
        const { data } = await api.put(`/cards/${cardId}`, updates);
        commit("UPDATE_CARD", data);
        return data;
      } catch (error) {
        console.error("Update card error:", error);
        throw error;
      }
    },

    async deleteCard({ commit }, cardId) {
      try {
        await api.delete(`/cards/${cardId}`);
        commit("REMOVE_CARD", cardId);
      } catch (error) {
        console.error("Delete card error:", error);
        throw error;
      }
    },

    // async moveCard({}, { cardId, listId, position }) {
    //   try {
    //     const { data } = await api.put(`/cards/${cardId}/move`, {
    //       listId,
    //       position,
    //     });
    //     return data;
    //   } catch (error) {
    //     console.error("Move card error:", error);
    //     throw error;
    //   }
    // },
  },

  getters: {
    boards: (state) => state.boards,
    isAuthenticated: (state) => !!state.user,
    userPermissions: (state) => state.userPermissions,
    activeBoard: (state) => state.activeBoard,
    lists: (state) => state.lists,
    activeCard: (state) => state.activeCard,
    notification: (state) => state.notification,
    getUserName: () => {
      // You might want to implement user cache/lookup here
      return "User Name"; // Placeholder
    },
    error: (state) => state.error,
  },
});

export default store;
